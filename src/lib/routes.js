/**
 * The site is a handful of pages addressed by the URL hash, so menu, footer and
 * in-text links stay plain links. Each hash names a page, or a section within
 * one (scrolled to once the page renders).
 */
const PAGES = {
  '': 'home',
  '#': 'home',
  '#home': 'home',
  '#trials': 'home',
  '#search': 'home',
  '#current-trials': 'home',
  '#results': 'results',
  '#journey': 'home',
  '#why': 'why',
  '#insights': 'insights',
  '#about': 'about',
  '#contact': 'contact',
};

/** The trial a #trial-<slug> hash names, or null. */
export function trialSlugFor(hash) {
  if (!hash.startsWith('#trial-')) return null;
  // The address may carry the study code after the slug: #trial-<slug>/<code>.
  return decodeURIComponent(hash.slice('#trial-'.length).split('/')[0]);
}

/** A trial's study code (e.g. CYWC628), taken from its tags, or ''. */
export function studyCodeFor(trial) {
  const text = `${trial?.detail?.tag ?? ''} ${trial?.tag ?? ''}`;
  return text.match(/\b[A-Z]{2,}\d{2,}\b/)?.[0] ?? '';
}

/** The address of a trial's page: #trial-<slug>, plus /<code> when it has one. */
export function trialHash(trial) {
  const code = studyCodeFor(trial);
  return `#trial-${trial.slug}${code ? `/${code}` : ''}`;
}

/** The report a #report-<id> hash names, or null. */
export function reportIdFor(hash) {
  return hash.startsWith('#report-') ? decodeURIComponent(hash.slice('#report-'.length)) : null;
}

/**
 * The page a hash belongs to, or null for an anchor inside the current page
 * (the skip link's #main, for example), which should not change page.
 */
export function pageFor(hash) {
  if (hash in PAGES) return PAGES[hash];
  if (hash.startsWith('#trial-')) return 'trial';
  if (hash.startsWith('#report-')) return 'report';
  return null;
}
