import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLang } from '../context/LangContext';
import { useAuth } from '../context/AuthContext';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.2 + i * 0.12, ease: 'easeOut' },
  }),
};

export default function Home() {
  const { t } = useLang();
  const { user } = useAuth();

  const tools = [
    {
      href: '/age-calculator',
      icon: '🎂',
      title: t.features.age.title,
      desc: t.features.age.desc,
    },
    {
      href: '/bmi-calculator',
      icon: '⚖️',
      title: t.features.bmi.title,
      desc: t.features.bmi.desc,
    },
  ];

  return (
    <>
      <Head>
        <title>Smart Health Tools - Age &amp; BMI Calculator</title>
        <meta
          name="description"
          content="Calculate your age and BMI instantly with a fast and modern health tools website."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Smart Health Tools - Age & BMI Calculator" />
        <meta
          property="og:description"
          content="Calculate your age and BMI instantly with a fast and modern health tools website."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Smart Health Tools - Age & BMI Calculator" />
        <meta
          name="twitter:description"
          content="Calculate your age and BMI instantly with a fast and modern health tools website."
        />
        <link rel="canonical" href="https://yourdomain.com/" />
      </Head>

      {/* Hero */}
      <section className="hero" dir={t.dir}>
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-content">
          <motion.div
            className="hero-badge"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
          >
            ✨ {t.hero.badge}
          </motion.div>

          <motion.h1
            className="hero-title"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
          >
            {t.hero.title}
          </motion.h1>

          <motion.p
            className="hero-desc"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            className="hero-buttons"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
          >
            {user ? (
              <Link href="/dashboard" className="btn btn-primary btn-lg">
                {t.nav.dashboard}
              </Link>
            ) : (
              <>
                <Link href="/register" className="btn btn-primary btn-lg">
                  {t.hero.register}
                </Link>
                <Link href="/login" className="btn btn-outline btn-lg">
                  {t.hero.login}
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="features" dir={t.dir}>
        <div className="section-header">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            {t.features.title}
          </motion.h2>
          <motion.p
            className="section-desc"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {t.features.subtitle}
          </motion.p>
        </div>

        <div className="features-grid">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.href}
              variants={cardVariant}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
            >
              <Link href={tool.href} className="feature-card">
                <div className="feature-icon">{tool.icon}</div>
                <h3 className="feature-title">{tool.title}</h3>
                <p className="feature-desc">{tool.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
