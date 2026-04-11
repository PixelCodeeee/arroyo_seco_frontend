// ---------------------------------------------------------------------------
// Shared reservation utilities
// ---------------------------------------------------------------------------

/**
 * Robustly parse a fecha+hora pair that may come from the API as either:
 *   - Separate ISO strings:  fecha="2025-01-15T00:00:00.000Z", hora="2025-01-15T14:30:00.000Z"
 *   - Plain strings:         fecha="2025-01-15",               hora="14:30"
 * Returns a valid Date object or null.
 */
export function buildReservaDate(fecha, hora) {
    if (!fecha || !hora) return null;

    // If `hora` is already a full ISO string, extract just HH:MM from it
    const horaStr = hora.length > 5
        ? new Date(hora).toISOString().slice(11, 16)   // "HH:MM"
        : hora;                                         // already "HH:MM"

    // If `fecha` is a full ISO string, extract just YYYY-MM-DD from it
    const fechaStr = fecha.length > 10
        ? new Date(fecha).toISOString().slice(0, 10)   // "YYYY-MM-DD"
        : fecha;                                        // already "YYYY-MM-DD"

    const dt = new Date(`${fechaStr}T${horaStr}:00`);
    return isNaN(dt.getTime()) ? null : dt;
}

export function formatDate(dateString) {
    if (!dateString) return "N/A";
    // Parse as UTC date-only to avoid timezone shifting the day
    const date = dateString.length <= 10
        ? new Date(`${dateString}T00:00:00`)
        : new Date(dateString);
    return date.toLocaleDateString("es-MX", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function formatDateShort(dateString) {
    if (!dateString) return "N/A";
    const date = dateString.length <= 10
        ? new Date(`${dateString}T00:00:00`)
        : new Date(dateString);
    return date.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function formatTime(horaString) {
    if (!horaString) return "N/A";
    // If it's a full ISO datetime, extract time portion
    const date = new Date(horaString);
    if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    }
    // Bare "HH:MM" fallback
    return horaString.slice(0, 5);
}

export function getEstadoBadgeClass(estado) {
    switch (estado) {
        case "pendiente": return "badge-warning";
        case "confirmada": return "badge-success";
        case "cancelada": return "badge-danger";
        default: return "badge-secondary";
    }
}

/** Returns hours remaining until the reservation. Negative = already passed. */
export function horasHastaReserva(fecha, hora) {
    const dt = buildReservaDate(fecha, hora);
    if (!dt) return null;
    return (dt - new Date()) / (1000 * 60 * 60);
}

export function canCancelReserva(reserva) {
    if (reserva.estado === "cancelada") return false;
    const horas = horasHastaReserva(reserva.fecha, reserva.hora);
    return horas !== null && horas >= 24;
}

export function getTiempoRestanteLabel(fecha, hora) {
    const horas = horasHastaReserva(fecha, hora);
    if (horas === null) return "Fecha inválida";
    if (horas < 0) return "La reserva ya pasó";
    if (horas < 24) return `Faltan ${Math.round(horas)} horas (no cancelable)`;
    if (horas < 48) return `Faltan ${Math.round(horas)} horas`;
    return `Faltan ${Math.floor(horas / 24)} días`;
}