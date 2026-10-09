import Image from './Image.jsx';
import RegistrationDialog from './RegistrationDialog.jsx';
import { Inline } from './RichText.jsx';
import { parsePolicy } from '../lib/policyText.js';

/** Photos placed beside the sections, in turn, so every section has one. */
const SECTION_IMAGES = [
  { src: '/media/hero-consult.jpg', webp: '/media/hero-consult.webp' },
  { src: '/media/trial-diabetes.jpg', webp: '/media/trial-diabetes.webp' },
  { src: '/media/why-join.jpg', webp: '/media/why-join.webp' },
  { src: '/media/hero-wide.jpg', webp: '/media/hero-wide.webp' },
];

const GLANCE = /^at a glance$/i;

/**
 * An "## At a glance" section becomes highlight cards. Each "- " line is
 * "Label | Value | Description", e.g. "Age range | 18–80 | Participants must
 * be aged between 18 and 80 years."
 */
function highlightsFrom(section) {
  return section.blocks
    .filter((b) => b.type === 'ul')
    .flatMap((b) => b.items)
    .map((item) => {
      const [label = '', value = '', ...rest] = item.split('|').map((part) => part.trim());
      return { label, value, description: rest.join(' | ') };
    })
    .filter((h) => h.label && h.value);
}

/**
 * A section whose points are all "Title | Description" becomes numbered step
 * cards, e.g. "## What happens if I register interest?" with
 * "- Register your interest | You share your contact details…".
 */
function stepsFrom(section) {
  const items = section.blocks.filter((b) => b.type === 'ul').flatMap((b) => b.items);
  if (!items.length || !items.every((item) => item.includes('|'))) return null;
  return items.map((item) => {
    const [title = '', ...rest] = item.split('|').map((part) => part.trim());
    return { title, description: rest.join(' | ') };
  });
}

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
  const allSections = sectionsFrom(detail.paragraphs);
  const sections = allSections.filter((sec) => !GLANCE.test(sec.title));
  const highlights = allSections.filter((sec) => GLANCE.test(sec.title)).flatMap(highlightsFrom);
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
            {!registers && (
              <div className="actions">
                <button type="button" className="btn" onClick={() => onEnquire(trial)}>
                  {detail.ctaLabel || 'Enquire about this trial ↗'}
                </button>
              </div>
            )}
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

        {/* The form comes first: register in three steps, then read on. */}
        {registers && <RegistrationDialog key={trial.slug} trial={trial} centres={centres} inline />}

        {sections.length > 0 && (
          <div className="trial-sections">
            {sections.map((section, i) => {
              const steps = stepsFrom(section);
              if (steps) {
                const intro = section.blocks.filter((b) => b.type !== 'ul');
                return (
                  <section className="trial-steps" key={section.title + i} aria-labelledby={`trial-section-${i}`}>
                    <h2 id={`trial-section-${i}`}>
                      <Inline text={section.title} />
                    </h2>
                    {intro.length > 0 && (
                      <div className="trial-steps-intro">
                        <Blocks blocks={intro} />
                      </div>
                    )}
                    <ol>
                      {steps.map((step, j) => (
                        <li key={step.title + j}>
                          <span className="trial-step-number">{String(j + 1).padStart(2, '0')}</span>
                          <h3>
                            <Inline text={step.title} />
                          </h3>
                          {step.description && (
                            <p>
                              <Inline text={step.description} />
                            </p>
                          )}
                        </li>
                      ))}
                    </ol>
                  </section>
                );
              }
              return (
              <section className="trial-section" key={section.title + i} aria-labelledby={`trial-section-${i}`}>
                <div className="trial-section-media">
                  <Image image={{ ...SECTION_IMAGES[i % SECTION_IMAGES.length], alt: '' }} />
                </div>
                <div className="trial-section-body">
                  <h2 id={`trial-section-${i}`}>
                    <Inline text={section.title} />
                  </h2>
                  <Blocks blocks={section.blocks} />
                </div>
              </section>
              );
            })}
          </div>
        )}

        {highlights.length > 0 && (
          <div className="trial-highlights">
            {highlights.map((h, i) => (
              <article className="trial-highlight" key={h.label}>
                <h3>{h.label}</h3>
                <div className="trial-highlight-media">
                  {/* Two photos in a checkerboard, so no two neighbouring cards match. */}
                  <Image image={{ ...SECTION_IMAGES[(i + Math.floor(i / 2)) % 2 === 0 ? 1 : 0], alt: '' }} />
                  <span className="trial-highlight-value">{h.value}</span>
                </div>
                {h.description && <p>{h.description}</p>}
              </article>
            ))}
          </div>
        )}

        {detail.note && (
          <aside className="trial-note">
            <strong>Please note</strong>
            <p>{detail.note}</p>
          </aside>
        )}
      </div>
    </section>
  );
}
