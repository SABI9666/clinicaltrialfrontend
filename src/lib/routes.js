/**
 * The site is a handful of pages. Internally each is named by a route written
 * like a hash ("#why", "#trial-<slug>/<code>") — the form the admin's links are
 * stored in — and shown in the address bar as a clean path ("/why",
 * "/trial-<slug>/<code>"). A route names a page, or a section within one
 * (scrolled to once the page renders).
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

/** The path a route is shown at: "#why" → "/why", "#home" → "/". */
export function pathFor(route) {
  const name = route.replace(/^#/, '');
  return name === '' || name === 'home' ? '/' : `/${name}`;
}

/**
 * The href to render for a link: a clean path for a route of this site,
 * anything else (an external address, mailto:, an in-page anchor) unchanged.
 */
export function linkHref(href = '') {
  return href.startsWith('#') && pageFor(href) ? pathFor(href) : href;
}

/** The route a path names: "/why" → "#why", "/" → "". */
export function routeForPath(path) {
  const name = decodeURIComponent(path.replace(/^\/+|\/+$/g, ''));
  return name ? `#${name}` : '';
}

/**
 * The route the address bar names. Old links (/#why) still arrive with a
 * hash; they are read the same way, and the address is tidied to the path.
 */
export function currentRoute() {
  const { pathname, hash } = window.location;
  if (pathname === '/' && hash && pageFor(hash)) {
    window.history.replaceState(null, '', pathFor(hash));
    return hash;
  }
  return routeForPath(pathname);
}
