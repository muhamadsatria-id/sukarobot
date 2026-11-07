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
          <div className="h-2 w-8 sm:w-14 rounded-full bg-blue-200 shadow-[0_0_15px_#93c5fd] border border-white/60 animate-pulse" />
        </div>

        {/* Lampu Belakang Samping (Taillight Side Glow) */}
        <div className="absolute top-[76%] right-[5%] sm:right-[8%] -translate-y-1/2">
          <div className="h-2 w-6 sm:w-10 rounded-full bg-blue-400 shadow-[0_0_15px_#60a5fa]" />
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

              <div className="mt-6 flex flex-wrap gap-2.5">
                {storeWhatsApp ? (
                  <a
                    href={storeWhatsApp}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                    title="WhatsApp"
                    className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#3c83f6] hover:text-white"
                  >
                    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.763.459 3.486 1.332 5.001L2 22l5.12-1.341c1.464.798 3.116 1.218 4.887 1.219h.005c5.507 0 9.991-4.479 9.992-9.986.001-2.668-1.036-5.176-2.923-7.062A9.924 9.924 0 0 0 12.012 2zm5.787 14.284c-.244.687-1.42 1.312-1.96 1.392-.497.073-1.144.103-3.32-.8-2.784-1.155-4.57-3.987-4.708-4.173-.138-.186-1.127-1.503-1.127-2.866 0-1.363.708-2.033.96-2.308.244-.265.534-.331.713-.331.18 0 .359.002.516.01.166.008.391-.063.612.467.226.541.768 1.874.836 2.011.068.138.114.298.023.48-.091.182-.138.298-.274.461-.137.162-.288.363-.411.488-.137.137-.28.286-.121.558.159.272.706 1.166 1.516 1.887 1.041.927 1.919 1.214 2.191 1.352.272.138.431.114.59-.068.159-.182.684-.796.866-1.069.182-.273.364-.227.612-.137.248.09 1.572.741 1.844.877.272.137.454.205.522.319.068.115.068.666-.176 1.353z" />
                    </svg>
                  </a>
                ) : null}

                {instagramUrl ? (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    title="Instagram"
                    className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#3c83f6] hover:text-white"
                  >
                    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.95c-3.15 0-3.5.01-4.74.07-.9.04-1.39.19-1.71.32-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.13.32-.28.81-.32 1.71-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.04.9.19 1.39.32 1.71.17.43.37.74.69 1.06.32.32.63.52 1.06.69.32.13.81.28 1.71.32 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c.9-.04 1.39-.19 1.71-.32.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.13-.32.28-.81.32-1.71.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.04-.9-.19-1.39-.32-1.71a2.85 2.85 0 0 0-.69-1.06 2.85 2.85 0 0 0-1.06-.69c-.32-.13-.81-.28-1.71-.32-1.24-.06-1.59-.07-4.74-.07zm0 3.32a4.57 4.57 0 1 1 0 9.14 4.57 4.57 0 0 1 0-9.14zm0 7.54a2.97 2.97 0 1 0 0-5.94 2.97 2.97 0 0 0 0 5.94zm5.82-7.74a1.07 1.07 0 1 1-2.14 0 1.07 1.07 0 0 1 2.14 0z" />
                    </svg>
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
                    href="/#area"
                    onClick={(event) => handleNavigate(event, '/#area')}
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
          <div className="mt-12 pt-6 border-t border-dashed border-white/20 flex flex-col gap-3 text-[0.56rem] uppercase tracking-[0.14em] text-blue-200/60 sm:flex-row sm:items-center sm:justify-between">
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