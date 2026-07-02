import type {
  StrapiBlock,
  StrapiBlockText,
  StrapiBlockHeading,
  StrapiBlockParagraph,
  StrapiBlockList,
  StrapiBlockQuote,
  StrapiBlockCode,
  StrapiBlockImage,
} from '../../types/strapi';

interface DescriptionBlockProps {
  content: string | StrapiBlock[];
}

// Simple renderer for Strapi Blocks content
// Falls back to checking if content is a string
export default function DescriptionBlock({ content }: DescriptionBlockProps) {
  if (!content) return null;

  // If content is a plain string, render as paragraphs
  if (typeof content === 'string') {
    return (
      <div className="prose prose-gray max-w-none">
        {content.split('\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    );
  }

  // If content is Strapi Blocks JSON array
  if (Array.isArray(content)) {
    return (
      <div className="prose prose-gray max-w-none">
        {content.map((block, i) => {
          const renderer = blockRenderers[block.type];
          return renderer ? renderer(block, i) : null;
        })}
      </div>
    );
  }

  return null;
}

const blockRenderers: Record<
  StrapiBlock['type'],
  (block: StrapiBlock, key: number) => React.ReactNode
> = {
  heading: (block, key) => renderHeading(block as StrapiBlockHeading, key),
  paragraph: (block, key) => (
    <p key={key}>{renderChildren((block as StrapiBlockParagraph).children)}</p>
  ),
  list: (block, key) => {
    const listBlock = block as StrapiBlockList;
    const items = listBlock.children.map((item, j) => (
      <li key={j}>{renderChildren(item.children)}</li>
    ));
    return listBlock.format === 'ordered' ? (
      <ol key={key}>{items}</ol>
    ) : (
      <ul key={key}>{items}</ul>
    );
  },
  quote: (block, key) => (
    <blockquote key={key}>
      {renderChildren((block as StrapiBlockQuote).children)}
    </blockquote>
  ),
  code: (block, key) => (
    <pre key={key}>
      <code>{renderChildren((block as StrapiBlockCode).children)}</code>
    </pre>
  ),
  image: (block, key) => {
    const img = (block as StrapiBlockImage).image;
    return (
      <img
        key={key}
        src={img?.url}
        alt={img?.alternativeText || ''}
        className="rounded-lg"
      />
    );
  },
};

function renderHeading(block: StrapiBlockHeading, key: number) {
  const level = block.level || 2;
  const children = renderChildren(block.children);
  switch (level) {
    case 1:
      return <h1 key={key}>{children}</h1>;
    case 2:
      return <h2 key={key}>{children}</h2>;
    case 3:
      return <h3 key={key}>{children}</h3>;
    case 4:
      return <h4 key={key}>{children}</h4>;
    case 5:
      return <h5 key={key}>{children}</h5>;
    case 6:
      return <h6 key={key}>{children}</h6>;
    default:
      return <h2 key={key}>{children}</h2>;
  }
}

function renderChildren(children: StrapiBlockText[]): React.ReactNode {
  if (!children) return null;
  return children.map((child, i) => {
    if (child.bold) return <strong key={i}>{child.text}</strong>;
    if (child.italic) return <em key={i}>{child.text}</em>;
    if (child.underline) return <u key={i}>{child.text}</u>;
    if (child.strikethrough) return <s key={i}>{child.text}</s>;
    if (child.code) return <code key={i}>{child.text}</code>;
    if (child.link)
      return (
        <a key={i} href={child.link} className="text-blue-600 hover:underline">
          {child.text}
        </a>
      );
    return child.text;
  });
}
