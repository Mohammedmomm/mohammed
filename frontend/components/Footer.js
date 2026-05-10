import Link from 'next/link';
import { useLang } from '../context/LangContext';

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="footer" dir={t.dir}>
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <span className="footer-brand-icon">💊</span>
              {t.siteName}
            </div>
            <p className="footer-desc">{t.footer.desc}</p>
          </div>

          <div>
            <div className="footer-col-title">{t.footer.tools}</div>
            <ul className="footer-links">
              <li>
                <Link href="/age-calculator">{t.footer.age}</Link>
              </li>
              <li>
                <Link href="/bmi-calculator">{t.footer.bmi}</Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">{t.footer.account}</div>
            <ul className="footer-links">
              <li>
                <Link href="/login">{t.footer.login}</Link>
              </li>
              <li>
                <Link href="/register">{t.footer.register}</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          © {year} {t.siteName} — {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}
