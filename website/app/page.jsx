import { getProducts, getCategories, getBrands } from '@/lib/api'
import HeroBanner from '@/components/ads/HeroBanner'
import HeroSection from '@/components/sections/HeroSection'
import TopCategories from '@/components/sections/TopCategories'
import FeaturedProducts from '@/components/sections/FeaturedProducts'
import NewArrivals from '@/components/sections/NewArrivals'
import BrandsStrip from '@/components/sections/BrandsStrip'
import FooterBanner from '@/components/ads/FooterBanner'

async function getData() {
  const [featuredRes, newestRes, categoriesRes, brandsRes] = await Promise.allSettled([
    getProducts({ featured: true, limit: 12 }),
    getProducts({ sort: 'newest', limit: 8 }),
    getCategories(),
    getBrands(),
  ])

  const featured = featuredRes.status === 'fulfilled'
    ? (featuredRes.value?.products || [])
    : []

  const newest = newestRes.status === 'fulfilled'
    ? (newestRes.value?.products || [])
    : []

  const categories = categoriesRes.status === 'fulfilled'
    ? (Array.isArray(categoriesRes.value) ? categoriesRes.value : [])
    : []

  const brands = brandsRes.status === 'fulfilled'
    ? (Array.isArray(brandsRes.value) ? brandsRes.value : [])
    : []

  return { featured, newest, categories, brands }
}

export default async function HomePage() {
  const { featured, newest, categories, brands } = await getData()

  const topLevelCategories = categories.filter((c) => !c.parent_id).slice(0, 8)

  return (
    <div>
      <HeroBanner />
      <HeroSection />
      <TopCategories categories={topLevelCategories} />
      {featured.length > 0 ? (
        <FeaturedProducts products={featured} />
      ) : (
        <NewArrivals products={newest} />
      )}
      {featured.length > 0 && <NewArrivals products={newest} />}
      <BrandsStrip brands={brands} />
      <div className="max-w-7xl mx-auto px-4">
        <FooterBanner />
      </div>
    </div>
  )
}
