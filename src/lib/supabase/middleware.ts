import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseKey, getSupabaseUrl } from "./env";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabaseKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
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

  const pathname = request.nextUrl.pathname;

  const protectedPrefixes = [
    "/rutas/nueva",
    "/bultos/nuevo",
    "/cuenta",
    "/aportacion",
    "/pagar-aportacion",
  ];

  const isProtected =
    pathname === "/suscribir" ||
    pathname.startsWith("/suscribir/") ||
    protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    const returnPath =
      request.nextUrl.pathname + (request.nextUrl.search || "");
    url.searchParams.set("redirect", returnPath);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
