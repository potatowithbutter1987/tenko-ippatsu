import { HttpError } from "@/lib/errors";

const resolveBaseUrl = (): string => {
  if (typeof window !== "undefined") return "";
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return `https://${vercelUrl}`;
  return process.env.APP_BASE_URL ?? "http://localhost:3000";
};

export const apiFetch = async <T>(
  path: string,
  init?: RequestInit,
): Promise<T> => {
  const url = `${resolveBaseUrl()}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new HttpError(res.status, "api_error", body || res.statusText);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
};
