"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { blocks, firstItem, tierLabels } from "@/content/blocks.config";
import { roles } from "@/content/roles.config";
import { ACCESS_RULES } from "@/lib/access";
import { intentFromCookieHeader } from "@/lib/intent";
import { completeOnboarding, loadOnboarding, saveOnboarding } from "@/lib/onboarding";
import { routes } from "@/lib/routes";
import { defaultRoleForTrack, deriveTrack, resolveRole } from "@/lib/tracks";
import { roleCards, situationLabels, situations, yearsBands } from "./onboarding/config";
import { emptyOnboardingState, type OnboardingState, type RoleId, type Situation, type YearsBand } from "./onboarding/types";

/** `destination` is where to go next: Block 1 after the payoff, /start if already done. */
type OnboardingFlowProps = { nameRequired?: boolean; initialName?: string; onComplete: (destination: string) => void };
const copy = {
  situation: { subtext: "We'll tailor your roadmap to your starting point." },
  role: { heading: "Which role are you aiming for?", subtext: "You can change this anytime." },
  payoff: { eyebrow: "Your path", source: "Source: foundit, H1 2026", proof: "GCC hiring in AI, data science and analytics grew about 38% year on year in H1 2026." },
};

function OptionCard({ selected, title, description, badge, disabled, dashed, onClick }: { selected: boolean; title: string; description: string; badge?: boolean; disabled?: boolean; dashed?: boolean; onClick: () => void }) {
  return <button className={`onboarding-option${selected ? " is-selected" : ""}${dashed ? " is-dashed" : ""}`} type="button" role="radio" aria-checked={selected} disabled={disabled} onClick={onClick}>
    {badge ? <span className="onboarding-badge">Popular for you</span> : null}<span className="onboarding-option-title">{title}</span><span className="onboarding-option-description">{description}</span>
  </button>;
}

