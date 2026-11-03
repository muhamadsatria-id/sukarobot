export default function Header({
  store,
  whatsapp,
  adminMode = false,
  onAdminClick,
  onLogout,
}) {
  const storeName = store?.storeName || 'Sukabumi Drive'
  const hours = store?.operationalHours || '08.00–21.00 WIB'

  return (
    <>
      <a
        href="#armada"
        className="sr-only z-[60] rounded-full bg-ink px-4 py-2 text-sm font-semibold text-bone focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Lewati ke armada
      </a>

      <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] w-full max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <a
            href="#top"
            className="group flex shrink-0 items-center gap-3"
            aria-label={`${storeName} — kembali ke atas`}
          >
            <span className="grid size-10 place-items-center rounded-[0.85rem] bg-ink text-bone shadow-card transition group-hover:-rotate-3 group-hover:bg-moss">
              <svg viewBox="0 0 64 64" width="26" height="26" aria-hidden="true">
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
                  stroke="#f4f0e7"
                  strokeLinecap="round"
                  strokeWidth="6"
                />
                <circle cx="32" cy="32" r="4" fill="#d6a45a" />
              </svg>
            </span>
            <span className="hidden leading-none sm:block">
              <span className="block font-display text-[1.05rem] font-bold tracking-[-0.03em] text-ink">
                {storeName}
              </span>
              <span className="mt-1 block font-mono text-[0.58rem] font-medium uppercase tracking-[0.28em] text-muted">
                Rental mobil · Sukabumi
              </span>
            </span>
          </a>

          {!adminMode ? (
            <nav
              className="hidden items-center gap-7 text-sm font-semibold text-ink-soft lg:flex"
              aria-label="Navigasi utama"
            >
              <a className="transition hover:text-rust" href="#armada">
                Armada
              </a>
              <a className="transition hover:text-rust" href="#cara-sewa">
                Cara sewa
              </a>
              <a className="transition hover:text-rust" href="#area">
                Area layanan
              </a>
            </nav>
          ) : (
            <div className="hidden items-center gap-2 rounded-full border border-rust/25 bg-rust-soft px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-rust-dark sm:flex">
              <span className="size-1.5 rounded-full bg-rust" />
              Mode admin
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full border border-line bg-bone/70 px-3 py-2 text-[0.7rem] font-semibold text-ink-soft xl:flex">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-40" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              {hours}
            </span>

            {whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="hidden items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-bone transition hover:-translate-y-0.5 hover:bg-moss sm:flex"
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
                <span className="hidden md:inline">Pesan via WhatsApp</span>
                <span className="md:hidden">WhatsApp</span>
              </a>
            ) : null}

            <button
              type="button"
              onClick={adminMode ? onLogout : onAdminClick}
              className="rounded-full border border-line bg-bone/70 px-3 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-ink-soft transition hover:border-ink/30 hover:bg-bone hover:text-ink"
            >
              {adminMode ? 'Keluar' : 'Admin'}
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
