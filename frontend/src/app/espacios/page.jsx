// src/app/espacios/page.jsx
// Página que lista los espacios disponibles usando EspaciosList.

import EspaciosList from "@/components/EspaciosList";

export default function EspaciosPage() {
  return (
    <>
      <h1>Espacios disponibles</h1>
      <EspaciosList />
    </>
  );
}
