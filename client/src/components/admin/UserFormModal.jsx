import { useEffect, useState } from 'react'
import Modal from '../Modal'
import { api } from '../../lib/api'
import {
  adminInputClass,
  adminLabelClass,
  adminPrimaryButtonClass,
} from '../../lib/adminUi'

export default function UserFormModal({ open, user, token, onClose, onSaved }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      password: '',
    })
    setError('')
    setSaving(false)
  }, [open, user])

  async function handleSubmit(event) {
    event.preventDefault()
    if (saving) return

    setSaving(true)
    setError('')
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        ...(form.password ? { password: form.password } : {}),
      }
      const response = user
        ? await api.updateUser(user.id, payload, token)
        : await api.createUser(payload, token)
      onSaved?.(response?.data, user)
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
      title={user ? 'Ubah akun admin' : 'Tambah akun admin'}
      description="Akun ini dapat masuk ke panel admin dengan email dan password yang ditentukan."
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
          <label className={adminLabelClass} htmlFor="user-name">
            Nama
          </label>
          <input
            id="user-name"
            type="text"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            className={adminInputClass}
            placeholder="Nama pengguna"
            autoFocus
            required
          />
        </div>

        <div>
          <label className={adminLabelClass} htmlFor="user-email">
            Email
          </label>
          <input
            id="user-email"
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            className={adminInputClass}
            placeholder="nama@sukabumidrive.id"
            autoComplete="off"
            required
          />
        </div>

        <div>
          <label className={adminLabelClass} htmlFor="user-password">
            {user ? 'Password baru' : 'Password'}
          </label>
          <input
            id="user-password"
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                password: event.target.value,
              }))
            }
            className={adminInputClass}
            placeholder={user ? 'Kosongkan jika tidak diubah' : 'Minimal 6 karakter'}
            autoComplete="new-password"
            minLength={6}
            required={!user}
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
            {saving ? 'Menyimpan…' : user ? 'Simpan akun' : 'Tambah akun'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
