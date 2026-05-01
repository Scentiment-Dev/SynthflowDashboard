import { render, screen } from '@testing-library/react';
import MetricCard from '../components/charts/MetricCard';

it('shows source of truth and calculated trust label', () => {
  render(
    <MetricCard
      metric={{
        key: 'subscription_save_rate',
        label: 'Save Rate',
        value: 'starter',
        trust_label: 'medium',
        description: 'Confirmed retained subscription outcomes only.',
        source_of_truth: 'Stay.ai',
      }}
    />,
  );

  expect(screen.getByText('Save Rate')).toBeInTheDocument();
  expect(screen.getByText('medium trust')).toBeInTheDocument();
  expect(screen.getByText('Stay.ai')).toBeInTheDocument();
});
