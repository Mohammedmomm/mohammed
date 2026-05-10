import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';

export default function Login() {
  const { login, user } = useAuth();
  const { t } = useLang();
  const router = useRouter();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.replace('/dashboard');
  }, [user, router]);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError(t.common.error);
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.error || t.auth.loginTitle + ' — ' + t.common.error
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Login — Smart Health Tools</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="auth-page" dir={t.dir}>
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="auth-logo">
            <span className="auth-logo-icon">💊</span>
          </div>

          <h1 className="auth-title">{t.auth.loginTitle}</h1>
          <p className="auth-subtitle">{t.auth.loginSubtitle}</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="label" htmlFor="email">
                {t.auth.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="input"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="password">
                {t.auth.password}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="input"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" /> {t.common.loading}
                </>
              ) : (
                t.auth.loginBtn
              )}
            </button>
          </form>

          <div className="auth-footer">
            {t.auth.noAccount}{' '}
            <Link href="/register">{t.auth.registerLink}</Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
