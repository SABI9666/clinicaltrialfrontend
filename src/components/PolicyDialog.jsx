import Dialog from './Dialog.jsx';
import RichText from './RichText.jsx';

export default function PolicyDialog({ policy, onClose }) {
  return (
    <Dialog open={Boolean(policy)} onClose={onClose} labelledBy="policy-title">
      {policy && (
        <div className="policy-body">
          <h2 id="policy-title">{policy.title}</h2>
          <RichText text={policy.body} />
        </div>
      )}
    </Dialog>
  );
}
