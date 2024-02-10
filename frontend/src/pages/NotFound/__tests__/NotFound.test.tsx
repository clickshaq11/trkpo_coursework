import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { createWrapper } from '@/test/RouterProviderTestWrapper';
import userEvent from '@testing-library/user-event';

beforeEach(() => {
  localStorage.setItem('token', 'test');
});

afterAll(() => {
  localStorage.clear();
});

describe('NotFound', () => {
  it('should be rendered on invalid route', async () => {
    const { router, wrapper } = createWrapper();
    const rendered = render(wrapper);

    await waitFor(() => router.navigate('/invalid-route'));

    expect(rendered.getByText('Извините, такой страницы нет.')).toBeInTheDocument();
  });

  it('should have link to main page', async () => {
    const user = userEvent.setup();
    const { router, wrapper } = createWrapper();
    const rendered = render(wrapper);

    await waitFor(() => router.navigate('/invalid-route'));

    const link = rendered.getByRole('link');

    await user.click(link);

    expect(router.state.location.pathname).toBe('/');
  });
});