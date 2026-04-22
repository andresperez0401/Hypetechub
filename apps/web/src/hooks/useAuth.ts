'use client';

import { useState } from 'react';
import { login, register } from '@/lib/api/auth.api';
import type { AuthScaffoldResponse, LoginInput, RegisterInput } from '@/lib/types/auth';
import { getApiErrorMessage } from '@/lib/utils/api-error';

interface UseAuthResult {
  data: AuthScaffoldResponse | null;
  isLoading: boolean;
  error: string | null;
  loginLocal: (payload: LoginInput) => Promise<void>;
  registerLocal: (payload: RegisterInput) => Promise<void>;
}

export function useAuth(): UseAuthResult {
  const [data, setData] = useState<AuthScaffoldResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loginLocal = async (payload: LoginInput): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      setData(await login(payload));
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'No fue posible iniciar sesión.'));
    } finally {
      setIsLoading(false);
    }
  };

  const registerLocal = async (payload: RegisterInput): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      setData(await register(payload));
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'No fue posible crear la cuenta.'));
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, loginLocal, registerLocal };
}
