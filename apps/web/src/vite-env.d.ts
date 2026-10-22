/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_DEFAULT_EXPIRATION_MINUTES?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_EMAIL_DOMAIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
