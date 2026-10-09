import Image from './Image.jsx';
import TrialSearch from './TrialSearch.jsx';
import { appliedFilters } from '../lib/trials.js';

/**
 * The top of the full page: what the search found, each trial with a clear
 * next step, and the search again so it can be refined in place.
 */
export default function TrialResults({
  section,
  facets,
  filters,
  results,
  onSearch,
  onReset,
  onNewSearch,
  onLearnMore,
}) {
  const chips = appliedFilters(filters);
  const count = results.length;

  return (
    <section id="results" className="results-page">
      <div className="wrap">
        <button type="button" className="back-link" onClick={onNewSearch}>
          ← New search
        </button>

        <div className="section-head">
          <div>
            <span className="eyebrow">Search results</span>
            <h1>
              {count === 0
                ? (section?.emptyTitle ?? 'No matching trials')
                : `${count} matching trial${count === 1 ? '' : 's'}`}
            </h1>
            {chips.length > 0 ? (
              <ul className="result-filters" aria-label="Filters applied">
                {chips.map((c) => (
                  <li key={c} className="tag">
                    {c}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Showing every trial currently listed.</p>
            )}
          </div>
        </div>

        {/* Keyed on the search so the form shows exactly what produced these results. */}
        <TrialSearch
          key={JSON.stringify(filters)}
          section={section}
          facets={facets}
          initial={filters}
          onSearch={onSearch}
        />

        {count > 0 ? (
          <div className="trial-list">
            {results.map((trial) => (
              <article className="trial-card" key={trial.id ?? trial.slug}>
                <Image image={trial.image} />
                <div className="trial-copy">
                  {trial.tag && <span className="tag">{trial.tag}</span>}
                  <h3>{trial.title}</h3>
                  {(trial.summary ?? []).map((text, i) => (
                    <p key={i}>{text}</p>
                  ))}
                  <button className="btn trial-cta" onClick={() => onLearnMore(trial)}>
                    {trial.learnMoreLabel ?? 'View details and register ↗'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="resource">
            <h3>{section?.emptyTitle ?? 'No matching trials'}</h3>
            <p>
              {section?.emptyBody ??
                'Nothing matches this combination yet. Widening the search may show trials recruiting nearby.'}
            </p>
            <button type="button" className="btn" onClick={onReset}>
              {section?.resetLabel ?? 'Clear filters and see all trials'}
            </button>
          </div>
        )}

        {section?.disclaimer && <p className="small">{section.disclaimer}</p>}
      </div>
    </section>
  );
}
