/// <reference types="vite/client" />

declare module '*.mp3' { const src: string; export default src; }
declare module '*.wav' { const src: string; export default src; }
declare module '*.ogg' { const src: string; export default src; }

declare module '@undecaf/zbar-wasm' {
  export function scanImageData(imageData: ImageData): Promise<Symbol[]>;
  export interface Symbol {
    typeName: string;
    decode(): string;
    // другие поля...
  }
}