export default function Searchbar({ value, onChange }) {
  return (
    <div
      className="group relative flex min-h-[3.25rem] w-full items-center rounded-full border border-line bg-bone/80 px-4 shadow-[0_1px_0_rgba(20,33,29,0.03)] transition focus-within:border-leaf/60 focus-within:bg-bone focus-within:shadow-card"
      role="search"
    >
      <svg
        className="mr-3 size-5 shrink-0 text-muted transition group-focus-within:text-leaf"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        aria-hidden="true"
      >
        <circle
          cx="11"
          cy="11"
          r="6.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M16 16l4 4"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>

      <label className="sr-only" htmlFor="cari-mobil">
        Cari mobil
      </label>
      <input
        id="cari-mobil"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Cari nama mobil, kategori, atau tipe…"
        autoComplete="off"
        className="h-12 min-w-0 flex-1 bg-transparent text-sm font-medium text-ink outline-none placeholder:text-muted/80"
      />

      {value ? (
        <button
          type="button"
          className="ml-2 grid size-8 shrink-0 place-items-center rounded-full bg-paper-deep text-ink-soft transition hover:bg-rust hover:text-bone"
          onClick={() => onChange('')}
          aria-label="Hapus pencarian"
        >
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.9"
            />
          </svg>
        </button>
      ) : null}
    </div>
  )
}
