const ADMIN_TABS = [
  { id: 'products', label: 'Armada' },
  { id: 'categories', label: 'Kategori' },
  { id: 'store', label: 'Info toko' },
]

export default function Sidebar({ active, onChange, onLogout, storeName }) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-line bg-bone/80 backdrop-blur-md">
      <div className="border-b border-line px-5 py-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
          Panel admin
        </p>
        <p className="mt-2 text-lg font-semibold text-ink">
          {storeName || 'Sukabumi Drive'}
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Navigasi admin">
        {ADMIN_TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange?.(item.id)}
            className={`flex w-full items-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
              active === item.id
                ? 'bg-[#3c83f6] text-white shadow-sm'
                : 'text-ink-soft hover:bg-paper hover:text-[#3c83f6]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-semibold text-ink-soft transition hover:bg-paper hover:text-[#1e3a8a]"
        >
          Keluar
        </button>
      </div>
    </aside>
  )
}