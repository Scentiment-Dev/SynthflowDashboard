import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

export default function ModuleHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <section className="surface-ink surface-grid-overlay relative overflow-hidden p-6 sm:p-8">
      <span className="ambient-glow -left-16 -top-16 bg-violet-500/40" />
      <span className="ambient-glow -bottom-20 right-10 bg-cyan-500/35" style={{ animationDelay: '-7s' }} />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-200">
            <Sparkles className="h-3.5 w-3.5 text-violet-300" /> {eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-[40px] md:leading-[1.1]">
            {title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200/85 md:text-[15px]">
            {description}
          </p>
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </section>
  );
}
