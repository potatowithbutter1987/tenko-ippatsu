type Level = "info" | "warn" | "error";

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) =>
    emit("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) =>
    emit("warn", message, meta),
  error: (message: string, meta?: Record<string, unknown>) =>
    emit("error", message, meta),
};

const emit = (
  level: Level,
  message: string,
  meta?: Record<string, unknown>,
): void => {
  const payload = {
    level,
    message,
    ...(meta ?? {}),
    timestamp: new Date().toISOString(),
  };
  if (level === "error") console.error(payload);
  else if (level === "warn") console.warn(payload);
  else console.log(payload);
};
