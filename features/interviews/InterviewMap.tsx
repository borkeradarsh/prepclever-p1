import { Chip } from "@/components/ui/Chip";
import { SoftCard } from "@/components/ui/SoftCard";
import { interviewCopy, interviewMap, type InterviewCell, type RoundStatus } from "@/content/interviews.config";

const copy = interviewCopy;

const dotClass: Record<RoundStatus, string> = {
  core: "border-accent-ink bg-accent-ink",
  sometimes: "border-accent-ink bg-surface-card",
  skipped: "border-dashed border-border-strong bg-transparent",
};

function StatusDot({ status }: { status: RoundStatus }) {
  return <span aria-hidden="true" className={`inline-block size-3.5 shrink-0 rounded-[var(--radius-pill)] border-[2.5px] ${dotClass[status]}`} />;
}

function Cell({ cell }: { cell: InterviewCell }) {
  const skipped = cell.status === "skipped";
  return (
    <div
      className={`grid h-full content-start gap-[var(--space-xs)] rounded-[var(--radius-soft-md)] border p-[var(--space-sm)] ${skipped ? "border-dashed border-border-soft-strong text-text-subtle" : "border-border-soft bg-surface-card"}`}
    >
      <Chip selected={cell.status === "core"} className="justify-self-start">
        {copy.statusChips[cell.status]}
      </Chip>
      <p className={skipped ? "" : "text-text-primary"}>{cell.focus}</p>
      {cell.question ? (
        <p className="border-l-2 border-brand pl-[var(--space-sm)] text-[length:var(--font-size-small)] text-text-subtle">
          <span className="sr-only">{copy.typicalQuestion}: </span>“{cell.question}”
        </p>
      ) : null}
    </div>
  );
}

/**
 * The general interview map: rounds by level. From 1280px a grid with a track
 * per level; below that, one stacked list per level, so nothing scrolls
 * sideways. Status is told by dot fill and label, never colour alone.
 */
