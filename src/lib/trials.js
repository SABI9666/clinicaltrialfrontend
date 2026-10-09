/** Trial search filters, shared by the search form and the results page. */
export const ANY = '';

export const EMPTY_FILTERS = { condition: ANY, country: ANY, state: ANY, age: ANY };

/**
 * Filters mirror the API's rule: a trial that records no value for a facet is
 * never excluded by that facet, because "not yet confirmed" is not the same as
 * "not eligible". Eligibility is always the research team's call.
 */
export function matches(trial, { condition, country, state, age }) {
  if (condition && trial.condition && trial.condition !== condition) return false;
  if (country && trial.country && trial.country !== country) return false;
  if (state && trial.states?.length && !trial.states.includes(state)) return false;
  if (age && trial.ageRange && trial.ageRange !== age) return false;
  return true;
}

/** The filters someone actually chose, in the order they appear on the form. */
export function appliedFilters({ condition, country, state, age }) {
  return [condition, country, state, age].filter(Boolean);
}
