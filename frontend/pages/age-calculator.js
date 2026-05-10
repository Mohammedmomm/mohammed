import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import api from '../utils/api';

function calcAge(birthDate) {
  const now = new Date();
  const birth = new Date(birthDate);

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prev = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prev.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const diffMs = now - birth;
  const totalDays = Math.floor(diffMs / 86400000);
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const isBirthday =
    now.getMonth() === birth.getMonth() && now.getDate() === birth.getDate();

  return { years, months, days, hours, minutes, seconds, totalDays, isBirthday };
}

export default function AgeCalculator() {
  const { user } = useAuth();
  const { t } = useLang();

  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  function handleCalculate(e) {
    e.preventDefault();
    if (!birthDate) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const birth = new Date(birthDate);
    if (birth > today) {
      setError('Birth date cannot be in the future.');
      return;
    }

    setError('');
    setSaved(false);
    clearInterval(timerRef.current);

    const update = () => setResult(calcAge(birthDate));
    update();
    timerRef.current = setInterval(update, 1000);
  }

  async function handleSave() {
    if (!user || !result) return;
    setSaving(true);
    try {
      await api.post('/api/history', {
        calculatorType: 'age',
        inputData: { birthDate },
        resultData: {
          years: result.years,
          months: result.months,
          days: result.days,
        },
      });
      setSaved(true);
    } catch {
      setError(t.common.error);
    } finally {
      setSaving(false);
    }
  }

  const maxDate = new Date().toISOString().split('T')[0];

  return (
    <>
      <Head>
        <title>Age Calculator — Smart Health Tools</title>
        <meta
          name="description"
          content="Calculate your exact age in years, months, days, hours, minutes and seconds."
        />
        <meta property="og:title" content="Age Calculator — Smart Health Tools" />
        <meta
          property="og:description"
          content="Calculate your exact age in years, months, days, hours, minutes and seconds."
        />
      </Head>

      <div className="calc-page" dir={t.dir}>
        <motion.div
          className="calc-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="calc-header">
            <div className="calc-icon">🎂</div>
            <h1 className="calc-title">{t.age.title}</h1>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleCalculate}>
            <div className="form-group">
              <label className="label" htmlFor="birthDate">
                {t.age.birthDate}
              </label>
              <input
                id="birthDate"
                type="date"
                className="input"
                value={birthDate}
                onChange={(e) => {
                  setBirthDate(e.target.value);
                  setResult(null);
                  setSaved(false);
                  clearInterval(timerRef.current);
                }}
                max={maxDate}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              {t.age.calculate}
            </button>
          </form>

          <AnimatePresence>
            {result && (
              <motion.div
                className="result-box"
                key="result"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {/* Main: years / months / days */}
                <div className="result-main">
                  {[
                    { value: result.years, label: t.age.years },
                    { value: result.months, label: t.age.months },
                    { value: result.days, label: t.age.days },
                  ].map((r) => (
                    <div className="result-item" key={r.label}>
                      <div className="result-value">{r.value}</div>
                      <div className="result-label">{r.label}</div>
                    </div>
                  ))}
                </div>

                {/* Secondary: hours / minutes / seconds */}
                <div className="result-secondary">
                  {[
                    { value: result.hours, label: t.age.hours },
                    { value: result.minutes, label: t.age.minutes },
                    { value: result.seconds, label: t.age.seconds },
                  ].map((r) => (
                    <div className="result-sec-item" key={r.label}>
                      <div className="result-sec-value">{r.value}</div>
                      <div className="result-sec-label">{r.label}</div>
                    </div>
                  ))}
                </div>

                {/* Birthday banner */}
                {result.isBirthday && (
                  <motion.div
                    className="birthday-banner"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                  >
                    <span className="birthday-emoji">🎉</span>
                    <div className="birthday-title">{t.age.happyBirthday}</div>
                    <div className="birthday-msg">{t.age.birthdayMsg}</div>
                  </motion.div>
                )}

                {/* Save */}
                <div className="save-row">
                  {user ? (
                    <>
                      <button
                        className="btn btn-outline"
                        onClick={handleSave}
                        disabled={saving || saved}
                      >
                        {saving ? (
                          <>
                            <span className="spinner" style={{ borderTopColor: 'var(--primary)', borderColor: 'var(--border)' }} />
                            {t.common.saving}
                          </>
                        ) : saved ? (
                          '✓ ' + t.age.saved
                        ) : (
                          t.common.save
                        )}
                      </button>
                      {saved && <span className="save-msg">{t.age.saved}</span>}
                    </>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      {t.age.loginToSave}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
