import { useState } from 'react'
import ConfirmModal from '../ConfirmModal'
import AdminIcon from './AdminIcon'
import TestimonialFormModal from './TestimonialFormModal'
import { api } from '../../lib/api'
import {
  adminCardClass,
  adminDangerButtonClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from '../../lib/adminUi'

function initials(name) {
  return String(name || 'T')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export default function TestimonialsPanel({
  testimonials,
  token,
  onRefresh,
  onNotice,
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState(null)
  const [confirmTestimonial, setConfirmTestimonial] = useState(null)
  const [busy, setBusy] = useState(false)

  async function handleDelete() {
    if (!confirmTestimonial) return
    setBusy(true)
    try {
      await api.deleteTestimonial(confirmTestimonial.id, token)
      const name = confirmTestimonial.name
      setConfirmTestimonial(null)
      await onRefresh?.()
      onNotice?.({ type: 'success', text: `Testimoni ${name} dihapus.` })
    } catch (err) {
      setConfirmTestimonial(null)
      onNotice?.({ type: 'error', text: err.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <section className={adminCardClass}>
        <div className="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-display text-lg font-semibold tracking-[-0.02em] text-ink">
              Testimoni
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              {testimonials.length} cerita pelanggan tampil di halaman utama.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingTestimonial(null)
              setModalOpen(true)
            }}
            className={adminPrimaryButtonClass}
          >
            <AdminIcon name="plus" className="size-4" />
            Tambah testimoni
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {testimonials.length === 0 ? (
            <div className="py-12 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-xl bg-leaf/10 text-leaf">
                <AdminIcon name="quote" className="size-6" />
              </span>
              <p className="mt-4 font-display text-xl font-semibold text-ink">
                Belum ada testimoni.
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
                Tambahkan cerita pelanggan untuk menambah kepercayaan
                pengunjung.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-line/80">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="flex min-w-0 gap-3">
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="size-10 shrink-0 rounded-full border border-line object-cover"
                      />
                    ) : (
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-leaf/10 text-xs font-bold text-leaf">
                        {initials(testimonial.name)}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink">
                        {testimonial.name}
                      </p>
                      <p className="text-[0.68rem] text-muted">
                        {[testimonial.role, testimonial.company]
                          .filter(Boolean)
                          .join(' / ')}
                      </p>
                      <p className="mt-1 line-clamp-2 max-w-2xl text-xs leading-5 text-ink-soft">
                        “{testimonial.quote}”
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTestimonial(testimonial)
                        setModalOpen(true)
                      }}
                      className={adminSecondaryButtonClass}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmTestimonial(testimonial)}
                      className={adminDangerButtonClass}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <TestimonialFormModal
        open={modalOpen}
        testimonial={editingTestimonial}
        token={token}
        onClose={() => setModalOpen(false)}
        onSaved={async (saved, previous) => {
          await onRefresh?.()
          onNotice?.({
            type: 'success',
            text: previous
              ? `Testimoni ${saved?.name || previous.name} diperbarui.`
              : `Testimoni ${saved?.name || ''} ditambahkan.`,
          })
        }}
      />

      <ConfirmModal
        open={Boolean(confirmTestimonial)}
        title="Hapus testimoni?"
        description={
          confirmTestimonial
            ? `Testimoni dari ${confirmTestimonial.name} akan dihapus dari halaman utama.`
            : ''
        }
        confirmLabel="Hapus testimoni"
        busy={busy}
        onClose={() => setConfirmTestimonial(null)}
        onConfirm={handleDelete}
      />
    </>
  )
}
