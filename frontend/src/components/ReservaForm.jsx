// src/components/ReservaForm.jsx
// Formulario para crear una reserva con validaciones básicas

"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { apiFetch } from "@/lib/fetcher";
import ErrorModal from "./ErrorModal";

export default function ReservaForm({ espacios = [] }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const isValidRange = (fecha, hIni, hFin) => {
    const start = new Date(`${fecha}T${hIni}:00`);
    const end   = new Date(`${fecha}T${hFin}:00`);
    return !isNaN(start) && !isNaN(end) && end > start;
  };

  const onSubmit = async (values) => {
    setMsg("");
    setSending(true);
    try {
      const payload = {
        espacioId: Number(values.espacioId),
        emailCliente: String(values.emailCliente || "").trim(),
        fecha: String(values.fecha),
        horaInicio: String(values.horaInicio),
        horaFin: String(values.horaFin),
      };

      if (!isValidRange(payload.fecha, payload.horaInicio, payload.horaFin)) {
        throw new Error("El rango de horas es inválido (Fin debe ser mayor que Inicio).");
      }

      await apiFetch("/api/reservas", { method: "POST", body: JSON.stringify(payload) });

      setMsg("✅ Reserva creada");
      setShowModal(true);
      // avisar al listado
      if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("reservas:refresh"));
      reset();
    } catch (e) {
      // Muestra literalmente lo que mande el backend (p.ej. "Máximo 3 reservas por semana" o "Horario solapado")
      setMsg("⚠️ " + (e?.message || "No se pudo crear la reserva"));
      setShowModal(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <h3 className="form__title">Crear reserva</h3>

      <div className="cont-part-form">
        <div className="cont-lb-input">
          <label className="form__label">Espacio</label>
          <select className="select" {...register("espacioId", { required: true, valueAsNumber: true })}>
            <option value="">Selecciona espacio…</option>
            {espacios.map((e) => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
          {errors.espacioId && <small className="form__error">Requerido</small>}
        </div>

        <div className="cont-lb-input">
          <label className="form__label">Email del cliente</label>
          <input
            className="input"
            placeholder="cliente@correo.com"
            {...register("emailCliente", { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
          />
          {errors.emailCliente && <small className="form__error">Email válido requerido</small>}
        </div>
      </div>

      <div className="cont-part-form">

        <div className="cont-lb-input">
          <label className="form__label">Fecha</label>
          <input className="input" type="date" {...register("fecha", { required: true })} />
        </div>

        <div className="cont-lb-input">
          <label className="form__label">Hora inicio</label>
          <input className="input" type="time" {...register("horaInicio", { required: true })} />
        </div>

        <div className="cont-lb-input">
          <label className="form__label">Hora fin</label>
          <input className="input" type="time" {...register("horaFin", { required: true })} />
        </div>
      </div>

      <button className="btn btn--primary" type="submit" disabled={sending}>
        {sending ? "Creando…" : "Reservar"}
      </button>
      {showModal && <ErrorModal msg={msg} setShowModal={setShowModal} setMsg={setMsg}/>}
    </form>
  );
}