// Utils to safely build public URLs without double slashes
// Example: base: http://localhost:4242/ and path: /public/uploads/x.jpg -> http://localhost:4242/public/uploads/x.jpg

export function buildPublicUrl(path) {
  const base = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "")
  const p = String(path || "").replace(/\\/g, "/").replace(/^\/+/, "")
  return `${base}/${p}`
}
