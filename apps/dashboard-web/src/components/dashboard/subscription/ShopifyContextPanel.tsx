import { Boxes, ShieldOff } from 'lucide-react';
import type { ShopifyContextMetrics } from '../../../types/subscriptionAnalytics';
import { formatMetricValue } from '../../../utils/formatters';

export default function ShopifyContextPanel({
  shopify,
}: {
  shopify: ShopifyContextMetrics;
}) {
  return (
    <section
      data-testid="shopify-context-panel"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <header>
        <h3 className="text-base font-semibold text-slate-950">Shopify context</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Shopify provides order, product, customer, fulfillment and tracking context. It does not
          finalize subscription state — Stay.ai always wins.
        </p>
      </header>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-green-950">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
            <Boxes className="h-4 w-4" /> Context records available
          </div>
          <p className="mt-2 text-3xl font-semibold tracking-tight">
            {formatMetricValue(shopify.context_records_available_count)}
          </p>
          <p className="mt-2 text-sm leading-6">
            Shopify rows joined for context display in this analytics window.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
            <ShieldOff className="h-4 w-4" /> Subscription finalization
          </div>
          <p className="mt-2 text-lg font-semibold">
            Context only — finalization not allowed
          </p>
          <ul className="mt-3 space-y-1 text-sm leading-6">
            <li>Role: <span className="font-mono text-xs">{shopify.context_role}</span></li>
            <li>
              Finalization allowed:{' '}
              <span className="font-mono text-xs">{String(shopify.finalization_allowed)}</span>
            </li>
            <li>Source-of-truth precedence: Stay.ai &gt; Shopify.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
