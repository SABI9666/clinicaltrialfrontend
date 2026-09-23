export default function About({ about }) {
  if (!about) return null;
  const wordmark = about.wordmark ?? {};

  return (
    <section id="about" className="about">
      <div className="wrap split">
        <div>
          {about.eyebrow && <span className="eyebrow">{about.eyebrow}</span>}
          <h2>{about.title}</h2>
          {(about.paragraphs ?? []).map((text, i) => (
            <p key={i}>{text}</p>
          ))}
          {about.cta?.label && (
            <a className="btn" href={about.cta.href}>
              {about.cta.label}
            </a>
          )}
        </div>

        <div className="about-word">
          {(wordmark.lines ?? []).map((line, i) => (
            <span key={i}>
              {line}
              {i < wordmark.lines.length - 1 && <br />}
            </span>
          ))}
          {wordmark.small && <small>{wordmark.small}</small>}
          {wordmark.body && (
            <p style={{ font: '15px/1.7 Arial,sans-serif', marginTop: 30 }}>{wordmark.body}</p>
          )}
        </div>
      </div>
    </section>
  );
}
