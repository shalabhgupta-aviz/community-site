// lib/fetcher.js
export async function fetcher(url, options = {}) {
    const res = await fetch(url, options)
    let payload
    try {
      payload = await res.json()
    } catch {
      throw new Error('Invalid JSON response')
    }
    if (!res.ok) {
      // assume the JSON has { message } or fall back to statusText
      throw new Error(payload.message || res.statusText)
    }
    return payload
  }