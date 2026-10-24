"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  Check,
  Circle,
  CircleCheck,
  CircleDot,
  Clock,
  LayoutList,
  Lock,
  Sparkles,
  Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ProgressBar } from "@/components/ui/Progress";
import { navCopy, sidebarNav } from "@/content/nav.config";
import { isActivePath, sidebarContext, type NavBlock, type NavBlockItem, type ShellData } from "@/lib/nav";
import { routes } from "@/lib/routes";

type SidebarContentProps = {
  data: ShellData;
  /** 72px rail: icons only, labels kept for screen readers and as tooltips. */
  collapsed: boolean;
  /** The drawer closes itself when a link is followed. */
  onNavigate?: () => void;
};

const rowBase =
  "flex min-h-11 items-center gap-[var(--space-sm)] rounded-[var(--radius-soft-sm)] text-[length:var(--font-size-small)] transition-colors duration-150 ease-out motion-reduce:transition-none";
const rowIdle = "text-text-subtle hover:bg-brand-soft/40 hover:text-text-primary";
const rowActive = "bg-brand-soft/60 font-medium text-text-primary";

function NavRow({
  href,
  label,
  icon,
  active,
  collapsed,
  trailing,
  hint,
  indent = false,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  active: boolean;
  collapsed: boolean;
  trailing?: ReactNode;
  /** Extra words for screen readers and the collapsed tooltip, such as "Locked". */
  hint?: string;
  indent?: boolean;
  onNavigate?: () => void;
}) {
  const fullLabel = hint ? `${label}, ${hint}` : label;
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={collapsed ? fullLabel : undefined}
      className={`${rowBase} ${active ? rowActive : rowIdle} ${collapsed ? "justify-center px-0" : indent ? "pl-[var(--space-lg)] pr-[var(--space-sm)]" : "px-[var(--space-sm)]"}`}
    >
      <span className="grid size-5 shrink-0 place-items-center" aria-hidden="true">
        {icon}
      </span>
      {collapsed ? (
        <span className="sr-only">{fullLabel}</span>
      ) : (
        <>
          <span className="min-w-0 flex-1 truncate">{label}</span>
          {hint ? <span className="sr-only">, {hint}</span> : null}
          {trailing}
        </>
      )}
    </Link>
  );
}

const iconProps = { size: 16, strokeWidth: 1.8 } as const;

function Icon({ icon: Glyph }: { icon: LucideIcon }) {
  return <Glyph {...iconProps} />;
}

/** A block's number, used as its icon in the collapsed rail. */
function OrderMark({ order, done }: { order: number; done: boolean }) {
  return (
    <span
      className={`grid size-5 place-items-center rounded-[var(--radius-pill)] border text-[length:var(--font-size-small)] leading-none ${done ? "border-brand bg-brand-soft text-text-primary" : "border-border-soft-strong text-text-subtle"}`}
    >
      {order}
    </span>
  );
}

function blockStatus(block: NavBlock): { icon: LucideIcon; label: string } {
  if (block.status === "coming_soon") return { icon: Clock, label: navCopy.comingSoon };
  if (block.state === "done") return { icon: CircleCheck, label: navCopy.done };
  if (block.state === "in_progress") return { icon: CircleDot, label: navCopy.inProgress };
  return { icon: Circle, label: navCopy.notStarted };
}

function LockMark() {
  return <Lock size={14} strokeWidth={1.8} aria-hidden="true" className="shrink-0 text-text-subtle" />;
}

function SoonChip() {
  return (
    <span className="shrink-0 rounded-[var(--radius-pill)] border border-border-soft-strong px-[var(--space-xs)] text-[length:var(--font-size-small)] leading-[1.4] text-text-subtle">
      {navCopy.soon}
    </span>
  );
}

function HomeContext({ data, collapsed, pathname, onNavigate }: SidebarContentProps & { pathname: string }) {
  const isFree = data.plan === "free";

  return (
    <ul className="grid gap-px">
      {sidebarNav.map((item) => (
        <li key={item.key}>
          <NavRow
            href={item.href}
            label={item.label}
            icon={<Icon icon={item.icon} />}
            // Roadmap is only "current" on /roadmap itself; inside a block the
            // sidebar has already switched to that block's contents.
            active={item.key === "roadmap" ? pathname === item.href : isActivePath(pathname, item.href)}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
          {item.key === "roadmap" && data.blocks ? (
            <ul className="grid gap-px" aria-label={item.label}>
              {data.blocks.map((block) => {
                const status = blockStatus(block);
                return (
                  <li key={block.slug}>
                    <NavRow
                      href={block.href}
                      label={`${navCopy.blockLabel(block.order)}: ${block.shortTitle}`}
                      hint={[status.label, block.locked ? navCopy.locked : null].filter(Boolean).join(", ")}
                      icon={
                        collapsed ? (
                          <OrderMark order={block.order} done={block.state === "done"} />
                        ) : (
                          <Icon icon={status.icon} />
                        )
                      }
                      trailing={block.locked ? <LockMark /> : null}
                      active={isActivePath(pathname, block.href)}
                      collapsed={collapsed}
                      indent
                      onNavigate={onNavigate}
                    />
                  </li>
                );
              })}
            </ul>
          ) : null}
        </li>
      ))}
      {isFree ? (
        <li className="mt-[var(--space-sm)] border-t border-border-soft pt-[var(--space-sm)]">
          <NavRow
            // On /upgrade itself this is the current page, not a way back to it.
            href={isActivePath(pathname, routes.upgrade) ? routes.upgrade : routes.upgradeFrom("sidebar", pathname)}
            label={navCopy.upgrade}
            hint={navCopy.upgradeHint}
            icon={<Icon icon={Sparkles} />}
            active={isActivePath(pathname, routes.upgrade)}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        </li>
      ) : null}
    </ul>
  );
}

