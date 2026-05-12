import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

type ActionableEmptyStateProps = {
  headline: string;
  detail: string;
  /** Optional helper that explains why the state happened. */
  why?: string;
  /** Optional verb-led action button or link. */
  action?: ReactNode;
  /** Optional secondary action. */
  secondaryAction?: ReactNode;
  icon?: ReactNode;
  testId?: string;
};

/**
 * Cycle 008 actionable empty state. Always answers the four questions a
 * support user asks: "what happened?", "why does it matter?", "can I
 * trust it?", and "what should I do next?". Replaces the silent "no
 * results" pattern that drove Cycle 006 confusion.
 */
export default function ActionableEmptyState({
  headline,
  detail,
  why,
  action,
  secondaryAction,
  icon,
  testId = 'actionable-empty-state',
}: ActionableEmptyStateProps) {
  return (
    <section
      role="status"
      aria-label={headline}
      data-testid={testId}
      className="surface-card flex flex-col items-center gap-3 px-5 py-8 text-center"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        {icon ?? <Inbox className="h-5 w-5" aria-hidden />}
      </span>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-900">{headline}</p>
        <p className="text-[12px] leading-5 text-slate-600">{detail}</p>
        {why ? (
          <p className="text-[11px] leading-5 text-slate-500">
            <span className="font-semibold text-slate-600">Why: </span>
            {why}
          </p>
        ) : null}
      </div>
      {(action || secondaryAction) ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {action}
          {secondaryAction}
        </div>
      ) : null}
    </section>
  );
}
