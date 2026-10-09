import { parseInline, parsePolicy } from '../lib/policyText.js';

/** One line of text with **bold**, *italic*, and web and email addresses linked. */
export function Inline({ text }) {
  return parseInline(text).map((part, i) => {
    switch (part.type) {
      case 'b':
        return <strong key={i}>{part.text}</strong>;
      case 'i':
        return <em key={i}>{part.text}</em>;
      case 'url':
        return (
          <a key={i} href={part.text} target="_blank" rel="noopener noreferrer">
            {part.text}
          </a>
        );
      case 'email':
        return (
          <a key={i} href={`mailto:${part.text}`}>
            {part.text}
          </a>
        );
      default:
        return part.text;
    }
  });
}

/**
 * Text written in the admin's formatting editor: blank lines between
 * paragraphs, "## " for a heading and "- " for a list item.
 */
export default function RichText({ text, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  return parsePolicy(text).map((block, i) => {
    if (block.type === 'h') {
      return (
        <Heading key={i}>
          <Inline text={block.text} />
        </Heading>
      );
    }
    if (block.type === 'ul') {
      return (
        <ul key={i}>
          {block.items.map((item, j) => (
            <li key={j}>
              <Inline text={item} />
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i}>
        <Inline text={block.text} />
      </p>
    );
  });
}
