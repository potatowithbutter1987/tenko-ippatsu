declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    APP_BASE_URL?: string;
    ENV?: "develop" | "production";
    BASIC_AUTH_USER?: string;
    BASIC_AUTH_PASSWORD?: string;
  }
}
