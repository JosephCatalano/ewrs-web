import { Link } from 'react-router-dom'

import './AppFooter.css'

// Ported from the Angular AppFooterComponent. The docs CTA routes to /docs; the
// Angular scroll-to-top/focus behavior depends on the docs page and will be
// reconnected when docs are migrated. The footer is currently always rendered;
// Angular hid it on `/register`, which returns when the route guard lands.
export function AppFooter() {
  return (
    <footer className="app-footer">
      <section
        aria-labelledby="footer-help-heading"
        className="app-footer__help"
      >
        <div className="app-footer__help-inner">
          <h2 className="app-footer__heading" id="footer-help-heading">
            Need help using EWRS?
          </h2>
          <p className="app-footer__desc">
            Find step-by-step instructions, including booking workspaces,
            checking in, managing reservations, and understanding recent
            changes.
          </p>
          <Link className="app-footer__cta" to="/docs">
            User Guide
          </Link>
        </div>
      </section>

      <section aria-label="Footer" className="app-footer__legal">
        <div className="app-footer__legal-inner">
          <ul className="app-footer__nav">
            <li>
              <a
                href="http://www.ontario.ca/page/accessibility"
                rel="noopener noreferrer"
                target="_blank"
                title="Go to accessibility page. Opens in a new window."
              >
                Accessibility
              </a>
            </li>
            <li>
              <a
                href="https://www.ontario.ca/page/privacy-statement"
                rel="noopener noreferrer"
                target="_blank"
                title="Go to privacy page. Opens in a new window."
              >
                Privacy
              </a>
            </li>
            <li>
              <a
                href="mailto:EWRSfeedback@ontario.ca"
                rel="noopener noreferrer"
                target="_top"
                title="Contact us"
              >
                Contact us
              </a>
            </li>
            <li>
              <a
                href="https://www.ontario.ca/page/terms-use"
                rel="noopener noreferrer"
                target="_blank"
                title="Go to terms of use page. Opens in a new window."
              >
                Terms of use
              </a>
            </li>
          </ul>

          <a
            className="app-footer__copyright"
            href="https://www.ontario.ca/page/copyright-information-c-queens-printer-ontario"
            rel="noopener noreferrer"
            target="_blank"
            title="Site copyright. Opens in a new window."
          >
            © King&apos;s Printer for Ontario, 2026
          </a>
        </div>
      </section>
    </footer>
  )
}
