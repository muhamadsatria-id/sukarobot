import { formatPrice, rentalRate } from '../lib/api'
import { onImageError, productImage } from '../lib/images'

function Spec({ label, value }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line/80 bg-paper/70 px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.08em] text-ink-soft">
      <span className="text-muted">{label}</span>
      {value}
    </span>
  )
}

export default function ProductCard({
  product,
  currency = 'IDR',
  rentalMode = 'self',
  onOrder,
}) {
  const available = product.stockStatus === 'Tersedia'
  const rate = rentalRate(product, rentalMode)
  const modeLabel = rentalMode === 'driver' ? 'Dengan driver' : 'Lepas kunci'

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[1.65rem] border border-line bg-bone/80 shadow-[0_1px_0_rgba(20,33,29,0.03)] transition duration-300 hover:-translate-y-1 hover:border-ink/20 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden bg-paper-deep">
        <img
          src={productImage(product)}
          alt={`${product.name} — ${product.categoryName}`}
          loading="lazy"
          onError={onImageError}
          className="size-full object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-bone/90 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-ink backdrop-blur">
            {product.categoryName}
          </span>
          <span
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] backdrop-blur ${
              available
                ? 'bg-[#2563eb]/95 text-white'
                : 'bg-[#93c5fd]/95 text-[#0f2744]'
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                available ? 'bg-white' : 'bg-[#0f2744]/60'
              }`}
            />
            {available ? 'Tersedia' : 'Sedang disewa'}
          </span>
        </div>

        {product.modelYear ? (
          <span className="absolute bottom-4 left-4 rounded-md border border-bone/40 bg-ink/55 px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-bone backdrop-blur">
            {product.modelYear}
          </span>
        ) : null}

        <span className="absolute bottom-4 right-4 rounded-full border border-bone/30 bg-ink/55 px-3 py-1 text-[0.6rem] font-medium uppercase tracking-[0.14em] text-bone backdrop-blur">
          {modeLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-[1.55rem] font-semibold leading-none tracking-[-0.04em] text-ink">
              {product.name}
            </h3>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
              {product.description}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <Spec label="Transmisi" value={product.transmission || 'Matic'} />
          <Spec label="Kursi" value={`${product.seats || 5}`} />
          <Spec label="Bahan bakar" value={product.fuel || 'Bensin'} />
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-line/80 pt-5">
          <div>
            <p className="text-[0.58rem] font-medium uppercase tracking-[0.18em] text-muted">
              {rentalMode === 'driver' ? 'Tarif + driver' : 'Mulai dari'}
            </p>
            <p className="mt-1 flex items-baseline gap-1.5">
              <span className="font-display text-[1.65rem] font-semibold leading-none tracking-[-0.04em] text-ink">
                {formatPrice(rate, currency)}
              </span>
              <span className="text-xs font-semibold text-muted">/ hari</span>
            </p>
            <p className="mt-1.5 text-[0.68rem] font-medium text-muted">
              Min. {product.minRental || 1} hari
              {rentalMode === 'driver' && product.driverFee
                ? ` · driver ${formatPrice(product.driverFee, currency)}`
                : ''}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOrder(product)}
            disabled={!available}
            className={`group/button inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] transition ${
              available
                ? 'bg-ink text-bone hover:bg-rust'
                : 'border border-line bg-paper-deep/60 text-muted'
            }`}
          >
            {available ? 'Sewa mobil' : 'Tidak tersedia'}
            <svg
              viewBox="0 0 24 24"
              width="15"
              height="15"
              aria-hidden="true"
              className="transition group-hover/button:translate-x-0.5"
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
          </button>
        </div>
      </div>
    </article>
  )
}
