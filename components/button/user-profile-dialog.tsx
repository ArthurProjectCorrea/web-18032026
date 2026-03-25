'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { LockIcon } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ProfileSettingsForm } from '@/components/form/profile-settings-form';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { UserData } from '@/types/user';

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: string;
    email: string;
    name?: string;
  };
  profile: UserData | null;
  onRefresh?: () => void;
}

export function UserProfileDialog({
  open,
  onOpenChange,
  user,
  profile,
  onRefresh,
}: UserProfileDialogProps) {
  const { setTheme, theme } = useTheme();
  const [isResetLoading, setIsResetLoading] = useState(false);

  const userDisplayName =
    profile?.name || user.name || user.email?.split('@')[0] || 'Usuário';
  const roleDisplay = profile?.position?.name || 'Sem Cargo';
  const deptDisplay = profile?.position?.department?.name || 'Sem Departamento';

  const handlePasswordReset = async () => {
    if (!user?.email) return;

    try {
      setIsResetLoading(true);
      await sendPasswordResetEmail(auth, user.email);

      toast.success('Link de redefinição enviado para o seu e-mail!');
    } catch (error: unknown) {
      toast.error(
        'Erro ao enviar link: ' +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-auto flex-col overflow-hidden p-6 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Minha Conta</DialogTitle>
        </DialogHeader>
        <Tabs
          defaultValue="geral"
          className="flex w-full flex-1 flex-col overflow-hidden"
        >
          <TabsList className="grid w-full shrink-0 grid-cols-2">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="config">Configurações</TabsTrigger>
          </TabsList>
          <div className="mt-2 flex-1 overflow-y-auto pr-1">
            <TabsContent value="geral" className="mt-0 outline-none">
              <ProfileSettingsForm
                user={{
                  id: user.id,
                  name: userDisplayName,
                  registration: profile?.registration,
                  department: deptDisplay,
                  position: roleDisplay,
                }}
                onSuccess={() => {
                  if (onRefresh) onRefresh();
                  onOpenChange(false);
                }}
              />
            </TabsContent>
            <TabsContent value="config" className="mt-0 outline-none">
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Aparência</h4>
                  <p className="text-muted-foreground text-sm">
                    Escolha como o sistema deve aparecer para você.
                  </p>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="bg-background mt-2 w-full">
                      <SelectValue placeholder="Selecione um tema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <DropdownMenuSeparator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Segurança</h4>
                  <p className="text-muted-foreground text-sm">
                    Receba um link em seu e-mail para definir uma nova senha.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-2 w-full gap-2"
                    onClick={handlePasswordReset}
                    disabled={isResetLoading}
                  >
                    {isResetLoading ? (
                      <Spinner />
                    ) : (
                      <>
                        <LockIcon className="size-4" />
                        Redefinir Senha
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
