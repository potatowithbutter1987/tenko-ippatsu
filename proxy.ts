import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

const REALM = "development";

type BasicCredentials = { user: string; password: string };

const isDevelopEnv = (): boolean => process.env.ENV === "develop";

const parseBasicAuthHeader = (header: string | null): BasicCredentials | null => {
  if (!header) return null;

  const [scheme, encoded] = header.split(" ");
  if (scheme !== "Basic" || !encoded) return null;

  const decoded = Buffer.from(encoded, "base64").toString("utf-8");
  const separatorIndex = decoded.indexOf(":");
  if (separatorIndex === -1) return null;

  return {
    user: decoded.slice(0, separatorIndex),
    password: decoded.slice(separatorIndex + 1),
  };
};

const isAuthorized = (request: NextRequest): boolean => {
  const expectedUser = process.env.BASIC_AUTH_USER;
  const expectedPassword = process.env.BASIC_AUTH_PASSWORD;
  if (!expectedUser || !expectedPassword) return false;

  const credentials = parseBasicAuthHeader(request.headers.get("authorization"));
  if (!credentials) return false;

  return credentials.user === expectedUser && credentials.password === expectedPassword;
};

const requiresAdminAuth = (pathname: string): boolean =>
  pathname.startsWith("/admin") && pathname !== "/admin/login";

const requiresLiffContext = (pathname: string): boolean =>
  pathname.startsWith("/driver");

// 各検証関数は方向性のみ確定済み。実装方式（cookie 名 / LINE OAuth or LIFF / 検証ヘッダ）が
// 未確定のため、現時点では pass-through。実装は別タスクで詰める。

// TODO(admin-auth): 管理者セッション cookie の検証
const hasAdminSession = (_request: NextRequest): boolean => true;

// TODO(line-auth): 管理者向け LINE 認証の検証
const hasLineAuth = (_request: NextRequest): boolean => true;

// TODO(liff-context): LIFF 経由アクセスの検証
const hasLiffContext = (_request: NextRequest): boolean => true;

export function proxy(request: NextRequest) {
  if (isDevelopEnv() && !isAuthorized(request)) {
    return new NextResponse("Authentication required.", {
      status: 401,
      headers: {
        "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
      },
    });
  }

  const { pathname } = request.nextUrl;

  if (
    requiresAdminAuth(pathname) &&
    (!hasAdminSession(request) || !hasLineAuth(request))
  ) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (requiresLiffContext(pathname) && !hasLiffContext(request)) {
    return new NextResponse("LIFF access required.", { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
