import TrialSearch from './TrialSearch.jsx';

/**
 * The landing page: the trial search and nothing else. Everything else on the
 * site opens once someone searches.
 */
export default function TrialsSection({ section, facets, onSearch }) {
  return (
    <section id="trials" className="landing">
      <div className="wrap">
        <div className="section-head">
          <div>
            {section?.eyebrow && <span className="eyebrow">{section.eyebrow}</span>}
            <h1>{section?.title}</h1>
            <p>{section?.intro}</p>
          </div>
          {section?.aside && <span className="small">{section.aside}</span>}
        </div>

        <TrialSearch id="search" section={section} facets={facets} onSearch={onSearch} />

        {section?.disclaimer && <p className="small">{section.disclaimer}</p>}
      </div>
    </section>
  );
}
