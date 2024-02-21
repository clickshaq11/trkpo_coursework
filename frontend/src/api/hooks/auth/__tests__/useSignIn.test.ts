import { it, describe, vi, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useSignIn } from '@/api/hooks/auth/useSignIn';
import { createWrapper } from '@/test/unit/QueryProviderTestWrapper';

const mockNavigate = vi.fn();

describe('useSignIn', () => {
  it('navigate should be called on successful login', async () => {
    const { result } = renderHook(() => useSignIn(mockNavigate), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({
        login: 'dsadsad',
        password: 'dsajknduisad',
      });
    });

    await waitFor(() =>
      expect(result.current.isSuccess, 'fetching failed').toBe(true),
    );

    expect(mockNavigate, 'Navigate wasnt called').toBeCalled();
  });

  it('localStorage should have token on successful login', async () => {
    const { result } = renderHook(() => useSignIn(mockNavigate), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate({
        login: 'dsadsad',
        password: 'dsajknduisad',
      });
    });

    await waitFor(() =>
      expect(result.current.isSuccess, 'fetching failed').toBe(true),
    );

    expect(localStorage.getItem('token')).toBe('123');
  });
});
