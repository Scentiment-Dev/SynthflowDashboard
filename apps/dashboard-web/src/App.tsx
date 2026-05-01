import { DashboardFilterProvider } from './context/DashboardFilterContext';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardRoutes from './routes/DashboardRoutes';

export default function App() {
  return (
    <DashboardFilterProvider>
      <DashboardLayout>
        <DashboardRoutes />
      </DashboardLayout>
    </DashboardFilterProvider>
  );
}
