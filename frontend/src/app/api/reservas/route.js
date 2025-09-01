// src/app/api/reservas/route.js
// Proxy interno Next → Backend para GET/POST/DELETE de reservas con paginación y eliminación

import { callBackend } from "@/lib/backendClient";
import normalizePageShape from "@/utils/pageHelper";

// Funcion para ver la lista de reservas
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") ?? "3");

    // Enviar TODOS los alias típicos para que el backend tome el que reconozca
    const qp = {
      page,
      limit,
      pageSize: limit,
      perPage: limit,
      size: limit,
      take: limit,
    };

    const data = await callBackend("/reservas", { searchParams: qp });
    let norm = normalizePageShape(data, page, limit);

    // Salvaguarda: si vinieron más de 'limit', recortamos a 'limit'
    if (Array.isArray(norm.items) && norm.items.length > limit) {
      norm = { ...norm, items: norm.items.slice(0, limit) };
    }

    return Response.json(norm);
  } catch (e) {
    console.error("[/api/reservas GET]", e);
    const code = e?.status || 502;
    const msg = e?.message || "Error interno";
    return Response.json({ message: msg }, { status: code });
  }
}

// Funcion para agregar una reserva
export async function POST(request) {
  try {
    const raw = await request.json();

    // Payload EXACTO pedido por el backend
    const payload = {
      espacioId: Number(raw.espacioId),
      emailCliente: String(raw.emailCliente || "").trim(),
      fecha: String(raw.fecha),           // YYYY-MM-DD
      horaInicio: String(raw.horaInicio), // HH:mm
      horaFin: String(raw.horaFin),       // HH:mm
    };

    const data = await callBackend("/reservas", { method: "POST", body: payload });
    return Response.json(data, { status: 201 });
  } catch (e) {
    console.error("[/api/reservas POST]", e);
    const code = e?.status || 400;
    const msg = e?.message || "Error al crear la reserva";
    return Response.json({ message: msg }, { status: code });
  }
}

// Funcion para eliminar una reserva
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return Response.json({ message: "Falta id" }, { status: 400 });

    const data = await callBackend(`/reservas/${id}`, { method: "DELETE" });
    return Response.json(data);
  } catch (e) {
    console.error("[/api/reservas DELETE]", e);
    const code = e?.status || 502;
    const msg = e?.message || "Error al eliminar la reserva";
    return Response.json({ message: msg }, { status: code });
  }
}