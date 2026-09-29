import Dialog from './Dialog.jsx';

/**
 * Policies are written in the admin as plain text with a light markup:
 * a blank line between blocks, "## " for a heading, "- " for list items,
 * **bold** and *italic*. Web and email addresses become links.
 */
const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

function inline(text) {
  return text.split(INLINE).map((part, i) => {
    if (!part) return null;
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    if (/^https?:\/\//.test(part)) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    }
    if (part.includes('@')) {
      return (
        <a key={i} href={`mailto:${part}`}>
          {part}
        </a>
      );
    }
    return part;
  });
}

function Block({ text }) {
  if (text.startsWith('## ')) return <h3>{inline(text.slice(3))}</h3>;

  const lines = text.split('\n');
  if (lines.every((l) => l.startsWith('- '))) {
    return (
      <ul>
        {lines.map((l, i) => (
          <li key={i}>{inline(l.slice(2))}</li>
        ))}
      </ul>
    );
  }

  return <p>{inline(text)}</p>;
}

export default function PolicyDialog({ policy, onClose }) {
  return (
    <Dialog open={Boolean(policy)} onClose={onClose} labelledBy="policy-title">
      {policy && (
        <div className="policy-body">
          <h2 id="policy-title">{policy.title}</h2>
          {policy.body
            .split(/\n\s*\n/)
            .map((block) => block.trim())
            .filter(Boolean)
            .map((block, i) => (
              <Block key={i} text={block} />
            ))}
        </div>
      )}
    </Dialog>
  );
}
