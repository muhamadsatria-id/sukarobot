import { useCallback, useEffect, useState } from 'react'
import ConfirmModal from '../ConfirmModal'
import AdminIcon from './AdminIcon'
import UserFormModal from './UserFormModal'
import { api } from '../../lib/api'
import {
  adminCardClass,
  adminDangerButtonClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from '../../lib/adminUi'

function initials(name) {
  return String(name || 'A')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export default function UsersPanel({ token, onNotice }) {
  const [users, setUsers] = useState([])
  const [currentUserId, setCurrentUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [confirmUser, setConfirmUser] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.getUsers(token)
      setUsers(response?.data ?? [])
      setCurrentUserId(response?.currentUserId ?? null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  async function handleDelete() {
    if (!confirmUser) return
    setBusy(true)
    try {
      await api.deleteUser(confirmUser.id, token)
      setConfirmUser(null)
      await load()
      onNotice?.({
        type: 'success',
        text: `Akun ${confirmUser.email} dihapus.`,
      })
    } catch (err) {
      setConfirmUser(null)
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
              Pengguna admin
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              {users.length} akun dapat mengakses panel ini.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingUser(null)
              setModalOpen(true)
            }}
            className={adminPrimaryButtonClass}
          >
            <AdminIcon name="plus" className="size-4" />
            Tambah pengguna
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {error ? (
            <div
              role="alert"
              className="mb-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-medium text-danger"
            >
              {error}
            </div>
          ) : null}

          {loading ? (
            <p className="py-8 text-center text-sm text-muted">
              Memuat akun…
            </p>
          ) : users.length === 0 ? (
            <div className="py-12 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-xl bg-leaf/10 text-leaf">
                <AdminIcon name="users" className="size-6" />
              </span>
              <p className="mt-4 font-display text-xl font-semibold text-ink">
                Belum ada akun admin.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-line/80">
              {users.map((user) => {
                const isSelf = user.id === currentUserId
                return (
                  <div
                    key={user.id}
                    className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-leaf/10 text-xs font-bold text-leaf ring-1 ring-leaf/20">
                        {initials(user.name)}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-semibold text-ink">
                            {user.name}
                          </p>
                          {isSelf ? (
                            <span className="rounded-full bg-leaf/10 px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.1em] text-leaf">
                              Akun ini
                            </span>
                          ) : null}
                        </div>
                        <p className="truncate text-xs text-muted">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUser(user)
                          setModalOpen(true)
                        }}
                        className={adminSecondaryButtonClass}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmUser(user)}
                        disabled={isSelf || users.length <= 1}
                        title={
                          isSelf
                            ? 'Tidak bisa menghapus akun yang sedang dipakai'
                            : undefined
                        }
                        className={adminDangerButtonClass}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <UserFormModal
        open={modalOpen}
        user={editingUser}
        token={token}
        onClose={() => setModalOpen(false)}
        onSaved={async (saved, previous) => {
          await load()
          const emailChanged =
            previous?.id === saved?.id &&
            previous?.email &&
            saved?.email &&
            previous.email !== saved.email
          onNotice?.({
            type: 'success',
            text:
              emailChanged && saved.id === currentUserId
                ? 'Akun sendiri diperbarui. Gunakan email baru saat masuk berikutnya.'
                : `Akun ${saved?.email || previous?.email || ''} disimpan.`,
          })
        }}
      />

      <ConfirmModal
        open={Boolean(confirmUser)}
        title="Hapus akun admin?"
        description={
          confirmUser
            ? `${confirmUser.name} (${confirmUser.email}) tidak akan bisa masuk lagi ke panel admin.`
            : ''
        }
        confirmLabel="Hapus akun"
        busy={busy}
        onClose={() => setConfirmUser(null)}
        onConfirm={handleDelete}
      />
    </>
  )
}
