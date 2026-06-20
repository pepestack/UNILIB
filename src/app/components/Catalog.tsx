import { useState } from "react";
import { Search, X, ChevronDown, BookMarked, CheckCircle2, AlertTriangle, CalendarDays, ShoppingCart } from "lucide-react";
import { BOOKS, USERS, type Book, type BookCategory, type Loan, type AuthUser, type ModuleId, type PurchaseRequest } from "./data";
import { BookCover } from "./BookCover";

const CATEGORIES: BookCategory[] = [
  "Derecho", "Medicina", "Matemáticas", "Historia", "Administración",
  "Psicología", "Informática", "Arquitectura", "Sociología", "Literatura", "Ingeniería",
];

function AvailBadge({ disponibles, total }: { disponibles: number; total: number }) {
  const color = disponibles === 0 ? "#DC2626" : disponibles < total * 0.4 ? "#D97706" : "#16A34A";
  const bg    = disponibles === 0 ? "#FEE2E2" : disponibles < total * 0.4 ? "#FEF3C7" : "#DCFCE7";
  return (
    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: bg, color }}>
      {disponibles}/{total}
    </span>
  );
}

// ─── Loan Request Modal (estudiante / docente regular) ────────────────────────

interface LoanRequestModalProps {
  book: Book;
  authUser: AuthUser;
  userActiveLoans: number;
  userLoanLimit: number;
  onConfirm: () => void;
  onClose: () => void;
}

