/// <reference types="svelte" />
/// <reference types="vite/client" />

interface Window {
  moment?: {
    (text: string, formats: string[], strict: boolean): { isValid(): boolean; toDate(): Date };
  };
}
