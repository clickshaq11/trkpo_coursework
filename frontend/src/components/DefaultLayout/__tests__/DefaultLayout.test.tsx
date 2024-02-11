import { beforeEach, describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { createWrapper } from '@/test/RouterProviderTestWrapper';

beforeEach(() => {
  localStorage.clear();
});

describe('DefaultLayout', () => {
  it('should navigate to /login when no token present in localStorage', () => {
    const { wrapper, router } = createWrapper();
    render(wrapper);

    expect(router.state.location.pathname).toBe('/login');
  });

  it('should not navigate to /login when there is token', () => {
    localStorage.setItem('token', '123');

    const { wrapper, router } = createWrapper();
    render(wrapper);

    expect(router.state.location.pathname).toBe('/me');
  });
});
