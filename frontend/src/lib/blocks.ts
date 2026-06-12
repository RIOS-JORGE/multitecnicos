/**
 * Extract plain text from Strapi Blocks (Rich Text) JSON array.
 * Falls back to empty string if blocks is null/undefined or not an array.
 */
export function extractTextFromBlocks(blocks: unknown): string {
  if (!blocks || !Array.isArray(blocks)) return '';

  return blocks
    .flatMap((block: Record<string, unknown>) => {
      if (block.type === 'heading' || block.type === 'paragraph') {
        const children = block.children as Array<Record<string, unknown>> | undefined;
        if (Array.isArray(children)) {
          return children
            .filter((child) => child.type === 'text' || child.type === 'link')
            .map((child) => String(child.text ?? ''));
        }
      }
      return [];
    })
    .join(' ')
    .trim();
}
