const NS = 'studyai__'

export const storage = {
  get(key) {
    try {
      const raw = localStorage.getItem(NS + key)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(NS + key, JSON.stringify(value))
    } catch {
      // storage full or blocked — silently fail
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(NS + key)
    } catch {}
  },

  clear() {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(NS))
        .forEach(k => localStorage.removeItem(k))
    } catch {}
  },
}