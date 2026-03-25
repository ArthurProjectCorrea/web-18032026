'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
// import { SocialAuth } from '../button/social-auth';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { LoginFormProps } from '@/types/auth-forms';
import { loginWithEmail, syncUserSession } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Login no Firebase
      const { token } = await loginWithEmail(email, password);

      // 2. Sincroniza sessão com a API
      await syncUserSession(token);

      toast.success('Login realizado com sucesso!');

      // 3. Redireciona para "/"
      router.push('/');
    } catch (error: unknown) {
      console.error('Erro no login:', error);
      toast.error('E-mail ou senha inválidos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
            Acessar sua conta
          </h1>
          <p className="text-muted-foreground text-xl text-balance">
            Insira seu e-mail abaixo para fazer login
          </p>
        </div>
        <Field>
          <FieldLabel
            htmlFor="email"
            className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase"
          >
            E-mail
          </FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@exemplo.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background focus-visible:ring-primary/20"
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel
              htmlFor="password"
              className="text-muted-foreground mb-1.5 text-xs font-semibold tracking-wider uppercase"
            >
              Senha
            </FieldLabel>
            <Link
              href="/forgot-password"
              className="text-primary ml-auto text-xs font-medium hover:underline"
            >
              Esqueceu sua senha?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-background focus-visible:ring-primary/20"
          />
        </Field>
        <Field>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Spinner /> : 'Entrar'}
          </Button>
        </Field>
        {/* <SocialAuth /> */}
      </FieldGroup>
    </form>
  );
}
