import { useState } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import api from '../utils/api';

function calcBMI(height, weight) {
  const h = parseFloat(height) / 100;
  const w = parseFloat(weight);
  const bmi = w / (h * h);
  return Math.round(bmi * 10) / 10;
}

function getCategory(bmi, t) {
  if (bmi < 18.5) return { key: 'underweight', label: t.bmi.underweight, cls: 'bmi-underweight' };
  if (bmi < 25)   return { key: 'normal',      label: t.bmi.normal,      cls: 'bmi-normal' };
  if (bmi < 30)   return { key: 'overweight',  label: t.bmi.overweight,  cls: 'bmi-overweight' };
  return              { key: 'obese',       label: t.bmi.obese,       cls: 'bmi-obese' };
}

function getBarPosition(bmi) {
  // Map BMI 10–40 → 0–100%
  const pct = ((Math.min(Math.max(bmi, 10), 40) - 10) / 30) * 100;
  return Math.min(Math.max(pct, 2), 98);
}

export default function BmiCalculator() {
  const { user } = useAuth();
  const { t } = useLang();

  const [form, setForm] = useState({ height: '', weight: '' });
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setResult(null);
    setSaved(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const h = parseFloat(form.height);
    const w = parseFloat(form.weight);

    if (!h || !w || h <= 0 || w <= 0) {
      setError(t.common.error);
      return;
    }
    if (h < 50 || h > 250) {
      setError('Height must be between 50 and 250 cm.');
      return;
    }
    if (w < 10 || w > 500) {
      setError('Weight must be between 10 and 500 kg.');
      return;
    }

    const bmi = calcBMI(h, w);
    const category = getCategory(bmi, t);
    setResult({ bmi, category, height: h, weight: w });
  }

  async function handleSave() {
    if (!user || !result) return;
    setSaving(true);
    try {
      await api.post('/api/history', {
        calculatorType: 'bmi',
        inputData: { height: result.height, weight: result.weight },
        resultData: { bmi: result.bmi, category: result.category.key },
      });
      setSaved(true);
    } catch {
      setError(t.common.error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Head>
        <title>BMI Calculator — Smart Health Tools</title>
        <meta
          name="description"
          content="Calculate your Body Mass Index (BMI) and get personalized health tips."
        />
        <meta property="og:title" content="BMI Calculator — Smart Health Tools" />
        <meta
          property="og:description"
          content="Calculate your Body Mass Index (BMI) and get personalized health tips."
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
            <div className="calc-icon">⚖️</div>
            <h1 className="calc-title">{t.bmi.title}</h1>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label" htmlFor="height">
                {t.bmi.height}
              </label>
              <input
                id="height"
                name="height"
                type="number"
                className="input"
                value={form.height}
                onChange={handleChange}
                placeholder="170"
                min="50"
                max="250"
                step="0.1"
                required
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="weight">
                {t.bmi.weight}
              </label>
              <input
                id="weight"
                name="weight"
                type="number"
                className="input"
                value={form.weight}
                onChange={handleChange}
                placeholder="70"
                min="10"
                max="500"
                step="0.1"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              {t.bmi.calculate}
            </button>
          </form>

          <AnimatePresence>
            {result && (
              <motion.div
                className="bmi-result-box"
                key="bmi-result"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {/* BMI value + category */}
                <div className={`bmi-value-display ${result.category.cls}`}>
                  <div className="bmi-number">{result.bmi}</div>
                  <div className="bmi-category-label">{result.category.label}</div>
                </div>

                {/* Progress bar */}
                <div className="bmi-bar-wrap">
                  <div className="bmi-bar-label">
                    <span>{t.bmi.underweight}</span>
                    <span>{t.bmi.normal}</span>
                    <span>{t.bmi.overweight}</span>
                    <span>{t.bmi.obese}</span>
                  </div>
                  <div className="bmi-track">
                    <motion.div
                      className="bmi-indicator"
                      initial={{ left: '0%' }}
                      animate={{ left: `${getBarPosition(result.bmi)}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Health tip */}
                <div className="bmi-tip">
                  💡 {t.bmi.tips[result.category.key]}
                </div>

                {/* Save */}
                <div className="save-row" style={{ marginTop: '1rem' }}>
                  {user ? (
                    <button
                      className="btn btn-outline"
                      onClick={handleSave}
                      disabled={saving || saved}
                    >
                      {saving ? (
                        <>
                          <span
                            className="spinner"
                            style={{
                              borderTopColor: 'var(--primary)',
                              borderColor: 'var(--border)',
                            }}
                          />
                          {t.common.saving}
                        </>
                      ) : saved ? (
                        '✓ ' + t.bmi.saved
                      ) : (
                        t.common.save
                      )}
                    </button>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      {t.bmi.loginToSave}
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
