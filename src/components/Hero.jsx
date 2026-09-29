import Image from './Image.jsx';

export default function Hero({ hero }) {
  if (!hero) return null;

  return (
    <div id="home" className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            {hero.eyebrow && <span className="eyebrow">{hero.eyebrow}</span>}
            <h1>
              {(hero.titleLines ?? []).map((line, i) => (
                <span key={i}>
                  {line}
                  {i < hero.titleLines.length - 1 && <br />}
                </span>
              ))}
            </h1>
            {(hero.paragraphs ?? []).map((text, i) => (
              <p key={i}>{text}</p>
            ))}

            <div className="actions">
              {hero.primaryCta?.label && (
                <a className="btn" href={hero.primaryCta.href}>
                  {hero.primaryCta.label} {hero.primaryCta.icon && <span>{hero.primaryCta.icon}</span>}
                </a>
              )}
              {hero.secondaryCta?.label && (
                <a className="btn light" href={hero.secondaryCta.href}>
                  {hero.secondaryCta.label}
                </a>
              )}
            </div>

            {hero.footnote && <p className="small">{hero.footnote}</p>}
          </div>

          <div className="hero-photo">
            <Image image={hero.image} loading="eager" />
            {hero.note?.title && (
              <div className="photo-note">
                <strong>{hero.note.title}</strong>
                {hero.note.body}
              </div>
            )}
          </div>
        </div>

        {(hero.trust ?? []).length > 0 && (
          <div className="trust">
            {hero.trust.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
