import { useState } from "react";
import {
  Plus,
  Search,
  X,
  CheckCircle,
  XCircle,
  ChevronDown,
  CalendarDays,
} from "lucide-react";
import {
  BOOKS,
  USERS,
  INITIAL_RESERVATIONS,
  type Reservation,
} from "./data";

function resvStatusBadge(estado: string) {
  if (estado === "pendiente")
    return {
      label: "Pendiente",
      color: "#D97706",
      bg: "#FEF3C7",
    };
  if (estado === "confirmada")
    return {
      label: "Confirmada",
      color: "#1D6FA4",
      bg: "#DBEAFE",
    };
  if (estado === "cancelada")
    return {
      label: "Cancelada",
      color: "#6B7A99",
      bg: "#F1F5F9",
    };
  return {
    label: "Completada",
    color: "#16A34A",
    bg: "#DCFCE7",
  };
}

function formatDate(str: string) {
  return new Date(str).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function daysLeft(str: string) {
  const diff = new Date(str).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

interface NewReservationFormProps {
  onSave: (r: Omit<Reservation, "id" | "estado">) => void;
  onClose: () => void;
}

function NewReservationForm({
  onSave,
  onClose,
}: NewReservationFormProps) {
  const [usuarioId, setUsuarioId] = useState("");
  const [libroId, setLibroId] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const vencimiento = new Date(Date.now() + 7 * 86400000)
    .toISOString()
    .split("T")[0];

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid var(--border)",
    background: "var(--input-background)",
    fontSize: 13.5,
    color: "var(--foreground)",
    outline: "none",
    appearance: "none",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)" }}
    >
      <div
        className="rounded-xl w-full max-w-md mx-4 overflow-hidden"
        style={{
          background: "var(--card)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
              fontSize: 18,
              color: "var(--foreground)",
            }}
          >
            Nueva Reserva
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--muted-foreground)",
            }}
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--muted-foreground)",
                display: "block",
                marginBottom: 4,
              }}
            >
              Usuario *
            </label>
            <select
              style={inputStyle}
              value={usuarioId}
              onChange={(e) => setUsuarioId(e.target.value)}
            >
              <option value="">Seleccionar usuario…</option>
              {USERS.filter((u) => u.estado === "activo").map(
                (u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombre} {u.apellidos} — {u.matricula}
                  </option>
                ),
              )}
            </select>
          </div>
          <div>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--muted-foreground)",
                display: "block",
                marginBottom: 4,
              }}
            >
              Libro *
            </label>
            <select
              style={inputStyle}
              value={libroId}
              onChange={(e) => setLibroId(e.target.value)}
            >
              <option value="">Seleccionar libro…</option>
              {BOOKS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.titulo} —{" "}
                  {b.disponibles > 0
                    ? `${b.disponibles} disponibles`
                    : "Sin existencias"}
                </option>
              ))}
            </select>
          </div>
          <div
            className="rounded-lg px-4 py-3 grid grid-cols-2 gap-3"
            style={{ background: "var(--muted)" }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--muted-foreground)",
                  fontWeight: 600,
                }}
              >
                FECHA DE RESERVA
              </div>
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "var(--foreground)",
                }}
              >
                {formatDate(today)}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--muted-foreground)",
                  fontWeight: 600,
                }}
              >
                VÁLIDA HASTA
              </div>
              <div
                style={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "var(--primary)",
                }}
              >
                {formatDate(vencimiento)}
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex gap-3 px-6 py-4 border-t justify-end"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 18px",
              borderRadius: 6,
              border: "1px solid var(--border)",
              background: "transparent",
              fontSize: 13.5,
              cursor: "pointer",
              color: "var(--foreground)",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (usuarioId && libroId)
                onSave({
                  libroId,
                  usuarioId,
                  fechaReserva: today,
                  fechaVencimiento: vencimiento,
                });
            }}
            style={{
              padding: "8px 18px",
              borderRadius: 6,
              border: "none",
              background: "var(--primary)",
              color: "#fff",
              fontSize: 13.5,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Registrar Reserva
          </button>
        </div>
      </div>
    </div>
  );
}

