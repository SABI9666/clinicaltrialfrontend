import { useMemo, useState } from 'react';
import SearchResultsDialog from './SearchResultsDialog.jsx';

const ANY = '';

/**
 * Filters mirror the API's rule: a trial that records no value for a facet is
 * never excluded by that facet, because "not yet confirmed" is not the same as
 * "not eligible". Eligibility is always the research team's call.
 */
function matches(trial, { condition, country, state, age }) {
  if (condition && trial.condition && trial.condition !== condition) return false;
  if (country && trial.country && trial.country !== country) return false;
  if (state && trial.states?.length && !trial.states.includes(state)) return false;
  if (age && trial.ageRange && trial.ageRange !== age) return false;
  return true;
}

export default function TrialsSection({ section, facets, trials, onLearnMore }) {
  const [filters, setFilters] = useState({
    condition: ANY,
    country: ANY,
    state: ANY,
    age: ANY,
  });
  const [submitted, setSubmitted] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const states = useMemo(() => {
    const country = facets?.countries?.find((c) => c.name === filters.country);
    return country?.states ?? [];
  }, [facets, filters.country]);

  // The page shows only the search; trials appear in the results dialog.
  const visible = submitted ? trials.filter((t) => matches(t, submitted)) : trials;

  const set = (key) => (e) => {
    const value = e.target.value;
    setFilters((f) => ({
      ...f,
      [key]: value,
      // A new country invalidates whatever state was chosen under the old one.
      ...(key === 'country' ? { state: ANY } : {}),
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(filters);
    setShowResults(true);
  };

  // Clearing from an empty result shows every trial, still in the dialog.
  const onReset = () => {
    const cleared = { condition: ANY, country: ANY, state: ANY, age: ANY };
    setFilters(cleared);
    setSubmitted(cleared);
  };

  /* Closes the results before opening the trial, so only one dialog is ever
   * modal — two at once would trap focus in the wrong one. */
  const onViewTrial = (trial) => {
    setShowResults(false);
    onLearnMore(trial);
  };

  return (
    <section id="trials">
      <div className="wrap">
        <div className="section-head">
          <div>
            {section?.eyebrow && <span className="eyebrow">{section.eyebrow}</span>}
            <h2>{section?.title}</h2>
            <p>{section?.intro}</p>
          </div>
          {section?.aside && <span className="small">{section.aside}</span>}
        </div>

        <form id="search" className="search" onSubmit={onSubmit}>
          <label>
            Condition
            <select value={filters.condition} onChange={set('condition')}>
              <option value={ANY}>All conditions</option>
              {(facets?.conditions ?? []).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>

          <label>
            Country
            <select value={filters.country} onChange={set('country')}>
              <option value={ANY}>Select country</option>
              {(facets?.countries ?? []).map((c) => (
                <option key={c.name}>{c.name}</option>
              ))}
            </select>
          </label>

          <label>
            State / territory
            <select value={filters.state} onChange={set('state')} disabled={!filters.country}>
              <option value={ANY}>
                {filters.country ? 'All states / territories' : 'Select country first'}
              </option>
              {states.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>

          <label>
            Age range
            <select value={filters.age} onChange={set('age')}>
              <option value={ANY}>Any age</option>
              {(facets?.ageRanges ?? []).map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>

          <button className="btn" type="submit">
            {section?.searchLabel ?? 'Search Trials ↗'}
          </button>
        </form>

        {section?.disclaimer && <p className="small">{section.disclaimer}</p>}

        <SearchResultsDialog
          open={showResults}
          filters={submitted}
          results={visible}
          section={section}
          onClose={() => setShowResults(false)}
          onViewTrial={onViewTrial}
          onReset={onReset}
        />
      </div>
    </section>
  );
}
