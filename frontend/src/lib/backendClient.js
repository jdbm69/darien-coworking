// src/lib/backendClient.js
// Helper del lado servidor para consumir el backend inyectando la API Key y manejando errores

export async function callBackend(path, { method = "GET", body, searchParams } = {}) {
  const base = process.env.BACKEND_BASE_URL?.replace(/\/+$/, "");
  const prefix = (process.env.BACKEND_API_PREFIX || "").replace(/\/+$/, "");
  if (!base) throw new Error("BACKEND_BASE_URL no definido");

  const url = new URL(`${base}${prefix}${path}`);
  if (searchParams) Object.entries(searchParams).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", "x-api-key": process.env.API_KEY || "" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const text = await res.text();
  let data; try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const backendMsg =
      (data && (data.message || data.error || data.err)) ||
      (Array.isArray(data?.errors) && data.errors.map(e => e.msg || e.message).join("; ")) ||
      (typeof data === "string" ? data : null) ||
      res.statusText;

    // Error estructurado (sin prefijo "Error 4xx: ...")
    const err = new Error(backendMsg || "Solicitud inválida");
    err.status = res.status;
    err.details = data;
    throw err;
  }
  return data;
}