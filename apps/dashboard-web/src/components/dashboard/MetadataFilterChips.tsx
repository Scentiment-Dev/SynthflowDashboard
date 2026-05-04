export type MetadataFilterChipsProps = {
  filters: Record<string, unknown>;
};

export default function MetadataFilterChips({ filters }: MetadataFilterChipsProps) {
  const entries = Object.entries(filters);
  if (entries.length === 0) {
    return <p className="text-sm leading-6 text-slate-500">No filters reported.</p>;
  }
  return (
    <ul className="flex flex-wrap gap-2">
      {entries.map(([key, value]) => (
        <li
          key={key}
          className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
        >
          {key}:{' '}
          <span className="ml-1 font-mono">
            {Array.isArray(value) ? value.join(', ') : String(value)}
          </span>
        </li>
      ))}
    </ul>
  );
}
