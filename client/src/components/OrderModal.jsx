import { useMemo, useState } from 'react'
import Modal from './Modal'
import { formatPrice, rentalRate, whatsappLink } from '../lib/api'
import { onImageError, productImage } from '../lib/images'

function todayISO() {
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

function formatDate(value) {
  if (!value) return 'Belum dipilih'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export default function OrderModal({
  open,
  product,
  store,
  rentalMode = 'self',
  onClose,
}) {
  const [mode, setMode] = useState(rentalMode)
  const [startDate, setStartDate] = useState(todayISO)
  const [days, setDays] = useState(() =>
    Math.max(1, Number(product?.minRental) || 1),
  )
  const [name, setName] = useState('')
  const [pickup, setPickup] = useState('')
  const [note, setNote] = useState('')

  const rate = rentalRate(product, mode)
  const safeDays = Math.max(1, Number(days) || 1)
  const total = rate * safeDays
  const currency = store?.currency || 'IDR'
  const whatsappEnabled =
    store?.activeWhatsApp === true || store?.activeWhatsApp === 'true'

  const message = useMemo(() => {
    if (!product) return ''
    const lines = [
      `Halo ${store?.storeName || 'Sukabumi Drive'}, saya ingin sewa mobil:`,
      '',
      `• Mobil: ${product.name} (${product.categoryName})`,
      `• Mode: ${mode === 'driver' ? 'Dengan driver' : 'Lepas kunci'}`,
      `• Mulai: ${formatDate(startDate)}`,
      `• Durasi: ${safeDays} hari`,
      `• Tarif: ${formatPrice(rate, currency)}/hari`,
      `• Estimasi total: ${formatPrice(total, currency)}`,
      '',
      `Nama: ${name.trim() || '-'}`,
      `Antar/jemput: ${pickup.trim() || '-'}`,
      `Catatan: ${note.trim() || '-'}`,
    ]
    return lines.join('\n')
  }, [
    currency,
    mode,
    name,
    note,
    pickup,
    product,
    rate,
    safeDays,
    startDate,
    store?.storeName,
    total,
  ])

  const waUrl = whatsappLink(store?.phone, message)

  // Title Modal dilengkapi dekorasi Tiga Titik Apple / macOS di paling kiri atas
  const modalTitle = (
    <div>
      <div className="mb-3 flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-[#ff5f56]" />
        <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="size-2.5 rounded-full bg-[#27c93f]" />
      </div>
      <span>{product ? `Sewa ${product.name}` : 'Sewa mobil'}</span>
    </div>
  )

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={modalTitle}
      description="Isi rencana perjalanan, lalu kirim detailnya ke WhatsApp kami."
      size="lg"
    >
      {product ? (
        <form
          className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]"
          onSubmit={(event) => event.preventDefault()}
        >
          <div className="space-y-5">
            {/* Kartu Info Mobil (Tanpa Titik Apple) */}
            <div className="rounded-[1.4rem] border border-line bg-paper/60 p-4 shadow-sm">
              <div className="flex gap-4">
                <div className="relative h-28 w-36 shrink-0 overflow-hidden rounded-[1rem] bg-paper-deep">
                  <img
                    src={productImage(product)}
                    alt={product.name}
                    onError={onImageError}
                    className="size-full object-cover"
                  />
                </div>
                <div className="min-w-0 py-1">
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-leaf">
                    {product.categoryName} · {product.modelYear || 'Unit pilihan'}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold leading-none tracking-[-0.04em]">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-muted">
                    {product.transmission} · {product.seats} kursi ·{' '}
                    {product.fuel}
                  </p>
                  <p className="mt-2 text-[0.6rem] font-medium uppercase tracking-[0.12em] text-ink-soft">
                    Min. {product.minRental || 1} hari
                  </p>
                </div>
              </div>
            </div>

            <fieldset>
              <legend className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">
                Pilih layanan
              </legend>
              <div className="grid grid-cols-2 gap-2 rounded-full border border-line bg-paper/60 p-1">
                {[
                  { id: 'self', label: 'Lepas kunci' },
                  { id: 'driver', label: 'Dengan driver' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMode(item.id)}
                    className={`rounded-full px-3 py-2.5 text-xs font-bold uppercase tracking-[0.08em] transition ${
                      mode === item.id
                        ? 'bg-ink text-bone shadow-card'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[0.72rem] leading-5 text-muted">
                {mode === 'driver'
                  ? `Sudah termasuk driver. Tarif driver ${formatPrice(product.driverFee || 0, currency)}/hari; BBM dan tol tetap di luar tarif.`
                  : 'Wajib KTP dan SIM A. BBM, tol, dan parkir di luar tarif sewa.'}
              </p>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-ink-soft"
                  htmlFor="tanggal-mulai"
                >
                  Tanggal mulai
                </label>
                <input
                  id="tanggal-mulai"
                  type="date"
                  min={todayISO()}
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  required
                  className="h-12 w-full rounded-xl border border-line bg-bone px-3.5 text-sm font-medium text-ink outline-none transition focus:border-rust/60"
                />
              </div>

              <div>
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">
                  Durasi
                </span>
                <div className="flex h-12 items-center justify-between rounded-xl border border-line bg-bone px-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setDays((current) =>
                        Math.max(
                          Number(product.minRental) || 1,
                          Number(current) - 1,
                        ),
                      )
                    }
                    disabled={safeDays <= (Number(product.minRental) || 1)}
                    className="grid size-9 place-items-center rounded-lg text-lg text-ink-soft transition hover:bg-paper-deep disabled:opacity-30"
                    aria-label="Kurangi durasi"
                  >
                    −
                  </button>
                  <span className="text-sm font-semibold text-ink">
                    {safeDays} hari
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setDays((current) => Math.min(30, Number(current) + 1))
                    }
                    disabled={safeDays >= 30}
                    className="grid size-9 place-items-center rounded-lg text-lg text-ink-soft transition hover:bg-paper-deep disabled:opacity-30"
                    aria-label="Tambah durasi"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label
                className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-ink-soft"
                htmlFor="nama-pemesan"
              >
                Nama pemesan
              </label>
              <input
                id="nama-pemesan"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nama lengkap"
                className="h-12 w-full rounded-xl border border-line bg-bone px-3.5 text-sm font-medium text-ink outline-none transition placeholder:text-muted/70 focus:border-rust/60"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-ink-soft"
                  htmlFor="lokasi-jemput"
                >
                  Antar / jemput
                </label>
                <input
                  id="lokasi-jemput"
                  type="text"
                  value={pickup}
                  onChange={(event) => setPickup(event.target.value)}
                  placeholder="Contoh: Stasiun Sukabumi"
                  className="h-12 w-full rounded-xl border border-line bg-bone px-3.5 text-sm font-medium text-ink outline-none transition placeholder:text-muted/70 focus:border-rust/60"
                />
              </div>
              <div>
                <label
                  className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-ink-soft"
                  htmlFor="catatan"
                >
                  Catatan
                </label>
                <input
                  id="catatan"
                  type="text"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Rute atau kebutuhan lain"
                  className="h-12 w-full rounded-xl border border-line bg-bone px-3.5 text-sm font-medium text-ink outline-none transition placeholder:text-muted/70 focus:border-rust/60"
                />
              </div>
            </div>
          </div>

          {/* Kartu Ringkasan Sewa */}
          <aside className="flex flex-col rounded-[1.4rem] bg-ink p-5 text-bone sm:p-6">
            <div className="mb-4 flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#ff5f56]" />
              <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="size-2.5 rounded-full bg-[#27c93f]" />
            </div>

            <div className="flex items-center justify-between gap-3">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-bone/55">
                Ringkasan sewa
              </p>
              <span className="rounded-full border border-bone/20 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-bone/70">
                {mode === 'driver' ? 'Dengan driver' : 'Lepas kunci'}
              </span>
            </div>

            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-bone/55">Mobil</dt>
                <dd className="text-right font-semibold">{product.name}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-bone/55">Mulai</dt>
                <dd className="text-right font-semibold">
                  {formatDate(startDate)}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-bone/55">Durasi</dt>
                <dd className="text-right font-semibold">{safeDays} hari</dd>
              </div>
              <div className="flex items-start justify-between gap-4 border-t border-bone/15 pt-4">
                <dt className="text-bone/55">
                  {formatPrice(rate, currency)} × {safeDays}
                </dt>
                <dd className="text-right text-xs text-bone/70">
                  {mode === 'driver' ? 'termasuk driver' : 'lepas kunci'}
                </dd>
              </div>
            </dl>

            <div className="mt-auto border-t border-bone/15 pt-5">
              <p className="text-[0.62rem] font-medium uppercase tracking-[0.18em] text-bone/55">
                Estimasi total
              </p>
              <p className="mt-2 font-display text-[2.15rem] font-semibold leading-none tracking-[-0.05em]">
                {formatPrice(total, currency)}
              </p>
              <p className="mt-2 text-xs leading-5 text-bone/50">
                Konfirmasi akhir menyesuaikan ketersediaan unit dan rute.
              </p>

              {whatsappEnabled && waUrl ? (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={onClose}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-rust px-4 py-3.5 text-sm font-bold text-bone transition hover:bg-rust-dark"
                >
                  Kirim ke WhatsApp
                  <svg
                    viewBox="0 0 24 24"
                    width="17"
                    height="17"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12h13M13 6l6 6-6 6"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                </a>
              ) : (
                <p className="mt-5 rounded-xl border border-bone/15 bg-bone/5 px-3 py-3 text-xs leading-5 text-bone/70">
                  Pemesanan WhatsApp sedang nonaktif. Hubungi admin toko untuk
                  menyelesaikan sewa.
                </p>
              )}
            </div>
          </aside>
        </form>
      ) : null}
    </Modal>
  )
}