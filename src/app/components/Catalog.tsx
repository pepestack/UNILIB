import { useState } from "react";
import { Search, X, ChevronDown, BookOpen, BookMarked, CheckCircle2, AlertTriangle } from "lucide-react";
import { BOOKS, USERS, type Book, type BookCategory, type Loan, type AuthUser, type ModuleId } from "./data";
import { BookCover } from "./BookCover";

const CATEGORIES: BookCategory[] = [
  "Derecho", "Medicina", "Matemáticas", "Historia", "Administración",
  "Psicología", "Informática", "Arquitectura", "Sociología", "Literatura", "Ingeniería",
];

function AvailBadge({ disponibles, total }: { disponibles: number; total: number }) {
  const color = disponibles === 0 ? "#DC2626" : disponibles < total * 0.4 ? "#D97706" : "#16A34A";
  const bg = disponibles === 0 ? "#FEE2E2" : disponibles < total * 0.4 ? "#FEF3C7" : "#DCFCE7";
  return (
    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: bg, color }}>
      {disponibles}/{total}
    </span>
  );
}

// ─── Loan Request Modal ───────────────────────────────────────────────────────

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
  const dueDate = new Date(Date.now() + 14 * 86400000).toLocaleDateString("es-MX", {
    day: "2-digit", month: "long", year: "numeric",
  });

  function handleConfirm() {
    onConfirm();
    setConfirmed(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-2xl w-full max-w-md mx-4 overflow-hidden" style={{ background: "var(--card)", boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}>
        {confirmed ? (
          /* Success state */
          <div className="flex flex-col items-center px-8 py-10 gap-4">
            <div className="flex items-center justify-center rounded-full" style={{ width: 64, height: 64, background: "#DCFCE7" }}>
              <CheckCircle2 size={32} style={{ color: "#16A34A" }} />
            </div>
            <div className="text-center">
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: "var(--foreground)", marginBottom: 6 }}>
                ¡Préstamo Registrado!
              </h3>
              <p style={{ fontSize: 14, color: "var(--muted-foreground)", lineHeight: 1.6, marginBottom: 4 }}>
                <strong style={{ color: "var(--foreground)" }}>{book.titulo}</strong> ha sido asignado a tu cuenta.
              </p>
              <p style={{ fontSize: 13.5, color: "var(--muted-foreground)" }}>
                Fecha de devolución: <strong style={{ color: "var(--primary)" }}>{dueDate}</strong>
              </p>
            </div>
            <button
              onClick={onClose}
              style={{ width: "100%", padding: "11px", borderRadius: 8, border: "none", background: "var(--primary)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4 }}
            >
              Aceptar
            </button>
          </div>
        ) : (
          /* Confirmation state */
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "var(--foreground)" }}>
                Solicitar Préstamo
              </h2>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}>
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">
              {/* Book info */}
              <div className="flex gap-4 rounded-xl p-4" style={{ background: "var(--muted)" }}>
                <BookCover book={book} size="sm" />
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", fontFamily: "'Playfair Display', serif", lineHeight: 1.3, marginBottom: 3 }}>
                    {book.titulo}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 6 }}>{book.autor}</div>
                  <span className="inline-flex rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: "var(--secondary)", color: "var(--primary)" }}>
                    {book.categoria}
                  </span>
                </div>
              </div>

              {/* Loan details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg px-4 py-3" style={{ background: "var(--muted)" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
                    Solicitante
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--foreground)" }}>{authUser.name}</div>
                </div>
                <div className="rounded-lg px-4 py-3" style={{ background: "var(--muted)" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
                    Devolución estimada
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--primary)" }}>{dueDate}</div>
                </div>
                <div className="rounded-lg px-4 py-3" style={{ background: "var(--muted)" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
                    Período del préstamo
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--foreground)" }}>14 días naturales</div>
                </div>
                <div className="rounded-lg px-4 py-3" style={{ background: "var(--muted)" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
                    Capacidad restante
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: atLimit ? "#DC2626" : "var(--foreground)" }}>
                    {userLoanLimit - userActiveLoans} de {userLoanLimit}
                  </div>
                </div>
              </div>

              {/* Warnings */}
              {atLimit && (
                <div className="flex items-start gap-3 rounded-lg px-4 py-3" style={{ background: "#FEE2E2", border: "1px solid #FECACA" }}>
                  <AlertTriangle size={16} style={{ color: "#DC2626", flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 13, color: "#991B1B" }}>
                    Has alcanzado tu límite de préstamos ({userLoanLimit}). Debes devolver un libro antes de solicitar uno nuevo.
                  </span>
                </div>
              )}
              {book.disponibles === 0 && !atLimit && (
                <div className="flex items-start gap-3 rounded-lg px-4 py-3" style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}>
                  <AlertTriangle size={16} style={{ color: "#D97706", flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 13, color: "#92400E" }}>
                    Este título no tiene ejemplares disponibles en este momento. Considera hacer una reserva.
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3 px-6 py-4 border-t justify-end" style={{ borderColor: "var(--border)" }}>
              <button onClick={onClose} style={{ padding: "9px 20px", borderRadius: 7, border: "1px solid var(--border)", background: "transparent", fontSize: 13.5, cursor: "pointer", color: "var(--foreground)" }}>
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={atLimit || book.disponibles === 0}
                style={{
                  padding: "9px 20px", borderRadius: 7, border: "none",
                  background: atLimit || book.disponibles === 0 ? "var(--muted)" : "var(--primary)",
                  color: atLimit || book.disponibles === 0 ? "var(--muted-foreground)" : "#fff",
                  fontSize: 13.5, cursor: atLimit || book.disponibles === 0 ? "not-allowed" : "pointer",
                  fontWeight: 600,
                }}
              >
                Confirmar Préstamo
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Book Detail Modal ────────────────────────────────────────────────────────

interface BookDetailProps {
  book: Book;
  canBorrow: boolean;
  alreadyBorrowed: boolean;
  onClose: () => void;
  onRequestLoan?: () => void;
}

function BookDetail({ book, canBorrow, alreadyBorrowed, onClose, onRequestLoan }: BookDetailProps) {
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
              { label: "ISBN", value: book.isbn },
              { label: "Editorial", value: book.editorial },
              { label: "Año", value: book.anio },
              { label: "Categoría", value: book.categoria },
              { label: "Ubicación", value: book.ubicacion },
              { label: "Ejemplares", value: `${book.totalEjemplares} totales` },
            ].map((r) => (
              <div key={r.label} className="rounded-lg px-3 py-2" style={{ background: "var(--muted)" }}>
                <div style={{ fontSize: 11, color: "var(--muted-foreground)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{r.label}</div>
                <div style={{ fontSize: 13.5, color: "var(--foreground)", fontWeight: 500, marginTop: 1 }}>{r.value}</div>
              </div>
            ))}
          </div>
          {book.descripcion && (
            <p style={{ fontSize: 13.5, color: "var(--foreground)", lineHeight: 1.6 }}>{book.descripcion}</p>
          )}
        </div>
        <div className="flex gap-3 px-6 py-4 border-t" style={{ borderColor: "var(--border)" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "9px", borderRadius: 7, border: "1px solid var(--border)", background: "transparent", fontSize: 13.5, cursor: "pointer", color: "var(--foreground)" }}>
            Cerrar
          </button>
          {canBorrow && (
            <button
              onClick={() => { onClose(); onRequestLoan?.(); }}
              disabled={alreadyBorrowed}
              className="flex items-center justify-center gap-2"
              style={{
                flex: 1, padding: "9px", borderRadius: 7, border: "none",
                background: alreadyBorrowed ? "var(--muted)" : "var(--primary)",
                color: alreadyBorrowed ? "var(--muted-foreground)" : "#fff",
                fontSize: 13.5, fontWeight: 600,
                cursor: alreadyBorrowed ? "not-allowed" : "pointer",
              }}
            >
              <BookMarked size={15} />
              {alreadyBorrowed ? "Ya en préstamo" : "Solicitar Préstamo"}
            </button>
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
  onRequestLoan?: (bookId: string, userId: string) => void;
  onNavigate?: (module: ModuleId) => void;
}

export function Catalog({ authUser, loans = [], onRequestLoan, onNavigate }: CatalogProps) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [availFilter, setAvailFilter] = useState<string>("all");
  const [detailBook, setDetailBook] = useState<Book | null>(null);
  const [loanRequestBook, setLoanRequestBook] = useState<Book | null>(null);

  const canBorrow = authUser?.role === "estudiante";
  const currentUser = canBorrow && authUser?.userId
    ? USERS.find((u) => u.id === authUser.userId)
    : null;

  const myActiveLoans = canBorrow
    ? loans.filter((l) => l.usuarioId === authUser?.userId && l.estado !== "devuelto")
    : [];

  function isAlreadyBorrowed(bookId: string) {
    return myActiveLoans.some((l) => l.libroId === bookId);
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

  function handleConfirmLoan() {
    if (!loanRequestBook || !authUser?.userId || !onRequestLoan) return;
    onRequestLoan(loanRequestBook.id, authUser.userId);
    // Navigate to Mis Préstamos after a short delay so the success screen is visible
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "var(--foreground)" }}>Catálogo</h1>
          <p style={{ fontSize: 13.5, color: "var(--muted-foreground)", marginTop: 2 }}>{BOOKS.length} títulos disponibles en la colección</p>
        </div>
        {canBorrow && currentUser && (
          <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <BookMarked size={16} style={{ color: "var(--primary)" }} />
            <div>
              <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Préstamos activos</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: myActiveLoans.length >= currentUser.limitePrestamos ? "#DC2626" : "var(--foreground)" }}>
                {myActiveLoans.length} / {currentUser.limitePrestamos}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, autor o ISBN…"
            style={{ width: "100%", padding: "8px 10px 8px 34px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", fontSize: 13.5, color: "var(--foreground)", outline: "none" }}
          />
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
                {["", "ISBN", "Título / Autor", "Editorial", "Área", "Año", "Ejemplares", ...(canBorrow ? [""] : [])].map((h, i) => (
                  <th key={i} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11.5, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={canBorrow ? 8 : 7} style={{ padding: 40, textAlign: "center", color: "var(--muted-foreground)", fontSize: 14 }}>
                    No se encontraron libros con los filtros aplicados.
                  </td>
                </tr>
              )}
              {filtered.map((book, i) => {
                const borrowed = isAlreadyBorrowed(book.id);
                return (
                  <tr
                    key={book.id}
                    style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.012)", cursor: "pointer", transition: "background 0.1s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--secondary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.012)")}
                    onClick={() => setDetailBook(book)}
                  >
                    <td style={{ padding: "10px 14px", width: 52 }}><BookCover book={book} size="xs" /></td>
                    <td style={{ padding: "10px 14px", fontSize: 12, color: "var(--muted-foreground)", fontFamily: "monospace", whiteSpace: "nowrap" }}>{book.isbn}</td>
                    <td style={{ padding: "10px 14px", maxWidth: 240 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{book.titulo}</div>
                      <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{book.autor}</div>
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 13, color: "var(--foreground)", whiteSpace: "nowrap" }}>{book.editorial}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: "var(--secondary)", color: "var(--primary)" }}>{book.categoria}</span>
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 13, color: "var(--foreground)" }}>{book.anio}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <AvailBadge disponibles={book.disponibles} total={book.totalEjemplares} />
                    </td>
                    {canBorrow && (
                      <td style={{ padding: "10px 14px" }} onClick={(e) => e.stopPropagation()}>
                        {borrowed ? (
                          <span className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium" style={{ background: "#DCFCE7", color: "#16A34A" }}>
                            <CheckCircle2 size={11} /> En préstamo
                          </span>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); setLoanRequestBook(book); }}
                            disabled={book.disponibles === 0 || (currentUser ? myActiveLoans.length >= currentUser.limitePrestamos : false)}
                            className="flex items-center gap-1"
                            style={{
                              padding: "5px 10px", borderRadius: 5, border: "none",
                              background: book.disponibles === 0 || (currentUser && myActiveLoans.length >= currentUser.limitePrestamos) ? "var(--muted)" : "var(--primary)",
                              color: book.disponibles === 0 || (currentUser && myActiveLoans.length >= currentUser.limitePrestamos) ? "var(--muted-foreground)" : "#fff",
                              fontSize: 12, cursor: book.disponibles === 0 || (currentUser && myActiveLoans.length >= currentUser.limitePrestamos) ? "not-allowed" : "pointer",
                              fontWeight: 600,
                            }}
                          >
                            <BookMarked size={11} />
                            {book.disponibles === 0 ? "Sin disp." : "Solicitar"}
                          </button>
                        )}
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
            {canBorrow && " · Haz clic en \"Solicitar\" para pedir un libro en préstamo"}
          </span>
        </div>
      </div>

      {detailBook && (
        <BookDetail
          book={detailBook}
          canBorrow={canBorrow}
          alreadyBorrowed={isAlreadyBorrowed(detailBook.id)}
          onClose={() => setDetailBook(null)}
          onRequestLoan={() => setLoanRequestBook(detailBook)}
        />
      )}

      {loanRequestBook && authUser && currentUser && (
        <LoanRequestModal
          book={loanRequestBook}
          authUser={authUser}
          userActiveLoans={myActiveLoans.length}
          userLoanLimit={currentUser.limitePrestamos}
          onConfirm={handleConfirmLoan}
          onClose={() => {
            setLoanRequestBook(null);
            if (onNavigate) onNavigate("mis-prestamos");
          }}
        />
      )}
    </div>
  );
}
