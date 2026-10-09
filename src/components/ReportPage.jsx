import RichText from './RichText.jsx';

/** A single report on its own page, opened from its card under Insights. */
export default function ReportPage({ report, loading }) {
  return (
    <section id="report" className="article-page">
      <div className="wrap">
        <a className="back-link" href="#insights">
          ← All reports
        </a>

        {report ? (
          <article className="article">
            {report.eyebrow && <span className="eyebrow">{report.eyebrow}</span>}
            <h1>{report.title}</h1>
            <div className="article-body policy-body">
              <RichText text={report.body} />
            </div>
            {report.footnote && <p className="article-footnote">{report.footnote}</p>}

            <div className="article-cta">
              <p>Looking for a clinical trial that may be relevant to you?</p>
              <a className="btn" href="#trials">
                Find a clinical trial ↗
              </a>
            </div>
          </article>
        ) : (
          <div className="article">
            <h1>{loading ? 'Loading…' : 'Report not found'}</h1>
            {!loading && (
              <p>This report may have been moved or taken down. You can browse every report under Insights.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
