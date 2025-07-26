'use client';

import * as React from 'react';

import type { User } from '@/types/user';
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';

export interface UserContextValue {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  checkSession?: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps): React.JSX.Element {
  const [state, setState] = React.useState<{ user: User | null; error: string | null; isLoading: boolean }>({
    user: null,
    error: null,
    isLoading: true,
  });

  const checkSession = React.useCallback(async (): Promise<void> => {
    try {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        // If no token is found, clear the user state and stop loading
        setState((prev) => ({ ...prev, user: null, error: null, isLoading: false }));
        return;
      }
  
      // Call the API to verify the session using the token
      const { data, error } = await authClient.getUser();
  
      if (error) {
        logger.error(error);
        // Clear session on error
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setState((prev) => ({ ...prev, user: null, error: 'Session expired', isLoading: false }));
        return;
      }
  
      // Successfully fetched user data, update the state
      setState((prev) => ({ ...prev, user: data ?? null, error: null, isLoading: false }));
    } catch (err) {
      logger.error(err);
      // Clear session on any catch error
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setState((prev) => ({ ...prev, user: null, error: 'Something went wrong', isLoading: false }));
    }
  }, []);
  

  React.useEffect(() => {
    checkSession().catch((err: unknown) => {
      logger.error(err);
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, []);

  return <UserContext.Provider value={{ ...state, checkSession }}>{children}</UserContext.Provider>;
}

export const UserConsumer = UserContext.Consumer;

