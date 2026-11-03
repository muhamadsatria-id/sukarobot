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
    <footer className="relative bg-[#f0f9ff] text-white select-none overflow-hidden pt-10">
      {/* 1. Siluet Atas: Profil Bodi Mobil Tampak Samping (Sedan/SUV Coupe) */}
      <div className="w-full overflow-hidden leading-none relative z-10 -mb-1">
        <svg
          className="relative block w-full h-24 sm:h-36 lg:h-44"
          viewBox="0 0 1200 160"
          preserveAspectRatio="none"
        >
          {/* Bayangan Siluet Lapisan Belakang */}
          <path
            d="M 0 160 L 40 160 C 60 160 80 145 110 135 C 160 120 230 115 320 115 Q 400 60 520 25 Q 700 20 840 65 C 920 90 980 110 1060 115 C 1120 120 1160 140 1180 160 L 1200 160 Z"
            fill="#3c83f6"
            fillOpacity="0.25"
          />
          {/* Siluet Utama Bodi Mobil Samping */}
          <path
            d="M 0 160 L 60 160 C 80 160 100 150 130 140 C 180 125 250 120 340 120 Q 420 65 540 30 Q 720 25 860 70 C 940 95 990 115 1070 120 C 1130 125 1165 145 1185 160 L 1200 160 Z"
            fill="#1e3a8a"
          />
          {/* Aksen Kaca Jendela Samping (Side Windows) */}
          <path
            d="M 400 108 Q 450 68 545 42 Q 700 38 820 72 C 800 108 720 108 400 108 Z"
            fill="#3c83f6"
            fillOpacity="0.3"
          />
          {/* Garis Pembatas Jendela Depan & Belakang (Pillar B) */}
          <line x1="620" y1="40" x2="620" y2="108" stroke="#1e3a8a" strokeWidth="4" />
        </svg>

        {/* Lampu Depan Samping (Headlight Side Glow) */}
        <div className="absolute top-[76%] left-[6%] sm:left-[9%] -translate-y-1/2">
          <div className="h-2 w-8 sm:w-14 rounded-full bg-cyan-300 shadow-[0_0_15px_#38bdf8] border border-white/60 animate-pulse" />
        </div>

        {/* Lampu Belakang Samping (Taillight Side Glow) */}
        <div className="absolute top-[76%] right-[5%] sm:right-[8%] -translate-y-1/2">
          <div className="h-2 w-6 sm:w-10 rounded-full bg-red-500 shadow-[0_0_15px_#ef4444]" />
        </div>
      </div>

      {/* 2. Area Utama Footer (Under Body & Chassis) */}
      <div className="bg-[#1e3a8a] text-white relative z-10 pt-4 pb-14">
        {/* Visual Roda / Velg Mobil Samping */}
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 relative -mt-10 mb-8 flex justify-between pointer-events-none">
          {/* Roda Depan */}
          <div className="ml-[10%] sm:ml-[14%] w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-slate-900 border-4 border-slate-700 shadow-xl flex items-center justify-center relative">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-dashed border-slate-400 animate-[spin_10s_linear_infinite]" />
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-400 absolute" />
          </div>

          {/* Roda Belakang */}
          <div className="mr-[8%] sm:mr-[12%] w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-slate-900 border-4 border-slate-700 shadow-xl flex items-center justify-center relative">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-dashed border-slate-400 animate-[spin_10s_linear_infinite]" />
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-400 absolute" />
          </div>
        </div>

        {/* Konten Utama */}
        <div className="relative mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.4fr_0.8fr_1fr]">
            {/* Kolom Info Toko */}
            <div>
              <a href="#top" className="flex w-fit items-center gap-3">
                <span className="grid size-11 place-items-center rounded-[0.9rem] bg-white text-[#1e3a8a]">
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
                    className="rounded-full bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#3c83f6] hover:text-white border border-white/10"
                  >
                    WhatsApp
                  </a>
                ) : null}
                {instagramUrl ? (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#3c83f6] hover:text-white border border-white/10"
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

          {/* Bagian Bawah: Garis Aspal & Copyright */}
          <div className="mt-12 pt-6 border-t border-dashed border-white/20 flex flex-col gap-3 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-blue-200/60 sm:flex-row sm:items-center sm:justify-between">
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