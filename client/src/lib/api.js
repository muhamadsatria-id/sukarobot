const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(
  /\/+$/,
  '',
)

export const TOKEN_KEY = 'sukarobot.admin.token'

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

async function request(path, { method = 'GET', body, token, signal } = {}) {
  const isForm = body instanceof FormData
  const headers = { Accept: 'application/json' }

  if (body && !isForm) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      signal,
      body: isForm ? body : body ? JSON.stringify(body) : undefined,
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ApiError(
      `Tidak bisa terhubung ke server. Pastikan backend berjalan di ${API_URL}.`,
      0,
    )
  }

  const text = await response.text()
  let payload = null
  if (text) {
    try {
      payload = JSON.parse(text)
    } catch {
      payload = { message: text }
    }
  }

  if (!response.ok) {
    const fallback =
      response.status === 401 || response.status === 403
        ? 'Sesi admin tidak valid. Silakan masuk lagi.'
        : `Permintaan gagal (${response.status}).`
    throw new ApiError(payload?.message || fallback, response.status, payload)
  }

  return payload
}

export const api = {
  url: API_URL,

  login: (email, password) =>
    request('/api/auth/login', { method: 'POST', body: { email, password } }),
  me: (token) => request('/api/auth/me', { token }),

  getStore: () => request('/api/stores'),
  saveStore: (data, token) =>
    request('/api/stores', { method: 'PUT', body: data, token }),
  uploadHero: (formData, token) =>
    request('/api/stores/hero', { method: 'POST', body: formData, token }),

  getUsers: (token) => request('/api/users', { token }),
  createUser: (data, token) =>
    request('/api/users', { method: 'POST', body: data, token }),
  updateUser: (id, data, token) =>
    request(`/api/users/${id}`, { method: 'PUT', body: data, token }),
  deleteUser: (id, token) =>
    request(`/api/users/${id}`, { method: 'DELETE', token }),

  getRoutes: () => request('/api/routes'),
  createRoute: (data, token) =>
    request('/api/routes', { method: 'POST', body: data, token }),
  updateRoute: (id, data, token) =>
    request(`/api/routes/${id}`, { method: 'PUT', body: data, token }),
  deleteRoute: (id, token) =>
    request(`/api/routes/${id}`, { method: 'DELETE', token }),

  getTestimonials: () => request('/api/testimonials'),
  createTestimonial: (data, token) =>
    request('/api/testimonials', { method: 'POST', body: data, token }),
  updateTestimonial: (id, data, token) =>
    request(`/api/testimonials/${id}`, {
      method: 'PUT',
      body: data,
      token,
    }),
  deleteTestimonial: (id, token) =>
    request(`/api/testimonials/${id}`, { method: 'DELETE', token }),

  getCategories: () => request('/api/categories'),
  createCategory: (name, token) =>
    request('/api/categories', { method: 'POST', body: { name }, token }),
  updateCategory: (id, name, token) =>
    request(`/api/categories/${id}`, { method: 'PUT', body: { name }, token }),
  deleteCategory: (id, token) =>
    request(`/api/categories/${id}`, { method: 'DELETE', token }),

  getProducts: () => request('/api/products'),
  createProduct: (formData, token) =>
    request('/api/products', { method: 'POST', body: formData, token }),
  updateProduct: (id, formData, token) =>
    request(`/api/products/${id}`, { method: 'PUT', body: formData, token }),
  toggleProduct: (id, token) =>
    request(`/api/products/${id}`, { method: 'PATCH', token }),
  deleteProduct: (id, token) =>
    request(`/api/products/${id}`, { method: 'DELETE', token }),
}

export function assetUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path
  return `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

const priceFormatters = new Map()

function priceFormatter(currency) {
  const code = /^[a-z]{3}$/i.test(String(currency || ''))
    ? String(currency).toUpperCase()
    : 'IDR'

  if (!priceFormatters.has(code)) {
    priceFormatters.set(
      code,
      new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: code,
        maximumFractionDigits: 0,
      }),
    )
  }

  return priceFormatters.get(code)
}

export function formatPrice(value, currency = 'IDR') {
  return priceFormatter(currency).format(Number(value) || 0)
}

export function rentalRate(product, mode = 'self') {
  const base = Number(product?.price) || 0
  if (mode !== 'driver') return base
  return base + (Number(product?.driverFee) || 0)
}

export function formatPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('62')) return `+${digits}`
  if (digits.startsWith('0')) return `+62 ${digits.slice(1)}`
  return `+${digits}`
}

export function toWhatsAppNumber(phone) {
  const digits = String(phone || '').replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('62')) return digits
  if (digits.startsWith('0')) return `62${digits.slice(1)}`
  return digits
}

export function whatsappLink(phone, message = '') {
  const number = toWhatsAppNumber(phone)
  if (!number) return ''
  const query = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${number}${query}`
}
