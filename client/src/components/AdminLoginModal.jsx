import { useState } from 'react'
import Modal from './Modal'
import { api } from '../lib/api'

export default function AdminLoginModal({ open, onClose, onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (loading) return

    setLoading(true)
    setError('')
    try {
      const response = await api.login(email.trim(), password)
      if (!response?.token) {
        throw new Error(response?.message || 'Login gagal. Coba lagi.')
      }
      onSuccess(response)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Masuk sebagai admin"
      description="Kelola armada, tarif, kategori, dan informasi rental."
      size="sm"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error ? (
          <p
            className="rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm leading-6 text-danger"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div>
          <label
            className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-ink-soft"
            htmlFor="admin-email"
          >
            Email admin
          </label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@sukabumidrive.id"
            autoComplete="username"
            autoFocus
            required
            className="h-12 w-full rounded-xl border border-line bg-bone px-3.5 text-sm font-medium text-ink outline-none transition placeholder:text-muted/70 focus:border-rust/60"
          />
        </div>

        <div>
          <label
            className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-ink-soft"
            htmlFor="admin-password"
          >
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            className="h-12 w-full rounded-xl border border-line bg-bone px-3.5 text-sm font-medium text-ink outline-none transition placeholder:text-muted/70 focus:border-rust/60"
          />
        </div>

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-line bg-paper px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink-soft transition hover:border-ink/30 hover:bg-paper-deep"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-ink px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-bone transition hover:bg-rust disabled:opacity-60"
          >
            {loading ? 'Memeriksa…' : 'Masuk'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
