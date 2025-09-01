// Ruta: src/components/ReservaForm.jsx
// Propósito: Formulario para crear una reserva. Si el prop `espacios` viene vacío,

"use client";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/fetcher";
import ErrorModal from "./ErrorModal";

export default function ReservaForm({ espacios = [] }) {
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
    defaultValues: { espacioId: "" }
  });

  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [espaciosList, setEspaciosList] = useState(Array.isArray(espacios) ? espacios : []);
  const [loadingEsp, setLoadingEsp] = useState(false);

  useEffect(() => {
    if (Array.isArray(espacios) && espacios.length) {
      setEspaciosList(espacios);
      setValue("espacioId", (v) => (v === undefined || v === null ? "" : v));
    }
  }, [espacios, setValue]);

  useEffect(() => {
    if (espaciosList.length === 0) {
      setLoadingEsp(true);
      apiFetch("/api/espacios")
        .then((list) => {
          setEspaciosList(Array.isArray(list) ? list : []);
          setValue("espacioId", "");
        })
        .catch((e) => setMsg("⚠️ " + (e?.message || "No se pudieron cargar los espacios")))
        .finally(() => setLoadingEsp(false));
    }
  }, [espaciosList.length, setValue]);

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
      if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("reservas:refresh"));
      reset({ espacioId: "" });
    } catch (e) {
      setMsg("⚠️ " + (e?.message || "No se pudo crear la reserva"));
      setShowModal(true);
    } finally {
      setSending(false);
    }
  };

  const placeholderText =
    loadingEsp ? "Cargando espacios…" :
    (espaciosList.length ? "Selecciona espacio…" : "No hay espacios disponibles");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <h3 className="form__title">Crear reserva</h3>

      <div className="cont-part-form">
        <div className="cont-lb-input">
          <label className="form__label">Espacio</label>

          <select
            className="select"
            disabled={loadingEsp || espaciosList.length === 0}
            {...register("espacioId", { required: true, valueAsNumber: true })}
          >
            {!loadingEsp && espaciosList.length === 0 && (
              <option value="">No hay espacios disponibles</option>
            )}
            {loadingEsp && <option value="">Cargando espacios…</option>}

            {espaciosList.map((e) => {
              const id = Number(e.id ?? e.espacioId ?? e.ID);
              const name = e.nombre ?? e.name ?? e.titulo ?? `Espacio #${id}`;
              return (
                <option key={id} value={id}>{name}</option>
              );
            })}
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

      <button className="btn btn--primary" type="submit" disabled={sending || loadingEsp || espaciosList.length === 0}>
        {sending ? "Creando…" : "Reservar"}
      </button>

      {!!msg && <ErrorModal msg={msg} setShowModal={() => {}} setMsg={setMsg} />}
    </form>
  );
}