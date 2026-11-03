import ProductCard from './ProductCard'

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

export default function ArmadaSection({
  loading,
  products,
  currency,
  rentalMode,
  setOrderProduct,
  onViewAll,
}) {
  return (
    <section
      id="armada"
      className="mx-auto w-full max-w-[1240px] scroll-mt-28 px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-leaf">
            Armada
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-[2.7rem] font-semibold leading-[0.92] tracking-[-0.055em] text-ink sm:text-[4.2rem]">
            Mobil untuk setiap rencana.
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-7 text-muted">
          Dari city car irit sampai SUV untuk rombongan. Semua unit bisa dipilih
          lepas kunci atau dengan driver.
        </p>
      </div>

      <div className="mt-6">
        {loading ? (
          <SkeletonGrid />
        ) : products.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.slice(0, 6).map((product) => (
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
            <p className="text-3xl font-semibold tracking-[-0.04em] text-ink">
              Belum ada mobil yang tersedia.
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-bone transition hover:-translate-y-0.5 hover:bg-rust"
        >
          Lihat semua armada
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  )
}
