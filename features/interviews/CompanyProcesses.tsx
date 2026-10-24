import { ArrowDown, ArrowRight } from "lucide-react";
import { Chip } from "@/components/ui/Chip";
import { SoftCard } from "@/components/ui/SoftCard";
import { companyProcesses, interviewCopy, type CompanyProcess, type StageKind } from "@/content/interviews.config";

const copy = interviewCopy;
const data = companyProcesses;

const stageClass: Record<StageKind, string> = {
  normal: "border-border-soft border-t-accent-ink bg-background",
  gate: "border-border-soft border-t-accent-ink [border-top-style:dashed] bg-background",
  peak: "border-accent-ink bg-brand-soft",
};

function StageFlow({ company }: { company: CompanyProcess }) {
  return (
    <ol aria-label={copy.stagesLabel(company.name)} className="flex flex-col gap-[var(--space-xs)] lg:flex-row lg:items-stretch">
      {company.stages.map((stage, index) => (
        <li key={stage.title} className="flex flex-col items-stretch gap-[var(--space-xs)] lg:min-w-0 lg:flex-1 lg:flex-row lg:items-center">
          <div className={`grid h-full flex-1 content-start gap-0.5 rounded-[var(--radius-soft-md)] border border-t-[3px] p-[var(--space-sm)] ${stageClass[stage.kind]}`}>
            <span className="text-[length:var(--font-size-small)] uppercase tracking-[0.05em] text-text-subtle">{stage.label}</span>
            <span className="font-medium leading-snug text-text-primary">{stage.title}</span>
            <span className="text-[length:var(--font-size-small)] text-text-muted">{stage.detail}</span>
          </div>
          {index < company.stages.length - 1 ? (
            <span aria-hidden="true" className="flex justify-center text-accent-ink lg:w-4">
              <ArrowDown size={14} strokeWidth={2} className="lg:hidden" />
              <ArrowRight size={14} strokeWidth={2} className="hidden lg:block" />
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

/** The four company processes, the TL;DR and the side-by-side table. */
export function CompanyProcesses() {
  const nameOf = (id: CompanyProcess["id"]) => data.companies.find((company) => company.id === id)?.name ?? id;
  const cell = (value: string | null) =>
    value ?? <span className="text-text-subtle">{data.comparison.notReported}</span>;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-[var(--space-lg)]">
      <div className="grid gap-[var(--space-sm)]">
        <p className="text-[length:var(--font-size-small)] font-medium uppercase tracking-[0.08em] text-text-subtle">{data.eyebrow}</p>
        <p className="max-w-prose text-text-primary">{data.lede}</p>
      </div>

      <div className="grid gap-[var(--space-md)] lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <SoftCard padding="lg" className="grid content-start gap-[var(--space-sm)]">
          <h2 className="font-heading text-lg leading-tight text-text-primary">{copy.tldrTitle}</h2>
          <ul className="grid gap-[var(--space-xs)]">
            {data.tldr.map((line) => (
              <li key={line.companyId} className="relative pl-[var(--space-md)] text-text-primary before:absolute before:left-0 before:top-[0.6em] before:size-1.5 before:rounded-[var(--radius-pill)] before:bg-accent-ink">
                <b className="font-medium">{nameOf(line.companyId)}</b> {line.text}
              </li>
            ))}
          </ul>
          <p className="text-[length:var(--font-size-small)] text-text-subtle">{data.tldrNote}</p>
        </SoftCard>
        <SoftCard padding="lg" className="grid content-start gap-[var(--space-sm)]">
          <h2 className="font-heading text-lg leading-tight text-text-primary">{data.gcc.title}</h2>
          <p className="text-text-primary">{data.gcc.body}</p>
          <p className="font-heading text-[length:var(--font-size-h3)] leading-none text-text-primary">{data.gcc.figure.value}</p>
          <p className="text-[length:var(--font-size-small)] text-text-subtle">{data.gcc.figure.label}</p>
        </SoftCard>
      </div>

      <section aria-label={copy.companiesLabel} className="grid gap-[var(--space-md)]">
        {data.companies.map((company) => (
          <article
            key={company.id}
            aria-labelledby={`company-${company.id}`}
            className="grid gap-[var(--space-md)] rounded-[var(--radius-soft-lg)] border border-l-[5px] border-border-soft border-l-accent-ink bg-surface-card p-[var(--space-md)] shadow-soft lg:grid-cols-[13rem_minmax(0,1fr)]"
          >
            <div className="grid content-start gap-[var(--space-xs)]">
              <h2 id={`company-${company.id}`} className="font-heading text-lg leading-tight text-text-primary">
                {company.name}
              </h2>
              <p className="text-text-primary">{company.hook}</p>
              <ul className="flex flex-wrap gap-[var(--space-xs)]">
                {company.stats.map((stat) => (
                  <li key={stat}>
                    <Chip>{stat}</Chip>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid min-w-0 content-start gap-[var(--space-sm)]">
              <StageFlow company={company} />
              {company.parallelTrack ? (
                <p className="rounded-[var(--radius-soft-md)] border border-dashed border-accent-ink p-[var(--space-sm)] text-text-primary">
                  <b className="font-medium text-accent-ink">{company.parallelTrack.title}.</b> {company.parallelTrack.body}
                </p>
              ) : null}
              {company.watchOut ? (
                <p className="rounded-[var(--radius-soft-md)] bg-surface-muted p-[var(--space-sm)] text-text-primary">
                  <b className="font-medium text-danger-ink">{copy.watchOut}</b> {company.watchOut}
                </p>
              ) : null}
            </div>
          </article>
        ))}
      </section>

      <section aria-labelledby="companies-compare" className="grid gap-[var(--space-sm)]">
        <h2 id="companies-compare" className="font-heading text-lg leading-tight text-text-primary">
          {data.comparison.heading}
        </h2>
        {/* relative: keeps anything absolutely positioned inside this scroll box. */}
        <div className="relative overflow-x-auto rounded-[var(--radius-soft-lg)] border border-border-soft bg-surface-card">
          <table className="w-full min-w-[48rem] border-collapse text-[length:var(--font-size-small)]">
            <thead>
              <tr>
                {Object.values(data.comparison.columns).map((label) => (
                  <th key={label} scope="col" className="p-[var(--space-sm)] text-left font-medium uppercase tracking-[0.05em] text-text-subtle">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.comparison.rows.map((row) => (
                <tr key={row.companyId} className="border-t border-border-soft align-top">
                  <th scope="row" className="whitespace-nowrap p-[var(--space-sm)] text-left font-medium text-accent-ink">
                    {nameOf(row.companyId)}
                  </th>
                  <td className="p-[var(--space-sm)] text-text-primary">{cell(row.eligibility)}</td>
                  <td className="p-[var(--space-sm)] text-text-primary">{cell(row.assessment)}</td>
                  <td className="p-[var(--space-sm)] text-text-primary">{cell(row.rounds)}</td>
                  <td className="whitespace-nowrap p-[var(--space-sm)] text-text-primary">{cell(row.timeline)}</td>
                  <td className="p-[var(--space-sm)] text-text-primary">{cell(row.different)}</td>
                  <td className="p-[var(--space-sm)] text-text-primary">{cell(row.glassdoor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="max-w-prose text-[length:var(--font-size-small)] text-text-subtle">{data.source.sourceLabel}</p>
    </div>
  );
}
