import { sourceBadgeClasses } from '../../utils/formatters';

export default function SourceBadge({ source }: { source: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${sourceBadgeClasses(source)}`}>
      {source}
    </span>
  );
}
