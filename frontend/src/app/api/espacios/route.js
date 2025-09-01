// src/app/api/espacios/route.js
// Proxy interno Next → Backend para GET /espacios. Oculta la API Key al cliente

import { callBackend } from "@/lib/backendClient";

// Funcion para obtener los espacios 
export async function GET() {
  try {
    const data = await callBackend("/espacios");
    return Response.json(data);
  } catch (e) {
    console.error("[/api/espacios GET]", e);
    const msg = e?.message || "Error interno";
    const code = Number((msg.match(/Error (\d+)/)?.[1])) || 502;
    return Response.json({ message: msg }, { status: code });
  }
}

// Aca se pueden agregar las demas funciones CRUD, pero me guio por las instrucciones que solo requerian visualizar los espacios