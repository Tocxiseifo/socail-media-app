const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3300'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('vesper_token')
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'object') {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = (data as any)?.msg || (data as any)?.message || res.statusText
    throw new Error(msg)
  }
  return data as T
}
