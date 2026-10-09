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
import { pageFor, reportIdFor, trialSlugFor } from './lib/routes.js';
import TrialPage from './components/TrialPage.jsx';
import ReportPage from './components/ReportPage.jsx';

export default function App() {
  const { site, source, error } = useSite();

  const [openPolicy, setOpenPolicy] = useState(null);
  const [insightsTab, setInsightsTab] = useState('reports');
  const [enquiryTrialSlug, setEnquiryTrialSlug] = useState('');
  const enquiryRef = useRef(null);

  const [page, setPage] = useState(() => pageFor(window.location.hash) ?? 'home');
  const [reportId, setReportId] = useState(() => reportIdFor(window.location.hash));
  const [trialSlug, setTrialSlug] = useState(() => trialSlugFor(window.location.hash));
  // The last search; the results page shows every trial until one is run.
  const [search, setSearch] = useState(EMPTY_FILTERS);
  // Set when the enquiry form needs filling once the Contact page renders.
  const pendingPrefill = useRef(null);

  useEffect(() => {
    const route = () => {
      const next = pageFor(window.location.hash);
      if (!next) return;
      setPage(next);
      setReportId(reportIdFor(window.location.hash));
      setTrialSlug(trialSlugFor(window.location.hash));
    };
    window.addEventListener('hashchange', route);
    return () => window.removeEventListener('hashchange', route);
  }, []);

  // A new page starts at the top, or at the section its link named.
  useLayoutEffect(() => {
    const hash = window.location.hash;
    const target = hash.length > 1 && pageFor(hash) === page ? document.querySelector(hash) : null;
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
  }, [page, reportId, trialSlug]);

  const go = useCallback((hash) => {
    if (window.location.hash === hash) setPage(pageFor(hash) ?? 'home');
    else window.location.hash = hash;
  }, []);

  const onSearch = useCallback(
    (filters) => {
      setSearch(filters);
      go('#results');
      if (window.location.hash === '#results') window.scrollTo(0, 0);
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

  const openTrial = useCallback((trial) => go(`#trial-${trial.slug}`), [go]);

  const onShowFaqs = useCallback(() => setInsightsTab('faqs'), []);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <Header settings={site.settings} page={page} />

      <main id="main">
        {page === 'home' && (
          <TrialsSection
            section={site.trialsSection}
            facets={site.facets}
            trust={site.hero?.trust ?? []}
            onSearch={onSearch}
          />
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
            <Journey journey={site.journey} />
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
