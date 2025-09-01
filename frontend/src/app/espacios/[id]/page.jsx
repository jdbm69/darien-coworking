// src/app/espacios/[id]/page.jsx
// Página de detalle SSR de un espacio específico

import { callBackend } from "@/lib/backendClient";
import { notFound } from "next/navigation";

export default async function EspacioDetalle({ params }) {
  const { id } = await params;

  let data;
  try {
    data = await callBackend(`/espacios/${id}`);
  } catch (e) {
    // Si el backend devuelve 404 u otro error, mostramos 404 en Next
    return notFound();
  }

  return (
    <section className="card">
      <h1 className="card__title">{data.nombre}</h1>
      <p>Ubicada en {data.ubicacion}</p>
      <p>{data.capacidad} personas maximo</p>
      <p>Cuenta con {data.descripcion}</p>
    </section>
  );
}