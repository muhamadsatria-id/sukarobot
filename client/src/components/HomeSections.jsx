import { heroImage, onImageError } from '../lib/images'
import ProductCard from './ProductCard'
import TestimonialSection from './TestimonialSection'

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

export default function HomeSections({ ctx }) {
  const {
    store,
    loading,
    products,
    rentalMode,
    currency,
    setOrderProduct,
    storeWhatsApp,
    startingPrice,
    readyCount,
    onViewAll,
  } = ctx

  return (
    <>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 grain opacity-[0.035]" />
          <div className="relative mx-auto grid w-full max-w-[1240px] gap-12 px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-12 lg:items-center lg:gap-8 lg:px-8 lg:pb-24 lg:pt-20">
            <div className="animate-rise lg:col-span-7">
              <h1 className="mt-5 max-w-[12ch] font-display text-[clamp(3.15rem,8vw,6.5rem)] font-semibold leading-[0.87] tracking-[-0.065em] text-ink">
                Mobil siap,
                <br />
                <span className="text-leaf">rute kamu</span> yang atur.
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
                  <dt className="text-[0.56rem] font-medium uppercase tracking-[0.16em] text-muted">
                    Tarif mulai
                  </dt>
                  <dd className="mt-1 font-display text-xl font-semibold tracking-[-0.04em] text-ink sm:text-2xl">
                    {loading ? '—' : shortRupiah(startingPrice)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.56rem] font-medium uppercase tracking-[0.16em] text-muted">
                    Unit siap
                  </dt>
                  <dd className="mt-1 font-display text-xl font-semibold tracking-[-0.04em] text-ink sm:text-2xl">
                    {loading ? '—' : `${String(readyCount).padStart(2, '0')} unit`}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.56rem] font-medium uppercase tracking-[0.16em] text-muted">
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

                <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-bone/20 bg-ink/45 px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-bone backdrop-blur">
                  <span className="size-1.5 animate-pulse rounded-full bg-gold" />
                  Armada Sukabumi
                </div>

                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-bone/60">
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
                    <p className="text-[0.55rem] font-medium uppercase tracking-[0.16em] text-muted">
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
          <div className="no-scrollbar mx-auto flex w-full max-w-[1240px] items-center gap-4 overflow-x-auto px-4 py-4 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-muted sm:px-6 lg:px-8">
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
          id="tentang"
          className="mx-auto w-full max-w-[1240px] scroll-mt-28 px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
        >
          <div className="grid gap-10 border-t border-line pt-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
            <div>
              <p className="text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-leaf">
                Tentang
              </p>
              <h2 className="mt-3 max-w-md font-display text-[2.7rem] font-semibold leading-[0.92] tracking-[-0.055em] text-ink sm:text-[4rem]">
                Dekat, jelas, siap jalan.
              </h2>
            </div>
            <div className="max-w-2xl">
              <p className="text-base leading-8 text-ink-soft">
                {store?.tagline ||
                  'Rental mobil harian di Sukabumi untuk perjalanan dalam kota, luar kota, atau antar-jemput.'}
              </p>
              <p className="mt-5 text-sm leading-7 text-muted">
                Kami berbasis di Cibadak, Sukabumi. Setiap unit dirawat dan
                dicek sebelum diserahkan, dengan pilihan lepas kunci atau dengan
                driver sesuai kebutuhan perjalanan Anda.
              </p>
              <dl className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Layanan', value: 'Lepas kunci & driver' },
                  { label: 'Area', value: 'Sukabumi & sekitar' },
                  {
                    label: 'Operasional',
                    value: store?.operationalHours || '08.00–21.00',
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-line bg-bone/60 p-4"
                  >
                    <dt className="text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-muted">
                      {item.label}
                    </dt>
                    <dd className="mt-2 text-sm font-semibold leading-6 text-ink">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

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
              Dari city car irit sampai SUV untuk rombongan. Semua unit bisa
              dipilih lepas kunci atau dengan driver.
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

        <section
          id="cara-sewa"
          className="relative scroll-mt-24 overflow-hidden bg-[#1e3a8a] text-bone"
        >
          <div className="pointer-events-none absolute inset-0 grain opacity-[0.05]" />
          <div className="relative mx-auto grid w-full max-w-[1240px] gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8">
            <div>
              <p className="text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-gold">
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
                <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-bone/50">
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
                  <span className="text-sm font-medium text-gold/80 transition group-hover:text-gold">
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
          className="mx-auto w-full max-w-[1240px] scroll-mt-28 px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
        >
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <p className="text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-leaf">
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
                  <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-leaf">
                    Antar-jemput
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink-soft">
                    Stasiun Sukabumi, terminal, hotel, dan bandara.
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-bone/60 p-4">
                  <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-leaf">
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
                    stroke="#93c5fd"
                    strokeDasharray="4 8"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                  <circle cx="28" cy="112" r="5" fill="#f0f9ff" />
                  <circle cx="178" cy="82" r="5" fill="#3c83f6" />
                  <circle cx="372" cy="24" r="5" fill="#93c5fd" />
                </svg>
                <span className="absolute left-4 top-4 text-[0.56rem] font-medium uppercase tracking-[0.18em] text-bone/60">
                  06°55′S 106°55′E
                </span>
                <span className="absolute bottom-4 right-4 text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-bone">
                  Sukabumi
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-ink-soft">
                  Rute populer
                </p>
                <span className="rounded-full border border-line px-2.5 py-1 text-[0.55rem] font-medium uppercase tracking-[0.12em] text-muted">
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
                      <span className="hidden rounded-full bg-paper px-2 py-0.5 text-[0.52rem] uppercase tracking-[0.1em] text-muted sm:inline">
                        {route.note}
                      </span>
                    </div>
                    <span className="shrink-0 text-[0.62rem] text-muted">
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
              <p className="text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-leaf">
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
                  className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-leaf underline decoration-leaf/30 underline-offset-4 transition hover:decoration-leaf"
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
                    <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line text-muted transition group-open:rotate-45 group-open:border-leaf group-open:text-leaf">
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

        <TestimonialSection />
    </>
  )
}
