import Sidebar from '../components/sidebar/Sidebar'

export default function AdminLayout({
  activeTab,
  onTabChange,
  onLogout,
  store,
  children,
}) {
  return (
    <div className="min-h-screen bg-[#f0f9ff] text-ink">
      <div className="flex min-h-screen">
        <Sidebar
          active={activeTab}
          onChange={onTabChange}
          onLogout={onLogout}
          storeName={store?.storeName}
        />
        <main className="flex-1 overflow-x-hidden">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}