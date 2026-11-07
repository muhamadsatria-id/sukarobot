import { useEffect, useState } from 'react'
import Modal from '../Modal'
import { api } from '../../lib/api'
import {
  adminInputClass,
  adminLabelClass,
  adminPrimaryButtonClass,
  adminTextareaClass,
} from '../../lib/adminUi'

const EMPTY_FORM = {
  quote: '',
  name: '',
  role: '',
  company: '',
  avatar: '',
}

export default function TestimonialFormModal({
  open,
  testimonial,
  token,
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setForm({
      quote: testimonial?.quote || '',
      name: testimonial?.name || '',
      role: testimonial?.role || '',
      company: testimonial?.company || '',
      avatar: testimonial?.avatar || '',
    })
    setError('')
    setSaving(false)
  }, [open, testimonial])

  async function handleSubmit(event) {
    event.preventDefault()
    if (saving) return
    setSaving(true)
    setError('')
    try {
      const payload = {
        quote: form.quote.trim(),
        name: form.name.trim(),
        role: form.role.trim(),
        company: form.company.trim(),
        avatar: form.avatar.trim(),
      }
      const response = testimonial
        ? await api.updateTestimonial(testimonial.id, payload, token)
        : await api.createTestimonial(payload, token)
      onSaved?.(response?.data, testimonial)
      onClose?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={testimonial ? 'Ubah testimoni' : 'Tambah testimoni'}
      description="Testimoni tampil di bagian kata mereka yang sudah jalan."
      size="md"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error ? (
          <div
            role="alert"
            className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-medium text-danger"
          >
            {error}
          </div>
        ) : null}

        <div>
          <label className={adminLabelClass} htmlFor="testi-quote">
            Isi testimoni
          </label>
          <textarea
            id="testi-quote"
            value={form.quote}
            onChange={(event) => update('quote', event.target.value)}
            className={adminTextareaClass}
            placeholder="Cerita singkat pelanggan…"
            autoFocus
            required
            maxLength={400}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={adminLabelClass} htmlFor="testi-name">
              Nama
            </label>
            <input
              id="testi-name"
              type="text"
              value={form.name}
              onChange={(event) => update('name', event.target.value)}
              className={adminInputClass}
              placeholder="Rina Kusuma"
              required
              maxLength={60}
            />
          </div>
          <div>
            <label className={adminLabelClass} htmlFor="testi-role">
              Peran
            </label>
            <input
              id="testi-role"
              type="text"
              value={form.role}
              onChange={(event) => update('role', event.target.value)}
              className={adminInputClass}
              placeholder="Karyawan"
              maxLength={40}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={adminLabelClass} htmlFor="testi-company">
              Kota / asal
            </label>
            <input
              id="testi-company"
              type="text"
              value={form.company}
              onChange={(event) => update('company', event.target.value)}
              className={adminInputClass}
              placeholder="Bandung"
              maxLength={40}
            />
          </div>
          <div>
            <label className={adminLabelClass} htmlFor="testi-avatar">
              URL foto
            </label>
            <input
              id="testi-avatar"
              type="url"
              value={form.avatar}
              onChange={(event) => update('avatar', event.target.value)}
              className={adminInputClass}
              placeholder="https://…"
            />
          </div>
        </div>

        {form.avatar ? (
          <div className="flex items-center gap-3 rounded-xl bg-paper/60 p-3">
            <img
              src={form.avatar}
              alt=""
              className="size-10 rounded-full object-cover"
            />
            <p className="text-[0.7rem] text-muted">
              Pratinjau foto testimoni.
            </p>
          </div>
        ) : null}

        <div className="flex flex-col-reverse gap-2.5 border-t border-line/80 pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-line bg-paper px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink-soft transition hover:bg-paper-deep"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className={adminPrimaryButtonClass}
          >
            {saving
              ? 'Menyimpan…'
              : testimonial
                ? 'Simpan testimoni'
                : 'Tambah testimoni'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
