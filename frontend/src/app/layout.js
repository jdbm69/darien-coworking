// src/app/layout.js
// Layout raíz (App Router). Importa Sass global y muestra NavBar y el contenedor principal.

import "@/styles/index.scss";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "Darien Coworking",
  description: "Reserva tu espacio de coworking",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main className="container">{children}</main>
      </body>
    </html>
  );
}