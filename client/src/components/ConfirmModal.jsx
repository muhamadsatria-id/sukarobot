import Modal from './Modal'

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Hapus',
  danger = true,
  busy = false,
  onConfirm,
  onClose,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm leading-7 text-ink-soft">{description}</p>
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="rounded-full border border-line bg-paper px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink-soft transition hover:border-ink/30 hover:bg-paper-deep"
          onClick={onClose}
          disabled={busy}
        >
          Batal
        </button>
        <button
          type="button"
          className={`rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-bone transition disabled:opacity-60 ${
            danger ? 'bg-danger hover:bg-danger/90' : 'bg-ink hover:bg-rust'
          }`}
          onClick={onConfirm}
          disabled={busy}
        >
          {busy ? 'Memproses…' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
