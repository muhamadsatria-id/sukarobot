import { useEffect, useState } from 'react'
import ConfirmModal from './ConfirmModal'
import ProductFormModal from './ProductFormModal'
import { api, formatPrice } from '../lib/api'
import { onImageError, productImage } from '../lib/images'
import AdminIcon from './admin/AdminIcon'

const inputClass =
  'h-12 w-full rounded-xl border border-line bg-bone px-3.5 text-sm font-medium text-ink outline-none transition duration-200 placeholder:text-muted/70 focus:border-[#3c83f6] focus:ring-2 focus:ring-[#3c83f6]/20'
const labelClass =
  'mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-ink-soft'

function storeToForm(store) {
  return {
    storeName: store?.storeName ?? '',
    tagline: store?.tagline ?? '',
    address: store?.address ?? '',
    phone: store?.phone ?? '',
    slug: store?.slug ?? '',
    currency: store?.currency ?? 'IDR',
    operationalHours: store?.operationalHours ?? '',
    instagram: store?.instagram ?? '',
    rentalNote: store?.rentalNote ?? '',
    activeWhatsApp:
      store?.activeWhatsApp === 'true' || store?.activeWhatsApp === true,
  }
}

function StatusBadge({ status }) {
  const available = status === 'Tersedia'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${
        available
          ? 'bg-[#dbeafe] text-[#1d4ed8] hover:bg-[#bfdbfe]'
          : 'bg-[#fef3c7] text-[#b45309] hover:bg-[#fde68a]'
      }`}
    >
      <span
        className={`size-1.5 rounded-full animate-pulse ${
          available ? 'bg-[#1d4ed8]' : 'bg-[#d97706]'
        }`}
      />
      {available ? 'Tersedia' : 'Disewa'}
    </span>
  )
}

export default function AdminDashboard({
  token,
  store,
  products,
  categories,
  onRefresh,
  tab: tabProp,
}) {
  const tab = tabProp ?? 'products'
  const [editing, setEditing] = useState(undefined)
  const [confirm, setConfirm] = useState(null)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState(null)
  const [newCategory, setNewCategory] = useState('')
  const [editingCategory, setEditingCategory] = useState(null)
  const [storeForm, setStoreForm] = useState(() => storeToForm(store))
  const [savingStore, setSavingStore] = useState(false)

  // Notifikasi otomatis hilang setelah beberapa detik.
  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(null), 4500)
    return () => window.clearTimeout(timer)
  }, [notice])

  async function run(action, successText) {
    setBusy(true)
    setNotice(null)
    try {
      await action()
      await onRefresh()
      setNotice({ type: 'success', text: successText })
      return true
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
      return false
    } finally {
      setBusy(false)
    }
  }

  async function handleToggle(product) {
    await run(
      () => api.toggleProduct(product.id, token),
      `${product.name} ditandai ${
        product.stockStatus === 'Tersedia' ? 'sedang disewa' : 'tersedia'
      }.`,
    )
  }

  async function handleDeleteProduct(product) {
    const ok = await run(
      () => api.deleteProduct(product.id, token),
      `${product.name} dihapus dari armada.`,
    )
    if (ok) setConfirm(null)
  }

  async function handleAddCategory(event) {
    event.preventDefault()
    if (!newCategory.trim() || busy) return
    const ok = await run(
      () => api.createCategory(newCategory.trim(), token),
      'Kategori baru ditambahkan.',
    )
    if (ok) setNewCategory('')
  }

  async function handleRenameCategory(event) {
    event.preventDefault()
    if (!editingCategory?.name?.trim() || busy) return
    const ok = await run(
      () =>
        api.updateCategory(
          editingCategory.id,
          editingCategory.name.trim(),
          token,
        ),
      'Nama kategori diperbarui.',
    )
    if (ok) setEditingCategory(null)
  }

  async function handleDeleteCategory(category) {
    if (category.productCount > 0) {
      setNotice({
        type: 'error',
        text: 'Kategori masih dipakai mobil. Pindahkan mobil ke kategori lain dulu.',
      })
      return
    }
    const ok = await run(
      () => api.deleteCategory(category.id, token),
      `Kategori ${category.name} dihapus.`,
    )
    if (ok) setConfirm(null)
  }

  async function handleSaveStore(event) {
    event.preventDefault()
    if (busy || savingStore) return
    setSavingStore(true)
    setNotice(null)
    try {
      const response = await api.saveStore(
        {
          ...storeForm,
          activeWhatsApp: Boolean(storeForm.activeWhatsApp),
        },
        token,
      )
      setStoreForm(storeToForm(response?.data ?? storeForm))
      await onRefresh()
      setNotice({ type: 'success', text: 'Informasi toko disimpan.' })
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    } finally {
      setSavingStore(false)
    }
  }

  const readyCount = products.filter(
    (product) => product.stockStatus === 'Tersedia',
  ).length
  const rentedCount = products.length - readyCount

  const readyPercent = products.length
    ? Math.round((readyCount / products.length) * 100)
    : 0
  const rentedPercent = products.length ? 100 - readyPercent : 0
  const topProducts = [...products]
    .sort((a, b) => Number(b.price) - Number(a.price))
    .slice(0, 4)
  const initials = (store?.storeName || 'Sukabumi Drive')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  const stats = [
    {
      label: 'Total unit',
      value: products.length,
      note: 'Armada terdaftar',
      icon: 'car',
    },
    {
      label: 'Tersedia',
      value: readyCount,
      note: `${readyPercent}% siap disewa`,
      icon: 'check',
    },
    {
      label: 'Disewa',
      value: rentedCount,
      note: rentedCount ? 'Sedang berjalan' : 'Tidak ada unit disewa',
      icon: 'clock',
    },
    {
      label: 'Kategori',
      value: categories.length,
      note: 'Kelompok armada',
      icon: 'layers',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-leaf">
            Panel admin
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold leading-tight tracking-[-0.04em] text-ink sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Selamat datang kembali. Kelola armada dan informasi toko dari satu
            tempat.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            title={`${rentedCount} mobil sedang disewa`}
            className="relative grid size-10 place-items-center rounded-xl border border-line bg-bone text-ink-soft shadow-sm transition hover:bg-paper hover:text-ink"
          >
            <AdminIcon name="bell" className="size-4" />
            {rentedCount > 0 ? (
              <span className="absolute right-2 top-2 size-2 rounded-full bg-danger ring-2 ring-bone" />
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => onRefresh()}
            title="Muat ulang data"
            className="grid size-10 place-items-center rounded-xl border border-line bg-bone text-ink-soft shadow-sm transition hover:-translate-y-0.5 hover:bg-paper hover:text-ink"
          >
            <AdminIcon name="refresh" className="size-4" />
          </button>
          <div
            title={store?.storeName || 'Sukabumi Drive'}
            className="grid size-10 place-items-center rounded-xl bg-leaf/10 text-xs font-bold text-leaf ring-1 ring-leaf/20"
          >
            {initials}
          </div>
        </div>
      </header>

      {notice ? (
        <div
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
            notice.type === 'success'
              ? 'border-success/30 bg-success/10 text-success'
              : 'border-danger/30 bg-danger/10 text-danger'
          }`}
          role="status"
        >
          <span className="size-2 shrink-0 rounded-full bg-current" />
          <span className="min-w-0 flex-1 font-medium">{notice.text}</span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Tutup notifikasi"
            className="grid size-7 shrink-0 place-items-center rounded-lg opacity-60 transition hover:bg-white/50 hover:opacity-100"
          >
            <AdminIcon name="close" className="size-4" />
          </button>
        </div>
      ) : null}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-line bg-bone p-4 shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-lift sm:p-5"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-10 place-items-center rounded-lg bg-leaf/10 text-leaf">
                <AdminIcon name={stat.icon} className="size-5" />
              </span>
              <AdminIcon name="trending" className="size-4 text-leaf/60" />
            </div>
            <p className="mt-4 text-xs font-medium text-muted">{stat.label}</p>
            <p className="mt-1 font-display text-2xl font-semibold tracking-[-0.04em] text-ink">
              {stat.value}
            </p>
            <p className="mt-1 text-[0.7rem] text-muted">{stat.note}</p>
          </div>
        ))}
      </div>

      {/* TAB 1: DAFTAR MOBIL */}
      {tab === 'products' ? (
        <div className="grid gap-6 xl:grid-cols-3">
          <section className="rounded-xl border border-line bg-bone shadow-card xl:col-span-2">
            <div className="flex flex-col gap-3 border-b border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="font-display text-lg font-semibold tracking-[-0.02em] text-ink">
                  Daftar mobil
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  {products.length} unit terdaftar di armada.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="inline-flex w-fit items-center gap-2 rounded-lg bg-leaf px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-rust-dark"
              >
                <AdminIcon name="plus" className="size-4" />
                Tambah mobil
              </button>
            </div>

            {products.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-xl bg-leaf/10 text-leaf">
                  <AdminIcon name="car" className="size-6" />
                </span>
                <p className="mt-4 font-display text-xl font-semibold text-ink">
                  Armada masih kosong.
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
                  Tambahkan mobil pertama beserta tarif harian dan spesifikasi
                  utamanya.
                </p>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="mt-5 rounded-lg bg-leaf px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-rust-dark"
                >
                  Tambah mobil
                </button>
              </div>
            ) : (
              <div className="divide-y divide-line/80">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="group flex flex-col gap-4 px-5 py-4 transition duration-200 hover:bg-paper/40 sm:flex-row sm:items-center sm:px-6"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-paper-deep">
                        <img
                          src={productImage(product)}
                          alt={product.name}
                          onError={onImageError}
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-base font-semibold tracking-[-0.02em] text-ink">
                            {product.name}
                          </h3>
                          <StatusBadge status={product.stockStatus} />
                        </div>
                        <p className="mt-1 text-[0.7rem] leading-5 text-muted">
                          {product.categoryName}
                          {product.modelYear ? ` · ${product.modelYear}` : ''}
                          {' · '}
                          {product.transmission}
                          {' · '}
                          {product.seats} kursi
                          {' · '}
                          {product.fuel}
                        </p>
                        <p className="mt-0.5 text-[0.68rem] font-medium text-ink-soft">
                          {formatPrice(product.price, store?.currency)}
                          /hari
                          {product.driverFee
                            ? ` · driver ${formatPrice(product.driverFee, store?.currency)}`
                            : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={product.stockStatus === 'Tersedia'}
                        aria-label={`Status ${product.name}: ${product.stockStatus}`}
                        title={
                          product.stockStatus === 'Tersedia'
                            ? 'Tandai sedang disewa'
                            : 'Tandai tersedia'
                        }
                        onClick={() => handleToggle(product)}
                        disabled={busy}
                        className="flex items-center gap-2 rounded-lg border border-line bg-paper px-2.5 py-1.5 transition duration-200 hover:border-ink/30 hover:bg-paper-deep disabled:opacity-50"
                      >
                        <span
                          className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${
                            product.stockStatus === 'Tersedia'
                              ? 'bg-leaf'
                              : 'bg-line-strong'
                          }`}
                        >
                          <span
                            className={`absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                              product.stockStatus === 'Tersedia'
                                ? 'translate-x-4'
                                : ''
                            }`}
                          />
                        </span>
                        <span className="text-[0.6rem] font-bold uppercase tracking-[0.08em] text-ink-soft">
                          {product.stockStatus === 'Tersedia'
                            ? 'Tersedia'
                            : 'Disewa'}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(product)}
                        className="rounded-lg border border-line bg-bone px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.08em] text-ink transition duration-200 hover:border-ink/30 hover:bg-paper"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setConfirm({
                            type: 'product',
                            item: product,
                            title: 'Hapus mobil?',
                            description: `${product.name} akan dihapus permanen dari armada.`,
                            confirmLabel: 'Hapus mobil',
                          })
                        }
                        className="rounded-lg border border-danger/20 bg-danger/5 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.08em] text-danger transition duration-200 hover:bg-danger/15"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-xl border border-line bg-bone p-5 shadow-card">
              <h2 className="font-display text-lg font-semibold tracking-[-0.02em] text-ink">
                Ringkasan
              </h2>
              <div className="mt-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Tersedia</span>
                    <span className="font-semibold text-ink">
                      {readyCount} unit
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-paper-deep">
                    <div
                      className="h-full rounded-full bg-leaf transition-all duration-500"
                      style={{ width: `${readyPercent}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Disewa</span>
                    <span className="font-semibold text-ink">
                      {rentedCount} unit
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-paper-deep">
                    <div
                      className="h-full rounded-full bg-rust-dark transition-all duration-500"
                      style={{ width: `${rentedPercent}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-line pt-4 text-sm">
                  <span className="text-muted">Kategori</span>
                  <span className="font-semibold text-ink">
                    {categories.length}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-line bg-bone p-5 shadow-card">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold tracking-[-0.02em] text-ink">
                  Armada teratas
                </h2>
                <AdminIcon name="package" className="size-4 text-muted" />
              </div>
              <div className="mt-4 space-y-3">
                {topProducts.length > 0 ? (
                  topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-paper text-[0.62rem] font-bold text-ink-soft">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">
                          {product.name}
                        </p>
                        <p className="truncate text-[0.68rem] text-muted">
                          {product.categoryName}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-ink-soft">
                        {formatPrice(product.price, store?.currency)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted">Belum ada armada.</p>
                )}
              </div>
            </section>
          </aside>
        </div>
      ) : null}

      {/* TAB 2: KATEGORI */}
      {tab === 'categories' ? (
        <section className="rounded-xl border border-line bg-bone shadow-card">
          <div className="border-b border-line px-5 py-4 sm:px-6">
            <h2 className="font-display text-lg font-semibold tracking-[-0.02em] text-ink">
              Kategori armada
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              Kelompokkan mobil agar pengunjung lebih mudah memilih.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <form
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={handleAddCategory}
            >
              <label className="sr-only" htmlFor="kategori-baru">
                Nama kategori baru
              </label>
              <input
                id="kategori-baru"
                type="text"
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
                placeholder="Contoh: MPV Premium"
                className={inputClass}
                maxLength={40}
              />
              <button
                type="submit"
                disabled={busy || !newCategory.trim()}
                className="shrink-0 rounded-xl bg-leaf px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-rust-dark disabled:opacity-50"
              >
                Tambah
              </button>
            </form>

            <div className="mt-6 divide-y divide-line/80">
              {categories.map((category) => (
                <div key={category.id} className="py-4">
                  {editingCategory?.id === category.id ? (
                    <form className="flex gap-2" onSubmit={handleRenameCategory}>
                      <input
                        type="text"
                        value={editingCategory.name}
                        onChange={(event) =>
                          setEditingCategory((current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                        className={`${inputClass} h-10 bg-paper`}
                        autoFocus
                        maxLength={40}
                        aria-label="Nama kategori"
                      />
                      <button
                        type="submit"
                        disabled={busy}
                        className="shrink-0 rounded-lg bg-leaf px-3 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-white transition hover:bg-rust-dark disabled:opacity-50"
                      >
                        Simpan
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCategory(null)}
                        className="shrink-0 rounded-lg border border-line px-3 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-ink-soft transition hover:bg-paper-deep"
                      >
                        Batal
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-display text-base font-semibold tracking-[-0.02em] text-ink">
                          {category.name}
                        </p>
                        <p className="mt-1 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-muted">
                          {category.productCount || 0} mobil
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setEditingCategory({
                              id: category.id,
                              name: category.name,
                            })
                          }
                          className="rounded-lg border border-line px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.08em] text-ink-soft transition hover:border-ink/30 hover:bg-paper"
                        >
                          Ubah
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setConfirm({
                              type: 'category',
                              item: category,
                              title: 'Hapus kategori?',
                              description:
                                category.productCount > 0
                                  ? `Kategori ${category.name} masih dipakai ${category.productCount} mobil. Pindahkan mobilnya terlebih dahulu.`
                                  : `Kategori ${category.name} akan dihapus.`,
                              confirmLabel: 'Hapus kategori',
                            })
                          }
                          className="rounded-lg border border-danger/20 bg-danger/5 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.08em] text-danger transition hover:bg-danger/15"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* TAB 3: INFORMASI TOKO */}
      {tab === 'store' ? (
        <section className="rounded-xl border border-line bg-bone shadow-card">
          <div className="border-b border-line px-5 py-4 sm:px-6">
            <h2 className="font-display text-lg font-semibold tracking-[-0.02em] text-ink">
              Informasi toko
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              Data ini tampil di halaman utama dan pesan WhatsApp.
            </p>
          </div>

          <form className="space-y-5 p-5 sm:p-6" onSubmit={handleSaveStore}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="toko-nama">
                  Nama toko
                </label>
                <input
                  id="toko-nama"
                  type="text"
                  value={storeForm.storeName}
                  onChange={(event) =>
                    setStoreForm((current) => ({
                      ...current,
                      storeName: event.target.value,
                    }))
                  }
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="toko-telepon">
                  Nomor WhatsApp
                </label>
                <input
                  id="toko-telepon"
                  type="tel"
                  value={storeForm.phone}
                  onChange={(event) =>
                    setStoreForm((current) => ({
                      ...current,
                      phone: event.target.value,
                    }))
                  }
                  placeholder="081234567890"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="toko-tagline">
                Tagline
              </label>
              <input
                id="toko-tagline"
                type="text"
                value={storeForm.tagline}
                onChange={(event) =>
                  setStoreForm((current) => ({
                    ...current,
                    tagline: event.target.value,
                  }))
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="toko-alamat">
                Alamat
              </label>
              <textarea
                id="toko-alamat"
                value={storeForm.address}
                onChange={(event) =>
                  setStoreForm((current) => ({
                    ...current,
                    address: event.target.value,
                  }))
                }
                className="min-h-24 w-full resize-y rounded-xl border border-line bg-bone px-3.5 py-3 text-sm font-medium leading-6 text-ink outline-none transition duration-200 focus:border-[#3c83f6] focus:ring-2 focus:ring-[#3c83f6]/20"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="toko-jam">
                  Jam operasional
                </label>
                <input
                  id="toko-jam"
                  type="text"
                  value={storeForm.operationalHours}
                  onChange={(event) =>
                    setStoreForm((current) => ({
                      ...current,
                      operationalHours: event.target.value,
                    }))
                  }
                  placeholder="08.00–21.00 WIB"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="toko-instagram">
                  Instagram
                </label>
                <input
                  id="toko-instagram"
                  type="text"
                  value={storeForm.instagram}
                  onChange={(event) =>
                    setStoreForm((current) => ({
                      ...current,
                      instagram: event.target.value,
                    }))
                  }
                  placeholder="@sukabumidrive"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="toko-catatan">
                Catatan sewa
              </label>
              <textarea
                id="toko-catatan"
                value={storeForm.rentalNote}
                onChange={(event) =>
                  setStoreForm((current) => ({
                    ...current,
                    rentalNote: event.target.value,
                  }))
                }
                className="min-h-24 w-full resize-y rounded-xl border border-line bg-bone px-3.5 py-3 text-sm font-medium leading-6 text-ink outline-none transition duration-200 focus:border-[#3c83f6] focus:ring-2 focus:ring-[#3c83f6]/20"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="toko-currency">
                  Kode mata uang
                </label>
                <input
                  id="toko-currency"
                  type="text"
                  value={storeForm.currency}
                  onChange={(event) =>
                    setStoreForm((current) => ({
                      ...current,
                      currency: event.target.value.toUpperCase(),
                    }))
                  }
                  maxLength={3}
                  className={inputClass}
                />
              </div>

              <label className="flex cursor-pointer items-center gap-3 self-end rounded-xl bg-paper/60 px-4 py-3 transition hover:bg-paper">
                <input
                  type="checkbox"
                  checked={storeForm.activeWhatsApp}
                  onChange={(event) =>
                    setStoreForm((current) => ({
                      ...current,
                      activeWhatsApp: event.target.checked,
                    }))
                  }
                  className="peer sr-only"
                />
                <span className="relative h-6 w-11 shrink-0 rounded-full bg-line-strong transition-colors duration-200 after:absolute after:left-1 after:top-1 after:size-4 after:rounded-full after:bg-bone after:shadow-sm after:transition-transform after:duration-200 after:content-[''] peer-checked:bg-success peer-checked:after:translate-x-5" />
                <span>
                  <span className="block text-xs font-bold uppercase tracking-[0.1em] text-ink">
                    WhatsApp aktif
                  </span>
                  <span className="mt-0.5 block text-[0.7rem] text-muted">
                    Tampilkan tombol pemesanan.
                  </span>
                </span>
              </label>
            </div>

            <div className="flex justify-end border-t border-line/80 pt-5">
              <button
                type="submit"
                disabled={savingStore || busy}
                className="rounded-lg bg-leaf px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-rust-dark hover:shadow-md disabled:opacity-60"
              >
                {savingStore ? 'Menyimpan…' : 'Simpan info toko'}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <ProductFormModal
        key={editing === undefined ? 'closed' : (editing?.id ?? 'new')}
        open={editing !== undefined}
        product={editing || null}
        categories={categories}
        token={token}
        currency={store?.currency}
        onClose={() => setEditing(undefined)}
        onSaved={async () => {
          await onRefresh()
          setNotice({
            type: 'success',
            text: editing
              ? 'Perubahan mobil disimpan.'
              : 'Mobil baru ditambahkan.',
          })
        }}
      />

      <ConfirmModal
        open={Boolean(confirm)}
        title={confirm?.title}
        description={confirm?.description}
        confirmLabel={confirm?.confirmLabel}
        busy={busy}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm?.type === 'product') handleDeleteProduct(confirm.item)
          if (confirm?.type === 'category') handleDeleteCategory(confirm.item)
        }}
      />
    </div>
  )
}
