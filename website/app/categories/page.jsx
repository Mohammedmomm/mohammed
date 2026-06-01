import Link from 'next/link'
import { getCategories } from '@/lib/api'
import Breadcrumb from '@/components/layout/Breadcrumb'
import { Layers } from 'lucide-react'

async function getData() {
  try {
    const data = await getCategories()
    return Array.isArray(data) ? data : data?.categories || []
  } catch {
    return []
  }
}

export const metadata = {
  title: 'التصنيفات - Syria Cable Zone',
}

export default async function CategoriesPage() {
  const categories = await getData()
  const topLevel = categories.filter((c) => !c.parent_id)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A1628' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: 'الرئيسية', href: '/' },
              { label: 'التصنيفات', href: '/categories' },
            ]}
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-8" style={{ color: '#F8F9FA' }}>
          جميع التصنيفات
        </h1>

        {topLevel.length === 0 ? (
          <div className="text-center py-20" style={{ color: '#94A3B8' }}>
            لا توجد تصنيفات
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {topLevel.map((cat) => {
              const children = categories.filter((c) => c.parent_id === (cat._id || cat.id))
              const subCount = children.length || cat.subcategory_count || 0
              const productCount = cat.product_count || 0
              const name = cat.name_ar || cat.name_en || cat.name || ''

              return (
                <Link
                  key={cat._id || cat.id}
                  href={`/category/${cat.slug}`}
                  className="rounded-xl p-4 transition-all duration-200 hover:scale-105 block group"
                  style={{
                    backgroundColor: '#0F1E35',
                    border: '1px solid #162440',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: '#162440' }}
                  >
                    {cat.icon ? (
                      <span className="text-2xl">{cat.icon}</span>
                    ) : (
                      <Layers size={22} style={{ color: '#00D4FF' }} />
                    )}
                  </div>
                  <h2 className="font-bold text-sm mb-1 line-clamp-2" style={{ color: '#F8F9FA' }}>
                    {name}
                  </h2>
                  <div className="text-xs" style={{ color: '#94A3B8' }}>
                    {productCount > 0
                      ? `${productCount} منتج`
                      : subCount > 0
                      ? `${subCount} تصنيف فرعي`
                      : ''}
                  </div>
                  {/* Subcategories */}
                  {children.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {children.slice(0, 3).map((child) => (
                        <span
                          key={child._id || child.id}
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: '#162440', color: '#94A3B8' }}
                        >
                          {child.name_ar || child.name_en || child.name}
                        </span>
                      ))}
                      {children.length > 3 && (
                        <span className="text-xs" style={{ color: '#00D4FF' }}>
                          +{children.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
