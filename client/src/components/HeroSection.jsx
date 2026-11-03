import { heroImage, onImageError } from '../lib/images'

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

export default function HeroSection({
  store,
  loading,
  storeWhatsApp,
  startingPrice,
  readyCount,
}) {
  return (
    <section className="relative overflow-hidden bg-ink">
      <img
        src={heroImage}
        alt=""
        aria-hidden="true"
        onError={onImageError}
        className="absolute inset-0 size-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-ink/75 lg:hidden" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-ink/95 via-ink/80 to-ink/30 lg:block" />
      <div className="pointer-events-none absolute inset-0 grain opacity-[0.06]" />

      <div className="relative mx-auto w-full max-w-[1240px] px-4 pb-20 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pb-24 lg:pt-32">
        <div className="max-w-3xl animate-rise">
          <h1 className="max-w-[12ch] font-display text-[clamp(3.15rem,8vw,6.5rem)] font-semibold leading-[0.87] tracking-[-0.065em] text-bone">
            Mobil siap,
            <br />
            <span className="text-[#93c5fd]">rute kamu</span> yang atur.
          </h1>

          <p className="mt-6 max-w-[35rem] text-base leading-7 text-bone/80 sm:text-lg sm:leading-8">
            Sewa mobil harian di Sukabumi untuk perjalanan dalam kota, luar
            kota, atau antar-jemput. Pilih lepas kunci atau dengan driver—
            sisanya kami bantu siapkan.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#armada"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-bone px-5 py-3.5 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:bg-gold"
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
                className="inline-flex items-center justify-center gap-2 rounded-full border border-bone/30 bg-bone/10 px-5 py-3.5 text-sm font-bold text-bone backdrop-blur transition hover:border-bone/50 hover:bg-bone/15"
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

          <dl className="mt-10 grid max-w-xl grid-cols-3 gap-3 border-t border-bone/20 pt-5">
            <div>
              <dt className="text-[0.56rem] font-medium uppercase tracking-[0.16em] text-bone/60">
                Tarif mulai
              </dt>
              <dd className="mt-1 font-display text-xl font-semibold tracking-[-0.04em] text-bone sm:text-2xl">
                {loading ? '—' : shortRupiah(startingPrice)}
              </dd>
            </div>
            <div>
              <dt className="text-[0.56rem] font-medium uppercase tracking-[0.16em] text-bone/60">
                Unit siap
              </dt>
              <dd className="mt-1 font-display text-xl font-semibold tracking-[-0.04em] text-bone sm:text-2xl">
                {loading ? '—' : `${String(readyCount).padStart(2, '0')} unit`}
              </dd>
            </div>
            <div>
              <dt className="text-[0.56rem] font-medium uppercase tracking-[0.16em] text-bone/60">
                Jam operasional
              </dt>
              <dd className="mt-1 font-display text-xl font-semibold tracking-[-0.04em] text-bone sm:text-2xl">
                {store?.operationalHours || '08.00–21.00'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
