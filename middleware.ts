import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip maintenance check for admin routes and maintenance page itself
  if (pathname.startsWith('/admin') || pathname === '/maintenance') {
    return NextResponse.next();
  }

  try {
    // Fetch settings to check maintenance mode
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.next();
    }

    const res = await fetch(
      `${supabaseUrl}/rest/v1/settings?select=maintenance_mode`,
      {
        headers: {
          'apikey': supabaseKey,
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (data[0]?.maintenance_mode === true) {
        return NextResponse.redirect(new URL('/maintenance', request.url));
      }
    }
  } catch {
    // If we can't fetch settings, let the request through
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
