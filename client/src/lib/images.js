import fallbackImage from '../assets/car-placeholder.svg'
import { assetUrl } from './api'

export { fallbackImage }

export const heroImage =
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85'

// Foto demo untuk data yang belum punya gambar. Upload admin selalu menang.
const DEMO_PHOTOS = [
  'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80',
]

function hash(value) {
  let result = 0
  for (let index = 0; index < value.length; index += 1) {
    result = (result * 31 + value.charCodeAt(index)) >>> 0
  }
  return result
}

export function productImage(product) {
  const raw = product?.image?.trim()
  if (raw) {
    if (/^https?:\/\//i.test(raw) || raw.startsWith('data:')) return raw
    if (raw.startsWith('/uploads') || raw.startsWith('uploads')) {
      return assetUrl(raw)
    }
  }

  if (!product) return fallbackImage
  const seed = String(product.id || product.name || '')
  return DEMO_PHOTOS[hash(seed) % DEMO_PHOTOS.length]
}

export function onImageError(event) {
  const image = event.currentTarget
  if (image.dataset.fallback === 'true') return
  image.dataset.fallback = 'true'
  image.src = fallbackImage
}
