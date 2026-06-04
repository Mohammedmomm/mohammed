import { useState, useEffect, useRef } from 'react'
import { ChevronDown, ChevronRight, Search } from 'lucide-react'
import { getTree } from '../../api/categories'

const mockCategories = [
  {
    id: 1, name_ar: 'كابلات', name_en: 'Cables', children: [
      { id: 11, name_ar: 'كابلات HDMI', name_en: 'HDMI Cables', children: [] },
      { id: 12, name_ar: 'كابلات USB', name_en: 'USB Cables', children: [] },
    ]
  },
  {
    id: 2, name_ar: 'مقابس وقطع توصيل', name_en: 'Connectors', children: [
      { id: 21, name_ar: 'مقابس RCA', name_en: 'RCA Connectors', children: [] },
    ]
  },
  { id: 3, name_ar: 'أجهزة صوتية', name_en: 'Audio Devices', children: [] },
]

const flattenTree = (nodes, depth = 0) => {
  const result = []
  for (const node of nodes) {
    result.push({ ...node, depth })
    if (node.children?.length) result.push(...flattenTree(node.children, depth + 1))
  }
  return result
}

const CategoryTreeSelect = ({ value, onChange, placeholder }) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState([])
  const [dropdownStyle, setDropdownStyle] = useState({})
  const ref = useRef(null)
  const btnRef = useRef(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getTree()
        setCategories(flattenTree(res.data.categories || res.data))
      } catch {
        setCategories(flattenTree(mockCategories))
      }
    }
    load()
  }, [])

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const dropH = 256
      if (spaceBelow < dropH) {
        setDropdownStyle({
          position: 'fixed',
          top: rect.top - dropH - 4,
          left: rect.left,
          width: rect.width,
          zIndex: 9999,
        })
      } else {
        setDropdownStyle({
          position: 'fixed',
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
          zIndex: 9999,
        })
      }
    }
    setOpen(!open)
  }

  const filtered = categories.filter(
    (c) =>
      !search ||
      c.name_ar.includes(search) ||
      c.name_en.toLowerCase().includes(search.toLowerCase())
  )

  const selected = categories.find((c) => c.id === value)

  return (
    <div ref={ref} className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={handleOpen}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm hover:border-blue-400 transition-colors"
      >
        <span className={selected ? 'text-gray-800' : 'text-gray-400'}>
          {selected ? `${selected.name_ar} / ${selected.name_en}` : (placeholder || 'اختر تصنيف')}
        </span>
        <ChevronDown size={16} className="text-gray-400" />
      </button>
      {open && (
        <div
          style={{ ...dropdownStyle, maxHeight: 256 }}
          className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-y-auto"
        >
          <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
            <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-50 rounded-lg">
              <Search size={14} className="text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث..."
                className="flex-1 bg-transparent text-sm outline-none"
              />
            </div>
          </div>
          {filtered.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => { onChange(cat.id); setOpen(false) }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-blue-50 text-start ${value === cat.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
              style={{ paddingInlineStart: `${12 + cat.depth * 16}px` }}
            >
              {cat.depth > 0 && <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />}
              <span>{cat.name_ar}</span>
              <span className="text-gray-400 text-xs">/ {cat.name_en}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-400">لا نتائج</div>
          )}
        </div>
      )}
    </div>
  )
}

export default CategoryTreeSelect
