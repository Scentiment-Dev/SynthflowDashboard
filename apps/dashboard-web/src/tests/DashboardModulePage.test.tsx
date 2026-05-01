import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DashboardFilterProvider } from '../context/DashboardFilterContext';
import DashboardModulePage from '../components/dashboard/DashboardModulePage';

it('renders Cost Too High locked sequence on retention page', () => {
  render(
    <MemoryRouter>
      <DashboardFilterProvider>
        <DashboardModulePage module="retention" />
      </DashboardFilterProvider>
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { name: /Cancellation \/ Retention Analytics/i })).toBeInTheDocument();
  expect(screen.getAllByText(/frequency change → 25% off/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/Stay.ai outcome determines save/i)).toBeInTheDocument();
});