export function Reservations() {
  const [reservations, setReservations] = useState<
    Reservation[]
  >(INITIAL_RESERVATIONS);
  const [estadoFilter, setEstadoFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  function getBook(id: string) {
    return BOOKS.find((b) => b.id === id);
  }
  function getUser(id: string) {
    return USERS.find((u) => u.id === id);
  }

  const filtered = reservations.filter((r) => {
    const matchesEstado =
      estadoFilter === "all" || r.estado === estadoFilter;
    const q = search.toLowerCase();
    const book = getBook(r.libroId);
    const user = getUser(r.usuarioId);
    const matchesSearch =
      !q ||
      book?.titulo.toLowerCase().includes(q) ||
      user?.nombre.toLowerCase().includes(q) ||
      user?.apellidos.toLowerCase().includes(q);
    return matchesEstado && matchesSearch;
  });

  function handleNewReservation(
    data: Omit<Reservation, "id" | "estado">,
  ) {
    const newR: Reservation = {
      ...data,
      id: `R${String(reservations.length + 1).padStart(3, "0")}`,
      estado: "pendiente",
    };
    setReservations((prev) => [newR, ...prev]);
    setShowForm(false);
  }

  function handleConfirm(id: string) {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, estado: "confirmada" } : r,
      ),
    );
  }

  function handleCancel(id: string) {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, estado: "cancelada" } : r,
      ),
    );
  }

  const counts = {
    pendiente: reservations.filter(
      (r) => r.estado === "pendiente",
    ).length,
    confirmada: reservations.filter(
      (r) => r.estado === "confirmada",
    ).length,
    cancelada: reservations.filter(
      (r) => r.estado === "cancelada",
    ).length,
    completada: reservations.filter(
      (r) => r.estado === "completada",
    ).length,
  };

  const selStyle: React.CSSProperties = {
    padding: "7px 32px 7px 10px",
    borderRadius: 6,
    border: "1px solid var(--border)",
    background: "var(--card)",
    fontSize: 13,
    color: "var(--foreground)",
    cursor: "pointer",
    appearance: "none",
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 26,
              fontWeight: 700,
              color: "var(--foreground)",
            }}
          >
            Reservas de Libros
          </h1>
          <p
            style={{
              fontSize: 13.5,
              color: "var(--muted-foreground)",
              marginTop: 2,
            }}
          >
            {counts.pendiente} reservas en espera de atención
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
          style={{
            padding: "9px 16px",
            borderRadius: 7,
            border: "none",
            background: "var(--primary)",
            color: "#fff",
            fontSize: 13.5,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          <Plus size={16} /> Nueva Reserva
        </button>
      </div>

      {/* Summary cards */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        {[
          {
            label: "Pendientes",
            value: counts.pendiente,
            color: "#D97706",
            bg: "#FEF3C7",
          },
          {
            label: "Confirmadas",
            value: counts.confirmada,
            color: "#1D6FA4",
            bg: "#DBEAFE",
          },
          {
            label: "Completadas",
            value: counts.completada,
            color: "#16A34A",
            bg: "#DCFCE7",
          },
          {
            label: "Canceladas",
            value: counts.cancelada,
            color: "#6B7A99",
            bg: "#F1F5F9",
          },
        ].map((c) => (
          <div
            key={c.label}
            className="rounded-lg p-4 flex items-center gap-3"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              className="rounded-lg p-2"
              style={{ background: c.bg }}
            >
              <CalendarDays
                size={16}
                style={{ color: c.color }}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "var(--foreground)",
                  fontFamily: "'Playfair Display', serif",
                  lineHeight: 1.1,
                }}
              >
                {c.value}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--muted-foreground)",
                }}
              >
                {c.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--muted-foreground)" }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por libro o usuario…"
            style={{
              width: "100%",
              padding: "8px 10px 8px 34px",
              borderRadius: 6,
              border: "1px solid var(--border)",
              background: "var(--card)",
              fontSize: 13.5,
              outline: "none",
              color: "var(--foreground)",
            }}
          />
        </div>
        <div className="relative">
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            style={selStyle}
          >
            <option value="all">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="confirmada">Confirmadas</option>
            <option value="cancelada">Canceladas</option>
            <option value="completada">Completadas</option>
          </select>
          <ChevronDown
            size={13}
            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--muted-foreground)" }}
          />
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <div className="overflow-x-auto">
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "var(--muted)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {[
                  "ID",
                  "Libro",
                  "Solicitante",
                  "F. Reserva",
                  "Válida Hasta",
                  "Estado",
                  "Acciones",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 14px",
                      textAlign: "left",
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: "var(--muted-foreground)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "var(--muted-foreground)",
                      fontSize: 14,
                    }}
                  >
                    No se encontraron reservas.
                  </td>
                </tr>
              )}
              {filtered.map((resv, i) => {
                const book = getBook(resv.libroId);
                const user = getUser(resv.usuarioId);
                const s = resvStatusBadge(resv.estado);
                const days = daysLeft(resv.fechaVencimiento);
                return (
                  <tr
                    key={resv.id}
                    style={{
                      borderBottom: "1px solid var(--border)",
                      background:
                        i % 2 === 0
                          ? "transparent"
                          : "rgba(0,0,0,0.012)",
                    }}
                  >
                    <td
                      style={{
                        padding: "11px 14px",
                        fontSize: 12,
                        color: "var(--muted-foreground)",
                        fontFamily: "monospace",
                      }}
                    >
                      {resv.id}
                    </td>
                    <td
                      style={{
                        padding: "11px 14px",
                        maxWidth: 200,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 600,
                          color: "var(--foreground)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {book?.titulo}
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: "var(--muted-foreground)",
                        }}
                      >
                        {book?.disponibles === 0 ? (
                          <span style={{ color: "#DC2626" }}>
                            Sin existencias
                          </span>
                        ) : (
                          <span style={{ color: "#16A34A" }}>
                            {book?.disponibles} disponibles
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 500,
                          color: "var(--foreground)",
                        }}
                      >
                        {user?.nombre} {user?.apellidos}
                      </div>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: "var(--muted-foreground)",
                        }}
                      >
                        {user?.matricula}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "11px 14px",
                        fontSize: 13,
                        color: "var(--foreground)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(resv.fechaReserva)}
                    </td>
                    <td
                      style={{
                        padding: "11px 14px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          color:
                            days < 0
                              ? "#DC2626"
                              : "var(--foreground)",
                        }}
                      >
                        {formatDate(resv.fechaVencimiento)}
                      </div>
                      {(resv.estado === "pendiente" ||
                        resv.estado === "confirmada") && (
                        <div
                          style={{
                            fontSize: 11,
                            color:
                              days < 0
                                ? "#DC2626"
                                : days <= 2
                                  ? "#D97706"
                                  : "var(--muted-foreground)",
                          }}
                        >
                          {days < 0
                            ? "Expirada"
                            : days === 0
                              ? "Vence hoy"
                              : `${days}d restantes`}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <span
                        className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
                        style={{
                          background: s.bg,
                          color: s.color,
                        }}
                      >
                        {s.label}
                      </span>
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      {resv.estado === "pendiente" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleConfirm(resv.id)
                            }
                            className="flex items-center gap-1"
                            style={{
                              padding: "5px 10px",
                              borderRadius: 5,
                              border: "none",
                              background: "#DBEAFE",
                              color: "#1D6FA4",
                              fontSize: 12,
                              cursor: "pointer",
                              fontWeight: 600,
                            }}
                          >
                            <CheckCircle size={12} /> Confirmar
                          </button>
                          <button
                            onClick={() =>
                              handleCancel(resv.id)
                            }
                            className="flex items-center gap-1"
                            style={{
                              padding: "5px 10px",
                              borderRadius: 5,
                              border: "none",
                              background: "#FEE2E2",
                              color: "#DC2626",
                              fontSize: 12,
                              cursor: "pointer",
                              fontWeight: 600,
                            }}
                          >
                            <XCircle size={12} /> Cancelar
                          </button>
                        </div>
                      )}
                      {resv.estado === "confirmada" && (
                        <button
                          onClick={() => handleCancel(resv.id)}
                          className="flex items-center gap-1"
                          style={{
                            padding: "5px 10px",
                            borderRadius: 5,
                            border: "none",
                            background: "#FEE2E2",
                            color: "#DC2626",
                            fontSize: 12,
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          <XCircle size={12} /> Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div
          className="px-5 py-3 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <span
            style={{
              fontSize: 12.5,
              color: "var(--muted-foreground)",
            }}
          >
            Mostrando {filtered.length} de {reservations.length}{" "}
            reservas
          </span>
        </div>
      </div>

      {showForm && (
        <NewReservationForm
          onSave={handleNewReservation}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}