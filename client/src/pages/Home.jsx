import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminDashboard from '../components/AdminDashboard'
import AdminLoginModal from '../components/AdminLoginModal'
import CategoryPills from '../components/CategoryPills'
import Header from '../components/Header'
import OrderModal from '../components/OrderModal'
import ProductCard from '../components/ProductCard'
import Searchbar from '../components/Searchbar'
import {
  TOKEN_KEY,
  api,
  formatPhone,
  whatsappLink,
} from '../lib/api'
import { heroImage, onImageError } from '../lib/images'

const CURRENT_YEAR = new Date().getFullYear()

const ROUTES = [
  { name: 'Pelabuhan Ratu', note: 'Pantai & liburan', distance: '± 60 km' },
  { name: 'Cibadak', note: 'Dalam kota', distance: '± 20 km' },
  { name: 'Bogor', note: 'Luar kota', distance: '± 90 km' },
  { name: 'Bandung', note: 'Luar kota', distance: '± 120 km' },
  { name: 'Jakarta', note: 'Antar-jemput', distance: '± 130 km' },
]

const STEPS = [
  {
    title: 'Pilih mobil & layanan',
    body: 'Tentukan unit, tanggal mulai, dan mau lepas kunci atau dengan driver. Tarif muncul otomatis.',
  },
  {
    title: 'Kirim detail via WhatsApp',
    body: 'Kami cek ketersediaan unit, konfirmasi tarif akhir, dan jadwal antar-jemput.',
  },
  {
    title: 'Ambil atau minta antar',
    body: 'Unit bisa diambil di Cibadak atau diantar sesuai kesepakatan. Siap jalan.',
  },
]

const FAQS = [
  {
    question: 'Apakah bisa lepas kunci?',
    answer:
      'Bisa. Untuk lepas kunci wajib menunjukkan KTP dan SIM A yang masih berlaku. Unit tertentu punya minimal sewa 2 hari.',
  },
  {
    question: 'Apakah tarif sudah termasuk BBM?',
    answer:
      'Belum. Tarif sewa belum termasuk BBM, tol, parkir, dan biaya jalan lain. Untuk layanan driver, tarif driver sudah tertera terpisah.',
  },
  {
    question: 'Bisa antar-jemput?',
    answer:
      'Bisa untuk area Sukabumi, stasiun, terminal, hotel, dan bandara dengan biaya menyesuaikan lokasi. Tulis lokasi jemput saat memesan.',
  },
  {
    question: 'Bagaimana cara pembayarannya?',
    answer:
      'Konfirmasi lewat WhatsApp, lalu DP via transfer. Pelunasan dilakukan saat serah terima unit.',
  },
]

async function fetchCatalog() {
  const [storeResponse, categoriesResponse, productsResponse] =
    await Promise.all([api.getStore(), api.getCategories(), api.getProducts()])

  return {
    store: storeResponse?.data ?? null,
    categories: categoriesResponse?.data ?? [],
    products: productsResponse?.data ?? [],
  }
}

