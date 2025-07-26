import * as React from 'react';
import type { UserContextValue } from '@/contexts/user-context';
import { UserContext } from '@/contexts/user-context';

export function useUser(): UserContextValue {
  // Retrieve the context value from UserContext
  const context = React.useContext(UserContext);

  // If context is undefined, it means useUser is used outside of UserProvider
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  // Return the context value, allowing components to access user data and actions
  return context;
}
