import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';

export default function Register() {
  const { register, user } = useAuth();
  const { t } = useLang();
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
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
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError(t.common.error);
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
      });
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || t.common.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Register — Smart Health Tools</title>
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

          <h1 className="auth-title">{t.auth.registerTitle}</h1>
          <p className="auth-subtitle">{t.auth.registerSubtitle}</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-row">
              <div className="form-group">
                <label className="label" htmlFor="firstName">
                  {t.auth.firstName}
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="input"
                  value={form.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label" htmlFor="lastName">
                  {t.auth.lastName}
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="input"
                  value={form.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>

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
              <label className="label" htmlFor="phone">
                {t.auth.phone}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="input"
                value={form.phone}
                onChange={handleChange}
                autoComplete="tel"
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
                autoComplete="new-password"
                required
                minLength={6}
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
                t.auth.registerBtn
              )}
            </button>
          </form>

          <div className="auth-footer">
            {t.auth.hasAccount}{' '}
            <Link href="/login">{t.auth.loginLink}</Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