function shortRupiah(value) {
  const amount = Number(value)
  if (!amount) return '—'
  if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toLocaleString('id-ID', {
      maximumFractionDigits: 1,
    })} jt`
  }
  return `Rp ${Math.round(amount / 1000)} rb`
}

function SkeletonGrid() {
  return (
    <div
      className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
      aria-busy="true"
      aria-label="Memuat armada"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div
          className="overflow-hidden rounded-[1.65rem] border border-line bg-bone/70"
          key={index}
        >
          <div className="aspect-[16/10] animate-pulse bg-paper-deep" />
          <div className="space-y-3 p-6">
            <div className="h-6 w-2/3 animate-pulse rounded-full bg-paper-deep" />
            <div className="h-3 w-full animate-pulse rounded-full bg-paper-deep/80" />
            <div className="h-3 w-4/5 animate-pulse rounded-full bg-paper-deep/80" />
            <div className="flex gap-2 pt-2">
              <div className="h-7 w-20 animate-pulse rounded-full bg-paper-deep/80" />
              <div className="h-7 w-16 animate-pulse rounded-full bg-paper-deep/80" />
            </div>
            <div className="flex items-end justify-between pt-4">
              <div className="h-8 w-32 animate-pulse rounded-full bg-paper-deep" />
              <div className="h-10 w-28 animate-pulse rounded-full bg-paper-deep" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
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
  const [loginOpen, setLoginOpen] = useState(false)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [adminMode, setAdminMode] = useState(false)

  const applyCatalog = useCallback((data) => {
    setStore(data.store)
    setCategories(data.categories)
    setProducts(data.products)
    setError('')
  }, [])

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
        setAdminMode(false)
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

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [adminMode])

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
  const instagramUrl = store?.instagram
    ? `https://instagram.com/${String(store.instagram).replace(/^@/, '')}`
    : ''

  function handleAdminClick() {
    if (adminMode) {
      setAdminMode(false)
      return
    }
    if (token) {
      setAdminMode(true)
      return
    }
    setLoginOpen(true)
  }

  function handleLoginSuccess(response) {
    localStorage.setItem(TOKEN_KEY, response.token)
    setToken(response.token)
    setAdminMode(true)
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setAdminMode(false)
  }

  function resetFilters() {
    setSearch('')
    setActiveCategory('all')
  }

  if (adminMode && token) {
    return (
      <div className="min-h-svh" id="top">
        <Header
          store={store}
          whatsapp={storeWhatsApp}
          adminMode
          onAdminClick={handleAdminClick}
          onLogout={handleLogout}
        />
        <AdminDashboard
          token={token}
          store={store}
          products={products}
          categories={categories}
          onRefresh={() => load({ quiet: true })}
        />
      </div>
    )
  }

  return (
    <div className="min-h-svh" id="top">
      <Header
        store={store}
        whatsapp={storeWhatsApp}
        adminMode={false}
        onAdminClick={handleAdminClick}
        onLogout={handleLogout}
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

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 grain opacity-[0.035]" />
          <div className="relative mx-auto grid w-full max-w-[1240px] gap-12 px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-12 lg:items-center lg:gap-8 lg:px-8 lg:pb-24 lg:pt-20">
            <div className="animate-rise lg:col-span-7">
              <div className="flex items-center gap-3 text-rust">
                <span className="h-px w-10 bg-rust/60" />
                <p className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.24em]">
                  Rental mobil · Sukabumi
                </p>
              </div>

              <h1 className="mt-5 max-w-[12ch] font-display text-[clamp(3.15rem,8vw,6.5rem)] font-semibold leading-[0.87] tracking-[-0.065em] text-ink">
                Mobil siap,
                <br />
                <span className="text-rust">rute kamu</span> yang atur.
              </h1>

              <p className="mt-6 max-w-[35rem] text-base leading-7 text-ink-soft sm:text-lg sm:leading-8">
                Sewa mobil harian di Sukabumi untuk perjalanan dalam kota, luar
                kota, atau antar-jemput. Pilih lepas kunci atau dengan driver—
                sisanya kami bantu siapkan.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#armada"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-bold text-bone transition hover:-translate-y-0.5 hover:bg-rust"
                >
                  Lihat armada
                  <svg
                    viewBox="0 0 24 24"
                    width="17"
                    height="17"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12h13M13 6l6 6-6 6"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                </a>
                {storeWhatsApp ? (
                  <a
                    href={storeWhatsApp}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-bone/70 px-5 py-3.5 text-sm font-bold text-ink transition hover:border-ink/30 hover:bg-bone"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="17"
                      height="17"
                      aria-hidden="true"
                      fill="currentColor"
                    >
                      <path d="M12.04 2.5a9.5 9.5 0 0 0-8.18 14.3L2.5 21.5l4.84-1.29a9.5 9.5 0 1 0 4.7-17.71Zm0 1.8a7.7 7.7 0 1 1-3.93 14.32l-.28-.17-2.86.76.77-2.78-.18-.29A7.7 7.7 0 0 1 12.04 4.3Zm-3.1 4.1c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.6c.13.17 1.74 2.76 4.22 3.76 2.06.83 2.48.66 2.93.62.45-.04 1.45-.59 1.65-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28-.25-.13-1.45-.72-1.68-.8-.23-.09-.4-.13-.56.12-.17.25-.64.8-.78.96-.14.17-.29.19-.54.07-.25-.13-1.04-.38-1.98-1.22-.73-.65-1.22-1.45-1.36-1.7-.14-.25-.02-.38.1-.5.12-.12.25-.29.38-.44.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.55-1.33-.75-1.82-.2-.48-.4-.41-.55-.42h-.48Z" />
                    </svg>
                    Tanya via WhatsApp
                  </a>
                ) : null}
              </div>

              <dl className="mt-10 grid max-w-xl grid-cols-3 gap-3 border-t border-line pt-5">
                <div>
                  <dt className="font-mono text-[0.56rem] font-medium uppercase tracking-[0.16em] text-muted">
                    Tarif mulai
                  </dt>
                  <dd className="mt-1 font-display text-xl font-semibold tracking-[-0.04em] text-ink sm:text-2xl">
                    {loading ? '—' : shortRupiah(startingPrice)}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.56rem] font-medium uppercase tracking-[0.16em] text-muted">
                    Unit siap
                  </dt>
                  <dd className="mt-1 font-display text-xl font-semibold tracking-[-0.04em] text-ink sm:text-2xl">
                    {loading ? '—' : `${String(readyCount).padStart(2, '0')} unit`}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.56rem] font-medium uppercase tracking-[0.16em] text-muted">
                    Jam operasional
                  </dt>
                  <dd className="mt-1 font-display text-xl font-semibold tracking-[-0.04em] text-ink sm:text-2xl">
                    {store?.operationalHours || '08.00–21.00'}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="relative mb-8 animate-rise [animation-delay:120ms] lg:col-span-5 lg:mb-0">
              <div className="relative overflow-hidden rounded-[2rem] border border-line/80 bg-paper-deep shadow-lift">
                <img
                  src={heroImage}
                  alt="Mobil rental melintas di jalan menuju Sukabumi"
                  onError={onImageError}
                  className="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />

                <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-bone/20 bg-ink/45 px-3 py-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-bone backdrop-blur">
                  <span className="size-1.5 animate-pulse rounded-full bg-gold" />
                  Armada Sukabumi
                </div>

                <div className="absolute bottom-5 left-5 right-5">
                  <p className="font-mono text-[0.6rem] font-medium uppercase tracking-[0.2em] text-bone/60">
                    06°55′S 106°55′E · Jawa Barat
                  </p>
                  <p className="mt-2 max-w-xs font-display text-[1.9rem] font-semibold leading-[0.95] tracking-[-0.05em] text-bone">
                    Siap jalan, kapan saja.
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-line bg-bone/95 p-4 shadow-lift backdrop-blur sm:left-6 sm:right-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-[0.55rem] font-medium uppercase tracking-[0.16em] text-muted">
                      Mulai dari
                    </p>
                    <p className="mt-1 font-display text-2xl font-semibold leading-none tracking-[-0.04em] text-ink">
                      {shortRupiah(startingPrice)}
                      <span className="ml-1 text-xs font-semibold tracking-normal text-muted">
                        /hari
                      </span>
                    </p>
                  </div>
                  <a
                    href="#armada"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-rust px-4 py-2.5 text-xs font-bold text-bone transition hover:bg-rust-dark"
                  >
                    Pilih mobil
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="border-y border-line bg-bone/45">
          <div className="no-scrollbar mx-auto flex w-full max-w-[1240px] items-center gap-4 overflow-x-auto px-4 py-4 font-mono text-[0.62rem] font-medium uppercase tracking-[0.18em] text-muted sm:px-6 lg:px-8">
            <span className="shrink-0">Lepas kunci</span>
            <span className="size-1 shrink-0 rounded-full bg-rust" />
            <span className="shrink-0">Dengan driver</span>
            <span className="size-1 shrink-0 rounded-full bg-rust" />
            <span className="shrink-0">Antar-jemput</span>
            <span className="size-1 shrink-0 rounded-full bg-rust" />
            <span className="shrink-0">Harian & mingguan</span>
            <span className="size-1 shrink-0 rounded-full bg-rust" />
            <span className="shrink-0">Unit terawat</span>
          </div>
        </div>

        <section
          id="armada"
          className="mx-auto w-full max-w-[1240px] px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-rust">
                Armada
              </p>
              <h2 className="mt-3 max-w-2xl font-display text-[2.7rem] font-semibold leading-[0.92] tracking-[-0.055em] text-ink sm:text-[4.2rem]">
                Mobil untuk setiap rencana.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-muted">
              Dari city car irit sampai SUV untuk rombongan. Semua unit bisa
              dipilih lepas kunci atau dengan driver.
            </p>
          </div>

          <div className="mt-10 rounded-[1.5rem] border border-line bg-bone/55 p-3 sm:p-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
              <div className="min-w-0 flex-1">
                <Searchbar value={search} onChange={setSearch} />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between xl:justify-end">
                <span className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-muted">
                  Tampilkan tarif
                </span>
                <div className="grid grid-cols-2 rounded-full border border-line bg-paper/70 p-1">
                  {[
                    { id: 'self', label: 'Lepas kunci' },
                    { id: 'driver', label: 'Dengan driver' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRentalMode(item.id)}
                      aria-pressed={rentalMode === item.id}
                      className={`rounded-full px-3 py-2 text-xs font-bold transition ${
                        rentalMode === item.id
                          ? 'bg-ink text-bone shadow-card'
                          : 'text-muted hover:text-ink'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <CategoryPills
                categories={categories}
                active={activeCategory}
                total={products.length}
                onChange={setActiveCategory}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[0.62rem] font-medium uppercase tracking-[0.14em] text-muted">
              {loading
                ? 'Memuat armada…'
                : `${filteredProducts.length} dari ${products.length} unit`}
            </p>
            {search || activeCategory !== 'all' ? (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-bold uppercase tracking-[0.1em] text-rust underline decoration-rust/30 underline-offset-4 transition hover:decoration-rust"
              >
                Reset filter
              </button>
            ) : null}
          </div>

          <div className="mt-6">
            {loading ? (
              <SkeletonGrid />
            ) : filteredProducts.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currency={currency}
                    rentalMode={rentalMode}
                    onOrder={setOrderProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[1.65rem] border border-dashed border-line-strong bg-bone/50 px-6 py-16 text-center">
                <p className="font-display text-3xl font-semibold tracking-[-0.04em] text-ink">
                  Belum ada mobil yang cocok.
                </p>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
                  Coba kata kunci lain atau lihat semua kategori. Kalau butuh
                  unit khusus, tanya langsung lewat WhatsApp.
                </p>
                <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="rounded-full bg-ink px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-bone transition hover:bg-rust"
                  >
                    Lihat semua mobil
                  </button>
                  {storeWhatsApp ? (
                    <a
                      href={storeWhatsApp}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-line bg-bone px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink transition hover:border-ink/30"
                    >
                      Tanya via WhatsApp
                    </a>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </section>

        <section
          id="cara-sewa"
          className="relative overflow-hidden bg-ink text-bone"
        >
          <div className="pointer-events-none absolute inset-0 grain opacity-[0.05]" />
          <div className="relative mx-auto grid w-full max-w-[1240px] gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8">
            <div>
              <p className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-gold">
                Cara sewa
              </p>
              <h2 className="mt-4 max-w-lg font-display text-[2.8rem] font-semibold leading-[0.92] tracking-[-0.055em] text-bone sm:text-[4rem]">
                Tiga langkah, tanpa ribet.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-bone/60">
                Semua percakapan dimulai dari WhatsApp. Kami bantu cek unit,
                hitung tarif, dan atur serah terima.
              </p>

              {storeWhatsApp ? (
                <a
                  href={storeWhatsApp}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-bone px-5 py-3.5 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:bg-gold"
                >
                  Tanya ketersediaan
                  <span aria-hidden="true">→</span>
                </a>
              ) : null}

              <div className="mt-8 max-w-md rounded-2xl border border-bone/15 bg-bone/5 p-5">
                <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-bone/50">
                  Yang perlu disiapkan
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-bone/75">
                  <li className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                    KTP dan SIM A untuk layanan lepas kunci.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                    Konfirmasi jadwal dan lokasi serah terima.
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                    BBM, tol, dan parkir di luar tarif sewa.
                  </li>
                </ul>
              </div>
            </div>

            <ol className="space-y-0 border-t border-bone/15">
              {STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="group grid gap-4 border-b border-bone/15 py-7 sm:grid-cols-[3.5rem_1fr]"
                >
                  <span className="font-mono text-sm font-medium text-gold/80 transition group-hover:text-gold">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-bone sm:text-3xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-lg text-sm leading-7 text-bone/55">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="area"
          className="mx-auto w-full max-w-[1240px] px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
        >
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <p className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-rust">
                Area layanan
              </p>
              <h2 className="mt-3 max-w-xl font-display text-[2.8rem] font-semibold leading-[0.92] tracking-[-0.055em] text-ink sm:text-[4rem]">
                Dari Sukabumi, ke mana saja?
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-muted">
                Basis kami di Cibadak, Sukabumi. Antar-jemput bisa diatur untuk
                dalam kota, luar kota, stasiun, terminal, hotel, sampai bandara.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-line bg-bone/60 p-4">
                  <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-rust">
                    Antar-jemput
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">
                    Stasiun Sukabumi, terminal, hotel, dan bandara.
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-bone/60 p-4">
                  <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-rust">
                    Luar kota
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">
                    Pelabuhan Ratu, Bogor, Bandung, dan Jakarta.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-line bg-bone p-5 shadow-card sm:p-6">
              <div className="relative mb-5 h-32 overflow-hidden rounded-xl bg-moss">
                <div className="pointer-events-none absolute inset-0 grain opacity-10" />
                <svg
                  viewBox="0 0 400 140"
                  className="absolute inset-0 size-full"
                  aria-hidden="true"
                >
                  <path
                    d="M28 112 C 100 90, 110 116, 178 82 S 282 70, 372 24"
                    fill="none"
                    stroke="#d6a45a"
                    strokeDasharray="4 8"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                  <circle cx="28" cy="112" r="5" fill="#f4f0e7" />
                  <circle cx="178" cy="82" r="5" fill="#c9502c" />
                  <circle cx="372" cy="24" r="5" fill="#d6a45a" />
                </svg>
                <span className="absolute left-4 top-4 font-mono text-[0.56rem] font-medium uppercase tracking-[0.18em] text-bone/60">
                  06°55′S 106°55′E
                </span>
                <span className="absolute bottom-4 right-4 font-mono text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-bone">
                  Sukabumi
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-ink-soft">
                  Rute populer
                </p>
                <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.55rem] font-medium uppercase tracking-[0.12em] text-muted">
                  Dari Sukabumi
                </span>
              </div>

              <ul className="mt-3">
                {ROUTES.map((route) => (
                  <li
                    key={route.name}
                    className="flex items-center justify-between gap-4 border-t border-line/80 py-3.5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="size-2 shrink-0 rounded-full bg-rust" />
                      <span className="truncate font-semibold text-ink">
                        {route.name}
                      </span>
                      <span className="hidden rounded-full bg-paper px-2 py-0.5 font-mono text-[0.52rem] uppercase tracking-[0.1em] text-muted sm:inline">
                        {route.note}
                      </span>
                    </div>
                    <span className="shrink-0 font-mono text-[0.62rem] text-muted">
                      {route.distance}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-2 text-[0.68rem] leading-5 text-muted">
                Jarak perkiraan. Biaya antar-jemput dikonfirmasi sesuai lokasi.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-bone/35">
          <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8">
            <div>
              <p className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-rust">
                Pertanyaan umum
              </p>
              <h2 className="mt-3 max-w-sm font-display text-[2.7rem] font-semibold leading-[0.92] tracking-[-0.055em] text-ink sm:text-[3.6rem]">
                Sebelum berangkat.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-7 text-muted">
                Belum ketemu jawabannya? Kirim pertanyaan lewat WhatsApp, kami
                bantu langsung.
              </p>
              {storeWhatsApp ? (
                <a
                  href={storeWhatsApp}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-rust underline decoration-rust/30 underline-offset-4 transition hover:decoration-rust"
                >
                  Tanya admin
                  <span aria-hidden="true">→</span>
                </a>
              ) : null}
            </div>

            <div className="border-y border-line">
              {FAQS.map((item) => (
                <details key={item.question} className="group border-b border-line/80 last:border-b-0">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-display text-xl font-semibold tracking-[-0.03em] text-ink [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line text-muted transition group-open:rotate-45 group-open:border-rust group-open:text-rust">
                      <svg
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        aria-hidden="true"
                      >
                        <path
                          d="M12 5v14M5 12h14"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeWidth="1.9"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="max-w-xl pb-5 text-sm leading-7 text-muted">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative overflow-hidden bg-ink text-bone">
        <div className="pointer-events-none absolute inset-0 grain opacity-[0.05]" />
        <div className="relative mx-auto w-full max-w-[1240px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.4fr_0.8fr_1fr]">
            <div>
              <a href="#top" className="flex w-fit items-center gap-3">
                <span className="grid size-11 place-items-center rounded-[0.9rem] bg-bone text-ink">
                  <svg
                    viewBox="0 0 64 64"
                    width="28"
                    height="28"
                    aria-hidden="true"
                  >
                    <path
                      d="M21 53c0-11 9-11 9-21S21 21 21 11"
                      fill="none"
                      stroke="#c9502c"
                      strokeLinecap="round"
                      strokeWidth="6"
                    />
                    <path
                      d="M43 53c0-11-9-11-9-21s9-11 9-21"
                      fill="none"
                      stroke="#14211d"
                      strokeLinecap="round"
                      strokeWidth="6"
                    />
                    <circle cx="32" cy="32" r="4" fill="#d6a45a" />
                  </svg>
                </span>
                <span>
                  <span className="block font-display text-xl font-bold tracking-[-0.03em]">
                    {storeName}
                  </span>
                  <span className="mt-1 block font-mono text-[0.56rem] uppercase tracking-[0.24em] text-bone/45">
                    Rental mobil · Sukabumi
                  </span>
                </span>
              </a>
              <p className="mt-5 max-w-sm text-sm leading-7 text-bone/55">
                {store?.tagline ||
                  'Rental mobil harian di Sukabumi — lepas kunci atau dengan driver.'}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {storeWhatsApp ? (
                  <a
                    href={storeWhatsApp}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-bone/20 px-4 py-2.5 text-xs font-bold text-bone transition hover:border-gold hover:text-gold"
                  >
                    WhatsApp
                  </a>
                ) : null}
                {instagramUrl ? (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-bone/20 px-4 py-2.5 text-xs font-bold text-bone transition hover:border-gold hover:text-gold"
                  >
                    Instagram
                  </a>
                ) : null}
              </div>
            </div>

            <div>
              <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-bone/40">
                Navigasi
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-bone/65">
                <li>
                  <a className="transition hover:text-bone" href="#armada">
                    Armada
                  </a>
                </li>
                <li>
                  <a className="transition hover:text-bone" href="#cara-sewa">
                    Cara sewa
                  </a>
                </li>
                <li>
                  <a className="transition hover:text-bone" href="#area">
                    Area layanan
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleAdminClick}
                    className="transition hover:text-bone"
                  >
                    Admin
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-bone/40">
                Kontak
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-bone/65">
                <li>{store?.address || 'Jl. Raya Cibadak, Sukabumi, Jawa Barat'}</li>
                <li>
                  {store?.phone ? (
                    <a
                      href={storeWhatsApp || undefined}
                      target="_blank"
                      rel="noreferrer"
                      className="transition hover:text-bone"
                    >
                      {formatPhone(store.phone)}
                    </a>
                  ) : (
                    'Hubungi admin untuk nomor WhatsApp'
                  )}
                </li>
                <li>Jam operasional: {store?.operationalHours || '08.00–21.00 WIB'}</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-bone/15 pt-5 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-bone/35 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {CURRENT_YEAR} {storeName}. Jalan jauh, tetap tenang.
            </p>
            <p>Sukabumi · Jawa Barat</p>
          </div>
        </div>
      </footer>

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
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
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
