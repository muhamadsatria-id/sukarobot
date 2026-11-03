import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminDashboard from '../components/AdminDashboard'
import AdminLoginModal from '../components/AdminLoginModal'
import AdminLayout from '../layouts/AdminLayout'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import OrderModal from '../components/OrderModal'
import HomeSections from '../components/HomeSections'
import ProductPage from '../components/ProductPage'
import {
  TOKEN_KEY,
  api,
  whatsappLink,
} from '../lib/api'



async function fetchCatalog() {
  const [storeResponse, categoriesResponse, productsResponse] =
    await Promise.all([api.getStore(), api.getCategories(), api.getProducts()])

  return {
    store: storeResponse?.data ?? null,
    categories: categoriesResponse?.data ?? [],
    products: productsResponse?.data ?? [],
  }
}

function getLocation() {
  if (typeof window === 'undefined') {
    return { page: 'home', path: '/' }
  }

  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  if (path === '/admin') return { page: 'admin', path: '/admin' }
  if (path === '/products' || path === '/armada') {
    return { page: 'products', path: '/products' }
  }

  return {
    page: 'home',
    path: window.location.hash === '#tentang' ? '/#tentang' : '/',
  }
}



export default function Home() {
  const [store, setStore] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [rentalMode, setRentalMode] = useState('self')
  const [orderProduct, setOrderProduct] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [adminTab, setAdminTab] = useState('products')
  const [location, setLocation] = useState(getLocation)
  const { page } = location

  const applyCatalog = useCallback((data) => {
    setStore(data.store)
    setCategories(data.categories)
    setProducts(data.products)
    setError('')
  }, [])

  const navigate = useCallback((path, { replace = false } = {}) => {
    const target = path || '/'
    if (replace) {
      window.history.replaceState({}, '', target)
    } else {
      window.history.pushState({}, '', target)
    }
    setLocation(getLocation())
  }, [])

  useEffect(() => {
    const syncLocation = () => setLocation(getLocation())
    window.addEventListener('popstate', syncLocation)
    window.addEventListener('hashchange', syncLocation)
    return () => {
      window.removeEventListener('popstate', syncLocation)
      window.removeEventListener('hashchange', syncLocation)
    }
  }, [])

  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const element = document.querySelector(hash)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location])

  const load = useCallback(
    async ({ quiet = false } = {}) => {
      if (!quiet) setLoading(true)
      try {
        applyCatalog(await fetchCatalog())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    },
    [applyCatalog],
  )

  useEffect(() => {
    let active = true
    fetchCatalog()
      .then((data) => {
        if (active) applyCatalog(data)
      })
      .catch((err) => {
        if (active) setError(err.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [applyCatalog])

  useEffect(() => {
    if (!token) return undefined
    let cancelled = false
    api.me(token).catch((err) => {
      if (cancelled) return
      if (err.status === 401 || err.status === 403) {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
      }
    })
    return () => {
      cancelled = true
    }
  }, [token])

  useEffect(() => {
    const name = store?.storeName || 'Sukabumi Drive'
    document.title = `${name} — Rental Mobil Sukabumi`
  }, [store])

  const query = search.trim().toLowerCase()

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (activeCategory !== 'all' && product.categoryId !== activeCategory) {
        return false
      }
      if (!query) return true
      return [
        product.name,
        product.categoryName,
        product.description,
        product.transmission,
        product.fuel,
        product.modelYear,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    })
  }, [products, activeCategory, query])

  const storeName = store?.storeName || 'Sukabumi Drive'
  const currency = store?.currency || 'IDR'
  const readyCount = products.filter(
    (product) => product.stockStatus === 'Tersedia',
  ).length
  const startingPrice = products.length
    ? Math.min(...products.map((product) => Number(product.price) || 0))
    : 0
  const storeWhatsApp = store?.phone
    ? whatsappLink(
        store.phone,
        `Halo ${storeName}, saya mau tanya sewa mobil di Sukabumi.`,
      )
    : ''


  function handleLoginSuccess(response) {
    localStorage.setItem(TOKEN_KEY, response.token)
    setToken(response.token)
    navigate('/admin', { replace: true })
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    navigate('/', { replace: true })
  }

  function resetFilters() {
    setSearch('')
    setActiveCategory('all')
  }

  const ctx = {
    store,
    loading,
    products,
    categories,
    filteredProducts,
    search,
    setSearch,
    activeCategory,
    setActiveCategory,
    rentalMode,
    setRentalMode,
    currency,
    resetFilters,
    setOrderProduct,
    storeWhatsApp,
    startingPrice,
    readyCount,
    onViewAll: () => navigate('/products'),
  }

  if (page === 'admin' && token) {
    return (
      <div className="min-h-screen bg-[#f0f9ff]" id="top">
        <AdminLayout
          activeTab={adminTab}
          onTabChange={setAdminTab}
          onLogout={handleLogout}
          store={store}
        >
          <AdminDashboard
            token={token}
            store={store}
            products={products}
            categories={categories}
            onRefresh={() => load({ quiet: true })}
            tab={adminTab}
            onTabChange={setAdminTab}
          />
        </AdminLayout>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f0f9ff] text-ink selection:bg-[#3c83f6] selection:text-white" id="top">
      <Navbar
        store={store}
        whatsapp={storeWhatsApp}
        activePath={location.path}
        onNavigate={navigate}
      />

      {error ? (
        <div className="border-b border-danger/20 bg-danger/5">
          <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-2 px-4 py-3 text-sm text-danger sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => load()}
              className="w-fit rounded-full border border-danger/30 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] transition hover:bg-danger/10"
            >
              Coba lagi
            </button>
          </div>
        </div>
      ) : null}

      <main className={page === 'products' ? 'flex-1 pt-24' : 'flex-1'}>
        {page === 'products' ? (
          <ProductPage
            products={products}
            categories={categories}
            currency={currency}
            loading={loading}
            onBack={() => navigate('/')}
            onOrder={setOrderProduct}
          />
        ) : (
          <HomeSections ctx={ctx} />
        )}
      </main>

      <Footer store={store} whatsapp={storeWhatsApp} onNavigate={navigate} />

      {storeWhatsApp ? (
        <a
          href={storeWhatsApp}
          target="_blank"
          rel="noreferrer"
          aria-label="Hubungi Sukabumi Drive via WhatsApp"
          className="fixed bottom-5 right-5 z-30 grid size-14 place-items-center rounded-full bg-rust text-bone shadow-lift transition hover:-translate-y-1 hover:bg-rust-dark sm:bottom-7 sm:right-7"
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            aria-hidden="true"
            fill="currentColor"
          >
            <path d="M12.04 2.5a9.5 9.5 0 0 0-8.18 14.3L2.5 21.5l4.84-1.29a9.5 9.5 0 1 0 4.7-17.71Zm0 1.8a7.7 7.7 0 1 1-3.93 14.32l-.28-.17-2.86.76.77-2.78-.18-.29A7.7 7.7 0 0 1 12.04 4.3Zm-3.1 4.1c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.6c.13.17 1.74 2.76 4.22 3.76 2.06.83 2.48.66 2.93.62.45-.04 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28-.25-.13-1.45-.72-1.68-.8-.23-.09-.4-.13-.56.12-.17.25-.64.8-.78.96-.14.17-.29.19-.54.07-.25-.13-1.04-.38-1.98-1.22-.73-.65-1.22-1.45-1.36-1.7-.14-.25-.02-.38.1-.5.12-.12.25-.29.38-.44.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.55-1.33-.75-1.82-.2-.48-.4-.41-.55-.42h-.48Z" />
          </svg>
        </a>
      ) : null}

      <AdminLoginModal
        open={page === 'admin' && !token}
        onClose={() => navigate('/')}
        onSuccess={handleLoginSuccess}
      />


      <OrderModal
        key={orderProduct?.id ?? 'closed'}
        open={Boolean(orderProduct)}
        product={orderProduct}
        store={store}
        rentalMode={rentalMode}
        onClose={() => setOrderProduct(null)}
      />
    </div>
  )
}
