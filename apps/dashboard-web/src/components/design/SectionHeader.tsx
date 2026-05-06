import type { ReactNode } from 'react';

type SectionHeaderProps = {
  eyebrow?: ReactNode;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  align?: 'left' | 'split';
  className?: string;
  titleClassName?: string;
  id?: string;
  ariaLabelledBy?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
  meta,
  align = 'split',
  className = '',
  titleClassName = '',
  id,
  ariaLabelledBy,
}: SectionHeaderProps) {
  return (
    <header
      aria-labelledby={ariaLabelledBy}
      className={`flex ${align === 'split' ? 'flex-col gap-4 lg:flex-row lg:items-end lg:justify-between' : 'flex-col gap-2'} ${className}`.trim()}
    >
      <div className="max-w-3xl">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2
          id={id}
          className={`display-title mt-2 text-xl tracking-tight text-slate-950 sm:text-2xl ${titleClassName}`.trim()}
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
        ) : null}
        {meta ? <div className="mt-3 flex flex-wrap items-center gap-2">{meta}</div> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
