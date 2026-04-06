import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth';

/**
 * Centralized session accessor. Uses next-auth v4.24.13+ which
 * properly awaits headers()/cookies() for Next.js 16 compatibility.
 */
export async function getSession() {
  return getServerSession(authOptions);
}
