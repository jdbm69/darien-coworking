// src/components/ReservasList.jsx
// Listado paginado de reservas con opción de eliminación

"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/fetcher";
import Pagination from "./Pagination";
import Loader from "./Loader";

export default function ReservasList() {
  const [data, setData] = useState({ items: [], page: 1, totalPages: 1 });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async (page = 1) => {
    setErr("");
    setLoading(true);
    try {
      const res = await apiFetch(`/api/reservas?page=${page}&limit=3`);
      setData(res);
    } catch (e) {
      setErr(e.message || "Error al cargar reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  useEffect(() => {
    const onRefresh = () => load(data.page);
    window.addEventListener("reservas:refresh", onRefresh);
    return () => window.removeEventListener("reservas:refresh", onRefresh);
  }, [data.page]);

  const del = async (id) => {
    if (!confirm("¿Eliminar reserva?")) return;
    try {
      await apiFetch(`/api/reservas?id=${id}`, { method: "DELETE" });
      await load(data.page);
    } catch (e) {
      alert(e.message || "No se pudo eliminar la reserva");
    }
  };

  if (loading) return <Loader text="Cargando reservas..." />;

  if (err) return <div className="alert alert--danger">⚠️ {err}</div>;

  // Si el backend no manda 'totalPages' fiable, pero recibimos exactamente 3 items,
  // asumimos que puede existir otra página → prevenimos que el botón "Siguiente" quede desactivado.
  const computedTotalPages = Math.max(
    data.totalPages || 1,
    data.items.length === 3 ? data.page + 1 : data.totalPages || 1
  );

  return (
    <section>
      <h2>Reservas</h2>
      <div className="grid grid--auto">
        {data.items?.map((r) => (
          <article key={r.id} className="card" data-testid="reserva-item">
            <div><b>Espacio:</b> {r.espacio?.nombre || r.espacioId}</div>
            <div><b>Cliente:</b> {r.emailCliente || r.cliente || "-"}</div>
            {r.fecha && <div><b>Fecha:</b> {r.fecha}</div>}
            {(r.horaInicio || r.fecha_inicio || r.fechaInicio) && (
              <div><b>Inicio:</b> {r.horaInicio || new Date(r.fecha_inicio ?? r.fechaInicio).toLocaleString()}</div>
            )}
            {(r.horaFin || r.fecha_fin || r.fechaFin) && (
              <div><b>Fin:</b> {r.horaFin || new Date(r.fecha_fin ?? r.fechaFin).toLocaleString()}</div>
            )}
            <button className="btn btn--danger" onClick={() => del(r.id)}>Eliminar</button>
          </article>
        ))}
      </div>
      <Pagination page={data.page} totalPages={computedTotalPages} onChange={load} />
    </section>
  );
}
