import { useState } from "react";
import { Plus, Search, RotateCcw, CheckCircle, AlertTriangle, X, ChevronDown, XCircle, Clock } from "lucide-react";
import { BOOKS, USERS, type Loan } from "./data";
import { BookCover } from "./BookCover";

function loanStatusBadge(estado: string) {
  if (estado === "pendiente") return { label: "Pendiente", color: "#D97706", bg: "#FEF3C7" };
  if (estado === "activo")    return { label: "Activo",    color: "#1D6FA4", bg: "#DBEAFE" };
  if (estado === "vencido")   return { label: "Vencido",   color: "#DC2626", bg: "#FEE2E2" };
  if (estado === "rechazado") return { label: "Rechazado", color: "#6B7A99", bg: "#F1F5F9" };
  return { label: "Devuelto", color: "#16A34A", bg: "#DCFCE7" };
}

function daysUntil(str: string) {
  return Math.ceil((new Date(str).getTime() - Date.now()) / 86400000);
}

function formatDate(str: string) {
  return new Date(str).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

interface NewLoanFormProps {
  onSave: (loan: Omit<Loan, "id" | "estado" | "renovaciones" | "fechaDevolucionReal">) => void;
  onClose: () => void;
}

function NewLoanForm({ onSave, onClose }: NewLoanFormProps) {
  const [usuarioId, setUsuarioId] = useState("");
  const [libroId, setLibroId] = useState("");
  const [dias, setDias] = useState(14);
  const availBooks = BOOKS.filter((b) => b.disponibles > 0);
  const today = new Date().toISOString().split("T")[0];
  const devDate = new Date(Date.now() + dias * 86400000).toISOString().split("T")[0];

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)",
    background: "var(--input-background)", fontSize: 13.5, color: "var(--foreground)", outline: "none", appearance: "none",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}>
      <div className="rounded-xl w-full max-w-md mx-4 overflow-hidden" style={{ background: "var(--card)", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "var(--foreground)" }}>Registrar Préstamo</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}><X size={20} /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Usuario *</label>
            <select style={inputStyle} value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)}>
              <option value="">Seleccionar usuario…</option>
              {USERS.filter((u) => u.estado === "activo" && u.prestamosActivos < u.limitePrestamos).map((u) => (
                <option key={u.id} value={u.id}>{u.nombre} {u.apellidos} — {u.matricula}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Libro *</label>
            <select style={inputStyle} value={libroId} onChange={(e) => setLibroId(e.target.value)}>
              <option value="">Seleccionar libro disponible…</option>
              {availBooks.map((b) => (
                <option key={b.id} value={b.id}>{b.titulo} — {b.autor} ({b.disponibles} disp.)</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Días de Préstamo</label>
            <input type="number" style={inputStyle} value={dias} onChange={(e) => setDias(Number(e.target.value))} min={1} max={90} />
          </div>
          <div className="rounded-lg px-4 py-3 grid grid-cols-2 gap-3" style={{ background: "var(--muted)" }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--muted-foreground)", fontWeight: 600 }}>FECHA DE PRÉSTAMO</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--foreground)" }}>{formatDate(today)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "var(--muted-foreground)", fontWeight: 600 }}>FECHA DE DEVOLUCIÓN</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--primary)" }}>{formatDate(devDate)}</div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t justify-end" style={{ borderColor: "var(--border)" }}>
          <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", fontSize: 13.5, cursor: "pointer", color: "var(--foreground)" }}>
            Cancelar
          </button>
          <button
            onClick={() => { if (usuarioId && libroId) onSave({ libroId, usuarioId, fechaPrestamo: today, fechaDevolucion: devDate }); }}
            style={{ padding: "8px 18px", borderRadius: 6, border: "none", background: "var(--primary)", color: "#fff", fontSize: 13.5, cursor: "pointer", fontWeight: 600 }}
          >
            Registrar Préstamo
          </button>
        </div>
      </div>
    </div>
  );
}

interface LoansProps {
  loans: Loan[];
  onLoansChange: (loans: Loan[]) => void;
}

type LoanTab = "pendientes" | "activos" | "vencidos" | "devueltos";

