import { describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@/test/unit/QueryProviderTestWrapper';
import { useSignup } from '@/api/hooks/auth/useSignup';

const mockNavigate = vi.fn();

describe('useSignUp', () => {
  it('navigate should be called on successful register', async () => {
    const { result } = renderHook(() => useSignup(mockNavigate), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({
        login: 'dsadsad',
        password: 'dsajknduisad',
        shortInfo: '123',
      });
    });

    await waitFor(() =>
      expect(result.current.isSuccess, 'fetching failed').toBe(true),
    );

    expect(mockNavigate, 'Navigate wasnt called').toBeCalled();
  });

  it('localStorage should have token on successful register', async () => {
    const { result } = renderHook(() => useSignup(mockNavigate), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({
        login: 'dsadsad',
        password: 'dsajknduisad',
        shortInfo: '123',
      });
    });

    await waitFor(() =>
      expect(result.current.isSuccess, 'fetching failed').toBe(true),
    );

    expect(localStorage.getItem('token')).toBe('123');
  });
});
