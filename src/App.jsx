import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSite } from './lib/useSite.js';
import Header from './components/Header.jsx';
import TrialsSection from './components/TrialsSection.jsx';
import TrialResults from './components/TrialResults.jsx';
import TrialDialog from './components/TrialDialog.jsx';
import RegistrationDialog from './components/RegistrationDialog.jsx';
import Journey from './components/Journey.jsx';
import WhyJoin from './components/WhyJoin.jsx';
import Insights from './components/Insights.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import PolicyDialog from './components/PolicyDialog.jsx';
import { EMPTY_FILTERS, matches } from './lib/trials.js';

/**
 * Anchors that live on the landing page. Every other in-page link (Why Join,
 * Insights, About, Contact…) points into the full page, so following one
 * opens it.
 */
const LANDING_ANCHORS = new Set(['', '#', '#home', '#trials', '#search']);

export default function App() {
  const { site } = useSite();

  const [openTrial, setOpenTrial] = useState(null);
  const [registerTrial, setRegisterTrial] = useState(null);
  const [openPolicy, setOpenPolicy] = useState(null);
  const [insightsTab, setInsightsTab] = useState('reports');
  const [enquiryTrialSlug, setEnquiryTrialSlug] = useState('');
  const enquiryRef = useRef(null);

  /*
   * Two views. The landing page is the menu and the trial search alone; the
   * full page (results, then everything else) opens when someone searches or
   * follows a menu link into it. `search` holds the last search, or null while
   * the landing page is showing.
   */
  const [search, setSearch] = useState(null);
  const scrollTarget = useRef(null);

  const openFullPage = useCallback((filters, target = null) => {
    scrollTarget.current = target;
    setSearch(filters);
  }, []);

  // Menu, footer and in-text links are plain hash links; route them here.
  useEffect(() => {
    const route = () => {
      const hash = window.location.hash;
      if (LANDING_ANCHORS.has(hash)) {
        scrollTarget.current = null;
        setSearch(null);
        return;
      }
      // Opening the full page scrolls to the section once it renders; if it is
      // already open the browser has scrolled there itself.
      setSearch((current) => {
        if (current !== null) return current;
        scrollTarget.current = hash;
        return EMPTY_FILTERS;
      });
    };
    route();
    window.addEventListener('hashchange', route);
    return () => window.removeEventListener('hashchange', route);
  }, []);

  // After the view changes, land at the top or on the section that was asked for.
  useLayoutEffect(() => {
    const target = scrollTarget.current;
    scrollTarget.current = null;
    const el = target && document.querySelector(target);
    if (el) el.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [search]);

  const onSearch = useCallback((filters) => {
    openFullPage(filters);
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [openFullPage]);

  const onNewSearch = useCallback(() => {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    setSearch(null);
  }, []);

  /**
   * The trial dialog's button. Trials that use the registration form open it;
   * the rest fall back to prefilling the ordinary enquiry form below.
   */
  const onEnquire = useCallback((trial) => {
    setOpenTrial(null);

    if (trial.registration?.enabled !== false && trial.slug) {
      setRegisterTrial(trial);
      return;
    }

    setEnquiryTrialSlug(trial.slug ?? '');

    const prefill = trial.detail?.enquiryPrefill;
    const field = enquiryRef.current;
    if (field) {
      if (prefill) {
        // The textarea is controlled by React, so set the value through the
        // native setter and dispatch input for React to pick the change up.
        const setter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          'value',
        ).set;
        setter.call(field, prefill);
        field.dispatchEvent(new Event('input', { bubbles: true }));
      }
      window.location.hash = 'contact';
      field.focus({ preventScroll: true });
      field.scrollIntoView({ block: 'center' });
    }
  }, []);

  const onShowFaqs = useCallback(() => setInsightsTab('faqs'), []);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <Header settings={site.settings} />

      <main id="main">
        {search === null ? (
          <TrialsSection
            section={site.trialsSection}
            facets={site.facets}
            trust={site.hero?.trust ?? []}
            onSearch={onSearch}
          />
        ) : (
          <>
            <TrialResults
              section={site.trialsSection}
              facets={site.facets}
              filters={search}
              results={(site.trials ?? []).filter((t) => matches(t, search))}
              onSearch={onSearch}
              onReset={() => onSearch(EMPTY_FILTERS)}
              onNewSearch={onNewSearch}
              onLearnMore={setOpenTrial}
            />

            <Journey journey={site.journey} />
            <WhyJoin why={site.why} />

            <Insights
              insights={site.insights}
              reports={site.reports ?? []}
              faqs={site.faqs ?? []}
              news={site.news ?? []}
              activeTab={insightsTab}
              onTabChange={setInsightsTab}
            />

            <About about={site.about} />
            <Contact ref={enquiryRef} contact={site.contact} trialSlug={enquiryTrialSlug} />
          </>
        )}
      </main>

      <Footer
        settings={site.settings}
        footer={site.footer}
        policies={site.policies ?? []}
        onShowPolicy={setOpenPolicy}
        onShowFaqs={onShowFaqs}
      />

      <TrialDialog trial={openTrial} onClose={() => setOpenTrial(null)} onEnquire={onEnquire} />

      <RegistrationDialog
        trial={registerTrial}
        centres={site.centres ?? []}
        onClose={() => setRegisterTrial(null)}
      />
      <PolicyDialog policy={openPolicy} onClose={() => setOpenPolicy(null)} />
    </>
  );
}
