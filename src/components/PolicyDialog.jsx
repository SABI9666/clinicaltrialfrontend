import Dialog from './Dialog.jsx';
import { parseInline, parsePolicy } from '../lib/policyText.js';

function Inline({ text }) {
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

export default function PolicyDialog({ policy, onClose }) {
  return (
    <Dialog open={Boolean(policy)} onClose={onClose} labelledBy="policy-title">
      {policy && (
        <div className="policy-body">
          <h2 id="policy-title">{policy.title}</h2>
          {parsePolicy(policy.body).map((block, i) => {
            if (block.type === 'h') return <h3 key={i}><Inline text={block.text} /></h3>;
            if (block.type === 'ul') {
              return (
                <ul key={i}>
                  {block.items.map((item, j) => (
                    <li key={j}><Inline text={item} /></li>
                  ))}
                </ul>
              );
            }
            return <p key={i}><Inline text={block.text} /></p>;
          })}
        </div>
      )}
    </Dialog>
  );
}
