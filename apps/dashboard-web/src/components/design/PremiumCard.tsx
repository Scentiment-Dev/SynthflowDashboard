import type { ReactNode, HTMLAttributes } from 'react';

type PremiumCardProps = HTMLAttributes<HTMLElement> & {
  as?: 'section' | 'article' | 'div';
  variant?: 'default' | 'elevated' | 'inset';
  padded?: boolean;
  children: ReactNode;
};

const VARIANT_CLASS: Record<NonNullable<PremiumCardProps['variant']>, string> = {
  default: 'surface-card',
  elevated: 'surface-card-elevated',
  inset: 'rounded-2xl border border-slate-200/80 bg-slate-50/60 backdrop-blur-sm',
};

export default function PremiumCard({
  as = 'section',
  variant = 'default',
  padded = true,
  className = '',
  children,
  ...rest
}: PremiumCardProps) {
  const Tag = as;
  const padding = padded ? 'p-5 sm:p-6' : '';
  return (
    <Tag className={`${VARIANT_CLASS[variant]} ${padding} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
