import { useState } from "react";
import { Search, ChevronDown, ShoppingCart, X, CheckCircle2 } from "lucide-react";
import { USERS, type PurchaseRequest } from "./data";

function statusInfo(estado: string) {
  if (estado === "pendiente")     return { label: "Pendiente",     color: "#D97706", bg: "#FEF3C7" };
  if (estado === "en_evaluacion") return { label: "En evaluación", color: "#1D6FA4", bg: "#DBEAFE" };
  if (estado === "aprobada")      return { label: "Aprobada",      color: "#16A34A", bg: "#DCFCE7" };
  return { label: "Rechazada", color: "#6B7A99", bg: "#F1F5F9" };
}

function tipoLabel(tipo: PurchaseRequest["tipo"]) {
  if (tipo === "libro_fisico")      return "Libro físico";
  if (tipo === "libro_electronico") return "Libro electrónico";
  return "Licencia digital";
}

function formatDate(str: string) {
  return new Date(str).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

interface ReviewModalProps {
  req: PurchaseRequest;
  onSave: (id: string, estado: PurchaseRequest["estado"], observaciones: string) => void;
  onClose: () => void;
}

function ReviewModal({ req, onSave, onClose }: ReviewModalProps) {
  const [estado, setEstado] = useState<PurchaseRequest["estado"]>(req.estado === "pendiente" ? "en_evaluacion" : req.estado);
  const [observaciones, setObservaciones] = useState(req.observaciones ?? "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}>
      <div className="rounded-xl w-full max-w-lg mx-4 overflow-hidden" style={{ background: "var(--card)", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: "var(--foreground)" }}>Evaluar Solicitud</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}><X size={20} /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="rounded-lg px-4 py-3" style={{ background: "var(--muted)" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)" }}>{req.titulo}</div>
            <div style={{ fontSize: 12.5, color: "var(--muted-foreground)" }}>{req.autor} · {tipoLabel(req.tipo)} · {req.cantidad} uds.</div>
            {req.asignatura && <div style={{ fontSize: 12.5, color: "var(--muted-foreground)" }}>Asignatura: {req.asignatura}</div>}
          </div>
          <div className="rounded-lg px-4 py-3" style={{ background: "var(--muted)" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Justificación del docente</div>
            <p style={{ fontSize: 13, color: "var(--foreground)", lineHeight: 1.6 }}>{req.justificacion}</p>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 6 }}>Nuevo Estado</label>
            <div className="flex gap-2 flex-wrap">
              {(["en_evaluacion", "aprobada", "rechazada"] as PurchaseRequest["estado"][]).map((s) => {
                const si = statusInfo(s);
                return (
                  <button key={s} onClick={() => setEstado(s)}
                    style={{ padding: "7px 14px", borderRadius: 7, border: `2px solid ${estado === s ? si.color : "var(--border)"}`, background: estado === s ? si.bg : "transparent", color: estado === s ? si.color : "var(--muted-foreground)", fontSize: 13, fontWeight: estado === s ? 700 : 400, cursor: "pointer" }}>
                    {si.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 6 }}>Observaciones / Respuesta</label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={4}
              placeholder="Escribe una respuesta, justificación o instrucciones para el solicitante…"
              style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--input-background)", fontSize: 13.5, color: "var(--foreground)", outline: "none", resize: "vertical" }}
            />
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t justify-end" style={{ borderColor: "var(--border)" }}>
          <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", fontSize: 13.5, cursor: "pointer", color: "var(--foreground)" }}>Cancelar</button>
          <button
            onClick={() => { onSave(req.id, estado, observaciones); onClose(); }}
            className="flex items-center gap-2"
            style={{ padding: "8px 18px", borderRadius: 6, border: "none", background: "var(--primary)", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}
          >
            <CheckCircle2 size={14} /> Guardar Evaluación
          </button>
        </div>
      </div>
    </div>
  );
}

interface AcquisitionRequestsProps {
  purchaseRequests: PurchaseRequest[];
  onRequestsChange: (reqs: PurchaseRequest[]) => void;
}

export function AcquisitionRequests({ purchaseRequests, onRequestsChange }: AcquisitionRequestsProps) {
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("all");
  const [tipoFilter, setTipoFilter] = useState("all");
  const [reviewReq, setReviewReq] = useState<PurchaseRequest | null>(null);

  function getUser(id: string) { return USERS.find((u) => u.id === id); }

  const filtered = purchaseRequests.filter((r) => {
    const q = search.toLowerCase();
    const user = getUser(r.usuarioId);
    const matchSearch = !q || r.titulo.toLowerCase().includes(q) || r.autor.toLowerCase().includes(q) || user?.nombre.toLowerCase().includes(q) || user?.apellidos.toLowerCase().includes(q);
    const matchEstado = estadoFilter === "all" || r.estado === estadoFilter;
    const matchTipo   = tipoFilter   === "all" || r.tipo   === tipoFilter;
    return matchSearch && matchEstado && matchTipo;
  });

  function handleSave(id: string, estado: PurchaseRequest["estado"], observaciones: string) {
    onRequestsChange(purchaseRequests.map((r) => r.id === id ? { ...r, estado, observaciones } : r));
  }

  const counts = {
    pendiente:     purchaseRequests.filter((r) => r.estado === "pendiente").length,
    en_evaluacion: purchaseRequests.filter((r) => r.estado === "en_evaluacion").length,
    aprobada:      purchaseRequests.filter((r) => r.estado === "aprobada").length,
    rechazada:     purchaseRequests.filter((r) => r.estado === "rechazada").length,
  };

  const selStyle: React.CSSProperties = {
    padding: "7px 32px 7px 10px", borderRadius: 6, border: "1px solid var(--border)",
    background: "var(--card)", fontSize: 13, color: "var(--foreground)", cursor: "pointer", appearance: "none",
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "var(--foreground)" }}>Solicitudes de Adquisición</h1>
        <p style={{ fontSize: 13.5, color: "var(--muted-foreground)", marginTop: 2 }}>Propuestas de compra enviadas por el personal docente</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {[
          { label: "Pendientes",     value: counts.pendiente,     color: "#D97706", bg: "#FEF3C7" },
          { label: "En evaluación",  value: counts.en_evaluacion, color: "#1D6FA4", bg: "#DBEAFE" },
          { label: "Aprobadas",      value: counts.aprobada,      color: "#16A34A", bg: "#DCFCE7" },
          { label: "Rechazadas",     value: counts.rechazada,     color: "#6B7A99", bg: "#F1F5F9" },
        ].map((c) => (
          <div key={c.label} className="rounded-lg p-4 flex items-center gap-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="rounded-lg p-2" style={{ background: c.bg }}>
              <ShoppingCart size={16} style={{ color: c.color }} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: c.color, fontFamily: "'Playfair Display', serif", lineHeight: 1.1 }}>{c.value}</div>
              <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por título, autor o docente…"
            style={{ width: "100%", padding: "8px 10px 8px 34px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", fontSize: 13.5, outline: "none", color: "var(--foreground)" }} />
        </div>
        <div className="relative">
          <select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)} style={selStyle}>
            <option value="all">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="en_evaluacion">En evaluación</option>
            <option value="aprobada">Aprobadas</option>
            <option value="rechazada">Rechazadas</option>
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted-foreground)" }} />
        </div>
        <div className="relative">
          <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)} style={selStyle}>
            <option value="all">Todos los tipos</option>
            <option value="libro_fisico">Libro físico</option>
            <option value="libro_electronico">Libro electrónico</option>
            <option value="licencia_digital">Licencia digital</option>
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted-foreground)" }} />
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="rounded-xl flex flex-col items-center py-16 gap-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <ShoppingCart size={36} style={{ color: "var(--muted-foreground)" }} />
            <span style={{ fontSize: 14, color: "var(--muted-foreground)" }}>No hay solicitudes con los filtros aplicados.</span>
          </div>
        )}
        {filtered.map((req) => {
          const s = statusInfo(req.estado);
          const user = getUser(req.usuarioId);
          return (
            <div key={req.id} className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded-md px-2 py-0.5 text-xs font-semibold" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                    <span className="rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: "var(--secondary)", color: "var(--primary)" }}>{tipoLabel(req.tipo)}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: "var(--foreground)", lineHeight: 1.3 }}>{req.titulo}</h3>
                  <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginTop: 2 }}>
                    {req.autor}{req.editorial ? ` · ${req.editorial}` : ""}{req.anio ? ` (${req.anio})` : ""}{req.isbn ? ` · ISBN: ${req.isbn}` : ""}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Solicitante</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--foreground)" }}>{user?.nombre} {user?.apellidos}</div>
                  <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{user?.carrera}</div>
                  <div style={{ fontSize: 11.5, color: "var(--muted-foreground)", marginTop: 2 }}>{formatDate(req.fechaSolicitud)}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { label: "Cantidad / Usuarios", value: req.cantidad },
                  { label: "Asignatura",           value: req.asignatura || "—" },
                  { label: "ID Solicitud",         value: req.id },
                ].map((r) => (
                  <div key={r.label} className="rounded-lg px-3 py-2" style={{ background: "var(--muted)" }}>
                    <div style={{ fontSize: 10.5, color: "var(--muted-foreground)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{r.label}</div>
                    <div style={{ fontSize: 13, color: "var(--foreground)", fontWeight: 500, marginTop: 1 }}>{r.value}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-lg px-3 py-2.5 mb-3" style={{ background: "var(--muted)" }}>
                <div style={{ fontSize: 11, color: "var(--muted-foreground)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>Justificación académica</div>
                <p style={{ fontSize: 13, color: "var(--foreground)", lineHeight: 1.6 }}>{req.justificacion}</p>
              </div>

              {req.observaciones && (
                <div className="rounded-lg px-3 py-2.5 mb-3" style={{ background: req.estado === "aprobada" ? "#DCFCE7" : req.estado === "rechazada" ? "#FEE2E2" : "#DBEAFE" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3, color: req.estado === "aprobada" ? "#16A34A" : req.estado === "rechazada" ? "#DC2626" : "#1D6FA4" }}>Tu evaluación anterior</div>
                  <p style={{ fontSize: 13, color: "var(--foreground)", lineHeight: 1.6 }}>{req.observaciones}</p>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => setReviewReq(req)}
                  style={{ padding: "7px 16px", borderRadius: 7, border: "none", background: "var(--primary)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Evaluar solicitud
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {reviewReq && <ReviewModal req={reviewReq} onSave={handleSave} onClose={() => setReviewReq(null)} />}
    </div>
  );
}
