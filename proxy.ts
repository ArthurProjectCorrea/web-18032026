import { NextResponse, NextRequest } from 'next/server';
import { parseSession, hasPermission } from '@/lib/permissions';

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const sessionCookie = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  const isPublicRoute =
    pathname === '/login' ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/public');
  const isPrivateRoute = !isPublicRoute;

  // Se não houver token e for rota privada, redireciona para login
  if (!token && isPrivateRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se houver token e tentar ir para login, redireciona para "/"
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Validação granular de permissões para rotas privadas
  if (token && isPrivateRoute) {
    const session = parseSession(sessionCookie);

    // Mapeamento de rotas para telas (screens)
    const routePermissions: Record<string, string> = {
      '/admin/users': 'users',
      '/admin/positions': 'positions',
      '/admin/departments': 'departments',
      '/admin/screens': 'screens_manage',
      '/admin/permissions': 'permissions_manage',
      '/admin/logs': 'audit_logs',
      '/seeu-service': 'seeu_service',
      '/register/people': 'people',
    };

    // Verifica se a rota atual exige permissão específica
    for (const [route, screen] of Object.entries(routePermissions)) {
      if (pathname.startsWith(route)) {
        if (!hasPermission(session, screen, 'view')) {
          console.warn(`Acesso negado para tela ${screen} na rota ${pathname}`);
          return NextResponse.rewrite(new URL('/forbidden', request.url));
        }
        break;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
