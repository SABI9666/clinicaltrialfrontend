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

/**
 * The page a hash belongs to, or null for an anchor inside the current page
 * (the skip link's #main, for example), which should not change page.
 */
export function pageFor(hash) {
  if (hash in PAGES) return PAGES[hash];
  if (hash.startsWith('#trial-')) return 'results';
  return null;
}
