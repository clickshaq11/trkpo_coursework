import { expect, it, describe, beforeEach, vi, afterEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from "../useDebounce"
import { useState } from 'react';

const DEFAULT_DELAY = 500;

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return default value before changing', () => {
    const value: string = 'sample value';

    const { result } = renderHook(() => useDebounce(value, DEFAULT_DELAY));

    expect(result.current).toBe('sample value');
  });

  it('should change value after period of time', () => {
    const value: string = 'sample value';

    const { result: stateResult } = renderHook(() => useState(value));
    const { result } = renderHook(() => useDebounce(stateResult.current[0], DEFAULT_DELAY));

    expect(result.current).toBe('sample value');

    act(() => stateResult.current[1]('another value'))

    waitFor(() => expect(result.current).toBe('another value'), {timeout: DEFAULT_DELAY + 1})
  })
});