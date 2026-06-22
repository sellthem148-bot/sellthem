import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Toutes les routes sauf api, fichiers internes Next et fichiers statiques
  matcher: ['/', '/(fr|he|en|es|ru)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