export function InterviewMap() {
  const map = interviewMap;
  const legend = (["core", "sometimes", "skipped"] as RoundStatus[]).map((status) => (
    <li key={status} className="flex items-center gap-[var(--space-xs)]">
      <StatusDot status={status} />
      {copy.statusLabels[status]}
    </li>
  ));

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-[var(--space-lg)]">
      <div className="grid gap-[var(--space-sm)]">
        <p className="text-[length:var(--font-size-small)] font-medium uppercase tracking-[0.08em] text-text-subtle">{map.eyebrow}</p>
        <p className="font-heading text-[length:var(--font-size-h3)] leading-[var(--line-height-h3)] text-text-primary">{map.title}</p>
        <ul className="flex flex-wrap gap-[var(--space-sm)]">
          {map.facts.map((fact) => (
            <li
              key={fact.value}
              className={`flex items-baseline gap-[var(--space-sm)] rounded-[var(--radius-soft-md)] border px-[var(--space-sm)] py-[var(--space-xs)] ${fact.highlight ? "border-accent-ink bg-brand-soft/50" : "border-border-soft bg-surface-card"}`}
            >
              <span className="font-heading text-lg text-text-primary">{fact.value}</span>
              <span className="text-[length:var(--font-size-small)] text-text-subtle">{fact.label}</span>
            </li>
          ))}
        </ul>
        <ul aria-label={copy.legend} className="flex flex-wrap gap-[var(--space-md)] text-[length:var(--font-size-small)] text-text-subtle">
          {legend}
        </ul>
      </div>

      {/* Desktop: the grid. Rows are levels, columns are rounds. */}
      <div className="hidden xl:block">
        <table className="w-full table-fixed border-separate border-spacing-x-[var(--space-sm)] border-spacing-y-[var(--space-sm)]">
          <thead>
            <tr>
              <th scope="col" className="w-[11rem] text-left align-bottom text-[length:var(--font-size-small)] font-medium uppercase tracking-[0.06em] text-text-subtle">
                {copy.corner}
              </th>
              {map.rounds.map((round, index) => (
                <th key={round.title} scope="col" className="text-left align-bottom font-normal">
                  <span className="block text-[length:var(--font-size-small)] text-text-subtle">{index + 1}</span>
                  <span className="block font-medium text-text-primary">{round.title}</span>
                  {round.note ? (
                    <span className="mt-[var(--space-xs)] inline-block rounded-[var(--radius-soft-sm)] bg-brand-soft/60 px-[var(--space-xs)] text-[length:var(--font-size-small)] text-accent-ink">
                      {round.note}
                    </span>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {map.levels.map((level) => (
              <tr key={level.id}>
                <th scope="row" className="border-l-4 border-accent-ink pl-[var(--space-sm)] text-left align-top font-normal">
                  <span className="block font-heading text-lg leading-tight text-text-primary">{level.title}</span>
                  <span className="block text-[length:var(--font-size-small)] text-text-subtle">{level.years}</span>
                  <span className="mt-[var(--space-xs)] block text-[length:var(--font-size-small)] text-text-primary">
                    <b className="font-medium">{copy.bar}</b> {level.bar}
                  </span>
                </th>
                {level.cells.map((cell, index) => (
                  <td key={map.rounds[index].title} className="h-px align-top">
                    <div className="mb-[var(--space-xs)] flex items-center gap-[var(--space-xs)]" aria-hidden="true">
                      <StatusDot status={cell.status} />
                      <span className="h-0.5 flex-1 bg-accent-ink/40" />
                      {index === level.cells.length - 1 ? (
                        <span className="text-[length:var(--font-size-small)] font-medium uppercase leading-none text-accent-ink">{copy.offer}</span>
                      ) : null}
                    </div>
                    <Cell cell={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Below 1280px: one card per level, rounds in order. */}
      <div className="grid gap-[var(--space-md)] xl:hidden">
        {map.levels.map((level) => (
          <section key={level.id} aria-labelledby={`level-${level.id}`} className="grid gap-[var(--space-sm)] border-l-4 border-accent-ink pl-[var(--space-sm)]">
            <div>
              <h2 id={`level-${level.id}`} className="font-heading text-lg leading-tight text-text-primary">
                {level.title} <span className="text-[length:var(--font-size-small)] font-normal text-text-subtle">· {level.years}</span>
              </h2>
              <p className="text-[length:var(--font-size-small)] text-text-primary">
                <b className="font-medium">{copy.bar}</b> {level.bar}
              </p>
            </div>
            <ol className="grid gap-[var(--space-sm)] md:grid-cols-2">
              {level.cells.map((cell, index) => (
                <li key={map.rounds[index].title} className="grid gap-[var(--space-xs)]">
                  <p className="flex items-center gap-[var(--space-xs)] text-[length:var(--font-size-small)] font-medium text-text-primary">
                    <StatusDot status={cell.status} />
                    {copy.roundNumber(index + 1)}: {map.rounds[index].title}
                  </p>
                  {map.rounds[index].note ? (
                    <p className="text-[length:var(--font-size-small)] text-accent-ink">{map.rounds[index].note}</p>
                  ) : null}
                  <Cell cell={cell} />
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>

      <div className="grid gap-[var(--space-sm)] md:grid-cols-2">
        <SoftCard>
          <p className="text-text-primary">
            <b className="font-medium">{copy.byLevelTitle}:</b> {map.byLevel}
          </p>
        </SoftCard>
        <SoftCard tone="accent">
          <p className="text-text-primary">
            <b className="font-medium text-accent-ink">{map.banks.title}:</b> {map.banks.body}
          </p>
        </SoftCard>
      </div>

      <p className="max-w-prose text-[length:var(--font-size-small)] text-text-subtle">{map.source.sourceLabel}</p>
    </div>
  );
}
