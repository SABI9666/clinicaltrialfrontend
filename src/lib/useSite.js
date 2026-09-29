import { useEffect, useState } from 'react';
import { fetchSite } from './api.js';
import { FALLBACK_SITE } from '../data/fallback.js';

/**
 * Site content, with the bundled snapshot as the initial value.
 *
 * The page renders immediately from the fallback and swaps to live content
 * when the API responds, so a slow or unreachable API never yields a blank
 * page. `source` lets the UI note when it is showing the offline copy.
 */
export function useSite() {
  const [site, setSite] = useState(FALLBACK_SITE);
  const [source, setSource] = useState('fallback');
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    fetchSite()
      .then((data) => {
        if (!active) return;
        // Merge so a section the API has not stored yet keeps its default.
        setSite({ ...FALLBACK_SITE, ...data });
        setSource('api');
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        console.warn('Falling back to bundled content:', err.message);
        setError(err);
        setSource('fallback');
      });

    return () => {
      active = false;
    };
  }, []);

  return { site, source, error };
}
