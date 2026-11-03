import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSite } from './lib/useSite.js';
import Header from './components/Header.jsx';
import TrialsSection from './components/TrialsSection.jsx';
import TrialResults from './components/TrialResults.jsx';
import Journey from './components/Journey.jsx';
import WhyJoin from './components/WhyJoin.jsx';
import Insights from './components/Insights.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import PolicyDialog from './components/PolicyDialog.jsx';
import { EMPTY_FILTERS, matches } from './lib/trials.js';
import { currentRoute, pageFor, pathFor, reportIdFor, routeForPath, trialHash, trialSlugFor } from './lib/routes.js';
import Hero from './components/Hero.jsx';
import CurrentTrials from './components/CurrentTrials.jsx';
import TrialPage from './components/TrialPage.jsx';
import ReportPage from './components/ReportPage.jsx';

export default function App() {
  const { site, source, error } = useSite();

  const [openPolicy, setOpenPolicy] = useState(null);
  const [insightsTab, setInsightsTab] = useState('reports');
  const [enquiryTrialSlug, setEnquiryTrialSlug] = useState('');
  const enquiryRef = useRef(null);

  const [route, setRoute] = useState(currentRoute);
  // Counts every navigation, so going to the page already shown still scrolls.
  const [visit, setVisit] = useState(0);
  const page = pageFor(route) ?? 'home';
  const reportId = reportIdFor(route);
  const trialSlug = trialSlugFor(route);
  // The last search; the results page shows every trial until one is run.
  const [search, setSearch] = useState(EMPTY_FILTERS);
  // Set when the enquiry form needs filling once the Contact page renders.
  const pendingPrefill = useRef(null);

  const go = useCallback((next) => {
    if (!pageFor(next)) return;
    const path = pathFor(next);
    if (window.location.pathname !== path || window.location.hash) {
      window.history.pushState(null, '', path);
    }
    setRoute(next);
    setVisit((v) => v + 1);
  }, []);

  // Back and forward.
  useEffect(() => {
    const onPop = () => {
      setRoute(currentRoute());
      setVisit((v) => v + 1);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Links stay plain <a href> everywhere (menu, footer, admin-written text);
  // a click on one of this site's pages changes page here instead of
  // reloading. Modified clicks (new tab, and so on) are left to the browser.
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.('a[href]');
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const href = a.getAttribute('href');
      let next = null;
      if (href.startsWith('#')) next = href;
      else if (href.startsWith('/') && !href.startsWith('//')) next = routeForPath(href.split(/[?#]/)[0]);
      if (next === null || !pageFor(next)) return;
      e.preventDefault();
      go(next);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [go]);

  // A new page starts at the top, or at the section its link named.
  useLayoutEffect(() => {
    // By id rather than selector: a trial's route (#trial-<slug>/<code>) is not a valid selector.
    const target = route.length > 1 ? document.getElementById(route.slice(1)) : null;
    const isPageRoot = target && target.closest('main > section:first-child') === target;
    if (target && !isPageRoot) target.scrollIntoView();
    else window.scrollTo(0, 0);

    const field = enquiryRef.current;
    if (page === 'contact' && field && pendingPrefill.current !== null) {
      // The textarea is controlled by React, so set the value through the
      // native setter and dispatch input for React to pick the change up.
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      setter.call(field, pendingPrefill.current);
      field.dispatchEvent(new Event('input', { bubbles: true }));
      pendingPrefill.current = null;
    }
  }, [route, visit, page]);

  const onSearch = useCallback(
    (filters) => {
      setSearch(filters);
      go('#results');
    },
    [go],
  );

  /** A trial without the registration form is enquired about from the Contact page. */
  const onEnquire = useCallback(
    (trial) => {
      setEnquiryTrialSlug(trial.slug ?? '');
      pendingPrefill.current = trial.detail?.enquiryPrefill || null;
      go('#contact');
    },
    [go],
  );

  const openTrial = useCallback((trial) => go(trialHash(trial)), [go]);

  const onShowFaqs = useCallback(() => setInsightsTab('faqs'), []);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <Header settings={site.settings} page={page} />

      <main id="main">
        {page === 'home' && (
          <>
            <Hero hero={site.hero} />
            <CurrentTrials
              section={site.trialsSection}
              trials={site.trials ?? []}
              onLearnMore={openTrial}
            />
            <Journey journey={site.journey} />
            <TrialsSection section={site.trialsSection} facets={site.facets} onSearch={onSearch} />
          </>
        )}

        {page === 'results' && (
          <>
            <TrialResults
              section={site.trialsSection}
              facets={site.facets}
              filters={search}
              results={(site.trials ?? []).filter((t) => matches(t, search))}
              onSearch={onSearch}
              onReset={() => onSearch(EMPTY_FILTERS)}
              onNewSearch={() => go('#trials')}
              onLearnMore={openTrial}
            />
          </>
        )}

        {page === 'why' && <WhyJoin why={site.why} />}

        {page === 'insights' && (
          <Insights
            insights={site.insights}
            reports={site.reports ?? []}
            faqs={site.faqs ?? []}
            news={site.news ?? []}
            activeTab={insightsTab}
            onTabChange={setInsightsTab}
          />
        )}

        {page === 'trial' && (
          <TrialPage
            trial={(site.trials ?? []).find((t) => t.slug === trialSlug)}
            centres={site.centres ?? []}
            loading={source === 'fallback' && !error}
            onEnquire={onEnquire}
          />
        )}

        {page === 'report' && (
          <ReportPage
            report={(site.reports ?? []).find((r) => String(r.id) === reportId)}
            // Live reports arrive with the API; until then only the bundled copy is here.
            loading={source === 'fallback' && !error}
          />
        )}

        {page === 'about' && <About about={site.about} />}

        {page === 'contact' && (
          <Contact ref={enquiryRef} contact={site.contact} trialSlug={enquiryTrialSlug} />
        )}
      </main>

      <Footer
        settings={site.settings}
        footer={site.footer}
        policies={site.policies ?? []}
        onShowPolicy={setOpenPolicy}
        onShowFaqs={onShowFaqs}
      />

      <PolicyDialog policy={openPolicy} onClose={() => setOpenPolicy(null)} />
    </>
  );
}
