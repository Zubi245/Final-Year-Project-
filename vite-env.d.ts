/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  // agar aur env variables chahiye to yahan add karo
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
