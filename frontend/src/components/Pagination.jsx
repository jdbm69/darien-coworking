// src/components/Pagination.jsx
// Control de paginación reutilizable (anterior/siguiente)

"use client";

export default function Pagination({ page, totalPages, onChange }) {
  return (
    <div className="pagination">
      <button className="btn" disabled={page <= 1} onClick={() => onChange(page - 1)}>Anterior</button>
      <span className="pagination__info">Página {page} de {totalPages}</span>
      <button className="btn" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Siguiente</button>
    </div>
  );
}
