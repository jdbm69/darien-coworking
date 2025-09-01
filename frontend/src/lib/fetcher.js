// src/lib/fetcher.js
// Helper del lado cliente para llamar a las rutas internas /api/* con manejo de errores

export async function apiFetch(path, opts = {}) {
  const res = await fetch(path, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
  });
  const text = await res.text();
  let data; try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error || data.err)) ||
      (Array.isArray(data?.errors) && data.errors.map(e => e.msg || e.message).join("; ")) ||
      (typeof data === "string" ? data : null) ||
      `Error ${res.status}`;

    throw new Error(msg);
  }
  return data;
}