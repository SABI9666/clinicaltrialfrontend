import TrialSearch from './TrialSearch.jsx';

/**
 * The landing page: the trial search and nothing else. Everything else on the
 * site opens once someone searches.
 */
export default function TrialsSection({ section, facets, trust = [], onSearch }) {
  return (
    <section id="trials" className="landing">
      <div className="wrap">
        <div className="landing-head">
          {section?.eyebrow && <span className="eyebrow">{section.eyebrow}</span>}
          <h1>{section?.title}</h1>
          {section?.intro && <p className="landing-intro">{section.intro}</p>}
        </div>

        <TrialSearch id="search" section={section} facets={facets} onSearch={onSearch} />

        {trust.length > 0 && (
          <ul className="landing-trust" aria-label="About Clinical Trial Access">
            {trust.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}

        {section?.disclaimer && <p className="landing-note">{section.disclaimer}</p>}
      </div>
    </section>
  );
}
