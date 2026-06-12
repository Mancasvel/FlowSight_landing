import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const isCoachApi = request.nextUrl.pathname.startsWith('/api/chat');
    const isProtectedApp =
        request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/account');

    if (isCoachApi && !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (isProtectedApp) {
        if (!user) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
        supabaseResponse.headers.set('x-user-id', user.id);
        supabaseResponse.headers.set('x-user-email', user.email ?? '');
        supabaseResponse.headers.set(
            'x-user-name',
            user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? ''
        );
        supabaseResponse.headers.set(
            'x-user-avatar',
            user.user_metadata?.avatar_url ?? ''
        );
        supabaseResponse.headers.set('x-pathname', request.nextUrl.pathname);
    }

    if (request.nextUrl.pathname === '/login') {
        if (user) {
            const url = request.nextUrl.clone();
            url.pathname = '/dashboard';
            return NextResponse.redirect(url);
        }
    }

    return supabaseResponse;
}

export const config = {
    matcher: ['/dashboard/:path*', '/account/:path*', '/login', '/api/chat/:path*'],
};