export function OnboardingFlow({ initialName = "", onComplete }: OnboardingFlowProps) {
  const [state, setState] = useState<OnboardingState>(emptyOnboardingState);
  const [experienceStep, setExperienceStep] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  // The situation picked on the landing page, if any: preselects screen 1.
  const [intent, setIntent] = useState<Situation | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstViewed = useRef(false);

  useEffect(() => { loadOnboarding().then((saved) => { const next = saved ?? emptyOnboardingState(); setIntent(intentFromCookieHeader(document.cookie)); setState(next); setExperienceStep(next.currentStep === "situation" && Boolean(next.situation) && !next.yearsBand && (next.situation === "it_services" || next.situation === "product_tech")); }).catch(() => setError("Couldn't load your setup. Try again.")).finally(() => setLoading(false)); }, []);
  useEffect(() => { if (!loading && !firstViewed.current) firstViewed.current = true; headingRef.current?.focus(); }, [loading, state.currentStep, experienceStep]);

  const update = async (patch: Partial<OnboardingState>, nextStep?: OnboardingState["currentStep"]) => {
    if (saving) return;
    const previous = state;
    const optimistic = { ...state, ...patch, ...(nextStep ? { currentStep: nextStep } : {}) };
    setState(optimistic); setSaving(true); setError("");
    try { setState(await saveOnboarding({ ...patch, ...(nextStep ? { currentStep: nextStep } : {}) })); }
    catch { setState(previous); setError("Couldn't save. Try again."); }
    finally { setSaving(false); }
  };

  const chooseSituation = (situation: Situation) => {
    const needsYears = situations.find((item) => item.id === situation)?.needsYears;
    if (needsYears) {
      void update({ situation, yearsBand: null });
      setExperienceStep(true);
      return;
    }
    void update({ situation, yearsBand: null }, "role");
  };
  const chooseYears = (yearsBand: YearsBand) => void update({ yearsBand }, "role");
  const chooseRole = (choice: RoleId | "not_sure") => {
    if (!state.situation) return;
    const resolved = resolveRole(choice, deriveTrack(state.situation, state.yearsBand));
    void update({ ...resolved }, "payoff");
  };

  if (loading) return <section className="onboarding-flow onboarding-skeleton" aria-busy="true"><div /><div /><div /><div /><style jsx>{`
    .onboarding-flow { width: 100%; max-width: 40rem; margin: 0 auto; padding: 2rem; border: 1px solid rgb(140 123 138 / 22%); border-radius: 1rem; background: rgb(253 252 251 / 96%); }
    .onboarding-skeleton { display: grid; gap: 0.7rem; }
    .onboarding-skeleton div { height: 1rem; border-radius: 0.35rem; background: var(--surface-muted); }
    .onboarding-skeleton div:nth-child(3) { height: 7rem; }
  `}</style></section>;
  if (state.currentStep === "done") { onComplete(routes.start); return null; }
  const situation = state.situation ? situations.find((item) => item.id === state.situation) : null;
  const role = state.roleId ? roles.find((item) => item.id === state.roleId) : null;
  const track = state.situation ? deriveTrack(state.situation, state.yearsBand) : null;
  const preselected = state.situation ?? intent;
  const postingCompanies = role ? [...new Set(role.examplePostings.map((posting) => posting.company))] : [];
  const displayName = initialName.trim().split(/\s+/)[0] || "User";
  const hasExperienceStep = situation?.needsYears === true;
  const totalSteps = hasExperienceStep ? 3 : 2;
  const currentProgress = state.currentStep === "role"
    ? totalSteps
    : experienceStep
      ? 2
      : 1;

  return <section className="onboarding-flow" aria-live="polite">
    {(experienceStep || state.currentStep === "role") ? <div className="-mt-3 mb-0 min-h-6"><button className="auth-back" type="button" onClick={() => {
      if (experienceStep) {
        setExperienceStep(false);
        setError("");
      } else {
        void update({ currentStep: "situation" });
      }
    }} disabled={saving}><ArrowLeft size={15} /> Back</button></div> : null}
    {state.currentStep !== "payoff" ? <div className="onboarding-progress-wrap"><div className="onboarding-topline"><span>Build your path</span><span className="sr-only" aria-valuenow={currentProgress} aria-valuemin={1} aria-valuemax={totalSteps} role="progressbar">Progress</span></div><div className="onboarding-progress" aria-hidden="true"><span style={{ width: `${(currentProgress / totalSteps) * 100}%` }} /></div><p className="onboarding-welcome">Welcome, {displayName}</p></div> : null}
    {state.currentStep === "situation" && !experienceStep ? <div role="radiogroup" aria-label="Current situation">
      <div className="onboarding-heading"><h2 ref={headingRef} tabIndex={-1}>Where are you right now?</h2><p className="onboarding-copy">{copy.situation.subtext}</p></div>
      <div className="onboarding-option-grid situation-grid">{situations.map((item) => <OptionCard key={item.id} selected={preselected === item.id} disabled={saving} title={item.title} description={item.description} onClick={() => chooseSituation(item.id)} />)}</div>
      {preselected ? <button className="auth-submit onboarding-continue" type="button" disabled={saving} onClick={() => chooseSituation(preselected)}>Continue <ArrowRight size={15} /></button> : null}
    </div> : null}
    {state.currentStep === "situation" && experienceStep ? <div role="radiogroup" aria-label="Years of experience">
      <div className="onboarding-heading"><h2 ref={headingRef} tabIndex={-1}>How long have you been working?</h2><p className="onboarding-copy">This helps us make your starting point more relevant.</p></div>
      <div className="onboarding-option-grid experience-grid">{yearsBands.map((item) => <OptionCard key={item.id} selected={state.yearsBand === item.id} disabled={saving} title={item.label} description={item.description} onClick={() => chooseYears(item.id)} />)}</div>
    </div> : null}
    {state.currentStep === "role" ? <div role="radiogroup" aria-label="Target role">
      <div className="onboarding-heading"><h2 ref={headingRef} tabIndex={-1}>{copy.role.heading}</h2><p className="onboarding-copy">{copy.role.subtext}</p></div>
      <div className="onboarding-option-grid role-grid">{roleCards.map((item) => item.id === "not_sure"
        ? <OptionCard key={item.id} selected={state.roleIsDefault} disabled={saving} dashed title={item.title} description={item.description} onClick={() => chooseRole("not_sure")} />
        : <OptionCard key={item.id} selected={state.roleId === item.id && !state.roleIsDefault} disabled={saving} title={item.title} description={item.description} badge={track ? defaultRoleForTrack(track) === item.id : false} onClick={() => chooseRole(item.id)} />)}</div>
    </div> : null}
    {state.currentStep === "payoff" && role && situation ? <div className="onboarding-payoff">
      <span className="onboarding-eyebrow">{copy.payoff.eyebrow}</span><h2 ref={headingRef} tabIndex={-1}>{situationLabels[situation.id]} → {role.title} at a GCC</h2>
      <ol className="onboarding-stages">{blocks.map((block, index) => {
        const tier = ACCESS_RULES.blocks[block.slug];
        return <li key={block.slug}><b>{index + 1}</b><span><strong>{block.title}</strong><small>{block.summary}</small></span><em className={`onboarding-tier${tier === "free" ? " is-free" : ""}`}>{tierLabels[tier]}</em></li>;
      })}</ol>
      <p className="onboarding-proof">{copy.payoff.proof}<small>{copy.payoff.source}</small></p>{postingCompanies.length > 0 ? <p className="onboarding-gccs">Example postings for this role at {postingCompanies.join(", ")} (may have closed).</p> : null}
      {state.roleIsDefault ? <p className="onboarding-default-note">We picked {role.title} as a starting point. Change it anytime.</p> : null}
      <button className="auth-submit" type="button" disabled={saving} onClick={async () => { setSaving(true); try { await completeOnboarding(); onComplete(routes.blockItem(firstItem.block, firstItem.item)); } catch { setError("Couldn't save. Try again."); } finally { setSaving(false); } }}>Start with Block 1 <ArrowRight size={15} /></button>
      <button className="onboarding-change" type="button" onClick={() => void update({ currentStep: "role" })} disabled={saving}>Change my role</button>
    </div> : null}
    {error ? <p className="onboarding-error" role="alert">{error}</p> : null}
    <style jsx>{`
      .onboarding-flow {
        width: 100%;
        max-width: 40rem;
        margin: 0 auto;
        padding: clamp(1.5rem, 4vw, 2.5rem);
        border: 1px solid rgb(140 123 138 / 18%);
        border-radius: 1.25rem;
        background: rgb(253 252 251 / 98%);
        box-shadow: 0 1.5rem 4rem rgb(49 38 59 / 8%);
      }
      .onboarding-progress-wrap { margin-bottom: 1rem; }
      .onboarding-topline {
        display: flex;
        justify-content: space-between;
        color: var(--text-subtle);
        font-size: 0.78rem;
        letter-spacing: 0.02em;
      }
      .onboarding-progress { height: 0.25rem; margin-top: 0.625rem; overflow: hidden; border-radius: 999px; background: var(--surface-muted); }
      .onboarding-progress span { display: block; height: 100%; border-radius: inherit; background: var(--brand); transition: width 300ms ease; }
      .onboarding-welcome {
        margin: 1rem 0 0;
        color: var(--text-subtle);
        font-size: 0.94rem;
        font-weight: 500;
      }
      .onboarding-heading { max-width: 31rem; margin: 0 auto 1rem; }
      .onboarding-flow h2 {
        margin: 0.1rem 0 0;
        color: var(--text-primary);
        font-family: "Formula", sans-serif;
        font-size: clamp(1.75rem, 4.5vw, 2.25rem);
        letter-spacing: -0.02em;
        line-height: 1.12;
        text-wrap: balance;
      }
      .onboarding-flow h2:focus { outline: none; }
      .onboarding-copy { max-width: 27rem; margin: 0.75rem 0 0; color: var(--text-subtle); font-size: 0.8rem; line-height: 1.5; }
      .onboarding-option-grid { display: grid; grid-auto-rows: 1fr; gap: 1rem; }
      .situation-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .role-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      :global(.onboarding-option) {
        position: relative;
        display: flex;
        min-height: 6rem;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 0.35rem;
        border: 1px solid var(--border);
        border-radius: 0.65rem;
        padding: 0.9rem 1rem;
        color: var(--text-primary);
        background: #fff;
        font: inherit;
        text-align: left;
        box-shadow: 0 0.25rem 0.75rem rgb(49 38 59 / 4%);
        transition: border-color 180ms ease, background 180ms ease, box-shadow 180ms ease, transform 180ms ease;
      }
      :global(.onboarding-option:hover), :global(.onboarding-option:focus-visible), :global(.onboarding-option.is-selected) { border-color: var(--focus); background: var(--brand-soft); box-shadow: 0 0.5rem 1rem rgb(49 38 59 / 8%); }
      :global(.onboarding-option.is-dashed) { border-style: dashed; }
      :global(.onboarding-option:active) { transform: translateY(1px); box-shadow: none; }
      :global(.onboarding-option:disabled:not(.is-selected)) { cursor: not-allowed; opacity: 0.6; }
      :global(.onboarding-option:focus-visible), .onboarding-years button:focus-visible, .onboarding-change:focus-visible {
        outline: 3px solid rgb(162 103 131 / 30%);
        outline-offset: 2px;
      }
      :global(.onboarding-option-title) { max-width: 100%; font-size: 0.82rem; font-weight: 700; line-height: 1.25; }
      :global(.onboarding-option-description) {
        display: block;
        max-width: 90%;
        color: var(--text-subtle);
        font-size: 0.74rem;
        line-height: 1.35;
      }
      :global(.onboarding-badge) { position: absolute; top: -0.625rem; left: 1rem; border-radius: 999px; padding: 0.2rem 0.45rem; color: #6f5362; background: #fff; font-size: 0.62rem; box-shadow: 0 0.15rem 0.4rem rgb(49 38 59 / 8%); }
      .experience-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .role-grid .onboarding-option { min-height: 5.4rem; padding: 0.75rem 0.9rem; }
      .role-grid .onboarding-option-title { font-size: 0.78rem; }
      .role-grid .onboarding-option-description { font-size: 0.7rem; }
      .onboarding-step-back { min-height: 1.5rem; margin-bottom: 0.75rem; }
      .onboarding-payoff h2 { margin-top: 0.5rem; }
      .onboarding-eyebrow { color: #8b5c71; font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase; }
      .onboarding-stages { display: grid; gap: 0.65rem; margin: 1.5rem 0; padding: 0; list-style: none; }
      .onboarding-stages li { display: flex; gap: 0.7rem; align-items: flex-start; }
      .onboarding-stages b { display: grid; width: 1.45rem; height: 1.45rem; flex: 0 0 auto; place-items: center; border-radius: 50%; color: var(--text-primary); background: var(--brand-soft); font-size: 0.7rem; }
      .onboarding-stages span { display: grid; flex: 1 1 auto; min-width: 0; gap: 0.1rem; }
      .onboarding-tier { flex: 0 0 auto; border: 1px solid var(--border); border-radius: 999px; padding: 0.1rem 0.5rem; color: var(--text-subtle); font-size: 0.62rem; font-style: normal; line-height: 1.4; }
      .onboarding-tier.is-free { border-color: transparent; color: var(--text-primary); background: var(--brand-soft); }
      .onboarding-continue { display: flex; width: 100%; align-items: center; justify-content: center; gap: 0.35rem; margin-top: 1rem; }
      .onboarding-stages strong { color: var(--text-primary); font-size: 0.75rem; }
      .onboarding-stages small, .onboarding-proof, .onboarding-gccs, .onboarding-default-note { color: var(--text-subtle); font-size: 0.7rem; line-height: 1.45; }
      .onboarding-proof { margin: 1rem 0 0; }
      .onboarding-proof small { display: block; margin-top: 0.2rem; }
      .onboarding-gccs { margin: 0.4rem 0 1rem; }
      .onboarding-default-note { margin: 0 0 0.75rem; color: #6f5362; }
      .onboarding-payoff .auth-submit { display: flex; width: 100%; align-items: center; justify-content: center; gap: 0.35rem; }
      .onboarding-change { display: block; margin: 0.8rem auto 0; border: 0; padding: 0; color: #8b5c71; background: transparent; font: inherit; font-size: 0.7rem; text-decoration: underline; text-underline-offset: 0.15rem; }
      .onboarding-error { margin: 1rem 0 0; color: #b34545; font-size: 0.75rem; }
      .onboarding-skeleton { display: grid; gap: 0.7rem; }
      .onboarding-skeleton div { height: 1rem; border-radius: 0.35rem; background: var(--surface-muted); }
      .onboarding-skeleton div:nth-child(3) { height: 7rem; }
      @media (max-width: 520px) {
        .onboarding-flow { padding: 1.25rem; border-radius: 0.75rem; }
        .onboarding-progress-wrap { margin-bottom: 2rem; }
        :global(.onboarding-option) { min-height: 5.5rem; }
        .situation-grid { grid-template-columns: 1fr; }
        .role-grid { gap: 0.75rem; }
      }
      @media (prefers-reduced-motion: reduce) {
        .onboarding-progress span, .onboarding-option { transition: none; }
      }
    `}</style>
  </section>;
}
