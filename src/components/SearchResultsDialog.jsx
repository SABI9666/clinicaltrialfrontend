import Dialog from './Dialog.jsx';
import Image from './Image.jsx';

/**
 * What a search returns, shown where the person is looking.
 *
 * The search form sits near the top of the page and its results render below
 * the fold, so pressing Search changed nothing in view and read as a dead
 * button. This puts the answer in front of them instead. The list underneath
 * stays filtered to the same search, so closing this leaves the page showing
 * what was found rather than resetting the work.
 */

/** The search as a sentence, so the result set is self-explanatory. */
function appliedFilters({ condition, country, state, age }) {
  return [condition, country, state, age].filter(Boolean);
}

export default function SearchResultsDialog({
  open,
  filters,
  results = [],
  section,
  onClose,
  onViewTrial,
  onReset,
}) {
  const chips = appliedFilters(filters ?? {});
  const count = results.length;

  return (
    <Dialog open={open} onClose={onClose} labelledBy="search-results-title">
      <div className="results-dialog">
        <span className="eyebrow">Search results</span>
        <h2 id="search-results-title">
          {count === 0
            ? 'No matching trials'
            : `${count} matching trial${count === 1 ? '' : 's'}`}
        </h2>

        {chips.length > 0 ? (
          <ul className="result-filters" aria-label="Filters applied">
            {chips.map((c) => (
              <li key={c} className="tag">
                {c}
              </li>
            ))}
          </ul>
        ) : (
          <p className="results-lede">Showing every trial currently listed.</p>
        )}

        {count > 0 ? (
          <ul className="result-list">
            {results.map((trial) => (
              <li key={trial.id ?? trial.slug}>
                {/* The whole row is the control, so there is no small target to
                    aim at and no ambiguity about what is clickable. */}
                <button type="button" className="result" onClick={() => onViewTrial(trial)}>
                  {trial.image?.src && (
                    <span className="result-thumb">
                      <Image image={trial.image} />
                    </span>
                  )}
                  <span className="result-copy">
                    {trial.tag && <span className="tag">{trial.tag}</span>}
                    <strong>{trial.title}</strong>
                    {trial.summary?.[0] && <span className="result-blurb">{trial.summary[0]}</span>}
                    <span className="result-cta" aria-hidden="true">
                      View trial details ↗
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="results-empty">
            <p>
              {section?.emptyBody ??
                'Nothing matches this combination yet. Widening the search — or clearing it — may show trials recruiting nearby.'}
            </p>
            <button type="button" className="btn" onClick={onReset}>
              Clear filters and see all trials
            </button>
          </div>
        )}

        <p className="note">
          {section?.disclaimer ??
            'Trial locations, age criteria and recruitment status require confirmation by the research team.'}
        </p>
      </div>
    </Dialog>
  );
}
