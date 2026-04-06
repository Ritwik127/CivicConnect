import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  fetchCurrentSession,
  getPortalRoles,
  getReadableErrorMessage,
  getRoleHomePath,
  getStoredSessionUser,
  loginUser,
  logoutUser,
  registerUser,
} from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredSessionUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function hydrateSession() {
      try {
        const session = await fetchCurrentSession();
        if (isMounted) {
          setUser(session.user);
        }
      } catch (error) {
        if (isMounted) {
          if (error?.status === 401) {
            setUser(null);
          } else {
            console.error('Failed to hydrate session', error);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    hydrateSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      async login(credentials, portalRole) {
        const response = await loginUser(credentials);
        const authenticatedUser = response.user;
        const allowedRoles = getPortalRoles(portalRole);

        if (!allowedRoles.includes(authenticatedUser.role)) {
          await logoutUser();
          throw new Error(
            `This account belongs to the ${authenticatedUser.role.replaceAll('_', ' ')} portal.`,
          );
        }

        setUser(authenticatedUser);
        return authenticatedUser;
      },
      async register(payload) {
        await registerUser(payload);
        const response = await loginUser({
          email: payload.email,
          password: payload.password,
        });
        setUser(response.user);
        return response.user;
      },
      async refreshSession() {
        const session = await fetchCurrentSession();
        setUser(session.user);
        return session.user;
      },
      async logout() {
        await logoutUser();
        setUser(null);
      },
      getHomePath(role = user?.role) {
        return getRoleHomePath(role);
      },
      getErrorMessage(error, fallback) {
        return getReadableErrorMessage(error, fallback);
      },
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
