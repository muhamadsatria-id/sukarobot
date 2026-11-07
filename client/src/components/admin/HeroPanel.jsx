import { useEffect, useRef, useState } from 'react'
import { api, assetUrl } from '../../lib/api'
import { heroImage as defaultHeroImage } from '../../lib/images'
import AdminIcon from './AdminIcon'
import {
  adminCardClass,
  adminDangerButtonClass,
  adminPrimaryButtonClass,
} from '../../lib/adminUi'

export default function HeroPanel({ store, token, onRefresh, onNotice }) {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const currentImage = store?.heroImage
    ? assetUrl(store.heroImage)
    : defaultHeroImage

  useEffect(() => {
    if (!file) {
      setPreview('')
      return undefined
    }

    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  useEffect(() => {
    setFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }, [store?.heroImage])

  async function handleUpload(event) {
    event.preventDefault()
    if (!file || busy) return

    setBusy(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('image', file)
      await api.uploadHero(formData, token)
      await onRefresh?.()
      setFile(null)
      if (inputRef.current) inputRef.current.value = ''
      onNotice?.({ type: 'success', text: 'Foto background hero diperbarui.' })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleReset() {
    if (busy) return
    setBusy(true)
    setError('')
    try {
      await api.saveStore({ heroImage: '' }, token)
      await onRefresh?.()
      onNotice?.({ type: 'success', text: 'Background hero kembali ke foto bawaan.' })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className={adminCardClass}>
      <div className="border-b border-line px-5 py-4 sm:px-6">
        <h2 className="font-display text-lg font-semibold tracking-[-0.02em] text-ink">
          Background hero
        </h2>
        <p className="mt-0.5 text-xs text-muted">
          Foto ini menjadi latar bagian paling atas halaman utama. Gunakan
          gambar lebar dengan area gelap di sisi kiri.
        </p>
      </div>

      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="overflow-hidden rounded-xl border border-line bg-paper-deep">
          <div className="relative aspect-[16/9]">
            <img
              src={preview || currentImage}
              alt="Pratinjau background hero"
              className="size-full object-cover"
              onError={(event) => {
                if (preview) return
                const image = event.currentTarget
                if (image.dataset.fallback === 'true') return
                image.dataset.fallback = 'true'
                image.src = defaultHeroImage
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/25 to-transparent" />
            <div className="absolute bottom-3 left-3 rounded-full bg-ink/60 px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-[0.14em] text-bone backdrop-blur">
              {preview ? 'Pratinjau foto baru' : 'Foto aktif'}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-line bg-bone px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-ink transition hover:border-ink/30 hover:bg-paper"
              htmlFor="hero-file"
            >
              <AdminIcon name="image" className="size-4" />
              Pilih foto
            </label>
            <input
              ref={inputRef}
              id="hero-file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              onChange={(event) => {
                setFile(event.target.files?.[0] || null)
                setError('')
              }}
            />
            <p className="mt-2 truncate text-xs text-muted">
              {file ? file.name : 'JPG, PNG, WEBP, atau GIF. Maksimal 6 MB.'}
            </p>
          </div>

          {error ? (
            <div
              role="alert"
              className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-medium text-danger"
            >
              {error}
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleUpload}
              disabled={!file || busy}
              className={adminPrimaryButtonClass}
            >
              <AdminIcon name="upload" className="size-4" />
              {busy ? 'Mengunggah…' : 'Unggah background'}
            </button>
            {store?.heroImage ? (
              <button
                type="button"
                onClick={handleReset}
                disabled={busy}
                className={adminDangerButtonClass}
              >
                <AdminIcon name="trash" className="size-4" />
                Gunakan foto bawaan
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