function LoanRequestModal({ book, authUser, userActiveLoans, userLoanLimit, onConfirm, onClose }: LoanRequestModalProps) {
  const [confirmed, setConfirmed] = useState(false);
  const atLimit = userActiveLoans >= userLoanLimit;
  const dueDate = new Date(Date.now() + 14 * 86400000).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-2xl w-full max-w-md mx-4 overflow-hidden" style={{ background: "var(--card)", boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}>
        {confirmed ? (
          <div className="flex flex-col items-center px-8 py-10 gap-4">
            <div className="flex items-center justify-center rounded-full" style={{ width: 64, height: 64, background: "#FEF3C7" }}>
              <CheckCircle2 size={32} style={{ color: "#D97706" }} />
            </div>
            <div className="text-center">
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: "var(--foreground)", marginBottom: 6 }}>Solicitud Enviada</h3>
              <p style={{ fontSize: 14, color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: 4 }}>
                Tu solicitud de <strong style={{ color: "var(--foreground)" }}>"{book.titulo}"</strong> fue registrada y está pendiente de aprobación por el bibliotecario.
              </p>
              <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>Puedes seguir el estado en <strong>Mis Préstamos</strong>.</p>
            </div>
            <button onClick={onClose} style={{ width: "100%", padding: "11px", borderRadius: 8, border: "none", background: "var(--primary)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>
              Aceptar
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "var(--foreground)" }}>Solicitar Préstamo</h2>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}><X size={20} /></button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="flex gap-4 rounded-xl p-4" style={{ background: "var(--muted)" }}>
                <BookCover book={book} size="sm" />
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", fontFamily: "'Playfair Display', serif", lineHeight: 1.3, marginBottom: 3 }}>{book.titulo}</div>
                  <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 6 }}>{book.autor}</div>
                  <AvailBadge disponibles={book.disponibles} total={book.totalEjemplares} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg px-4 py-3" style={{ background: "var(--muted)" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Solicitante</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>{authUser.name}</div>
                </div>
                <div className="rounded-lg px-4 py-3" style={{ background: "var(--muted)" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Devolución estimada</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--primary)" }}>{dueDate}</div>
                </div>
                <div className="rounded-lg px-4 py-3" style={{ background: "var(--muted)" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Período</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>14 días naturales</div>
                </div>
                <div className="rounded-lg px-4 py-3" style={{ background: "var(--muted)" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Capacidad restante</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: atLimit ? "#DC2626" : "var(--foreground)" }}>{userLoanLimit - userActiveLoans} de {userLoanLimit}</div>
                </div>
              </div>
              {atLimit && (
                <div className="flex items-start gap-3 rounded-lg px-4 py-3" style={{ background: "#FEE2E2", border: "1px solid #FECACA" }}>
                  <AlertTriangle size={15} style={{ color: "#DC2626", flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 13, color: "#991B1B" }}>Has alcanzado tu límite de préstamos. Devuelve un libro antes de solicitar uno nuevo.</span>
                </div>
              )}
              <div className="rounded-lg px-4 py-3 flex items-start gap-2" style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}>
                <AlertTriangle size={14} style={{ color: "#D97706", flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 12.5, color: "#92400E" }}>La solicitud quedará <strong>pendiente</strong> hasta que el bibliotecario la apruebe.</span>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t justify-end" style={{ borderColor: "var(--border)" }}>
              <button onClick={onClose} style={{ padding: "9px 20px", borderRadius: 7, border: "1px solid var(--border)", background: "transparent", fontSize: 13.5, cursor: "pointer", color: "var(--foreground)" }}>Cancelar</button>
              <button
                onClick={() => { if (!atLimit) { onConfirm(); setConfirmed(true); } }}
                disabled={atLimit}
                style={{ padding: "9px 20px", borderRadius: 7, border: "none", background: atLimit ? "var(--muted)" : "var(--primary)", color: atLimit ? "var(--muted-foreground)" : "#fff", fontSize: 13.5, cursor: atLimit ? "not-allowed" : "pointer", fontWeight: 600 }}
              >
                Enviar Solicitud
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── External Loan Modal (docente) ────────────────────────────────────────────

interface ExternalLoanModalProps {
  book: Book;
  authUser: AuthUser;
  userActiveLoans: number;
  userLoanLimit: number;
  onConfirm: (cantidad: number, dias: number, justificacion: string) => void;
  onClose: () => void;
}

function ExternalLoanModal({ book, authUser, userActiveLoans, userLoanLimit, onConfirm, onClose }: ExternalLoanModalProps) {
  const [cantidad, setCantidad] = useState(1);
  const [dias, setDias] = useState(30);
  const [justificacion, setJustificacion] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const maxCopies = Math.min(book.disponibles, userLoanLimit - userActiveLoans, 5);
  const atLimit = userActiveLoans >= userLoanLimit || book.disponibles === 0;
  const dueDate = new Date(Date.now() + dias * 86400000).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)",
    background: "var(--input-background)", fontSize: 13.5, color: "var(--foreground)", outline: "none", appearance: "none",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-2xl w-full max-w-md mx-4 overflow-hidden" style={{ background: "var(--card)", boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}>
        {confirmed ? (
          <div className="flex flex-col items-center px-8 py-10 gap-4">
            <div className="flex items-center justify-center rounded-full" style={{ width: 64, height: 64, background: "#EDE9FE" }}>
              <CheckCircle2 size={32} style={{ color: "#7C3AED" }} />
            </div>
            <div className="text-center">
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: "var(--foreground)", marginBottom: 6 }}>Préstamo Externo Solicitado</h3>
              <p style={{ fontSize: 14, color: "var(--muted-foreground)", lineHeight: 1.6 }}>
                Se solicitó <strong style={{ color: "var(--foreground)" }}>{cantidad} ejemplar{cantidad > 1 ? "es" : ""}</strong> de <strong style={{ color: "var(--foreground)" }}>"{book.titulo}"</strong> por <strong>{dias} días</strong>. Pendiente de aprobación.
              </p>
            </div>
            <button onClick={onClose} style={{ width: "100%", padding: "11px", borderRadius: 8, border: "none", background: "var(--primary)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>
              Aceptar
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: "var(--foreground)" }}>Préstamo Externo</h2>
                <p style={{ fontSize: 12, color: "#7C3AED", marginTop: 1 }}>Modalidad docente — múltiples ejemplares</p>
              </div>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}><X size={20} /></button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="flex gap-3 rounded-xl p-3" style={{ background: "var(--muted)" }}>
                <BookCover book={book} size="xs" />
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{book.titulo}</div>
                  <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{book.autor}</div>
                  <AvailBadge disponibles={book.disponibles} total={book.totalEjemplares} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Ejemplares a solicitar (máx. {maxCopies})</label>
                  <input type="number" style={inputStyle} value={cantidad} min={1} max={Math.max(1, maxCopies)}
                    onChange={(e) => setCantidad(Math.min(Math.max(1, Number(e.target.value)), Math.max(1, maxCopies)))} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Duración del préstamo</label>
                  <select style={inputStyle} value={dias} onChange={(e) => setDias(Number(e.target.value))}>
                    <option value={30}>30 días (1 mes)</option>
                    <option value={60}>60 días (2 meses)</option>
                    <option value={90}>90 días (1 semestre)</option>
                    <option value={180}>180 días (2 semestres)</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Justificación académica *</label>
                <textarea
                  value={justificacion}
                  onChange={(e) => setJustificacion(e.target.value)}
                  placeholder="Describe el uso académico de los ejemplares solicitados (asignatura, investigación, etc.)"
                  style={{ ...inputStyle, resize: "vertical" }}
                  rows={3}
                />
              </div>
              <div className="rounded-lg px-4 py-3 grid grid-cols-2 gap-3" style={{ background: "var(--muted)" }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase" }}>Devolución estimada</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)" }}>{dueDate}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase" }}>Solicitante</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{authUser.name}</div>
                </div>
              </div>
              {atLimit && (
                <div className="flex items-start gap-3 rounded-lg px-4 py-3" style={{ background: "#FEE2E2", border: "1px solid #FECACA" }}>
                  <AlertTriangle size={15} style={{ color: "#DC2626", flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 13, color: "#991B1B" }}>
                    {book.disponibles === 0 ? "Este título no tiene ejemplares disponibles." : "Has alcanzado tu límite de préstamos."}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t justify-end" style={{ borderColor: "var(--border)" }}>
              <button onClick={onClose} style={{ padding: "9px 20px", borderRadius: 7, border: "1px solid var(--border)", background: "transparent", fontSize: 13.5, cursor: "pointer", color: "var(--foreground)" }}>Cancelar</button>
              <button
                onClick={() => { if (!atLimit && justificacion.trim()) { onConfirm(cantidad, dias, justificacion); setConfirmed(true); } }}
                disabled={atLimit || !justificacion.trim()}
                style={{ padding: "9px 20px", borderRadius: 7, border: "none", background: atLimit || !justificacion.trim() ? "var(--muted)" : "#7C3AED", color: atLimit || !justificacion.trim() ? "var(--muted-foreground)" : "#fff", fontSize: 13.5, cursor: atLimit || !justificacion.trim() ? "not-allowed" : "pointer", fontWeight: 600 }}
              >
                Solicitar Préstamo Externo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Reservation Modal (unavailable books) ────────────────────────────────────

interface ReserveModalProps {
  book: Book;
  authUser: AuthUser;
  onConfirm: () => void;
  onClose: () => void;
}

function ReserveModal({ book, authUser, onConfirm, onClose }: ReserveModalProps) {
  const [confirmed, setConfirmed] = useState(false);
  const vencimiento = new Date(Date.now() + 7 * 86400000).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-2xl w-full max-w-sm mx-4 overflow-hidden" style={{ background: "var(--card)", boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}>
        {confirmed ? (
          <div className="flex flex-col items-center px-8 py-10 gap-4">
            <div className="flex items-center justify-center rounded-full" style={{ width: 60, height: 60, background: "#DBEAFE" }}>
              <CheckCircle2 size={28} style={{ color: "#1D6FA4" }} />
            </div>
            <div className="text-center">
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "var(--foreground)", marginBottom: 6 }}>Reserva Registrada</h3>
              <p style={{ fontSize: 13.5, color: "var(--muted-foreground)", lineHeight: 1.6 }}>
                Serás notificado cuando "<strong style={{ color: "var(--foreground)" }}>{book.titulo}</strong>" esté disponible. La reserva vence el <strong>{vencimiento}</strong>.
              </p>
            </div>
            <button onClick={onClose} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "var(--primary)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>
              Aceptar
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: "var(--foreground)" }}>Reservar Libro</h2>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}><X size={18} /></button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="flex gap-3 rounded-xl p-3" style={{ background: "var(--muted)" }}>
                <BookCover book={book} size="xs" />
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{book.titulo}</div>
                  <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{book.autor}</div>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: "#DC2626" }}>Sin ejemplares disponibles</span>
                </div>
              </div>
              <p style={{ fontSize: 13.5, color: "var(--muted-foreground)", lineHeight: 1.6 }}>
                Al confirmar, quedarás en lista de espera. La reserva será válida por <strong style={{ color: "var(--foreground)" }}>7 días</strong> una vez que se libere un ejemplar (vence el <strong style={{ color: "var(--primary)" }}>{vencimiento}</strong>).
              </p>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t justify-end" style={{ borderColor: "var(--border)" }}>
              <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 7, border: "1px solid var(--border)", background: "transparent", fontSize: 13.5, cursor: "pointer", color: "var(--foreground)" }}>Cancelar</button>
              <button
                onClick={() => { onConfirm(); setConfirmed(true); }}
                className="flex items-center gap-2"
                style={{ padding: "8px 18px", borderRadius: 7, border: "none", background: "var(--primary)", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}
              >
                <CalendarDays size={14} /> Confirmar Reserva
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Purchase Request Modal (docente) ─────────────────────────────────────────

interface PurchaseRequestModalProps {
  authUser: AuthUser;
  onConfirm: (req: Omit<PurchaseRequest, "id" | "estado" | "fechaSolicitud">) => void;
  onClose: () => void;
  prefillBook?: Book;
}

function PurchaseRequestModal({ authUser, onConfirm, onClose, prefillBook }: PurchaseRequestModalProps) {
  const [form, setForm] = useState({
    titulo: prefillBook?.titulo ?? "",
    autor: prefillBook?.autor ?? "",
    isbn: prefillBook?.isbn ?? "",
    editorial: prefillBook?.editorial ?? "",
    anio: prefillBook?.anio ?? new Date().getFullYear(),
    tipo: "libro_fisico" as PurchaseRequest["tipo"],
    cantidad: 1,
    justificacion: "",
    asignatura: "",
  });
  const [confirmed, setConfirmed] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)",
    background: "var(--input-background)", fontSize: 13.5, color: "var(--foreground)", outline: "none", appearance: "none",
  };
  const field = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm((p) => ({ ...p, [k]: val }));
  };
  const canSubmit = form.titulo.trim() && form.autor.trim() && form.justificacion.trim();

  const tipoLabels: Record<PurchaseRequest["tipo"], string> = {
    libro_fisico: "Libro físico",
    libro_electronico: "Libro electrónico (e-book)",
    licencia_digital: "Licencia digital / base de datos",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-2xl w-full max-w-lg mx-4 overflow-hidden" style={{ background: "var(--card)", boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}>
        {confirmed ? (
          <div className="flex flex-col items-center px-8 py-10 gap-4">
            <div className="flex items-center justify-center rounded-full" style={{ width: 64, height: 64, background: "#DCFCE7" }}>
              <CheckCircle2 size={32} style={{ color: "#16A34A" }} />
            </div>
            <div className="text-center">
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: "var(--foreground)", marginBottom: 6 }}>Solicitud Enviada</h3>
              <p style={{ fontSize: 14, color: "var(--muted-foreground)", lineHeight: 1.6 }}>
                Tu solicitud de adquisición de <strong style={{ color: "var(--foreground)" }}>"{form.titulo}"</strong> ha sido enviada al bibliotecario para evaluación.
              </p>
            </div>
            <button onClick={onClose} style={{ width: "100%", padding: "11px", borderRadius: 8, border: "none", background: "var(--primary)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>
              Aceptar
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: "var(--foreground)" }}>Solicitar Adquisición</h2>
                <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 1 }}>Propuesta de compra o licencia para la biblioteca</p>
              </div>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}><X size={20} /></button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-3 max-h-[68vh] overflow-y-auto">
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Título *</label>
                <input style={inputStyle} value={form.titulo} onChange={field("titulo")} placeholder="Título del libro o recurso" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Autor(es) *</label>
                <input style={inputStyle} value={form.autor} onChange={field("autor")} placeholder="Apellido, Nombre" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>ISBN / DOI</label>
                  <input style={inputStyle} value={form.isbn} onChange={field("isbn")} placeholder="Opcional" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Año edición</label>
                  <input type="number" style={inputStyle} value={form.anio} onChange={field("anio")} min={2000} max={2030} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Tipo de recurso *</label>
                  <select style={inputStyle} value={form.tipo} onChange={field("tipo")}>
                    {(Object.entries(tipoLabels) as [PurchaseRequest["tipo"], string][]).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>
                    {form.tipo === "licencia_digital" ? "Usuarios concurrentes" : "Cantidad sugerida"}
                  </label>
                  <input type="number" style={inputStyle} value={form.cantidad} onChange={field("cantidad")} min={1} max={100} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Asignatura / Programa</label>
                <input style={inputStyle} value={form.asignatura} onChange={field("asignatura")} placeholder="Nombre de la asignatura o programa académico" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Justificación académica *</label>
                <textarea style={{ ...inputStyle, resize: "vertical" }} rows={4} value={form.justificacion} onChange={field("justificacion")}
                  placeholder="Explica por qué es necesario adquirir este recurso, número de estudiantes beneficiados, comparación con recursos existentes, etc." />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t justify-end" style={{ borderColor: "var(--border)" }}>
              <button onClick={onClose} style={{ padding: "9px 20px", borderRadius: 7, border: "1px solid var(--border)", background: "transparent", fontSize: 13.5, cursor: "pointer", color: "var(--foreground)" }}>Cancelar</button>
              <button
                onClick={() => { if (canSubmit) { onConfirm({ ...form, usuarioId: authUser.userId! }); setConfirmed(true); } }}
                disabled={!canSubmit}
                className="flex items-center gap-2"
                style={{ padding: "9px 20px", borderRadius: 7, border: "none", background: !canSubmit ? "var(--muted)" : "var(--primary)", color: !canSubmit ? "var(--muted-foreground)" : "#fff", fontSize: 13.5, fontWeight: 600, cursor: !canSubmit ? "not-allowed" : "pointer" }}
              >
                <ShoppingCart size={14} /> Enviar Solicitud
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Book Detail ──────────────────────────────────────────────────────────────

interface BookDetailProps {
  book: Book;
  canBorrow: boolean;
  isDocente: boolean;
  alreadyBorrowed: boolean;
  onClose: () => void;
  onRequestLoan?: () => void;
  onExternalLoan?: () => void;
  onReserve?: () => void;
  onRequestPurchase?: () => void;
}

function BookDetail({ book, canBorrow, isDocente, alreadyBorrowed, onClose, onRequestLoan, onExternalLoan, onReserve, onRequestPurchase }: BookDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}>
      <div className="rounded-xl w-full max-w-md mx-4 overflow-hidden" style={{ background: "var(--card)", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "var(--foreground)" }}>Detalle del Libro</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}><X size={20} /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <BookCover book={book} size="md" />
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)", fontFamily: "'Playfair Display', serif", lineHeight: 1.3, marginBottom: 4 }}>{book.titulo}</div>
              <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 6 }}>{book.autor}</div>
              <AvailBadge disponibles={book.disponibles} total={book.totalEjemplares} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "ISBN", value: book.isbn }, { label: "Editorial", value: book.editorial },
              { label: "Año", value: book.anio }, { label: "Categoría", value: book.categoria },
              { label: "Ubicación", value: book.ubicacion }, { label: "Ejemplares", value: `${book.totalEjemplares} totales` },
            ].map((r) => (
              <div key={r.label} className="rounded-lg px-3 py-2" style={{ background: "var(--muted)" }}>
                <div style={{ fontSize: 11, color: "var(--muted-foreground)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{r.label}</div>
                <div style={{ fontSize: 13, color: "var(--foreground)", fontWeight: 500, marginTop: 1 }}>{r.value}</div>
              </div>
            ))}
          </div>
          {book.descripcion && <p style={{ fontSize: 13.5, color: "var(--foreground)", lineHeight: 1.6 }}>{book.descripcion}</p>}
        </div>
        <div className="flex flex-wrap gap-2 px-6 py-4 border-t" style={{ borderColor: "var(--border)" }}>
          <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: 7, border: "1px solid var(--border)", background: "transparent", fontSize: 13, cursor: "pointer", color: "var(--foreground)" }}>Cerrar</button>
          {canBorrow && book.disponibles > 0 && !alreadyBorrowed && (
            <button onClick={() => { onClose(); onRequestLoan?.(); }} className="flex items-center gap-1.5"
              style={{ padding: "8px 16px", borderRadius: 7, border: "none", background: "var(--primary)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              <BookMarked size={13} /> Solicitar Préstamo
            </button>
          )}
          {isDocente && book.disponibles > 0 && (
            <button onClick={() => { onClose(); onExternalLoan?.(); }} className="flex items-center gap-1.5"
              style={{ padding: "8px 16px", borderRadius: 7, border: "none", background: "#7C3AED", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              <BookMarked size={13} /> Préstamo Externo
            </button>
          )}
          {canBorrow && book.disponibles === 0 && (
            <button onClick={() => { onClose(); onReserve?.(); }} className="flex items-center gap-1.5"
              style={{ padding: "8px 16px", borderRadius: 7, border: "none", background: "var(--primary)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              <CalendarDays size={13} /> Reservar
            </button>
          )}
          {isDocente && (
            <button onClick={() => { onClose(); onRequestPurchase?.(); }} className="flex items-center gap-1.5"
              style={{ padding: "8px 16px", borderRadius: 7, border: "none", background: "#DCFCE7", color: "#16A34A", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              <ShoppingCart size={13} /> Solicitar Adquisición
            </button>
          )}
          {alreadyBorrowed && (
            <span className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium" style={{ background: "#DCFCE7", color: "#16A34A" }}>
              <CheckCircle2 size={13} /> Ya en préstamo
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface CatalogProps {
  authUser?: AuthUser;
  loans?: Loan[];
  onRequestLoan?: (bookId: string, userId: string, tipo?: "regular" | "externo", cantidad?: number, dias?: number, justificacion?: string) => void;
  onRequestReservation?: (bookId: string, userId: string) => void;
  onRequestPurchase?: (req: Omit<PurchaseRequest, "id" | "estado" | "fechaSolicitud">) => void;
  onNavigate?: (module: ModuleId) => void;
}

export function Catalog({ authUser, loans = [], onRequestLoan, onRequestReservation, onRequestPurchase, onNavigate }: CatalogProps) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [availFilter, setAvailFilter] = useState<string>("all");
  const [detailBook, setDetailBook] = useState<Book | null>(null);
  const [loanRequestBook, setLoanRequestBook] = useState<Book | null>(null);
  const [externalLoanBook, setExternalLoanBook] = useState<Book | null>(null);
  const [reserveBook, setReserveBook] = useState<Book | null>(null);
  const [purchaseBook, setPurchaseBook] = useState<Book | undefined>(undefined);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const canBorrow = authUser?.role === "estudiante" || authUser?.role === "docente";
  const isDocente = authUser?.role === "docente";

  const currentUser = canBorrow && authUser?.userId ? USERS.find((u) => u.id === authUser.userId) : null;
  const myActiveLoans = canBorrow ? loans.filter((l) => l.usuarioId === authUser?.userId && l.estado !== "devuelto" && l.estado !== "rechazado") : [];

  function isAlreadyBorrowed(bookId: string) {
    return myActiveLoans.some((l) => l.libroId === bookId && (l.estado === "activo" || l.estado === "pendiente"));
  }

  const filtered = BOOKS.filter((b) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || b.titulo.toLowerCase().includes(q) || b.autor.toLowerCase().includes(q) || b.isbn.includes(q);
    const matchesCat = catFilter === "all" || b.categoria === catFilter;
    const matchesAvail = availFilter === "all" || (availFilter === "disponible" ? b.disponibles > 0 : b.disponibles === 0);
    return matchesSearch && matchesCat && matchesAvail;
  });

  const selStyle: React.CSSProperties = {
    padding: "7px 32px 7px 10px", borderRadius: 6, border: "1px solid var(--border)",
    background: "var(--card)", fontSize: 13, color: "var(--foreground)", cursor: "pointer", appearance: "none",
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "var(--foreground)" }}>Catálogo</h1>
          <p style={{ fontSize: 13.5, color: "var(--muted-foreground)", marginTop: 2 }}>{BOOKS.length} títulos en la colección</p>
        </div>
        <div className="flex items-center gap-3">
          {canBorrow && currentUser && (
            <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <BookMarked size={16} style={{ color: "var(--primary)" }} />
              <div>
                <div style={{ fontSize: 11.5, color: "var(--muted-foreground)" }}>Préstamos activos</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: myActiveLoans.length >= currentUser.limitePrestamos ? "#DC2626" : "var(--foreground)" }}>
                  {myActiveLoans.length} / {currentUser.limitePrestamos}
                </div>
              </div>
            </div>
          )}
          {isDocente && onRequestPurchase && (
            <button
              onClick={() => { setPurchaseBook(undefined); setShowPurchaseModal(true); }}
              className="flex items-center gap-2"
              style={{ padding: "9px 16px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)", fontSize: 13.5, cursor: "pointer", fontWeight: 600 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--secondary)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--card)")}
            >
              <ShoppingCart size={15} style={{ color: "#16A34A" }} /> Solicitar adquisición
            </button>
          )}
        </div>
      </div>

      {/* Docente banner */}
      {isDocente && (
        <div className="rounded-lg px-4 py-3 flex items-center gap-3" style={{ background: "#EDE9FE", border: "1px solid #DDD6FE" }}>
          <BookMarked size={15} style={{ color: "#7C3AED", flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: "#4C1D95" }}>
            Como docente puedes solicitar <strong>préstamos externos</strong> (múltiples ejemplares, duración extendida) y proponer <strong>adquisiciones</strong> al bibliotecario.
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por título, autor o ISBN…"
            style={{ width: "100%", padding: "8px 10px 8px 34px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", fontSize: 13.5, color: "var(--foreground)", outline: "none" }} />
        </div>
        <div className="relative">
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={selStyle}>
            <option value="all">Todas las áreas</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted-foreground)" }} />
        </div>
        <div className="relative">
          <select value={availFilter} onChange={(e) => setAvailFilter(e.target.value)} style={selStyle}>
            <option value="all">Disponibilidad</option>
            <option value="disponible">Con existencias</option>
            <option value="agotado">Sin existencias</option>
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted-foreground)" }} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="overflow-x-auto">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                {["", "ISBN", "Título / Autor", "Editorial", "Área", "Año", "Ejemplares", ...(canBorrow ? ["Acción"] : [])].map((h, i) => (
                  <th key={i} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11.5, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={canBorrow ? 8 : 7} style={{ padding: 40, textAlign: "center", color: "var(--muted-foreground)", fontSize: 14 }}>No se encontraron libros con los filtros aplicados.</td></tr>
              )}
              {filtered.map((book, i) => {
                const borrowed = isAlreadyBorrowed(book.id);
                const atLimit = currentUser ? myActiveLoans.length >= currentUser.limitePrestamos : false;
                return (
                  <tr key={book.id}
                    style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.012)", cursor: "pointer", transition: "background 0.1s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--secondary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.012)")}
                    onClick={() => setDetailBook(book)}
                  >
                    <td style={{ padding: "10px 12px", width: 48 }}><BookCover book={book} size="xs" /></td>
                    <td style={{ padding: "10px 12px", fontSize: 11.5, color: "var(--muted-foreground)", fontFamily: "monospace", whiteSpace: "nowrap" }}>{book.isbn}</td>
                    <td style={{ padding: "10px 12px", maxWidth: 220 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{book.titulo}</div>
                      <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{book.autor}</div>
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 13, color: "var(--foreground)", whiteSpace: "nowrap" }}>{book.editorial}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: "var(--secondary)", color: "var(--primary)" }}>{book.categoria}</span>
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 13, color: "var(--foreground)" }}>{book.anio}</td>
                    <td style={{ padding: "10px 12px" }}><AvailBadge disponibles={book.disponibles} total={book.totalEjemplares} /></td>
                    {canBorrow && (
                      <td style={{ padding: "10px 12px" }} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {borrowed ? (
                            <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: "#DCFCE7", color: "#16A34A" }}>
                              <CheckCircle2 size={10} /> Solicitado
                            </span>
                          ) : book.disponibles > 0 ? (
                            <>
                              <button
                                onClick={(e) => { e.stopPropagation(); setLoanRequestBook(book); }}
                                disabled={atLimit}
                                style={{ padding: "4px 9px", borderRadius: 5, border: "none", background: atLimit ? "var(--muted)" : "var(--primary)", color: atLimit ? "var(--muted-foreground)" : "#fff", fontSize: 11.5, cursor: atLimit ? "not-allowed" : "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>
                                {atLimit ? "Límite" : "Solicitar"}
                              </button>
                              {isDocente && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); setExternalLoanBook(book); }}
                                  disabled={atLimit}
                                  style={{ padding: "4px 9px", borderRadius: 5, border: "none", background: atLimit ? "var(--muted)" : "#EDE9FE", color: atLimit ? "var(--muted-foreground)" : "#7C3AED", fontSize: 11.5, cursor: atLimit ? "not-allowed" : "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>
                                  Externo
                                </button>
                              )}
                            </>
                          ) : (
                            <button
                              onClick={(e) => { e.stopPropagation(); setReserveBook(book); }}
                              className="flex items-center gap-1"
                              style={{ padding: "4px 9px", borderRadius: 5, border: "none", background: "#DBEAFE", color: "#1D6FA4", fontSize: 11.5, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>
                              <CalendarDays size={10} /> Reservar
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t" style={{ borderColor: "var(--border)" }}>
          <span style={{ fontSize: 12.5, color: "var(--muted-foreground)" }}>
            Mostrando {filtered.length} de {BOOKS.length} títulos
            {canBorrow && " · Haz clic en una fila para ver el detalle"}
          </span>
        </div>
      </div>

      {/* Modals */}
      {detailBook && (
        <BookDetail
          book={detailBook}
          canBorrow={canBorrow}
          isDocente={isDocente}
          alreadyBorrowed={isAlreadyBorrowed(detailBook.id)}
          onClose={() => setDetailBook(null)}
          onRequestLoan={() => setLoanRequestBook(detailBook)}
          onExternalLoan={() => setExternalLoanBook(detailBook)}
          onReserve={() => setReserveBook(detailBook)}
          onRequestPurchase={() => { setPurchaseBook(detailBook); setShowPurchaseModal(true); }}
        />
      )}

      {loanRequestBook && authUser && currentUser && (
        <LoanRequestModal
          book={loanRequestBook}
          authUser={authUser}
          userActiveLoans={myActiveLoans.length}
          userLoanLimit={currentUser.limitePrestamos}
          onConfirm={() => onRequestLoan?.(loanRequestBook.id, authUser.userId!)}
          onClose={() => { setLoanRequestBook(null); onNavigate?.("mis-prestamos"); }}
        />
      )}

      {externalLoanBook && authUser && currentUser && (
        <ExternalLoanModal
          book={externalLoanBook}
          authUser={authUser}
          userActiveLoans={myActiveLoans.length}
          userLoanLimit={currentUser.limitePrestamos}
          onConfirm={(cantidad, dias, justificacion) => onRequestLoan?.(externalLoanBook.id, authUser.userId!, "externo", cantidad, dias, justificacion)}
          onClose={() => { setExternalLoanBook(null); onNavigate?.("mis-prestamos"); }}
        />
      )}

      {reserveBook && authUser && (
        <ReserveModal
          book={reserveBook}
          authUser={authUser}
          onConfirm={() => onRequestReservation?.(reserveBook.id, authUser.userId!)}
          onClose={() => { setReserveBook(null); onNavigate?.("mis-reservas"); }}
        />
      )}

      {showPurchaseModal && authUser && (
        <PurchaseRequestModal
          authUser={authUser}
          prefillBook={purchaseBook}
          onConfirm={(req) => onRequestPurchase?.(req)}
          onClose={() => { setShowPurchaseModal(false); setPurchaseBook(undefined); onNavigate?.("mis-solicitudes"); }}
        />
      )}
    </div>
  );
}
