import { useEffect, useRef, useState } from 'react';
import Brand from './Brand.jsx';
import { pageFor } from '../lib/routes.js';

/** Pages reached from a menu item, rather than listed in it, mark that item. */
const MENU_PAGE = { results: 'home', trial: 'home', report: 'insights' };

export default function Header({ settings, page }) {
  const menuPage = MENU_PAGE[page] ?? page;
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);

  // Close the mobile menu when the viewport grows past the breakpoint that
  // shows the full nav, so it cannot be left stuck open.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 701px)');
    const onChange = (e) => e.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <header className="nav">
      <div className="wrap">
        <Brand brand={settings?.brand} ariaLabel="Clinical Trial Access home" />

        <button
          className="menu"
          aria-expanded={open}
          aria-controls="navigation"
          onClick={() => setOpen((v) => !v)}
        >
          Menu ☰
        </button>

        <nav
          ref={navRef}
          className={`links${open ? ' open' : ''}`}
          id="navigation"
          aria-label="Main navigation"
        >
          {(settings?.nav ?? []).map((link) => (
            <a
              key={link.href + link.label}
              href={link.href}
              aria-current={pageFor(link.href) === menuPage ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          {settings?.navCta?.label && (
            <a
              className="btn"
              href={settings.navCta.href}
              aria-current={pageFor(settings.navCta.href) === menuPage ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              {settings.navCta.label}
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
