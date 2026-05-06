import type { ReactNode } from 'react';

type SubscriptionPageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  id?: string;
};

export default function SubscriptionPageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta,
  id,
}: SubscriptionPageHeaderProps) {
  return (
    <header
      aria-labelledby={id}
      className="surface-card flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-end lg:justify-between"
    >
      <div className="max-w-3xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className="display-title mt-2 text-xl tracking-tight text-slate-950 sm:text-2xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
        ) : null}
        {meta ? <div className="mt-3 flex flex-wrap items-center gap-2">{meta}</div> : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </header>
  );
}
