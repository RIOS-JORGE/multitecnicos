export interface StrapiMedia {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  name: string;
  width: number;
  height: number;
  mime: string;
  formats?: Record<string, { url: string; width: number; height: number }>;
}

export interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface StrapiResponse<T> {
  data: T[];
  meta: StrapiMeta;
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: StrapiMeta;
}

// ── Strapi Blocks (Rich Text) ────────────────────────────────────────────────

export interface StrapiBlockText {
  type: 'text';
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  link?: string;
}

export interface StrapiBlockHeading {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: StrapiBlockText[];
}

export interface StrapiBlockParagraph {
  type: 'paragraph';
  children: StrapiBlockText[];
}

export interface StrapiBlockList {
  type: 'list';
  format: 'ordered' | 'unordered';
  children: Array<{ children: StrapiBlockText[] }>;
}

export interface StrapiBlockQuote {
  type: 'quote';
  children: StrapiBlockText[];
}

export interface StrapiBlockCode {
  type: 'code';
  children: StrapiBlockText[];
}

export interface StrapiBlockImage {
  type: 'image';
  image: StrapiMedia;
}

export type StrapiBlock =
  | StrapiBlockHeading
  | StrapiBlockParagraph
  | StrapiBlockList
  | StrapiBlockQuote
  | StrapiBlockCode
  | StrapiBlockImage;
