import { useEffect } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { LangProvider, useLang } from '../context/LangContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/globals.css';

function AppInner({ Component, pageProps }) {
  const { t } = useLang();

  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = t.dir === 'rtl' ? 'ar' : 'en';
  }, [t.dir]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <LangProvider>
        <AuthProvider>
          <AppInner Component={Component} pageProps={pageProps} />
        </AuthProvider>
      </LangProvider>
    </ThemeProvider>
  );
}
