import { create } from 'zustand'

const useSettingsStore = create((set) => ({
  settings: {
    site_name_ar: 'سيريا كابل زون',
    site_name_en: 'Syria Cable Zone',
    site_description_ar: 'متجر قطع الإلكترونيات والكابلات',
    site_description_en: 'Electronic parts and cables store',
    whatsapp: '+963912345678',
    phone: '+963112345678',
    address: 'دمشق، سوريا',
    facebook: 'https://facebook.com/syriacablezone',
    instagram: 'https://instagram.com/syriacablezone',
    telegram: 'https://t.me/syriacablezone',
    products_per_page: 20,
    similar_products_count: 6,
  },
  exchangeRate: 13500,

  setSettings: (settings) => set({ settings }),
  setExchangeRate: (rate) => set({ exchangeRate: rate }),
}))

export default useSettingsStore
