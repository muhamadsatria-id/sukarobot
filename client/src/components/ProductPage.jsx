import { useState } from 'react'
import Searchbar from './Searchbar'
import CategoryPills from './CategoryPills'
import ProductCard from './ProductCard'

export default function ProductPage({
  products,
  categories,
  currency,
  loading,
  onBack,
  onOrder,
}) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [rentalMode, setRentalMode] = useState('self')

  const query = search.trim().toLowerCase()
  const filteredProducts = products.filter((product) => {
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

  function resetFilters() {
    setSearch('')
    setActiveCategory('all')
  }

  return (
    <section className="mx-auto w-full max-w-[1240px] px-4 pt-2 pb-10 sm:px-6 sm:pt-4 sm:pb-14 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-leaf">
            Armada
          </p>
          <h1 className="mt-1 font-display text-[2.7rem] font-semibold leading-[0.92] tracking-[-0.055em] text-ink sm:text-[4.2rem]">
            Semua mobil.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-7 text-muted">
            Pilih unit, bandingkan tarif, lalu pesan lewat WhatsApp.
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-bone px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink transition hover:border-ink/30"
        >
          ← Kembali
        </button>
      </div>

      <div className="mt-5 space-y-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
          <div className="min-w-0 flex-1">
            <Searchbar value={search} onChange={setSearch} />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between xl:justify-end">
            <span className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-muted">
              Tampilkan tarif
            </span>
            <div className="grid grid-cols-2 rounded-full bg-paper/70 p-1 gap-1">
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
                      : 'bg-white text-muted hover:text-ink hover:bg-white/90'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <CategoryPills
            categories={categories}
            active={activeCategory}
            total={products.length}
            onChange={setActiveCategory}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.62rem] font-medium uppercase tracking-[0.14em] text-muted">
          {loading
            ? 'Memuat armada…'
            : `${filteredProducts.length} dari ${products.length} unit`}
        </p>
        {search || activeCategory !== 'all' ? (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-bold uppercase tracking-[0.1em] text-leaf underline decoration-leaf/30 underline-offset-4 transition hover:decoration-leaf"
          >
            Reset filter
          </button>
        ) : null}
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-[1.65rem] border border-line bg-bone/70"
              />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                rentalMode={rentalMode}
                onOrder={onOrder}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[1.65rem] border border-dashed border-line-strong bg-bone/50 px-6 py-16 text-center">
            <p className="text-3xl font-semibold tracking-[-0.04em] text-ink">
              Belum ada mobil yang cocok.
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
              Coba kata kunci lain atau lihat semua kategori.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 rounded-full bg-ink px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-bone transition hover:bg-rust"
            >
              Lihat semua mobil
            </button>
          </div>
        )}
      </div>
    </section>
  )
}