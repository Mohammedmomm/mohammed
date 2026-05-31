import { useState } from 'react'
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  pagination,
  onPageChange,
  selectable = false,
  onSelectionChange,
  rowKey = 'id',
}) => {
  const { t } = useTranslation()
  const [selected, setSelected] = useState([])

  const toggleAll = () => {
    if (selected.length === data.length) {
      setSelected([])
      onSelectionChange?.([])
    } else {
      const all = data.map((r) => r[rowKey])
      setSelected(all)
      onSelectionChange?.(all)
    }
  }

  const toggleRow = (id) => {
    const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]
    setSelected(next)
    onSelectionChange?.(next)
  }

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.limit) : 1
  const currentPage = pagination?.page || 1

  const skeletonRows = Array(6).fill(null)

  return (
    <div className="bg-white rounded-xl border border-gray-100 card-shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {selectable && (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={data.length > 0 && selected.length === data.length}
                    onChange={toggleAll}
                    className="rounded border-gray-300"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-start text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                  style={{ width: col.width }}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? skeletonRows.map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {selectable && <td className="px-4 py-3"><div className="h-4 w-4 bg-gray-200 rounded animate-pulse" /></td>}
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: col.width ? '60%' : '80%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              : data.length === 0
              ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Inbox size={40} strokeWidth={1} />
                      <p className="text-sm">{t('common.noData')}</p>
                    </div>
                  </td>
                </tr>
              )
              : data.map((row) => (
                <tr
                  key={row[rowKey]}
                  className="border-b border-gray-50 table-row-hover"
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(row[rowKey])}
                        onChange={() => toggleRow(row[rowKey])}
                        className="rounded border-gray-300"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-gray-700">
                      {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {pagination && !loading && data.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
          <span>
            {t('common.showing')} {(currentPage - 1) * pagination.limit + 1}–
            {Math.min(currentPage * pagination.limit, pagination.total)} {t('common.of')} {pagination.total}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1
              return (
                <button
                  key={page}
                  onClick={() => onPageChange?.(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium ${
                    page === currentPage
                      ? 'text-white'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  style={page === currentPage ? { backgroundColor: '#1E6FBF' } : {}}
                >
                  {page}
                </button>
              )
            })}
            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable
