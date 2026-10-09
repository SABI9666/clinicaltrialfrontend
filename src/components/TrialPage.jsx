import Image from './Image.jsx';
import RegistrationDialog from './RegistrationDialog.jsx';
import { Inline } from './RichText.jsx';
import { parsePolicy } from '../lib/policyText.js';

/**
 * The trial's details as sections. Each detail paragraph written in the admin
 * that starts with "## Heading" becomes its own section; paragraphs without a
 * heading are gathered into an opening "About this trial" section.
 */
function sectionsFrom(paragraphs = []) {
  const sections = [];
  let intro = null;

  for (const text of paragraphs) {
    const blocks = parsePolicy(text);
    if (blocks[0]?.type === 'h') {
      sections.push({ title: blocks[0].text, blocks: blocks.slice(1) });
    } else if (blocks.length) {
      if (!intro) {
        intro = { title: 'About this trial', blocks: [] };
        sections.unshift(intro);
      }
      intro.blocks.push(...blocks);
    }
  }
  return sections;
}

/** The key facts, from the fields the admin already records for a trial. */
function factsFrom(trial) {
  const location = [trial.states?.length ? trial.states.join(', ') : '', trial.country]
    .filter(Boolean)
    .join(' · ');
  return [
    { label: 'Condition', value: trial.condition },
    { label: 'Age range', value: trial.ageRange || 'Confirmed by the study team' },
    { label: 'Location', value: location },
    { label: 'Treatment', value: trial.detail?.tag },
  ].filter((f) => f.value);
}

function Blocks({ blocks }) {
  return blocks.map((block, i) => {
    if (block.type === 'h') {
      return (
        <h4 key={i}>
          <Inline text={block.text} />
        </h4>
      );
    }
    if (block.type === 'ul') {
      return (
        <ul key={i} className="check-list">
          {block.items.map((item, j) => (
            <li key={j}>
              <Inline text={item} />
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i}>
        <Inline text={block.text} />
      </p>
    );
  });
}

export default function TrialPage({ trial, centres, loading, onEnquire }) {
  if (!trial) {
    return (
      <section id="trial" className="article-page">
        <div className="wrap">
          <a className="back-link" href="#results">
            ← All trials
          </a>
          <div className="article">
            <h1>{loading ? 'Loading…' : 'Trial not found'}</h1>
            {!loading && <p>This trial may no longer be recruiting. You can search every trial currently listed.</p>}
          </div>
        </div>
      </section>
    );
  }

  const detail = trial.detail ?? {};
  const sections = sectionsFrom(detail.paragraphs);
  const facts = factsFrom(trial);
  const registers = trial.registration?.enabled !== false && trial.slug;

  return (
    <section id="trial" className="trial-page">
      <div className="wrap">
        <a className="back-link" href="#results">
          ← Back to results
        </a>

        <header className="trial-hero">
          <div className="trial-hero-copy">
            {trial.tag && <span className="tag">{trial.tag}</span>}
            {detail.eyebrow && <span className="eyebrow">{detail.eyebrow}</span>}
            <h1>{detail.title || trial.title}</h1>
            {(trial.summary ?? []).map((text, i) => (
              <p key={i}>{text}</p>
            ))}
            <div className="actions">
              {registers ? (
                // Scrolls rather than links, so the address keeps naming this trial.
                <button
                  type="button"
                  className="btn"
                  onClick={() => document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Register your interest ↓
                </button>
              ) : (
                <button type="button" className="btn" onClick={() => onEnquire(trial)}>
                  {detail.ctaLabel || 'Enquire about this trial ↗'}
                </button>
              )}
            </div>
          </div>
          {trial.image?.src && (
            <div className="trial-hero-media">
              <Image image={trial.image} />
            </div>
          )}
        </header>

        {facts.length > 0 && (
          <dl className="trial-facts">
            {facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {sections.map((section, i) => (
          <section className="trial-section" key={section.title + i} aria-labelledby={`trial-section-${i}`}>
            <div className="trial-section-head">
              <span className="trial-section-number">{String(i + 1).padStart(2, '0')}</span>
              <h2 id={`trial-section-${i}`}>
                <Inline text={section.title} />
              </h2>
            </div>
            <div className="trial-section-body">
              <Blocks blocks={section.blocks} />
            </div>
          </section>
        ))}

        {detail.note && (
          <aside className="trial-note">
            <strong>Please note</strong>
            <p>{detail.note}</p>
          </aside>
        )}

        {registers && (
          <RegistrationDialog key={trial.slug} trial={trial} centres={centres} inline />
        )}
      </div>
    </section>
  );
}
