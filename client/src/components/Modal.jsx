import { useEffect, useId, useRef } from 'react'

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  children,
}) {
  const dialogRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className={`fixed inset-0 z-50 m-auto hidden w-[calc(100%-1.5rem)] ${SIZES[size]} max-h-[calc(100dvh-1.5rem)] overflow-hidden rounded-[1.75rem] border border-line/80 bg-bone p-0 text-ink shadow-lift backdrop:bg-ink/55 backdrop:backdrop-blur-[3px] open:flex open:flex-col`}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="flex min-h-0 flex-col">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-line/80 px-5 py-5 sm:px-7">
          <div>
            <h2
              className="font-display text-2xl font-semibold leading-[1.05] tracking-[-0.035em]"
              id={titleId}
            >
              {title}
            </h2>
            {description ? (
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-paper text-ink-soft transition hover:border-ink/40 hover:bg-paper-deep hover:text-ink"
            onClick={onClose}
            aria-label="Tutup dialog"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.8"
              />
            </svg>
          </button>
        </header>

        <div className="min-h-0 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          {children}
        </div>
      </div>
    </dialog>
  )
}
