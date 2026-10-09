import { useRef } from 'react';
import RichText from './RichText.jsx';
import { parsePolicy } from '../lib/policyText.js';

/** The first paragraph of a report, as plain text for its card. */
function excerpt(body = '') {
  const first = parsePolicy(body).find((b) => b.type === 'p');
  return (first?.text ?? '').replace(/\*\*|\*/g, '');
}

const TABS = [
  { id: 'reports', label: 'Reports' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'news', label: 'News' },
];

export default function Insights({ insights, reports, faqs, news, activeTab, onTabChange }) {
  const tabRefs = useRef([]);

  // Arrow/Home/End keys move between tabs, per the WAI-ARIA tabs pattern.
  const onKeyDown = (e, index) => {
    const last = TABS.length - 1;
    let next;
    if (e.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    if (e.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = last;
    if (next === undefined) return;
    e.preventDefault();
    onTabChange(TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section className="insights" id="insights">
      <div className="wrap">
        <div className="section-head">
          <div>
            {insights?.eyebrow && <span className="eyebrow">{insights.eyebrow}</span>}
            <h2>{insights?.title}</h2>
            <p>{insights?.intro}</p>
          </div>
        </div>

        <div className="tabs" role="tablist" aria-label="Insight categories">
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[i] = el)}
              className="tab"
              id={`tab-${tab.id}`}
              role="tab"
              aria-controls={tab.id}
              aria-selected={activeTab === tab.id}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => onTabChange(tab.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          id="reports"
          role="tabpanel"
          aria-labelledby="tab-reports"
          className="resources"
          hidden={activeTab !== 'reports'}
        >
          {reports.map((report) => (
            // The whole card is the link, so there is one obvious thing to press.
            <a className="resource report-card" key={report.id} href={`#report-${report.id}`}>
              {report.eyebrow && <span className="eyebrow">{report.eyebrow}</span>}
              <h3>{report.title}</h3>
              <p className="report-excerpt">{excerpt(report.body)}</p>
              <span className="report-more">Read report →</span>
            </a>
          ))}
        </div>

        <div id="faqs" role="tabpanel" aria-labelledby="tab-faqs" hidden={activeTab !== 'faqs'}>
          {faqs.map((faq) => (
            <details key={faq.id}>
              <summary>{faq.question}</summary>
              <div className="faq-answer">
                <RichText text={faq.answer} headingLevel={4} />
              </div>
            </details>
          ))}
        </div>

        <div
          id="news"
          role="tabpanel"
          aria-labelledby="tab-news"
          className={news.length ? 'resources' : 'resource'}
          hidden={activeTab !== 'news'}
        >
          {news.length === 0 ? (
            <>
              <h3>{insights?.newsEmptyTitle ?? 'News & updates'}</h3>
              <p>{insights?.newsEmptyBody}</p>
            </>
          ) : (
            news.map((item) => (
              <article className="resource" key={item.id}>
                {item.date && <span className="eyebrow">{item.date}</span>}
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
