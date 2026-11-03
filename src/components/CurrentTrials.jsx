import Image from './Image.jsx';

/** The home page's list of trials looking for participants, each linking to its own page. */
export default function CurrentTrials({ section, trials, onLearnMore }) {
  const recruiting = trials.filter((t) => t.published !== false);
  if (!recruiting.length) return null;

  return (
    <section id="current-trials" className="current-trials">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">{section?.recruitingEyebrow ?? 'Now recruiting'}</span>
            <h2>{section?.recruitingTitle ?? 'Clinical trials currently recruiting'}</h2>
            <p>
              {section?.recruitingIntro ??
                'Explore clinical trials currently looking for participants across Australia and Asia.'}
            </p>
          </div>
        </div>

        <div className="trial-list">
          {recruiting.map((trial) => (
            <article className="trial-card" key={trial.id ?? trial.slug}>
              <Image image={trial.image} />
              <div className="trial-copy">
                {trial.tag && <span className="tag">{trial.tag}</span>}
                <h3>{trial.title}</h3>
                {(trial.summary ?? []).map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
                <button type="button" className="btn trial-cta" onClick={() => onLearnMore(trial)}>
                  {trial.learnMoreLabel ?? 'Learn more about this trial ↗'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
