import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LangContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLang();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    router.push('/');
    setOpen(false);
  }

  const links = user
    ? [
        { href: '/', label: t.nav.home },
        { href: '/age-calculator', label: t.nav.ageCalc },
        { href: '/bmi-calculator', label: t.nav.bmiCalc },
        { href: '/dashboard', label: t.nav.dashboard },
      ]
    : [
        { href: '/', label: t.nav.home },
        { href: '/age-calculator', label: t.nav.ageCalc },
        { href: '/bmi-calculator', label: t.nav.bmiCalc },
      ];

  return (
    <nav className="navbar" dir={t.dir}>
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo" onClick={() => setOpen(false)}>
          <span>💊</span> {t.siteName}
        </Link>

        {/* Desktop Links */}
        <ul className="nav-desktop">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
          {user ? (
            <li>
              <button className="nav-link" onClick={handleLogout}>
                {t.nav.logout}
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link href="/login">{t.nav.login}</Link>
              </li>
              <li>
                <Link href="/register">
                  <span
                    style={{
                      background: 'var(--primary)',
                      color: '#fff',
                      padding: '0.4rem 0.9rem',
                      borderRadius: '0.4rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                    }}
                  >
                    {t.nav.register}
                  </span>
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="nav-controls">
          <button className="icon-btn" onClick={toggleLang} title="Language">
            {lang === 'en' ? 'عر' : 'EN'}
          </button>
          <button className="icon-btn" onClick={toggleTheme} title="Theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button
            className="hamburger"
            onClick={() => setOpen((p) => !p)}
            aria-label="Menu"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`nav-mobile ${open ? 'open' : ''}`}>
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
          {user ? (
            <li>
              <button className="nav-link" onClick={handleLogout}>
                {t.nav.logout}
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link href="/login" onClick={() => setOpen(false)}>
                  {t.nav.login}
                </Link>
              </li>
              <li>
                <Link href="/register" onClick={() => setOpen(false)}>
                  {t.nav.register}
                </Link>
              </li>
            </>
          )}
        </ul>
        <div className="nav-mobile-controls">
          <button className="icon-btn" onClick={toggleLang}>
            {lang === 'en' ? 'عربي' : 'English'}
          </button>
          <button className="icon-btn" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </div>
    </nav>
  );
}
