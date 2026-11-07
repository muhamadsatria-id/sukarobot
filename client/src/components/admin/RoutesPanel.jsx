import { useState } from 'react'
import ConfirmModal from '../ConfirmModal'
import AdminIcon from './AdminIcon'
import RouteFormModal from './RouteFormModal'
import { api } from '../../lib/api'
import {
  adminCardClass,
  adminDangerButtonClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from '../../lib/adminUi'

export default function RoutesPanel({ routes, token, onRefresh, onNotice }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRoute, setEditingRoute] = useState(null)
  const [confirmRoute, setConfirmRoute] = useState(null)
  const [busy, setBusy] = useState(false)

  async function handleDelete() {
    if (!confirmRoute) return
    setBusy(true)
    try {
      await api.deleteRoute(confirmRoute.id, token)
      const name = confirmRoute.name
      setConfirmRoute(null)
      await onRefresh?.()
      onNotice?.({ type: 'success', text: `Rute ${name} dihapus.` })
    } catch (err) {
      setConfirmRoute(null)
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
              Rute populer
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              {routes.length} rute tampil di bagian area layanan.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingRoute(null)
              setModalOpen(true)
            }}
            className={adminPrimaryButtonClass}
          >
            <AdminIcon name="plus" className="size-4" />
            Tambah rute
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {routes.length === 0 ? (
            <div className="py-12 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-xl bg-leaf/10 text-leaf">
                <AdminIcon name="route" className="size-6" />
              </span>
              <p className="mt-4 font-display text-xl font-semibold text-ink">
                Belum ada rute populer.
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
                Tambahkan tujuan favorit agar pengunjung tahu jangkauan
                layanan.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-line/80">
              {routes.map((route) => (
                <div
                  key={route.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-leaf/10 text-leaf">
                      <AdminIcon name="route" className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-ink">
                          {route.name}
                        </p>
                        {route.note ? (
                          <span className="rounded-full bg-paper px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.1em] text-ink-soft">
                            {route.note}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-0.5 text-xs text-muted">
                        {route.distance || 'Jarak belum diisi'}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRoute(route)
                        setModalOpen(true)
                      }}
                      className={adminSecondaryButtonClass}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmRoute(route)}
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

      <RouteFormModal
        open={modalOpen}
        route={editingRoute}
        token={token}
        onClose={() => setModalOpen(false)}
        onSaved={async (saved, previous) => {
          await onRefresh?.()
          onNotice?.({
            type: 'success',
            text: previous
              ? `Rute ${saved?.name || previous.name} diperbarui.`
              : `Rute ${saved?.name || ''} ditambahkan.`,
          })
        }}
      />

      <ConfirmModal
        open={Boolean(confirmRoute)}
        title="Hapus rute populer?"
        description={
          confirmRoute
            ? `${confirmRoute.name} akan dihapus dari bagian area layanan.`
            : ''
        }
        confirmLabel="Hapus rute"
        busy={busy}
        onClose={() => setConfirmRoute(null)}
        onConfirm={handleDelete}
      />
    </>
  )
}
