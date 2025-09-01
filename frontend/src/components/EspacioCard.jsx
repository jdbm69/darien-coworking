// src/components/EspacioCard.jsx
// Tarjeta visual de un espacio (nombre, tipo, capacidad)

export default function EspacioCard({ espacio }) {
  return (
    <article className="card card--hover">
      <h3 className="card__title">{espacio.nombre}</h3>
      <p className="text-muted"><span className="title-span">Ubicacion:</span> {espacio.ubicacion}</p>
      <p className="text-muted"><span className="title-span">Capacidad:</span> {espacio.capacidad}</p>
    </article>
  );
}