export function Loans({ loans, onLoansChange }: LoansProps) {
  const [tab, setTab] = useState<LoanTab>("pendientes");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  function getBook(id: string) { return BOOKS.find((b) => b.id === id); }
  function getUser(id: string) { return USERS.find((u) => u.id === id); }

  const tabFilter: Record<LoanTab, (l: Loan) => boolean> = {
    pendientes: (l) => l.estado === "pendiente",
    activos:    (l) => l.estado === "activo",
    vencidos:   (l) => l.estado === "vencido",
    devueltos:  (l) => l.estado === "devuelto" || l.estado === "rechazado",
  };

  const filteredLoans = loans.filter((l) => {
    if (!tabFilter[tab](l)) return false;
    const q = search.toLowerCase();
    const book = getBook(l.libroId);
    const user = getUser(l.usuarioId);
    return !q || book?.titulo.toLowerCase().includes(q) || user?.nombre.toLowerCase().includes(q) || user?.apellidos.toLowerCase().includes(q) || user?.matricula.toLowerCase().includes(q);
  });

  function handleNewLoan(data: Omit<Loan, "id" | "estado" | "renovaciones" | "fechaDevolucionReal">) {
    const newLoan: Loan = { ...data, id: `P${String(loans.length + 1).padStart(3, "0")}`, estado: "activo", renovaciones: 0 };
    onLoansChange([newLoan, ...loans]);
    setShowForm(false);
  }

  function handleApprove(loanId: string) {
    onLoansChange(loans.map((l) => l.id === loanId ? { ...l, estado: "activo" as const } : l));
  }

  function handleReject(loanId: string) {
    onLoansChange(loans.map((l) => l.id === loanId ? { ...l, estado: "rechazado" as const } : l));
  }

  function handleDevolver(loanId: string) {
    onLoansChange(loans.map((l) => l.id === loanId ? { ...l, estado: "devuelto" as const, fechaDevolucionReal: new Date().toISOString().split("T")[0] } : l));
  }

  function handleRenovar(loanId: string) {
    onLoansChange(loans.map((l) => {
      if (l.id !== loanId) return l;
      const d = new Date(l.fechaDevolucion);
      d.setDate(d.getDate() + 14);
      return { ...l, fechaDevolucion: d.toISOString().split("T")[0], estado: "activo" as const, renovaciones: l.renovaciones + 1 };
    }));
  }

  const counts = {
    pendientes: loans.filter((l) => l.estado === "pendiente").length,
    activos:    loans.filter((l) => l.estado === "activo").length,
    vencidos:   loans.filter((l) => l.estado === "vencido").length,
    devueltos:  loans.filter((l) => l.estado === "devuelto" || l.estado === "rechazado").length,
  };

  const tabDefs: { id: LoanTab; label: string; icon?: React.ReactNode }[] = [
    { id: "pendientes", label: "Por Aprobar", icon: <Clock size={13} /> },
    { id: "activos",    label: "Activos" },
    { id: "vencidos",   label: "Vencidos" },
    { id: "devueltos",  label: "Devueltos / Rechazados" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "var(--foreground)" }}>Gestión de Préstamos</h1>
          <p style={{ fontSize: 13.5, color: "var(--muted-foreground)", marginTop: 2 }}>
            {counts.pendientes > 0 && <span style={{ color: "#D97706", fontWeight: 600 }}>{counts.pendientes} pendiente(s) de aprobación · </span>}
            {counts.activos} activos en el sistema
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
          style={{ padding: "9px 16px", borderRadius: 7, border: "none", background: "var(--primary)", color: "#fff", fontSize: 13.5, cursor: "pointer", fontWeight: 600 }}
        >
          <Plus size={16} /> Nuevo Préstamo
        </button>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto pb-1">
      <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: "var(--card)", border: "1px solid var(--border)", width: "fit-content", minWidth: "max-content" }}>
        {tabDefs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5"
            style={{
              padding: "6px 12px", borderRadius: 6, border: "none", cursor: "pointer",
              background: tab === t.id ? (t.id === "pendientes" ? "#D97706" : "var(--primary)") : "transparent",
              color: tab === t.id ? "#fff" : "var(--muted-foreground)",
              fontSize: 13, fontWeight: tab === t.id ? 600 : 400,
            }}
          >
            {t.icon}
            {t.label}
            {counts[t.id] > 0 && (
              <span style={{
                background: tab === t.id ? "rgba(255,255,255,0.25)" : t.id === "pendientes" ? "#FEF3C7" : t.id === "vencidos" ? "#FEE2E2" : "var(--muted)",
                color: tab === t.id ? "#fff" : t.id === "pendientes" ? "#D97706" : t.id === "vencidos" ? "#DC2626" : "var(--muted-foreground)",
                borderRadius: 4, padding: "0 6px", fontSize: 11, fontWeight: 700,
              }}>{counts[t.id]}</span>
            )}
          </button>
        ))}
      </div>
      </div>

      {/* Pending info banner */}
      {tab === "pendientes" && counts.pendientes > 0 && (
        <div className="flex items-center gap-3 rounded-lg px-4 py-3" style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}>
          <Clock size={15} style={{ color: "#D97706", flexShrink: 0 }} />
          <span style={{ fontSize: 13.5, color: "#92400E" }}>
            Estas solicitudes fueron enviadas por estudiantes y docentes. Revisa los datos y <strong>aprueba o rechaza</strong> cada una.
          </span>
        </div>
      )}

      {/* Search */}
      <div className="relative" style={{ maxWidth: 400 }}>
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por libro o usuario…"
          style={{ width: "100%", padding: "8px 10px 8px 34px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", fontSize: 13.5, outline: "none", color: "var(--foreground)" }}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="overflow-x-auto">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                {["", "ID", "Libro", "Usuario", "F. Préstamo", "Devolución", "Tipo", "Estado", "Acciones"].map((h) => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11.5, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLoans.length === 0 && (
                <tr><td colSpan={9} style={{ padding: 40, textAlign: "center", color: "var(--muted-foreground)", fontSize: 14 }}>
                  {tab === "pendientes" ? "No hay solicitudes pendientes de aprobación. ✓" : "No hay préstamos en esta categoría."}
                </td></tr>
              )}
              {filteredLoans.map((loan, i) => {
                const book = getBook(loan.libroId);
                const user = getUser(loan.usuarioId);
                const s = loanStatusBadge(loan.estado);
                const days = daysUntil(loan.fechaDevolucion);
                return (
                  <tr key={loan.id} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.012)" }}>
                    <td style={{ padding: "10px 12px", width: 44 }}>
                      {book && <BookCover book={book} size="xs" />}
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 11.5, color: "var(--muted-foreground)", fontFamily: "monospace" }}>{loan.id}</td>
                    <td style={{ padding: "10px 12px", maxWidth: 180 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{book?.titulo}</div>
                      <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{book?.autor}</div>
                      {loan.tipo === "externo" && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#7C3AED", background: "#EDE9FE", borderRadius: 3, padding: "1px 5px" }}>EXTERNO × {loan.cantidad ?? 1}</span>
                      )}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--foreground)" }}>{user?.nombre} {user?.apellidos}</div>
                      <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{user?.matricula} · {user?.tipo}</div>
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 12.5, color: "var(--foreground)", whiteSpace: "nowrap" }}>{formatDate(loan.fechaPrestamo)}</td>
                    <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                      <div style={{ fontSize: 12.5, color: loan.estado === "vencido" ? "#DC2626" : "var(--foreground)", fontWeight: loan.estado === "vencido" ? 600 : 400 }}>
                        {loan.fechaDevolucionReal ? formatDate(loan.fechaDevolucionReal) : formatDate(loan.fechaDevolucion)}
                      </div>
                      {(loan.estado === "activo" || loan.estado === "vencido") && (
                        <div style={{ fontSize: 11, color: days < 0 ? "#DC2626" : days <= 3 ? "#D97706" : "var(--muted-foreground)" }}>
                          {days < 0 ? `${Math.abs(days)}d vencido` : days === 0 ? "Hoy" : `${days}d restantes`}
                        </div>
                      )}
                      {loan.justificacion && loan.estado === "pendiente" && (
                        <div style={{ fontSize: 11, color: "var(--muted-foreground)", fontStyle: "italic", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={loan.justificacion}>
                          "{loan.justificacion}"
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ fontSize: 11.5, color: "var(--muted-foreground)" }}>
                        {loan.tipo === "externo" ? "Externo" : "Regular"}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: s.bg, color: s.color }}>
                        {loan.estado === "vencido" && <AlertTriangle size={11} style={{ marginRight: 3 }} />}
                        {s.label}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {loan.estado === "pendiente" && (
                          <>
                            <button onClick={() => handleApprove(loan.id)} className="flex items-center gap-1"
                              style={{ padding: "4px 9px", borderRadius: 5, border: "none", background: "#DCFCE7", color: "#16A34A", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                              <CheckCircle size={11} /> Aprobar
                            </button>
                            <button onClick={() => handleReject(loan.id)} className="flex items-center gap-1"
                              style={{ padding: "4px 9px", borderRadius: 5, border: "none", background: "#FEE2E2", color: "#DC2626", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                              <XCircle size={11} /> Rechazar
                            </button>
                          </>
                        )}
                        {(loan.estado === "activo" || loan.estado === "vencido") && (
                          <>
                            <button onClick={() => handleDevolver(loan.id)} className="flex items-center gap-1"
                              style={{ padding: "4px 9px", borderRadius: 5, border: "none", background: "#DCFCE7", color: "#16A34A", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                              <CheckCircle size={11} /> Devolver
                            </button>
                            {loan.renovaciones < 2 && loan.tipo !== "externo" && (
                              <button onClick={() => handleRenovar(loan.id)} className="flex items-center gap-1"
                                style={{ padding: "4px 9px", borderRadius: 5, border: "1px solid var(--border)", background: "transparent", color: "var(--muted-foreground)", fontSize: 12, cursor: "pointer" }}>
                                <RotateCcw size={11} /> Renovar
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t" style={{ borderColor: "var(--border)" }}>
          <span style={{ fontSize: 12.5, color: "var(--muted-foreground)" }}>Mostrando {filteredLoans.length} préstamo(s)</span>
        </div>
      </div>

      {showForm && <NewLoanForm onSave={handleNewLoan} onClose={() => setShowForm(false)} />}
    </div>
  );
}
