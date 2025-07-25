// types/FileData.ts
export interface FileData {
  name: string;
  size: number;
  type: string;
  base64: string; // 👈 important
}
