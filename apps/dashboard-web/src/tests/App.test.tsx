import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

it('renders the Wave 4 dashboard shell', () => {
  render(
    <MemoryRouter initialEntries={["/subscriptions"]}>
      <App />
    </MemoryRouter>,
  );

  expect(screen.getByText(/Phone Support Analytics/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /Subscription Analytics/i })).toBeInTheDocument();
  expect(screen.getAllByText(/Stay.ai/i).length).toBeGreaterThan(0);
});
