'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { toast } from 'sonner';
import { translateAuthError } from '@/lib/auth-errors';
import { Spinner } from '@/components/ui/spinner';

import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { syncUserSession } from '@/lib/auth';

export function SocialAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // Sincroniza sessão com a API e cookies
      await syncUserSession(idToken);

      toast.success('Login com Google realizado com sucesso!');
      window.location.href = '/';
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Ocorreu um erro';
      toast.error(translateAuthError(message));
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Field>
        <div className="relative flex items-center py-2">
          <div className="border-border grow border-t" />
          <span className="text-muted-foreground mx-4 shrink text-xs uppercase">
            Ou continue com
          </span>
          <div className="border-border grow border-t" />
        </div>
      </Field>

      <Field>
        <Button
          type="button"
          variant="outline"
          className="w-full font-medium"
          onClick={signInWithGoogle}
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Google
            </>
          )}
        </Button>
      </Field>
    </div>
  );
}
