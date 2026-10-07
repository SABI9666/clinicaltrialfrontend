export default function Journey({ journey }) {
  if (!journey) return null;
  return (
    <section className="process" id="journey">
      <div className="wrap">
        {journey.eyebrow && <span className="eyebrow">{journey.eyebrow}</span>}
        <h2>{journey.title}</h2>
        <p>{journey.intro}</p>

        <div className="steps">
          {(journey.steps ?? []).map((step) => (
            <article key={step.number + step.title}>
              <span className="number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>

        {journey.note && <p className="note">{journey.note}</p>}
      </div>
    </section>
  );
}
