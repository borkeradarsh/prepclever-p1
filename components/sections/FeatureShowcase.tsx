"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { landingData } from "@/lib/placeholder-data";

function WindowChrome() {
  return (
    <div className="mock-window-chrome" aria-hidden="true">
      <i />
      <i />
      <i />
      <span>PLACEHOLDER WORKSPACE</span>
    </div>
  );
}

function ChatMock({ active }: { active: boolean }) {
  return (
    <div className={`feature-mock feature-mock-chat ${active ? "is-active" : ""}`}>
      <WindowChrome />
      <div className="chat-mock-sidebar">
        {Array.from({ length: 7 }).map((_, index) => <span key={index} />)}
      </div>
      <div className="chat-mock-body">
        <div className="chat-bubble">Show a useful answer from this data</div>
        <div className="chat-answer">Here is a placeholder explanation with trusted context.</div>
        <div className="chat-chart">{Array.from({ length: 9 }).map((_, index) => <i style={{ height: `${20 + ((index * 13) % 54)}%` }} key={index} />)}</div>
        <div className="chat-input">Ask another question...</div>
      </div>
    </div>
  );
}

function ContextMock({ active }: { active: boolean }) {
  return (
    <div className={`feature-mock feature-mock-context ${active ? "is-active" : ""}`}>
      <div className="context-orbit-large"><strong>Compounding<br />context</strong></div>
      <span className="context-node-large context-node-large-top">APP<br />DATA</span>
      <span className="context-node-large context-node-large-left">TRUST</span>
      <span className="context-node-large context-node-large-right">EVALS</span>
    </div>
  );
}

function DashboardMock({ active }: { active: boolean }) {
  return (
    <div className={`feature-mock feature-mock-dashboard ${active ? "is-active" : ""}`}>
      {Array.from({ length: 4 }).map((_, index) => (
        <div className="dashboard-card" key={index}>
          <div className="dashboard-card-top"><span>Placeholder metric</span><b>{index % 2 ? "$428k" : "24,806"}</b></div>
          <div className={`dashboard-graphic dashboard-graphic-${index}`} />
          <span className="dashboard-pill">Placeholder insight ↗</span>
        </div>
      ))}
    </div>
  );
}

function ObservabilityMock({ active }: { active: boolean }) {
  return (
    <div className={`feature-mock feature-mock-observability ${active ? "is-active" : ""}`}>
      <WindowChrome />
      <div className="observability-nav"><b>Agent observability</b><span>All conversations</span><span>All sources</span></div>
      <div className="observability-stat"><strong>461</strong><span>Agent conversations</span><div className="observability-bars"><i /><i /><i /><i /><i /></div></div>
      <div className="observability-table">{Array.from({ length: 5 }).map((_, index) => <span key={index}><i /> Placeholder evaluation result <b>{index % 2 ? "Passed" : "Review"}</b></span>)}</div>
    </div>
  );
}

function ProductMock({ index, active }: { index: number; active: boolean }) {
  if (index === 1) return <ContextMock active={active} />;
  if (index === 2) return <DashboardMock active={active} />;
  if (index === 3) return <ObservabilityMock active={active} />;
  return <ChatMock active={active} />;
}

export function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section className="feature-showcase border-b border-border py-[var(--section-padding)]">
      <Container>
        <div className="feature-showcase-heading">
          <h2 className="text-[length:var(--font-size-h2)] font-semibold leading-[var(--line-height-h2)] tracking-[-0.06em]">{landingData.feature.title}</h2>
          <p>{landingData.feature.description}</p>
        </div>
        <div className="feature-showcase-list">
          {landingData.feature.items.map((item, index) => (
            <article className={`feature-row feature-row-${index} ${activeFeature === index ? "is-selected" : ""}`} key={item.title}>
              <div className="feature-copy">
                <button className="feature-select" type="button" aria-pressed={activeFeature === index} onClick={() => setActiveFeature(index)}>
                  <span className="feature-icon" aria-hidden="true">{["✦", "⌁", "◇", "◌"][index]}</span>
                  <span className="feature-title">{item.title}</span>
                </button>
                <Button variant="secondary" className="mt-[var(--space-md)]">{item.action}</Button>
                <blockquote>{item.quote}</blockquote>
                <small>PLACEHOLDER AUTHOR · PLACEHOLDER ROLE</small>
              </div>
              <button className="feature-mock-button" type="button" aria-label={`Select ${item.title}`} onClick={() => setActiveFeature(index)}>
                <ProductMock index={index} active={activeFeature === index} />
              </button>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
