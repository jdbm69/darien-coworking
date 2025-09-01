// src/app/reservas/page.jsx
// Página de reservas; muestra formulario de creación y listado paginado

import { callBackend } from "@/lib/backendClient";
import ReservasList from "@/components/ReservaList";
import ReservaForm from "@/components/ReservaForm";

export default async function ReservasPage() {
  let espacios = [];
  try {
    espacios = await callBackend("/espacios");
  } catch {
    espacios = [];
  }

  return (
    <>
      <h1>Reservas</h1>
      <ReservaForm espacios={espacios} />
      <ReservasList />
    </>
  );
}