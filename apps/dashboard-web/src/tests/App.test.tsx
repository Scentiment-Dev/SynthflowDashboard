import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

it('renders the subscription analytics dashboard shell on /subscriptions', () => {
  render(
    <MemoryRouter initialEntries={['/subscriptions']}>
      <App />
    </MemoryRouter>,
  );

  // Sidebar wordmark uses the support-user friendly product name.
  expect(screen.getAllByText(/Subscription analytics/i).length).toBeGreaterThan(0);
  // Topbar renders the Command Center question above the fold.
  expect(
    screen.getByRole('heading', { name: /What changed in subscriptions today\?/i }),
  ).toBeInTheDocument();
  // Subscription subnav renders as a labelled landmark for the 10 subpages.
  const subnav = screen.getByRole('navigation', { name: /Subscription analytics/i });
  expect(within(subnav).getAllByRole('link').length).toBe(10);
  expect(screen.getAllByText(/Stay\.ai/i).length).toBeGreaterThan(0);
});
