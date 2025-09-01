// src/app/reservas/page.jsx
// Página de reservas; muestra formulario de creación y listado paginado

import { callBackend } from "@/lib/backendClient";
import ReservasList from "@/components/ReservaList";
import ReservaForm from "@/components/ReservaForm";
import normalizeEspacios from "@/utils/normalizeHelper";

export default async function ReservasPage() {
  let espacios = [];
  try {
    const raw = await callBackend("/espacios");
    espacios = normalizeEspacios(raw);
  } catch {
    espacios = [];
  }

  return (
    <>
      <h1>Reservas</h1>
      <ReservaForm espacios={espacios} />
      <div className="spacer-2" />
      <ReservasList />
    </>
  );
}