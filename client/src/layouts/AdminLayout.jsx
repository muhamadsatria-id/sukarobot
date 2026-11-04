import { useCallback, useEffect, useState } from 'react'
import Sidebar from '../components/sidebar/Sidebar'

export default function AdminLayout({
  activeTab,
  onTabChange,
  onLogout,
  onViewSite,
  store,
  productCount,
  categoryCount,
  children,
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  // Tutup drawer mobile saat layar melebar ke desktop.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)')
    const handleChange = () => {
      if (query.matches) setMobileOpen(false)
    }
    query.addEventListener('change', handleChange)
    handleChange()
    return () => query.removeEventListener('change', handleChange)
  }, [])

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="flex min-h-screen">
        <Sidebar
          active={activeTab}
          onChange={onTabChange}
          onLogout={onLogout}
          onViewSite={onViewSite}
          storeName={store?.storeName}
          productCount={productCount}
          categoryCount={categoryCount}
          open={mobileOpen}
          collapsed={collapsed}
          onClose={closeMobile}
          onToggleCollapsed={() => setCollapsed((value) => !value)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar khusus mobile */}
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-bone/90 px-4 py-3 backdrop-blur-md lg:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="grid size-10 place-items-center rounded-xl border border-line bg-bone text-ink shadow-sm transition hover:bg-paper"
              aria-label="Buka menu admin"
              aria-expanded={mobileOpen}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="min-w-0">
              <p className="text-[0.55rem] font-bold uppercase tracking-[0.18em] text-muted">
                Panel admin
              </p>
              <p className="truncate text-sm font-semibold text-ink">
                {store?.storeName || 'Sukabumi Drive'}
              </p>
            </div>
          </header>

          <main className="flex-1">
            <div className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
