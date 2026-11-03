import TrialSearch from './TrialSearch.jsx';

/** The home page's trial search: pick a condition and location, then see the results. */
export default function TrialsSection({ section, facets, onSearch }) {
  return (
    <section id="trials" className="find-trial">
      <div className="wrap">
        <div className="section-head">
          <div>
            {section?.eyebrow && <span className="eyebrow">{section.eyebrow}</span>}
            <h2>{section?.title}</h2>
            {section?.intro && <p>{section.intro}</p>}
          </div>
          {section?.aside && <span className="section-aside">{section.aside}</span>}
        </div>

        <TrialSearch id="search" section={section} facets={facets} onSearch={onSearch} />

        {section?.disclaimer && <p className="small">{section.disclaimer}</p>}
      </div>
    </section>
  );
}
