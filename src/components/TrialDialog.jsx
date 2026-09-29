import Dialog from './Dialog.jsx';

export default function TrialDialog({ trial, onClose, onEnquire }) {
  const detail = trial?.detail ?? {};

  return (
    <Dialog open={Boolean(trial)} onClose={onClose} labelledBy="trial-title">
      {trial && (
        <>
          {detail.eyebrow && <span className="eyebrow">{detail.eyebrow}</span>}
          <h2 id="trial-title">{detail.title || trial.title}</h2>
          {detail.tag && <span className="tag">{detail.tag}</span>}
          {(detail.paragraphs ?? []).map((text, i) => (
            <p key={i}>{text}</p>
          ))}
          {detail.note && <p className="note">{detail.note}</p>}
          <button className="btn" onClick={() => onEnquire(trial)}>
            {detail.ctaLabel ?? 'Enquire about this trial ↗'}
          </button>
        </>
      )}
    </Dialog>
  );
}
