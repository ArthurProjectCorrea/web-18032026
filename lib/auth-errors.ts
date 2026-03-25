export const translateAuthError = (error: string) => {
  const message = error.toLowerCase();

  // Firebase Error Codes
  if (
    message.includes('auth/invalid-credential') ||
    message.includes('invalid login credentials')
  ) {
    return 'E-mail ou senha incorretos.';
  }

  if (message.includes('auth/email-already-in-use')) {
    return 'Este e-mail já está cadastrado.';
  }

  if (message.includes('auth/weak-password')) {
    return 'A senha deve ter pelo menos 6 caracteres.';
  }

  if (message.includes('auth/user-not-found')) {
    return 'Usuário não encontrado.';
  }

  if (message.includes('auth/wrong-password')) {
    return 'Senha incorreta.';
  }

  if (
    message.includes('auth/too-many-requests') ||
    message.includes('rate limit exceeded')
  ) {
    return 'Muitas tentativas. Por favor, tente novamente mais tarde.';
  }

  if (message.includes('auth/network-request-failed')) {
    return 'Erro de conexão. Verifique sua internet.';
  }

  // Supabase Legacy / Other
  if (message.includes('email not confirmed')) {
    return 'Por favor, confirme seu e-mail antes de fazer login.';
  }

  if (message.includes('invalid code') || message.includes('code expired')) {
    return 'O código de confirmação é inválido ou expirou.';
  }

  return 'Ocorreu um erro inesperado. Tente novamente.';
};
