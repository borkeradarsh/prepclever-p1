"use client";

import { ArrowLeft, ArrowRight, Check, Search } from "lucide-react";
import { useMemo, useState } from "react";

const roles = [
  "Student", "Teacher / Educator", "Tutor", "Professor / Lecturer", "Teaching Assistant",
  "School Administrator", "College Administrator", "Instructional Designer", "Curriculum Developer",
  "Career Counselor", "EdTech Professional", "Parent / Guardian", "Other",
];

const experiences = [
  ["Just starting", "0 years"], ["Beginner", "Less than 1 year"], ["Growing", "1–2 years"],
  ["Experienced", "3–5 years"], ["Advanced", "6–10 years"], ["Expert", "10+ years"],
];

type OnboardingFlowProps = { nameRequired: boolean; initialName?: string; onComplete: () => void };
type ResumeState = { name?: string; role?: string; experience?: string; step?: number };

function getResumeState(): ResumeState {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("prepclever-onboarding") ?? "{}") as ResumeState;
  } catch {
    return {};
  }
}

export function OnboardingFlow({ nameRequired, initialName = "", onComplete }: OnboardingFlowProps) {
  const [resume] = useState(getResumeState);
  const [step, setStep] = useState(resume.step ?? (nameRequired ? 0 : 1));
  const [name, setName] = useState(resume.name ?? initialName);
  const [role, setRole] = useState(resume.role ?? "");
  const [experience, setExperience] = useState(resume.experience ?? "");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const recommendations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return roles.slice(0, 5);
    return roles.filter((candidate) => candidate.toLowerCase().includes(normalized)).slice(0, 5);
  }, [query]);

  const advance = () => {
    setError("");
    if (step === 0 && !name.trim()) return setError("Enter your name to continue.");
    if (step === 1 && !role) return setError("Choose a role to continue.");
    if (step === 2 && !experience) return setError("Choose an experience level to continue.");
    if (step === 2) {
      localStorage.removeItem("prepclever-onboarding");
      onComplete();
      return;
    }
    const nextStep = step + 1;
    localStorage.setItem("prepclever-onboarding", JSON.stringify({ name, role, experience, step: nextStep }));
    setStep(nextStep);
  };

  const goBack = () => { setError(""); setStep(Math.max(nameRequired ? 0 : 1, step - 1)); };

  return (
    <section className="onboarding-card" aria-live="polite">
      <div className="onboarding-topline"><span>Set up your workspace</span><span>{step + (nameRequired ? 1 : 0)} of {nameRequired ? 3 : 2}</span></div>
      <div className="onboarding-progress"><span style={{ width: `${((step + 1) / (nameRequired ? 3 : 2)) * 100}%` }} /></div>
      {step === 0 ? <>
        <h2>What should we call you?</h2><p className="onboarding-copy">Use the name you would like to see in your workspace.</p>
        <label className="auth-field"><span>Your name</span><input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" /></label>
      </> : null}
      {step === 1 ? <>
        <h2>What best describes your role?</h2><p className="onboarding-copy">Search for a role, then select the closest match.</p>
        <label className="role-search"><Search size={16} aria-hidden="true" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search roles" /></label>
        <div className="role-recommendations" aria-label="Recommended roles">
          {recommendations.map((candidate) => <button className={role === candidate ? "is-selected" : ""} type="button" key={candidate} onClick={() => { setRole(candidate); setQuery(candidate); }}>{candidate}{role === candidate ? <Check size={15} /> : null}</button>)}
          {query && !recommendations.some((candidate) => candidate.toLowerCase() === query.toLowerCase()) ? <button type="button" onClick={() => setRole(query)}>Use “{query}”</button> : null}
        </div>
      </> : null}
      {step === 2 ? <>
        <h2>How much experience do you have?</h2><p className="onboarding-copy">Choose the milestone that feels right.</p>
        <div className="experience-grid">
          {experiences.map(([label, detail]) => <button className={experience === label ? "is-selected" : ""} type="button" key={label} onClick={() => setExperience(label)}><span>{label}</span><small>{detail}</small>{experience === label ? <Check size={15} /> : null}</button>)}
        </div>
      </> : null}
      {error ? <p className="auth-error">{error}</p> : null}
      <div className="onboarding-actions">{step > (nameRequired ? 0 : 1) ? <button className="auth-back" type="button" onClick={goBack}><ArrowLeft size={15} /> Back</button> : <span />}
        <button className="auth-submit" type="button" onClick={advance}>{step === 2 ? "Complete setup" : "Continue"}<ArrowRight size={15} /></button>
      </div>
    </section>
  );
}