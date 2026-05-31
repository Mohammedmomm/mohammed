import { useTranslation } from 'react-i18next'
import useUiStore from '../../store/uiStore'

const LangToggle = () => {
  const { i18n } = useTranslation()
  const { lang, setLang } = useUiStore()

  const toggle = () => {
    const next = lang === 'ar' ? 'en' : 'ar'
    setLang(next)
    i18n.changeLanguage(next)
    document.documentElement.lang = next
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-medium transition-colors"
      style={{ color: '#1E6FBF' }}
    >
      <span className={lang === 'ar' ? 'font-bold' : 'opacity-50'}>AR</span>
      <span className="text-gray-300">|</span>
      <span className={lang === 'en' ? 'font-bold' : 'opacity-50'}>EN</span>
    </button>
  )
}

export default LangToggle
