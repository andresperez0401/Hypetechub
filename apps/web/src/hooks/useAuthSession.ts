'use client';

interface AuthSessionState {
  isAuthenticated: boolean;
  userEmail: string | null;
}

export function useAuthSession(): AuthSessionState {
  // Placeholder until backend auth flow is fully implemented.
  return {
    isAuthenticated: false,
    userEmail: null,
  };
}
