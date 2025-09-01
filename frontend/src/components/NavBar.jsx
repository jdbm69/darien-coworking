// src/components/NavBar.jsx
// Barra de navegación con enlaces a Home, Espacios y Reservas.

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const path = usePathname();
  const isActive = (p) => (path === p ? "nav__link nav__link--active" : "nav__link");

  return (
    <nav className="nav">
      <div className="nav__inner">
        <Link className={isActive("/")} href="/">Inicio</Link>
        <Link className={isActive("/espacios")} href="/espacios">Espacios</Link>
        <Link className={isActive("/reservas")} href="/reservas">Reservas</Link>
      </div>
    </nav>
  );
}