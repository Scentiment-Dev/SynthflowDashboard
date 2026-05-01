import { Navigate, Route, Routes } from 'react-router-dom';
import OverviewPage from '../pages/OverviewPage';
import SubscriptionAnalyticsPage from '../pages/SubscriptionAnalyticsPage';
import CancellationPage from '../pages/CancellationPage';
import CancellationRetentionPage from '../pages/CancellationRetentionPage';
import OrderStatusPage from '../pages/OrderStatusPage';
import EscalationsPage from '../pages/EscalationsPage';
import DataQualityPage from '../pages/DataQualityPage';
import { GovernancePage } from '../pages/GovernancePage';
import ExportsPage from '../pages/ExportsPage';

export default function DashboardRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/overview" replace />} />
      <Route path="/overview" element={<OverviewPage />} />
      <Route path="/subscriptions" element={<SubscriptionAnalyticsPage />} />
      <Route path="/cancellations" element={<CancellationPage />} />
      <Route path="/retention" element={<CancellationRetentionPage />} />
      <Route path="/order-status" element={<OrderStatusPage />} />
      <Route path="/escalations" element={<EscalationsPage />} />
      <Route path="/data-quality" element={<DataQualityPage />} />
      <Route path="/governance" element={<GovernancePage />} />
      <Route path="/exports" element={<ExportsPage />} />
    </Routes>
  );
}
