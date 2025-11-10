import { render, screen } from '@testing-library/react';
import { describe, it, expect} from 'vitest';

function Sample() {
  return <span data-testid="sample">FarmSafe</span>;
}

describe('frontend sanity', () => {
  it('renders sample text', () => {
    render(<Sample />);
    expect(screen.getByTestId('sample'));
  });
});
