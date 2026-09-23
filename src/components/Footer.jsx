import Brand from './Brand.jsx';

export default function Footer({ settings, footer, policies, onShowPolicy, onShowFaqs }) {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-top">
          <div>
            <Brand brand={settings?.brand} />
            <p>{footer?.tagline}</p>
          </div>

          <div className="footer-links">
            {(footer?.links ?? []).map((link) => (
              <a
                key={link.label + link.href}
                href={link.href}
                onClick={link.action === 'faqs' ? onShowFaqs : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {(footer?.legal ?? []).map((text, i) => (
          <p className="legal" key={i}>
            {text}
          </p>
        ))}

        <div className="bottom">
          <span>{footer?.copyright}</span>
          <div>
            {policies.map((policy) => (
              <button className="policy" key={policy.id} onClick={() => onShowPolicy(policy)}>
                {policy.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
