import { buildModuleSummaryUrl } from '../services/dashboardApi';

describe('dashboard API contract alignment', () => {
  it('uses the Wave 3 module summary endpoint shape', () => {
    expect(buildModuleSummaryUrl('subscriptions')).toContain('/metrics/modules/subscriptions/summary');
  });
});
