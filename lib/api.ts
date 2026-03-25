/**
 * Utilitário centralizado para chamadas de API.
 * Resolve automaticamente a URL base e anexa cookies no lado do servidor.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchApi<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const isServer = typeof window === 'undefined';

  // No servidor, batemos direto na porta 8000 (API)
  // No cliente, usamos a URL relativa e deixamos o Next.js Rewrite (next.config.js) cuidar do proxy
  const baseUrl = isServer
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    : '';
  const url = `${baseUrl}${path}`;

  const headers = new Headers(options.headers);

  if (isServer) {
    // Encaminha cookies do navegador para a API no SSR
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      headers.set('cookie', cookieStore.toString());
    } catch {
      // Ignora se não houver contexto de request (ex: build estático)
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Tratamento especial para 401 (Não autorizado/Sessão expirada)
    if (response.status === 401) {
      if (!isServer) {
        // No cliente, limpamos cookies e forçamos redirect
        document.cookie =
          'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie =
          'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.href = '/login?expired=true';
        return null as T;
      }

      // No servidor, jogamos um erro específico que o error.tsx pode capturar
      const error = new Error('UNAUTHORIZED');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).status = 401;
      throw error;
    }

    let errorMessage = `Erro na API: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Falha ao parsear erro como JSON
    }
    throw new Error(errorMessage);
  }

  // Se o status for 204 (No Content), retorna null
  if (response.status === 204) return null as T;

  return response.json();
}
