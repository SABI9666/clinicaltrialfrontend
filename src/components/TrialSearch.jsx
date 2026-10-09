import { useMemo, useState } from 'react';
import { ANY, EMPTY_FILTERS } from '../lib/trials.js';

/**
 * The trial search form. Used on the landing page and again at the top of the
 * results page, where it starts from the search that was just run so it can
 * be refined rather than retyped.
 */
export default function TrialSearch({ section, facets, initial = EMPTY_FILTERS, onSearch, id }) {
  const [filters, setFilters] = useState(initial);

  const states = useMemo(() => {
    const country = facets?.countries?.find((c) => c.name === filters.country);
    return country?.states ?? [];
  }, [facets, filters.country]);

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
    onSearch(filters);
  };

  return (
    <form id={id} className="search" onSubmit={onSubmit}>
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
  );
}
