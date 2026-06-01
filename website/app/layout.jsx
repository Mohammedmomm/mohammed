import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'
import { CurrencyProvider } from '@/context/CurrencyContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppFloatingButton from '@/components/layout/WhatsAppFloatingButton'
import PopupAd from '@/components/ads/PopupAd'

export const metadata = {
  title: 'Syria Cable Zone - قطع إلكترونية وكابلات',
  description: 'متجر متخصص في قطع الإلكترونيات والكابلات في سوريا',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=IBM+Plex+Sans+Arabic:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider>
          <CurrencyProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <WhatsAppFloatingButton />
            <PopupAd />
          </CurrencyProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
