const ROUTES = [
  { name: 'Pelabuhan Ratu', note: 'Pantai & liburan', distance: '± 60 km' },
  { name: 'Cibadak', note: 'Dalam kota', distance: '± 20 km' },
  { name: 'Bogor', note: 'Luar kota', distance: '± 90 km' },
  { name: 'Bandung', note: 'Luar kota', distance: '± 120 km' },
  { name: 'Jakarta', note: 'Antar-jemput', distance: '± 130 km' },
]

export default function AreaSection() {
  return (
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
            Basis kami di Cibadak, Sukabumi. Antar-jemput bisa diatur untuk dalam
            kota, luar kota, stasiun, terminal, hotel, sampai bandara.
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
  )
}
