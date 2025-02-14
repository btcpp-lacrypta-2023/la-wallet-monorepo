import { AvailableLanguages } from '@lawallet/react/types';
import { useWalletContext } from '@lawallet/react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import React, { useLayoutEffect, useMemo } from 'react';
import SpinnerView from '../Spinner/SpinnerView';
import { loadingMessages } from '@/context/TranslateContext';

// const unloggedRoutes: string[] = ['/', '/start', '/login', '/reset']

const protectedRoutes: string[] = [
  '/dashboard',
  '/transfer',
  '/deposit',
  '/scan',
  '/settings',
  '/transactions',
  '/plugins',
];

const AuthProvider = ({ children, lng }: { children: React.ReactNode; lng: AvailableLanguages }) => {
  const {
    account: { identity },
  } = useWalletContext();

  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const isProtectedRoute = (path: string): boolean => {
    let isProtected: boolean = false;

    protectedRoutes.forEach((route) => {
      if (path.startsWith(route)) isProtected = true;
    });

    return isProtected;
  };

  useLayoutEffect(() => {
    if (!identity.isLoading) {
      const protectedFlag = isProtectedRoute(pathname);
      const userLogged: boolean = Boolean(identity.data.hexpub.length);
      const nonce: string = params.get('i') || '';
      const card: string = params.get('c') || '';

      switch (true) {
        case !userLogged && pathname == '/' && !nonce:
          router.push('/');
          break;

        case !userLogged && protectedFlag:
          router.push('/');
          break;

        case userLogged && !protectedFlag:
          card ? router.push(`/settings/cards?c=${card}`) : router.push('/dashboard');
          break;
      }
    }
  }, [pathname, identity.data.hexpub, identity.isLoading]);

  const hydrateApp = useMemo((): boolean => {
    if (identity.isLoading) return false;

    const protectedFlag: boolean = isProtectedRoute(pathname);
    if (identity.data.hexpub.length && protectedFlag) return true;
    if (!identity.data.hexpub && !protectedFlag) return true;

    return false;
  }, [identity.isLoading, pathname]);

  return !hydrateApp ? <SpinnerView loadingText={loadingMessages[lng]['LOADING_ACCOUNT']} /> : children;
};

export default AuthProvider;
