import Dialog from './Dialog.jsx';

export default function PolicyDialog({ policy, onClose }) {
  return (
    <Dialog open={Boolean(policy)} onClose={onClose} labelledBy="policy-title">
      {policy && (
        <>
          <h2 id="policy-title">{policy.title}</h2>
          {policy.body.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </>
      )}
    </Dialog>
  );
}
