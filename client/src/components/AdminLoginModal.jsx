import { useState } from 'react'
import Modal from './Modal'
import { api } from '../lib/api'

function MacDots({ className = '' }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="size-2.5 rounded-full bg-[#1e3a8a] transition-transform duration-200 hover:scale-125" />
      <span className="size-2.5 rounded-full bg-[#3c83f6] transition-transform duration-200 hover:scale-125" />
      <span className="size-2.5 rounded-full bg-[#93c5fd] transition-transform duration-200 hover:scale-125" />
    </div>
  )
}

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
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const modalTitle = (
    <div>
      <MacDots className="mb-3" />
      <span>Masuk sebagai admin</span>
    </div>
  )

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={modalTitle}
      description="Kelola armada, tarif, kategori, dan informasi rental."
      size="sm"
    >
      <form className="mt-2 space-y-4" onSubmit={handleSubmit}>
        {error ? (
          <div
            className="flex items-center gap-2.5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm leading-6 text-danger shadow-sm"
            role="alert"
          >
            <MacDots />
            <span className="font-medium">{error}</span>
          </div>
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
            className="h-12 w-full rounded-xl border border-line bg-bone px-3.5 text-sm font-medium text-ink outline-none transition-all duration-200 placeholder:text-muted/70 focus:border-[#3c83f6] focus:ring-2 focus:ring-[#3c83f6]/20"
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
            className="h-12 w-full rounded-xl border border-line bg-bone px-3.5 text-sm font-medium text-ink outline-none transition-all duration-200 placeholder:text-muted/70 focus:border-[#3c83f6] focus:ring-2 focus:ring-[#3c83f6]/20"
          />
        </div>

        <div className="flex flex-col-reverse gap-2.5 pt-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-line bg-paper px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink-soft shadow-sm transition-all duration-200 hover:border-ink/30 hover:bg-paper-deep"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-bone shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#3c83f6] hover:shadow-lg disabled:opacity-60"
          >
            {loading ? 'Memeriksa…' : 'Masuk'}
          </button>
        </div>
      </form>
    </Modal>
  )
}