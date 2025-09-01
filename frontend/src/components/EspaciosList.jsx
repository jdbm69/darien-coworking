// src/components/EspaciosList.jsx
// Obtener y renderizar el listado de espacios con tarjetas

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/fetcher";
import EspacioCard from "./EspacioCard";
import Loader from "./Loader";

export default function EspaciosList() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiFetch("/api/espacios");
        setItems(data);
      } catch (e) {
        setErr(e.message || "Error inesperado al cargar espacios");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />

  if (err) return <div className="alert alert--danger">⚠️ {err}</div>;

  return (
    <div className="grid grid--3">
      {items?.map((e) => (
        <Link key={e.id} href={`/espacios/${e.id}`}>
          <EspacioCard espacio={e} />
        </Link>
      ))}
    </div>
  );
}
