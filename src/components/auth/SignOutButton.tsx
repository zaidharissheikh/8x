'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui';

export default function SignOutButton() {
  return (
    <Button 
      variant="outline" 
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-oxblood border-oxblood hover:bg-oxblood hover:text-white"
    >
      Sign Out
    </Button>
  );
}
