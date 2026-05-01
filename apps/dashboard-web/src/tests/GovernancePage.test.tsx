import { render, screen } from '@testing-library/react';
import { GovernancePage } from '../pages/GovernancePage';

describe('GovernancePage', () => {
  it('renders explicit deny and export audit controls', () => {
    render(<GovernancePage />);
    expect(screen.getByText(/Server-side explicit deny/i)).toBeInTheDocument();
    expect(screen.getByText(/Export audit metadata required/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Trust labels are system-calculated/i })).toBeInTheDocument();
  });
});
