import { useState } from 'react'

const NAV_LINKS = [
  { name: 'Beranda', path: '/' },
  { name: 'Tentang', path: '/#tentang' },
  { name: 'Armada', path: '/products' },
]

export default function Navbar({
  whatsapp,
  activePath = '/',
  onNavigate,
}) {
  const [open, setOpen] = useState(false)

  const isActive = (path) => activePath === path

  function handleNavigate(event, path) {
    event.preventDefault()
    setOpen(false)
    onNavigate?.(path)
  }

  return (
    <>
      <a
        href="/#armada"
        onClick={(event) => handleNavigate(event, '/#armada')}
        className="sr-only z-[60] rounded-full bg-ink px-4 py-2 text-sm font-semibold text-bone focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Lewati ke armada
      </a>

      <header className="fixed inset-x-0 top-0 z-50">
        {/* Desktop navbar */}
        <div className="pointer-events-auto hidden justify-center px-6 pt-5 md:flex lg:px-12">
          <nav className="flex w-full max-w-fit items-center space-x-2 rounded-full border border-line bg-bone/80 px-4 py-2 shadow-lg shadow-[0_18px_44px_-32px_rgba(15,39,68,0.28)] backdrop-blur-md transition-all">
            <div className="flex items-center space-x-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={(event) => handleNavigate(event, link.path)}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-leaf font-semibold text-white shadow-sm'
                      : 'text-leaf hover:bg-leaf/10'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="mx-1 h-4 w-[1px] bg-line" />

            {whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#3c83f6] px-5 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-blue-600 hover:shadow-blue-500/20 active:scale-95"
              >
                Pesan via WhatsApp
              </a>
            ) : null}
          </nav>
        </div>

        {/* Mobile toggle */}
        <div className="fixed right-5 top-5 z-[60] md:hidden">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-full border border-line bg-bone/80 p-3.5 text-ink shadow-md backdrop-blur-md transition-transform duration-200 active:scale-90 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {open ? (
              <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f0f9ff]/95 px-8 text-center backdrop-blur-2xl transition-all duration-300 ease-in-out md:hidden ${
            open
              ? 'pointer-events-auto scale-100 opacity-100'
              : 'pointer-events-none scale-95 opacity-0'
          }`}
        >
          <div className="flex w-full max-w-xs flex-col items-center space-y-6">
            {NAV_LINKS.map((link, index) => (
              <a
                key={link.name}
                href={link.path}
                onClick={(event) => handleNavigate(event, link.path)}
                aria-current={isActive(link.path) ? 'page' : undefined}
                style={{ transitionDelay: open ? `${index * 50}ms` : '0ms' }}
                className={`transform text-3xl font-extrabold tracking-wide transition-all duration-300 ${
                  open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                } ${
                  isActive(link.path)
                    ? 'scale-110 text-leaf'
                    : 'text-leaf/80 hover:scale-105 hover:text-leaf'
                }`}
              >
                {link.name}
                {isActive(link.path) ? (
                  <div className="mx-auto mt-2 h-1 w-8 rounded-full bg-leaf" />
                ) : null}
              </a>
            ))}

            {whatsapp ? (
              <div
                style={{
                  transitionDelay: open ? `${NAV_LINKS.length * 50}ms` : '0ms',
                }}
                className={`w-full transform transition-all duration-300 ${
                  open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
              >
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="inline-block w-full rounded-full bg-[#3c83f6] px-6 py-4 text-lg font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-600 active:scale-95"
                >
                  Pesan via WhatsApp
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </header>
    </>
  )
}