function itemIcon(item: NavBlockItem, index: number, collapsed: boolean): ReactNode {
  if (collapsed) {
    return <OrderMark order={index + 1} done={item.done} />;
  }
  if (item.done) return <Check size={16} strokeWidth={2} className="text-accent-ink" />;
  if (item.status === "coming_soon") return <Icon icon={Clock} />;
  return <Circle size={8} strokeWidth={2} />;
}

function itemHint(item: NavBlockItem): string | undefined {
  const parts = [item.done ? navCopy.done : null, item.status === "coming_soon" ? navCopy.comingSoon : null, item.locked ? navCopy.locked : null];
  const hint = parts.filter(Boolean).join(", ");
  return hint || undefined;
}

function BlockContext({
  block,
  activeItem,
  collapsed,
  pathname,
  onNavigate,
}: {
  block: NavBlock;
  activeItem: string | null;
  collapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="grid gap-[var(--space-sm)]">
      <NavRow
        href={routes.roadmap}
        label={navCopy.backToRoadmap}
        icon={<Icon icon={ArrowLeft} />}
        active={false}
        collapsed={collapsed}
        onNavigate={onNavigate}
      />

      {collapsed ? (
        <div className="grid justify-items-center" title={`${navCopy.blockLabel(block.order)}: ${block.title}`}>
          <span className="sr-only">
            {navCopy.blockLabel(block.order)}: {block.title}, {navCopy.blockProgress(block.done, block.total)}
          </span>
          <span aria-hidden="true" className="font-heading text-base text-text-primary">
            {block.order}
          </span>
        </div>
      ) : (
        <div className="grid gap-[var(--space-xs)] px-[var(--space-sm)]">
          <p className="flex items-center gap-[var(--space-xs)] text-[length:var(--font-size-small)] text-text-subtle">
            {navCopy.blockLabel(block.order)}
            {block.locked ? (
              <>
                <LockMark />
                <span className="sr-only">{navCopy.locked}</span>
              </>
            ) : null}
          </p>
          <p className="font-heading text-base leading-tight text-text-primary">{block.title}</p>
          <ProgressBar
            value={block.done}
            max={block.total}
            label={navCopy.blockProgress(block.done, block.total)}
            className="mt-[var(--space-xs)]"
          />
          <p className="text-[length:var(--font-size-small)] text-text-subtle">
            {navCopy.blockProgress(block.done, block.total)}
          </p>
        </div>
      )}

      <ul className="grid gap-px" aria-label={block.shortTitle}>
        <li>
          <NavRow
            href={block.href}
            label={navCopy.overview}
            icon={<Icon icon={LayoutList} />}
            active={pathname === block.href}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        </li>
        {block.items.map((item, index) => (
          <li key={item.slug}>
            <NavRow
              href={item.href}
              label={item.title}
              hint={itemHint(item)}
              icon={itemIcon(item, index, collapsed)}
              trailing={
                <>
                  {item.status === "coming_soon" ? <SoonChip /> : null}
                  {item.locked ? <LockMark /> : null}
                </>
              }
              active={activeItem === item.slug}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The sidebar's body, shared by the desktop sidebar and the mobile drawer:
 * the role chip, then either the home context or, inside a block, that
 * block's contents. Locked entries stay links: they open their lock page.
 */
export function SidebarContent({ data, collapsed, onNavigate }: SidebarContentProps) {
  const pathname = usePathname() ?? "";
  const context = sidebarContext(pathname, data.blocks);

  return (
    <div className="grid content-start gap-[var(--space-md)]">
      {data.roleChip ? (
        <Link
          href={routes.profile}
          onClick={onNavigate}
          title={collapsed ? `${data.roleChip.role} · ${data.roleChip.track}` : navCopy.roleChipHint}
          className={`flex min-h-11 items-center gap-[var(--space-sm)] rounded-[var(--radius-soft-md)] border border-border-soft bg-background text-[length:var(--font-size-small)] text-text-primary transition-colors duration-150 ease-out hover:border-border-strong motion-reduce:transition-none ${collapsed ? "justify-center" : "px-[var(--space-sm)] py-[var(--space-xs)]"}`}
        >
          <Target size={16} strokeWidth={1.8} aria-hidden="true" className="shrink-0 text-accent-ink" />
          {collapsed ? (
            <span className="sr-only">
              {data.roleChip.role}, {data.roleChip.track}
            </span>
          ) : (
            <span className="grid min-w-0 leading-tight">
              <span className="truncate font-medium">{data.roleChip.role}</span>
              <span className="truncate text-text-subtle">{data.roleChip.track}</span>
            </span>
          )}
        </Link>
      ) : null}

      <nav aria-label={navCopy.sidebarLabel}>
        {context.kind === "block" ? (
          <BlockContext
            block={context.block}
            activeItem={context.activeItem}
            collapsed={collapsed}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ) : (
          <HomeContext data={data} collapsed={collapsed} pathname={pathname} onNavigate={onNavigate} />
        )}
      </nav>
    </div>
  );
}
