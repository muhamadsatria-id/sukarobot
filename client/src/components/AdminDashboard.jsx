import { useState } from 'react'
import ConfirmModal from './ConfirmModal'
import ProductFormModal from './ProductFormModal'
import { api, formatPrice } from '../lib/api'
import { onImageError, productImage } from '../lib/images'

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

function MacDots({ className = '' }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="size-2.5 rounded-full bg-[#ff5f56] transition-transform duration-200 hover:scale-125" />
      <span className="size-2.5 rounded-full bg-[#ffbd2e] transition-transform duration-200 hover:scale-125" />
      <span className="size-2.5 rounded-full bg-[#27c93f] transition-transform duration-200 hover:scale-125" />
    </div>
  )
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

  return (
    <main className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {/* Container Utama Berkas Gaya macOS */}
      <section className="overflow-hidden rounded-[1.85rem] border border-line bg-bone/90 shadow-xl backdrop-blur-md transition-all duration-300">
        
        {/* Header Dashboard */}
        <div className="border-b border-line/80 bg-paper/70 px-5 py-6 sm:px-7 sm:py-8">
          <MacDots className="mb-4" />
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-rust">
                Dashboard admin
              </p>
              <h1 className="mt-2 font-display text-[2.4rem] font-semibold leading-[0.95] tracking-[-0.05em] sm:text-5xl">
                Kelola armada.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
                Perbarui unit, tarif, status ketersediaan, dan informasi rental
                dalam satu tempat.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRefresh()}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-bone px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-ink-soft shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-ink/30 hover:bg-paper-deep hover:shadow"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path
                  d="M20 11a8 8 0 1 0-2.34 5.66M20 5v6h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                />
              </svg>
              Muat ulang
            </button>
          </div>

          {/* Kartu Statistik Ringkas */}
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Total unit', value: products.length },
              { label: 'Tersedia', value: readyCount },
              { label: 'Disewa', value: rentedCount },
              { label: 'Kategori', value: categories.length },
            ].map((stat) => (
              <div
                key={stat.label}
                className="group rounded-2xl border border-line/80 bg-bone/80 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#3c83f6]/40 hover:bg-white hover:shadow-md"
              >
                <MacDots className="mb-2 opacity-60 transition-opacity group-hover:opacity-100" />
                <p className="text-[0.58rem] font-medium uppercase tracking-[0.16em] text-muted">
                  {stat.label}
                </p>
                <p className="mt-1 font-display text-3xl font-semibold leading-none tracking-[-0.04em] text-ink">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Konten Utama Berdasarkan Tab */}
        <div className="p-5 sm:p-7">
          {notice ? (
            <div
              className={`mb-5 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm leading-6 shadow-sm transition-all duration-300 ${
                notice.type === 'success'
                  ? 'border-success/30 bg-success/10 text-success'
                  : 'border-danger/30 bg-danger/10 text-danger'
              }`}
              role="status"
            >
              <MacDots />
              <span className="font-medium">{notice.text}</span>
            </div>
          ) : null}

          {/* TAB 1: DAFTAR MOBIL */}
          {tab === 'products' ? (
            <section className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-display text-2xl font-semibold tracking-[-0.04em]">
                    Daftar mobil
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {products.length} unit terdaftar di armada.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-bone shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-rust hover:shadow-lg"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 5v14M5 12h14"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="1.9"
                    />
                  </svg>
                  Tambah mobil
                </button>
              </div>

              {products.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-line-strong bg-paper/45 px-6 py-12 text-center transition-all">
                  <MacDots className="justify-center mb-4" />
                  <p className="font-display text-2xl font-semibold">
                    Armada masih kosong.
                  </p>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
                    Tambahkan mobil pertama beserta tarif harian dan spesifikasi
                    utamanya.
                  </p>
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="mt-5 rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-bone transition hover:bg-rust"
                  >
                    Tambah mobil
                  </button>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-line bg-bone shadow-sm">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="group flex flex-col gap-4 border-b border-line/80 p-4 transition duration-200 hover:bg-paper/40 last:border-b-0 sm:flex-row sm:items-center"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-4">
                        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-paper-deep">
                          <img
                            src={productImage(product)}
                            alt={product.name}
                            onError={onImageError}
                            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-display text-xl font-semibold leading-none tracking-[-0.04em]">
                              {product.name}
                            </h3>
                            <StatusBadge status={product.stockStatus} />
                          </div>
                          <p className="mt-2 text-xs leading-5 text-muted">
                            {product.categoryName}
                            {product.modelYear ? ` · ${product.modelYear}` : ''}
                            {' · '}
                            {product.transmission}
                            {' · '}
                            {product.seats} kursi
                            {' · '}
                            {product.fuel}
                          </p>
                          <p className="mt-1 text-[0.68rem] font-medium text-ink-soft">
                            {formatPrice(product.price, store?.currency)}
                            /hari
                            {product.driverFee
                              ? ` · driver ${formatPrice(product.driverFee, store?.currency)}`
                              : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2 sm:justify-end">
                        <button
                          type="button"
                          onClick={() => handleToggle(product)}
                          disabled={busy}
                          className="rounded-full border border-line bg-paper px-3.5 py-2 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-ink-soft transition duration-200 hover:border-ink/30 hover:bg-paper-deep disabled:opacity-50"
                        >
                          {product.stockStatus === 'Tersedia'
                            ? 'Set disewa'
                            : 'Set tersedia'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditing(product)}
                          className="rounded-full border border-line bg-bone px-3.5 py-2 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-ink transition duration-200 hover:border-ink/30 hover:bg-paper"
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
                          className="rounded-full border border-danger/20 bg-danger/5 px-3.5 py-2 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-danger transition duration-200 hover:bg-danger/15"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : null}

          {/* TAB 2: KATEGORI */}
          {tab === 'categories' ? (
            <section className="space-y-5">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-[-0.04em]">
                  Kategori armada
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Kelompokkan mobil agar pengunjung lebih mudah memilih.
                </p>
              </div>

              <form
                className="flex flex-col gap-2 rounded-2xl border border-line bg-paper/50 p-4 shadow-sm transition sm:flex-row"
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
                  className={`${inputClass} bg-bone`}
                  maxLength={40}
                />
                <button
                  type="submit"
                  disabled={busy || !newCategory.trim()}
                  className="shrink-0 rounded-xl bg-ink px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-bone transition hover:bg-rust disabled:opacity-50"
                >
                  Tambah
                </button>
              </form>

              <div className="grid gap-4 sm:grid-cols-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="group rounded-2xl border border-line bg-bone p-4 shadow-sm transition-all duration-200 hover:border-line-strong hover:shadow"
                  >
                    <MacDots className="mb-3" />
                    {editingCategory?.id === category.id ? (
                      <form
                        className="flex gap-2"
                        onSubmit={handleRenameCategory}
                      >
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
                          className="shrink-0 rounded-lg bg-ink px-3 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-bone transition hover:bg-rust disabled:opacity-50"
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
                          <p className="font-display text-lg font-semibold tracking-[-0.02em]">
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
                            className="rounded-full border border-line px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.08em] text-ink-soft transition hover:border-ink/30 hover:bg-paper"
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
                            className="rounded-full border border-danger/20 bg-danger/5 px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.08em] text-danger transition hover:bg-danger/15"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* TAB 3: INFORMASI TOKO */}
          {tab === 'store' ? (
            <section className="space-y-5">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-[-0.04em]">
                  Informasi toko
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Data ini tampil di halaman utama dan pesan WhatsApp.
                </p>
              </div>

              <form
                className="rounded-2xl border border-line bg-bone p-5 shadow-sm space-y-5"
                onSubmit={handleSaveStore}
              >
                <MacDots />

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

                  <label className="flex cursor-pointer items-center gap-3 self-end rounded-xl border border-line bg-paper/50 px-4 py-3 transition hover:bg-paper">
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
                    className="rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] text-bone shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-rust hover:shadow-lg disabled:opacity-60"
                  >
                    {savingStore ? 'Menyimpan…' : 'Simpan info toko'}
                  </button>
                </div>
              </form>
            </section>
          ) : null}
        </div>
      </section>

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
    </main>
  )
}