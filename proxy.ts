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

export function proxy(request: NextRequest) {
  if (!isDevelopEnv()) return NextResponse.next();
  if (isAuthorized(request)) return NextResponse.next();

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
