'use client';

import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { removeCookie } from '@/lib/auth';

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await auth.signOut();
    removeCookie('session');
    removeCookie('token');
    router.push('/login');
  };

  return <Button onClick={logout}>Logout</Button>;
}
