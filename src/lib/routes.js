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
  '#results': 'results',
  '#journey': 'results',
  '#why': 'why',
  '#insights': 'insights',
  '#about': 'about',
  '#contact': 'contact',
};

/** The trial a #trial-<slug> hash names, or null. */
export function trialSlugFor(hash) {
  return hash.startsWith('#trial-') ? decodeURIComponent(hash.slice('#trial-'.length)) : null;
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
