interface DescriptionBlockProps {
  content: any; // Strapi Blocks JSON
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
        {content.map((block: any, i: number) => {
          switch (block.type) {
            case 'heading':
              return renderHeading(block, i);
            case 'paragraph':
              return <p key={i}>{renderChildren(block.children)}</p>;
            case 'list':
              if (block.format === 'ordered') {
                return (
                  <ol key={i}>
                    {block.children?.map((item: any, j: number) => (
                      <li key={j}>{renderChildren(item.children)}</li>
                    ))}
                  </ol>
                );
              }
              return (
                <ul key={i}>
                  {block.children?.map((item: any, j: number) => (
                    <li key={j}>{renderChildren(item.children)}</li>
                  ))}
                </ul>
              );
            case 'quote':
              return (
                <blockquote key={i}>
                  {renderChildren(block.children)}
                </blockquote>
              );
            case 'code':
              return (
                <pre key={i}><code>{renderChildren(block.children)}</code></pre>
              );
            case 'image':
              return (
                <img
                  key={i}
                  src={block.image?.url}
                  alt={block.image?.alternativeText || ''}
                  className="rounded-lg"
                />
              );
            default:
              return null;
          }
        })}
      </div>
    );
  }

  return null;
}

function renderHeading(block: any, key: number) {
  const level = block.level || 2;
  const children = renderChildren(block.children);
  switch (level) {
    case 1: return <h1 key={key}>{children}</h1>;
    case 2: return <h2 key={key}>{children}</h2>;
    case 3: return <h3 key={key}>{children}</h3>;
    case 4: return <h4 key={key}>{children}</h4>;
    case 5: return <h5 key={key}>{children}</h5>;
    case 6: return <h6 key={key}>{children}</h6>;
    default: return <h2 key={key}>{children}</h2>;
  }
}

function renderChildren(children: any[]): React.ReactNode {
  if (!children) return null;
  return children.map((child: any, i: number) => {
    if (child.bold) return <strong key={i}>{child.text}</strong>;
    if (child.italic) return <em key={i}>{child.text}</em>;
    if (child.underline) return <u key={i}>{child.text}</u>;
    if (child.strikethrough) return <s key={i}>{child.text}</s>;
    if (child.code) return <code key={i}>{child.text}</code>;
    if (child.link) return <a key={i} href={child.link} className="text-blue-600 hover:underline">{child.text}</a>;
    return child.text;
  });
}
