import { Check, X } from "lucide-react";
import { dosAndDonts, interviewCopy, type AdviceGroup } from "@/content/interviews.config";

const copy = interviewCopy;

function Column({ title, groups, kind }: { title: string; groups: AdviceGroup[]; kind: "do" | "dont" }) {
  const Icon = kind === "do" ? Check : X;
  return (
    <section
      aria-labelledby={`advice-${kind}`}
      className={`grid content-start gap-[var(--space-md)] rounded-[var(--radius-soft-lg)] border border-t-[3px] bg-surface-card p-[var(--space-md)] ${kind === "do" ? "border-border-soft border-t-accent-ink" : "border-border-soft border-t-danger-ink"}`}
    >
      <h2 id={`advice-${kind}`} className="flex items-center gap-[var(--space-xs)] font-heading text-lg leading-tight text-text-primary">
        <Icon size={18} strokeWidth={2} aria-hidden="true" className={kind === "do" ? "text-accent-ink" : "text-danger-ink"} />
        {title}
      </h2>
      {groups.map((group) => (
        <div key={group.title} className="grid gap-[var(--space-xs)]">
          <h3 className="text-[length:var(--font-size-small)] font-medium uppercase tracking-[0.06em] text-text-subtle">{group.title}</h3>
          <ul className="grid gap-[var(--space-xs)]">
            {group.items.map((item) => (
              <li key={item} className="flex gap-[var(--space-sm)] text-text-primary">
                <Icon size={15} strokeWidth={2} aria-hidden="true" className={`mt-1 shrink-0 ${kind === "do" ? "text-accent-ink" : "text-danger-ink"}`} />
                <span>
                  <span className="sr-only">{kind === "do" ? copy.dos : copy.donts}: </span>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

export function DosAndDonts() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-[var(--space-md)] lg:grid-cols-2">
      <Column title={copy.dosTitle} groups={dosAndDonts.dos} kind="do" />
      <Column title={copy.dontsTitle} groups={dosAndDonts.donts} kind="dont" />
    </div>
  );
}
