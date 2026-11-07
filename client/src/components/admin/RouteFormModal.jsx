import { useEffect, useState } from 'react'
import Modal from '../Modal'
import { api } from '../../lib/api'
import {
  adminInputClass,
  adminLabelClass,
  adminPrimaryButtonClass,
} from '../../lib/adminUi'

export default function RouteFormModal({ open, route, token, onClose, onSaved }) {
  const [form, setForm] = useState({ name: '', note: '', distance: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setForm({
      name: route?.name || '',
      note: route?.note || '',
      distance: route?.distance || '',
    })
    setError('')
    setSaving(false)
  }, [open, route])

  async function handleSubmit(event) {
    event.preventDefault()
    if (saving) return
    setSaving(true)
    setError('')
    try {
      const payload = {
        name: form.name.trim(),
        note: form.note.trim(),
        distance: form.distance.trim(),
      }
      const response = route
        ? await api.updateRoute(route.id, payload, token)
        : await api.createRoute(payload, token)
      onSaved?.(response?.data, route)
      onClose?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={route ? 'Ubah rute populer' : 'Tambah rute populer'}
      description="Rute ini tampil di bagian Tentang & Area Layanan pada halaman utama."
      size="sm"
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
          <label className={adminLabelClass} htmlFor="route-name">
            Nama rute
          </label>
          <input
            id="route-name"
            type="text"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            className={adminInputClass}
            placeholder="Pelabuhan Ratu"
            autoFocus
            required
            maxLength={60}
          />
        </div>

        <div>
          <label className={adminLabelClass} htmlFor="route-note">
            Keterangan
          </label>
          <input
            id="route-note"
            type="text"
            value={form.note}
            onChange={(event) =>
              setForm((current) => ({ ...current, note: event.target.value }))
            }
            className={adminInputClass}
            placeholder="Pantai & liburan"
            maxLength={40}
          />
        </div>

        <div>
          <label className={adminLabelClass} htmlFor="route-distance">
            Jarak
          </label>
          <input
            id="route-distance"
            type="text"
            value={form.distance}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                distance: event.target.value,
              }))
            }
            className={adminInputClass}
            placeholder="± 60 km"
            maxLength={30}
          />
        </div>

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
            {saving ? 'Menyimpan…' : route ? 'Simpan rute' : 'Tambah rute'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
