import { useLanguage } from '@/context/LanguageContext'

export default function SpecsTable({ specifications = [] }) {
  const { lang } = useLanguage()

  if (!specifications.length) return null

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #162440' }}>
      <table className="w-full text-sm">
        <tbody>
          {specifications.map((spec, i) => {
            const label = lang === 'ar'
              ? spec.label_ar || spec.label_en || spec.label || spec.field
              : spec.label_en || spec.label_ar || spec.label || spec.field
            const value = spec.value_ar && lang === 'ar'
              ? spec.value_ar
              : spec.value_en || spec.value || ''
            return (
              <tr
                key={i}
                style={{
                  backgroundColor: i % 2 === 0 ? '#0F1E35' : '#162440',
                  borderBottom: '1px solid #1e2d4a',
                }}
              >
                <td
                  className="px-4 py-3 font-medium w-2/5"
                  style={{ color: '#94A3B8' }}
                >
                  {label}
                </td>
                <td className="px-4 py-3" style={{ color: '#F8F9FA' }}>
                  {value}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
