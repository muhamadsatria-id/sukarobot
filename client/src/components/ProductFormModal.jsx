import { useEffect, useMemo, useState } from 'react'
import Modal from './Modal'
import { api } from '../lib/api'
import { onImageError, productImage } from '../lib/images'

const inputClass =
  'h-12 w-full rounded-xl border border-line bg-bone px-3.5 text-sm font-medium text-ink outline-none transition placeholder:text-muted/70 focus:border-rust/60'
const textareaClass =
  'min-h-28 w-full resize-y rounded-xl border border-line bg-bone px-3.5 py-3 text-sm font-medium leading-6 text-ink outline-none transition placeholder:text-muted/70 focus:border-rust/60'
const labelClass =
  'mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-ink-soft'
const CURRENT_YEAR = new Date().getFullYear()

function initialForm(product, categories) {
  return {
    name: product?.name ?? '',
    categoryId: product?.categoryId ?? categories[0]?.id ?? '',
    price: product?.price !== undefined ? String(product.price) : '',
    driverFee:
      product?.driverFee !== undefined ? String(product.driverFee) : '150000',
    minRental:
      product?.minRental !== undefined ? String(product.minRental) : '1',
    stockStatus: product?.stockStatus ?? 'Tersedia',
    transmission: product?.transmission ?? 'Matic',
    seats: product?.seats !== undefined ? String(product.seats) : '5',
    fuel: product?.fuel ?? 'Bensin',
    modelYear:
      product?.modelYear !== undefined
        ? String(product.modelYear)
        : String(CURRENT_YEAR),
    description: product?.description ?? '',
    imageurl:
      product?.image && /^(https?:|\/uploads)/.test(product.image)
        ? product.image
        : '',
  }
}

