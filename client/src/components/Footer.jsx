import { formatPhone } from '../lib/api'

const CURRENT_YEAR = new Date().getFullYear()

export default function Footer({ store, whatsapp, onNavigate }) {
  const storeName = store?.storeName || 'Sukabumi Drive'
  const storeWhatsApp = whatsapp
  const instagramUrl = store?.instagram
    ? `https://instagram.com/${String(store.instagram).replace(/^@/, '')}`
    : ''

  function handleNavigate(event, path) {
    event.preventDefault()
    onNavigate?.(path)
  }

  return (
    <footer className="relative bg-[#f0f9ff] text-white select-none">
      {/* 1. SVG Wave Layer di Atas (-mb-1 menghilangkan celah garis pixel) */}
      <div className="w-full overflow-hidden leading-none relative z-10 -mb-1">
        <svg
          className="relative block w-full h-16 sm:h-24 lg:h-32"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,50 L1200,120 L0,120 Z"
            fill="#3c83f6"
            fillOpacity="0.25"
          />
          <path
            d="M0,20 C200,80 450,10 700,70 C950,130 1100,30 1200,40 L1200,120 L0,120 Z"
            fill="#1e3a8a"
          />
        </svg>
      </div>

      {/* 2. Area Utama Footer Berwarna Biru Tua (#1e3a8a) */}
      <div className="bg-[#1e3a8a] text-white relative z-10 pt-4 pb-14">
        <div className="relative mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.4fr_0.8fr_1fr]">
            {/* Kolom Info Toko */}
            <div>
              <a href="#top" className="flex w-fit items-center gap-3">
                <span className="grid size-11 place-items-center rounded-[0.9rem] bg-bone text-[#1e3a8a]">
                  <svg
                    viewBox="0 0 64 64"
                    width="28"
                    height="28"
                    aria-hidden="true"
                  >
                    <path
                      d="M21 53c0-11 9-11 9-21S21 21 21 11"
                      fill="none"
                      stroke="#3c83f6"
                      strokeLinecap="round"
                      strokeWidth="6"
                    />
                    <path
                      d="M43 53c0-11-9-11-9-21s9-11 9-21"
                      fill="none"
                      stroke="#1e3a8a"
                      strokeLinecap="round"
                      strokeWidth="6"
                    />
                    <circle cx="32" cy="32" r="4" fill="#60a5fa" />
                  </svg>
                </span>
                <span>
                  <span className="block font-display text-xl font-bold tracking-[-0.03em] text-white">
                    {storeName}
                  </span>
                  <span className="mt-1 block text-[0.56rem] uppercase tracking-[0.24em] text-blue-200/60">
                    Rental mobil · Sukabumi
                  </span>
                </span>
              </a>
              <p className="mt-5 max-w-sm text-sm leading-7 text-blue-100/75">
                {store?.tagline ||
                  'Rental mobil harian di Sukabumi — lepas kunci atau dengan driver.'}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {storeWhatsApp ? (
                  <a
                    href={storeWhatsApp}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-bone/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#3c83f6] hover:text-white"
                  >
                    WhatsApp
                  </a>
                ) : null}
                {instagramUrl ? (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-bone/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#3c83f6] hover:text-white"
                  >
                    Instagram
                  </a>
                ) : null}
              </div>
            </div>

            {/* Kolom Navigasi */}
            <div>
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-blue-200/60">
                Navigasi
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-blue-100/80">
                <li>
                  <a
                    className="transition hover:text-white"
                    href="/"
                    onClick={(event) => handleNavigate(event, '/')}
                  >
                    Beranda
                  </a>
                </li>
                <li>
                  <a
                    className="transition hover:text-white"
                    href="/#tentang"
                    onClick={(event) => handleNavigate(event, '/#tentang')}
                  >
                    Tentang
                  </a>
                </li>
                <li>
                  <a
                    className="transition hover:text-white"
                    href="/products"
                    onClick={(event) => handleNavigate(event, '/products')}
                  >
                    Armada
                  </a>
                </li>
                <li>
                  <a
                    className="transition hover:text-white"
                    href="/#cara-sewa"
                    onClick={(event) => handleNavigate(event, '/#cara-sewa')}
                  >
                    Cara sewa
                  </a>
                </li>
              </ul>
            </div>

            {/* Kolom Kontak */}
            <div>
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-blue-200/60">
                Kontak
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-blue-100/80">
                <li>{store?.address || 'Jl. Raya Cibadak, Sukabumi, Jawa Barat'}</li>
                <li>
                  {store?.phone ? (
                    <a
                      href={storeWhatsApp || undefined}
                      target="_blank"
                      rel="noreferrer"
                      className="transition hover:text-white"
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

          {/* Bagian Bawah Footer */}
          <div className="mt-12 flex flex-col gap-3 border-t border-bone/15 pt-5 text-[0.56rem] uppercase tracking-[0.14em] text-blue-200/60 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {CURRENT_YEAR} {storeName}. Jalan jauh, tetap tenang.
            </p>
            <p>Sukabumi · Jawa Barat</p>
          </div>
        </div>
      </div>
    </footer>
  )
}