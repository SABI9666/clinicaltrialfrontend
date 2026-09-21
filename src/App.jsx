import { useCallback, useRef, useState } from 'react';
import { useSite } from './lib/useSite.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import HeroWide from './components/HeroWide.jsx';
import TrialsSection from './components/TrialsSection.jsx';
import TrialDialog from './components/TrialDialog.jsx';
import Journey from './components/Journey.jsx';
import WhyJoin from './components/WhyJoin.jsx';
import Insights from './components/Insights.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import PolicyDialog from './components/PolicyDialog.jsx';

export default function App() {
  const { site } = useSite();

  const [openTrial, setOpenTrial] = useState(null);
  const [openPolicy, setOpenPolicy] = useState(null);
  const [insightsTab, setInsightsTab] = useState('reports');
  const [enquiryTrialSlug, setEnquiryTrialSlug] = useState('');
  const enquiryRef = useRef(null);

  /** Close the trial dialog, prefill the enquiry and send the user to it. */
  const onEnquire = useCallback((trial) => {
    setOpenTrial(null);
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
    }
  }, []);

  const onShowFaqs = useCallback(() => setInsightsTab('faqs'), []);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      {site.settings?.bannerEnabled && site.settings?.banner && (
        <div className="top">{site.settings.banner}</div>
      )}

      <Header settings={site.settings} />

      <main id="main">
        <Hero hero={site.hero} />
        <HeroWide heroWide={site.heroWide} />

        <TrialsSection
          section={site.trialsSection}
          facets={site.facets}
          trials={site.trials ?? []}
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
      </main>

      <Footer
        settings={site.settings}
        footer={site.footer}
        policies={site.policies ?? []}
        onShowPolicy={setOpenPolicy}
        onShowFaqs={onShowFaqs}
      />

      <TrialDialog trial={openTrial} onClose={() => setOpenTrial(null)} onEnquire={onEnquire} />
      <PolicyDialog policy={openPolicy} onClose={() => setOpenPolicy(null)} />
    </>
  );
}