export default function ProductFormModal({
  open,
  product,
  categories,
  token,
  currency = 'IDR',
  onClose,
  onSaved,
}) {
  const [form, setForm] = useState(() => initialForm(product, categories))
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const objectUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : ''),
    [file],
  )
  const preview =
    objectUrl ||
    productImage({
      ...(product || {}),
      name: form.name || product?.name,
      image: form.imageurl || product?.image,
    })

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [objectUrl])

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (saving) return

    if (!form.name.trim()) {
      setError('Nama mobil wajib diisi.')
      return
    }
    if (!form.categoryId) {
      setError('Pilih kategori mobil.')
      return
    }
    const price = Number(form.price)
    if (form.price === '' || Number.isNaN(price) || price < 0) {
      setError('Tarif harian harus berupa angka 0 atau lebih.')
      return
    }
    const driverFee = Number(form.driverFee)
    if (
      form.driverFee === '' ||
      Number.isNaN(driverFee) ||
      driverFee < 0
    ) {
      setError('Tarif driver harus berupa angka 0 atau lebih.')
      return
    }
    const seats = Number(form.seats)
    if (form.seats === '' || Number.isNaN(seats) || seats < 1) {
      setError('Jumlah kursi minimal 1.')
      return
    }
    const minRental = Number(form.minRental)
    if (form.minRental === '' || Number.isNaN(minRental) || minRental < 1) {
      setError('Minimal sewa minimal 1 hari.')
      return
    }

    setSaving(true)
    setError('')

    try {
      const data = new FormData()
      data.append('name', form.name.trim())
      data.append('categoryId', form.categoryId)
      data.append('price', String(price))
      data.append('driverFee', String(driverFee))
      data.append('minRental', String(Math.trunc(minRental)))
      data.append('stockStatus', form.stockStatus)
      data.append('transmission', form.transmission)
      data.append('seats', String(Math.trunc(seats)))
      data.append('fuel', form.fuel)
      if (form.modelYear) data.append('modelYear', String(form.modelYear))
      data.append('description', form.description.trim())

      if (file) {
        data.append('image', file)
      } else if (form.imageurl.trim()) {
        data.append('imageurl', form.imageurl.trim())
      }

      if (product?.id) {
        await api.updateProduct(product.id, data, token)
      } else {
        await api.createProduct(data, token)
      }

      await onSaved()
      onClose()
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
      title={product ? `Edit ${product.name}` : 'Tambah mobil'}
      description="Lengkapi data unit dan tarif sewa. Foto bisa diunggah atau memakai URL."
      size="lg"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error ? (
          <p
            className="rounded-xl border border-danger/25 bg-danger/10 px-4 py-3 text-sm leading-6 text-danger"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className={labelClass}>Foto mobil</p>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] border border-line bg-paper-deep">
              <img
                src={preview}
                alt="Pratinjau mobil"
                onError={onImageError}
                className="size-full object-cover"
              />
            </div>

            <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-line-strong bg-paper/60 px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink-soft transition hover:border-rust/50 hover:bg-bone">
              <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
                <path
                  d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.7"
                />
              </svg>
              {file ? file.name : 'Pilih foto'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={(event) => {
                  update('imageurl', '')
                  setFile(event.target.files?.[0] || null)
                }}
              />
            </label>
            <p className="mt-2 text-[0.7rem] leading-5 text-muted">
              Lanskap 16:10, maksimal 5 MB. Kosongkan untuk memakai foto demo.
            </p>

            <div className="mt-4">
              <label className={labelClass} htmlFor="foto-url">
                Atau URL foto
              </label>
              <input
                id="foto-url"
                type="url"
                value={form.imageurl}
                onChange={(event) => {
                  setFile(null)
                  update('imageurl', event.target.value)
                }}
                placeholder="https://…"
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClass} htmlFor="mobil-nama">
                Nama mobil
              </label>
              <input
                id="mobil-nama"
                type="text"
                value={form.name}
                onChange={(event) => update('name', event.target.value)}
                placeholder="Contoh: Toyota Avanza"
                className={inputClass}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="mobil-kategori">
                  Kategori
                </label>
                <select
                  id="mobil-kategori"
                  value={form.categoryId}
                  onChange={(event) =>
                    update('categoryId', event.target.value)
                  }
                  className={inputClass}
                  required
                >
                  {categories.length === 0 ? (
                    <option value="">Belum ada kategori</option>
                  ) : null}
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="mobil-tahun">
                  Tahun
                </label>
                <input
                  id="mobil-tahun"
                  type="number"
                  min="1980"
                  max={CURRENT_YEAR + 1}
                  value={form.modelYear}
                  onChange={(event) => update('modelYear', event.target.value)}
                  placeholder="2024"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass} htmlFor="mobil-transmisi">
                  Transmisi
                </label>
                <select
                  id="mobil-transmisi"
                  value={form.transmission}
                  onChange={(event) =>
                    update('transmission', event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="Matic">Matic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="mobil-kursi">
                  Kursi
                </label>
                <input
                  id="mobil-kursi"
                  type="number"
                  min="1"
                  max="20"
                  value={form.seats}
                  onChange={(event) => update('seats', event.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="mobil-bahan-bakar">
                  Bahan bakar
                </label>
                <select
                  id="mobil-bahan-bakar"
                  value={form.fuel}
                  onChange={(event) => update('fuel', event.target.value)}
                  className={inputClass}
                >
                  <option value="Bensin">Bensin</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Listrik">Listrik</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass} htmlFor="mobil-tarif">
                  Tarif / hari
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[0.62rem] font-semibold text-muted">
                    {currency}
                  </span>
                  <input
                    id="mobil-tarif"
                    type="number"
                    min="0"
                    step="1000"
                    value={form.price}
                    onChange={(event) => update('price', event.target.value)}
                    placeholder="450000"
                    className={`${inputClass} pl-12`}
                    required
                  />
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="mobil-driver">
                  Tarif driver
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[0.62rem] font-semibold text-muted">
                    {currency}
                  </span>
                  <input
                    id="mobil-driver"
                    type="number"
                    min="0"
                    step="1000"
                    value={form.driverFee}
                    onChange={(event) =>
                      update('driverFee', event.target.value)
                    }
                    placeholder="150000"
                    className={`${inputClass} pl-12`}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="mobil-min">
                  Min. hari
                </label>
                <input
                  id="mobil-min"
                  type="number"
                  min="1"
                  max="30"
                  value={form.minRental}
                  onChange={(event) =>
                    update('minRental', event.target.value)
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="mobil-status">
                Status unit
              </label>
              <select
                id="mobil-status"
                value={form.stockStatus}
                onChange={(event) =>
                  update('stockStatus', event.target.value)
                }
                className={inputClass}
              >
                <option value="Tersedia">Tersedia</option>
                <option value="Disewa">Sedang disewa</option>
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="mobil-deskripsi">
                Deskripsi
              </label>
              <textarea
                id="mobil-deskripsi"
                value={form.description}
                onChange={(event) =>
                  update('description', event.target.value)
                }
                placeholder="Ceritakan kelebihan unit, cocok untuk rute apa, dan catatan lain."
                className={textareaClass}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-line/80 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-line bg-paper px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-ink-soft transition hover:border-ink/30 hover:bg-paper-deep"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-ink px-5 py-3 text-xs font-bold uppercase tracking-[0.1em] text-bone transition hover:bg-rust disabled:opacity-60"
          >
            {saving
              ? 'Menyimpan…'
              : product
                ? 'Simpan perubahan'
                : 'Tambahkan mobil'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
