export default function CategoryPills({ categories, active, total, onChange }) {
  const items = [
    { id: 'all', name: 'Semua', count: total },
    ...categories.map((category) => ({
      id: category.id,
      name: category.name,
      count: category.productCount,
    })),
  ]

  return (
    <div
      className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      role="group"
      aria-label="Filter kategori mobil"
    >
      {items.map((item) => {
        const isActive = active === item.id
        return (
          <button
            key={item.id}
            type="button"
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              isActive
                ? 'bg-ink text-bone shadow-card'
                : 'bg-bone/60 text-ink-soft hover:bg-bone'
            }`}
            aria-pressed={isActive}
            onClick={() => onChange(item.id)}
          >
            {item.name}
            {typeof item.count === 'number' ? (
              <span
                className={`text-[0.62rem] font-medium ${
                  isActive ? 'text-bone/60' : 'text-muted'
                }`}
              >
                {String(item.count).padStart(2, '0')}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
