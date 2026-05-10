import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import api from '../utils/api';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { t } = useLang();
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      api
        .get('/api/history')
        .then((res) => setHistory(res.data))
        .catch(() => {})
        .finally(() => setHistoryLoading(false));
    }
  }, [user]);

  if (loading || !user) return null;

  const initials =
    (user.firstName?.[0] || '') + (user.lastName?.[0] || '');

  function formatDate(str) {
    return new Date(str).toLocaleDateString(
      t.dir === 'rtl' ? 'ar-SA' : 'en-US',
      { year: 'numeric', month: 'short', day: 'numeric' }
    );
  }

  function historyLabel(item) {
    if (item.calculator_type === 'age') {
      const r = item.result_data;
      return `${r.years}y ${r.months}m ${r.days}d`;
    }
    if (item.calculator_type === 'bmi') {
      const r = item.result_data;
      return `BMI ${r.bmi}`;
    }
    return '';
  }

  return (
    <>
      <Head>
        <title>Dashboard — Smart Health Tools</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="dashboard-page" dir={t.dir}>
        {/* Profile */}
        <motion.div
          className="profile-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="profile-avatar">{initials.toUpperCase()}</div>
          <div className="profile-info">
            <h3>
              {user.firstName} {user.lastName}
            </h3>
            <p>{user.email}</p>
          </div>
        </motion.div>

        {/* Welcome */}
        <motion.div
          className="dashboard-welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1>
            {t.dashboard.welcome},{' '}
            {user.firstName}! 👋
          </h1>
          <p>{t.dashboard.subtitle}</p>
        </motion.div>

        {/* Tools */}
        <div className="tools-grid">
          {[
            {
              href: '/age-calculator',
              icon: '🎂',
              title: t.dashboard.ageCalc,
              desc: t.dashboard.ageDesc,
            },
            {
              href: '/bmi-calculator',
              icon: '⚖️',
              title: t.dashboard.bmiCalc,
              desc: t.dashboard.bmiDesc,
            },
          ].map((card, i) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1 }}
            >
              <Link href={card.href} className="tool-card">
                <div className="tool-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* History */}
        <motion.div
          className="history-section"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2>{t.dashboard.history}</h2>

          {historyLoading ? (
            <div className="history-empty">{t.common.loading}</div>
          ) : history.length === 0 ? (
            <div className="history-empty">{t.dashboard.noHistory}</div>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <div className="history-item" key={item.id}>
                  <div className="history-icon">
                    {item.calculator_type === 'age' ? '🎂' : '⚖️'}
                  </div>
                  <div className="history-info">
                    <strong>
                      {item.calculator_type === 'age'
                        ? t.dashboard.ageCalc
                        : t.dashboard.bmiCalc}
                    </strong>
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                  <div className="history-result">{historyLabel(item)}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
