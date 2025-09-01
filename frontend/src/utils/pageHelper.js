// src/utils/pageHelper.js
// Funcion para detectar paginas e items

export default function normalizePageShape(raw, page, limit) {
  if (Array.isArray(raw)) return { items: raw, page, totalPages: 1 };
  if (!raw || typeof raw !== "object") return { items: [], page, totalPages: 1 };

  if (Array.isArray(raw.items)) {
    const total = Number(raw.total ?? raw.count ?? raw.items.length);
    const totalPages = Number(raw.totalPages ?? (total ? Math.ceil(total / limit) : 1));
    const p = Number(raw.page ?? page);
    return { items: raw.items, page: p, totalPages: Math.max(1, totalPages) };
  }

  if (Array.isArray(raw.rows) && raw.count != null) {
    return {
      items: raw.rows,
      page,
      totalPages: Math.max(1, Math.ceil(Number(raw.count) / limit)),
    };
  }

  if (Array.isArray(raw.data) && raw.meta) {
    const m = raw.meta;
    const total = Number(m.total ?? m.count ?? raw.data.length);
    const totalPages = Number(m.totalPages ?? (total ? Math.ceil(total / (m.limit ?? limit)) : 1));
    const p = Number(m.page ?? m.currentPage ?? page);
    return { items: raw.data, page: p, totalPages: Math.max(1, totalPages) };
  }

  const candidates = ["reservas", "list", "results"];
  const key = candidates.find((k) => Array.isArray(raw[k]));
  if (key) {
    const total = Number(raw.total ?? raw.count ?? raw[`${key}Count`] ?? raw[key].length);
    const totalPages = Number(raw.totalPages ?? (total ? Math.ceil(total / limit) : 1));
    const p = Number(raw.page ?? raw.currentPage ?? page);
    return { items: raw[key], page: p, totalPages: Math.max(1, totalPages) };
  }

  return { items: [], page, totalPages: 1 };
}