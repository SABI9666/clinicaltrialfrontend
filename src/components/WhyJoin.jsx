import Image from './Image.jsx';

export default function WhyJoin({ why }) {
  if (!why) return null;
  return (
    <section id="why">
      <div className="wrap split">
        <Image image={why.image} />
        <div>
          {why.eyebrow && <span className="eyebrow">{why.eyebrow}</span>}
          <h2>
            {(why.titleLines ?? []).map((line, i) => (
              <span key={i}>
                {line}
                {i < why.titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
          {(why.paragraphs ?? []).map((text, i) => (
            <p key={i}>{text}</p>
          ))}
          {why.cta?.label && (
            <a className="btn light" href={why.cta.href}>
              {why.cta.label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
