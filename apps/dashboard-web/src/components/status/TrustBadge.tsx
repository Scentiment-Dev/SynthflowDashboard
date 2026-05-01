import type { TrustLabel } from '../../types/metrics';
import { trustLabelClasses } from '../../utils/formatters';

export default function TrustBadge({ trustLabel }: { trustLabel: TrustLabel }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${trustLabelClasses(trustLabel)}`}>
      {trustLabel} trust
    </span>
  );
}
