import type { ReactNode } from 'react';
import SectionHeader from '../design/SectionHeader';

type SubscriptionPageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  id?: string;
};

/**
 * Cycle 007 IA v2 — per-subpage hero. Thin wrapper around the shared
 * `SectionHeader` design primitive that adds the `surface-card` styling and
 * sets `aria-labelledby` on the outer `<header>` to the page title id. The
 * structural rendering (eyebrow / title / description / meta / actions) lives
 * inside `SectionHeader` so the design system has a single canonical
 * implementation of the header pattern.
 */
export default function SubscriptionPageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta,
  id,
}: SubscriptionPageHeaderProps) {
  return (
    <SectionHeader
      eyebrow={eyebrow}
      title={title}
      description={description}
      meta={meta}
      actions={actions}
      align="split"
      id={id}
      ariaLabelledBy={id}
      className="surface-card px-5 py-5 sm:px-6 sm:py-6"
    />
  );
}
