import { useEffect } from 'react'
import AdminIcon from '../admin/AdminIcon'

const ADMIN_TABS = [
  { id: 'products', label: 'Armada', icon: 'car' },
  { id: 'categories', label: 'Kategori', icon: 'tag' },
  { id: 'store', label: 'Info toko', icon: 'store' },
]

function Option({
  icon,
  label,
  active = false,
  danger = false,
  count,
  collapsed,
  title,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-current={active ? 'page' : undefined}
      className={`relative flex h-11 w-full items-center rounded-md border-l-2 transition-all duration-200 ${
        active
          ? 'border-leaf bg-leaf/10 text-leaf shadow-sm'
          : danger
            ? 'border-transparent text-danger/80 hover:bg-danger/10 hover:text-danger'
            : 'border-transparent text-ink-soft hover:bg-paper hover:text-ink'
      }`}
    >
      <span className="grid h-full w-12 shrink-0 place-content-center">
        <AdminIcon name={icon} className="size-[18px]" />
      </span>
      <span
        className={`truncate text-sm font-medium ${
          collapsed ? 'lg:hidden' : ''
        }`}
      >
        {label}
      </span>
      {count > 0 ? (
        <span
          className={`absolute right-2.5 flex min-w-5 items-center justify-center rounded-full bg-leaf px-1.5 py-0.5 text-[0.6rem] font-semibold leading-none text-white ${
            collapsed ? 'lg:hidden' : ''
          }`}
        >
          {count}
        </span>
      ) : null}
    </button>
  )
}

export default function Sidebar({
  active,
  onChange,
  onLogout,
  onViewSite,
  storeName,
  productCount = 0,
  categoryCount = 0,
  open = false,
  collapsed = false,
  onClose,
  onToggleCollapsed,
}) {
  useEffect(() => {
    if (!open) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  const counts = {
    products: productCount,
    categories: categoryCount,
  }

  return (
    <>
      {/* Overlay backdrop (mobile) */}
      <div
        onClick={() => onClose?.()}
        className={`fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />

      <aside
        aria-label="Navigasi admin"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] shrink-0 flex-col border-r border-line bg-bone shadow-2xl transition-[transform,width] duration-300 ease-in-out lg:sticky lg:inset-y-auto lg:left-auto lg:top-0 lg:z-auto lg:h-screen lg:max-w-none lg:translate-x-0 lg:shadow-sm ${
          collapsed ? 'lg:w-16' : 'lg:w-64'
        } ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Brand */}
        <div className={`border-b border-line px-2 pb-4 pt-2 ${collapsed ? 'lg:px-1' : ''}`}>
          <div className="flex items-center gap-3 rounded-md p-2">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-leaf to-rust-dark text-white shadow-sm">
              <AdminIcon name="car" className="size-5" strokeWidth={1.9} />
            </span>
            <div
              className={`min-w-0 flex-1 ${collapsed ? 'lg:hidden' : ''}`}
            >
              <span className="block truncate text-sm font-semibold text-ink">
                {storeName || 'Sukabumi Drive'}
              </span>
              <span className="block text-xs text-muted">Panel admin</span>
            </div>
            {/* <AdminIcon
              name="chevronDown"
              className={`size-4 shrink-0 text-muted ${
                collapsed ? 'lg:hidden' : ''
              }`}
            /> */}
            <button
              type="button"
              onClick={() => onClose?.()}
              className="grid size-8 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-paper hover:text-ink lg:hidden"
              aria-label="Tutup menu"
            >
              <AdminIcon name="close" className="size-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto px-2 py-4 ${collapsed ? 'lg:px-1' : ''}`}>
          <div className="mb-8 space-y-1">
            {ADMIN_TABS.map((item) => (
              <Option
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={active === item.id}
                count={counts[item.id]}
                collapsed={collapsed}
                title={collapsed ? item.label : undefined}
                onClick={() => {
                  onChange?.(item.id)
                  onClose?.()
                }}
              />
            ))}
          </div>

          <div className="border-t border-line pt-4">
            <div
              className={`px-3 py-2 text-[0.65rem] font-medium uppercase tracking-wide text-muted ${
                collapsed ? 'lg:hidden' : ''
              }`}
            >
              Akun
            </div>
            <Option
              icon="external"
              label="Lihat situs"
              collapsed={collapsed}
              title={collapsed ? 'Lihat situs' : undefined}
              onClick={() => {
                onClose?.()
                onViewSite?.()
              }}
            />
            <Option
              icon="logout"
              label="Keluar"
              danger
              collapsed={collapsed}
              title={collapsed ? 'Keluar' : undefined}
              onClick={() => {
                onClose?.()
                onLogout?.()
              }}
            />
          </div>
        </nav>

        {/* Collapse toggle (desktop) */}
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? 'Buka sidebar' : 'Tutup sidebar'}
          aria-expanded={!collapsed}
          className="hidden border-t border-line transition-colors hover:bg-paper lg:flex"
        >
          <span className="flex w-full items-center p-3">
            <span className="grid size-10 shrink-0 place-content-center">
              <AdminIcon
                name="chevronsRight"
                className={`size-4 text-muted transition-transform duration-300 ${
                  collapsed ? '' : 'rotate-180'
                }`}
              />
            </span>
            <span
              className={`text-sm font-medium text-ink-soft ${
                collapsed ? 'lg:hidden' : ''
              }`}
            >
              Sembunyikan
            </span>
          </span>
        </button>

        {/* Close (mobile) */}
        <button
          type="button"
          onClick={() => onClose?.()}
          className="flex items-center gap-3 border-t border-line p-3 text-sm font-medium text-ink-soft transition hover:bg-paper lg:hidden"
        >
          <span className="grid size-10 shrink-0 place-content-center">
            <AdminIcon name="close" className="size-4" />
          </span>
          Tutup menu
        </button>
      </aside>
    </>
  )
}
