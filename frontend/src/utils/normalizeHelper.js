// src/utils/normalizeHelper.js
// Helper para normalizar array de espacios

export default function normalizeEspacios(raw) {
  if (Array.isArray(raw)) return raw;
  if (!raw || typeof raw !== "object") return [];
  if (Array.isArray(raw.items)) return raw.items;
  if (Array.isArray(raw.data)) return raw.data;
  if (Array.isArray(raw.espacios)) return raw.espacios;
  if (Array.isArray(raw.rows)) return raw.rows;
  return [];
}