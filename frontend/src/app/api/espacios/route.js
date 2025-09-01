// src/app/api/espacios/route.js
// Proxy interno Next → Backend para GET /espacios. Oculta la API Key al cliente

import { callBackend } from "@/lib/backendClient";
import normalizeEspacios from "@/utils/normalizeHelper";

// Funcion para obtener los espacios 
export async function GET() {
  try {
    const data = await callBackend("/espacios");
    const list = normalizeEspacios(data);
    return Response.json(list);
  } catch (e) {
    console.error("[/api/espacios GET]", e);
    const code = e?.status || 502;
    const msg = e?.message || "Error interno";
    return Response.json({ message: msg }, { status: code });
  }
}

// Aca se pueden agregar las demas funciones CRUD, pero me guio por las instrucciones que solo requerian visualizar los espacios