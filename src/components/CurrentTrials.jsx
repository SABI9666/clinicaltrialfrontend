import Image from './Image.jsx';

/** The trials currently listed, under the search on the home page. */
export default function CurrentTrials({ trials, onLearnMore }) {
  if (trials.length === 0) return null;

  return (
    <section id="current-trials" className="current-trials">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">Clinical trials</span>
            <h2>Currently recruiting</h2>
          </div>
          <a className="text-link" href="#results">
            View all trials →
          </a>
        </div>

        <div className="trial-grid">
          {trials.map((trial) => (
            <article className="trial-tile" key={trial.id ?? trial.slug}>
              <div className="trial-tile-media">
                <Image image={trial.image} />
              </div>
              <div className="trial-tile-body">
                {trial.tag && <span className="tag">{trial.tag}</span>}
                <h3>{trial.title}</h3>
                {trial.summary?.[0] && <p>{trial.summary[0]}</p>}
                <button type="button" className="btn" onClick={() => onLearnMore(trial)}>
                  View details ↗
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
