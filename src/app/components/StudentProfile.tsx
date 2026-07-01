import { useState } from "react";
import { BookMarked, CalendarDays, AlertTriangle, CheckCircle2, Clock, User, BookOpen } from "lucide-react";
import { BOOKS, USERS, INITIAL_RESERVATIONS, type AuthUser, type Loan } from "./data";
import { BookCover } from "./BookCover";

type Tab = "inicio" | "prestamos" | "reservas" | "perfil";

interface StudentProfileProps {
  authUser: AuthUser;
  initialTab?: Tab;
  loans?: Loan[];
}

function formatDate(str: string) {
  return new Date(str).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

function daysUntil(str: string) {
  const diff = new Date(str).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function loanStatusInfo(estado: string) {
  if (estado === "activo") return { label: "Activo", color: "#1D6FA4", bg: "#DBEAFE" };
  if (estado === "vencido") return { label: "Vencido", color: "#DC2626", bg: "#FEE2E2" };
  return { label: "Devuelto", color: "#16A34A", bg: "#DCFCE7" };
}

function resvStatusInfo(estado: string) {
  if (estado === "pendiente") return { label: "Pendiente", color: "#D97706", bg: "#FEF3C7" };
  if (estado === "confirmada") return { label: "Confirmada", color: "#1D6FA4", bg: "#DBEAFE" };
  if (estado === "cancelada") return { label: "Cancelada", color: "#6B7A99", bg: "#F1F5F9" };
  return { label: "Completada", color: "#16A34A", bg: "#DCFCE7" };
}

export function StudentProfile({ authUser, initialTab = "inicio", loans = [] }: StudentProfileProps) {
  const [tab, setTab] = useState<Tab>(initialTab);

  const user = USERS.find((u) => u.id === authUser.userId);
  const myLoans = loans.filter((l) => l.usuarioId === authUser.userId);
  const myActiveLoans = myLoans.filter((l) => l.estado === "activo" || l.estado === "vencido");
  const myOverdueLoans = myLoans.filter((l) => l.estado === "vencido");
  const myHistory = myLoans.filter((l) => l.estado === "devuelto");
  const myReservations = INITIAL_RESERVATIONS.filter((r) => r.usuarioId === authUser.userId);
  const myPendingResvs = myReservations.filter((r) => r.estado === "pendiente" || r.estado === "confirmada");

  function getBook(id: string) { return BOOKS.find((b) => b.id === id); }

  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "inicio", label: "Inicio", icon: <User size={15} /> },
    { id: "prestamos", label: "Mis Préstamos", icon: <BookMarked size={15} />, badge: myActiveLoans.length },
    { id: "reservas", label: "Mis Reservas", icon: <CalendarDays size={15} />, badge: myPendingResvs.length },
    { id: "perfil", label: "Mi Perfil", icon: <User size={15} /> },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Welcome header */}
      <div className="rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ background: "var(--primary)", color: "#fff" }}>
        <div className="flex items-center justify-center rounded-full" style={{ width: 56, height: 56, background: "rgba(255,255,255,0.15)", flexShrink: 0 }}>
          <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{authUser.initials}</span>
        </div>
        <div>
          <div style={{ fontSize: 12, opacity: 0.65, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>Bienvenido/a</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, lineHeight: 1.2 }}>{authUser.name}</h1>
          {user && <div style={{ fontSize: 13.5, opacity: 0.75, marginTop: 3 }}>{user.carrera} · {user.matricula}</div>}
        </div>
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          <div className="text-center">
            <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{myActiveLoans.length}</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Préstamos activos</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{myPendingResvs.length}</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Reservas</div>
          </div>
          {user && (
            <div className="text-center">
              <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{user.limitePrestamos - myActiveLoans.length}</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Créditos disp.</div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto">
      <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: "var(--card)", border: "1px solid var(--border)", width: "fit-content", whiteSpace: "nowrap" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex items-center gap-2"
            style={{
              padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer",
              background: tab === t.id ? "var(--primary)" : "transparent",
              color: tab === t.id ? "#fff" : "var(--muted-foreground)",
              fontSize: 13, fontWeight: tab === t.id ? 600 : 400,
            }}
          >
            {t.icon}
            {t.label}
            {t.badge !== undefined && t.badge > 0 && (
              <span style={{ background: tab === t.id ? "rgba(255,255,255,0.25)" : "var(--muted)", color: tab === t.id ? "#fff" : "var(--muted-foreground)", borderRadius: 4, padding: "0 5px", fontSize: 11, fontWeight: 700 }}>
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      </div>

      {/* Tab: Inicio */}
      {tab === "inicio" && (
        <div className="flex flex-col gap-4">
          {/* Overdue alert */}
          {myOverdueLoans.length > 0 && (
            <div className="rounded-xl px-5 py-4 flex items-start gap-4" style={{ background: "#FEE2E2", border: "1px solid #FECACA" }}>
              <AlertTriangle size={20} style={{ color: "#DC2626", flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#991B1B", marginBottom: 2 }}>Tienes {myOverdueLoans.length} préstamo(s) vencido(s)</div>
                <div style={{ fontSize: 13, color: "#B91C1C" }}>Por favor acércate a la biblioteca para regularizar tu situación o podrías perder tu acceso.</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Active loans */}
            <div className="rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                <BookMarked size={15} style={{ color: "var(--primary)" }} />
                <span style={{ fontWeight: 600, fontSize: 14, color: "var(--foreground)" }}>Préstamos Vigentes</span>
              </div>
              {myActiveLoans.length === 0 ? (
                <div className="flex flex-col items-center py-10 gap-2">
                  <CheckCircle2 size={28} style={{ color: "#16A34A" }} />
                  <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>Sin préstamos activos</span>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {myActiveLoans.map((loan) => {
                    const book = getBook(loan.libroId);
                    const s = loanStatusInfo(loan.estado);
                    const days = daysUntil(loan.fechaDevolucion);
                    return (
                      <div key={loan.id} className="flex items-center gap-3 px-5 py-3">
                        {book && <BookCover book={book} size="xs" />}
                        <div className="flex-1 min-w-0">
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{book?.titulo}</div>
                          <div style={{ fontSize: 11.5, color: days < 0 ? "#DC2626" : days <= 3 ? "#D97706" : "var(--muted-foreground)" }}>
                            {days < 0 ? `Vencido hace ${Math.abs(days)}d` : days === 0 ? "Vence hoy" : `Vence en ${days}d`}
                          </div>
                        </div>
                        <span className="rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: s.bg, color: s.color, flexShrink: 0 }}>{s.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reservations */}
            <div className="rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                <CalendarDays size={15} style={{ color: "var(--primary)" }} />
                <span style={{ fontWeight: 600, fontSize: 14, color: "var(--foreground)" }}>Mis Reservas</span>
              </div>
              {myPendingResvs.length === 0 ? (
                <div className="flex flex-col items-center py-10 gap-2">
                  <CheckCircle2 size={28} style={{ color: "#16A34A" }} />
                  <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>Sin reservas pendientes</span>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {myPendingResvs.map((resv) => {
                    const book = getBook(resv.libroId);
                    const s = resvStatusInfo(resv.estado);
                    return (
                      <div key={resv.id} className="flex items-center gap-3 px-5 py-3">
                        {book && <BookCover book={book} size="xs" />}
                        <div className="flex-1 min-w-0">
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{book?.titulo}</div>
                          <div style={{ fontSize: 11.5, color: "var(--muted-foreground)" }}>Vence: {formatDate(resv.fechaVencimiento)}</div>
                        </div>
                        <span className="rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: s.bg, color: s.color, flexShrink: 0 }}>{s.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Loan limit indicator */}
          {user && (
            <div className="rounded-xl px-5 py-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--foreground)" }}>Capacidad de Préstamos</span>
                <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>{myActiveLoans.length} de {user.limitePrestamos} utilizados</span>
              </div>
              <div className="rounded-full overflow-hidden" style={{ height: 8, background: "var(--muted)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${(myActiveLoans.length / user.limitePrestamos) * 100}%`, background: myActiveLoans.length >= user.limitePrestamos ? "#DC2626" : myActiveLoans.length >= user.limitePrestamos * 0.7 ? "#D97706" : "var(--primary)" }} />
              </div>
              {myActiveLoans.length >= user.limitePrestamos && (
                <p style={{ fontSize: 12.5, color: "#DC2626", marginTop: 6 }}>Has alcanzado tu límite de préstamos. Devuelve un libro para solicitar uno nuevo.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab: Mis Préstamos */}
      {tab === "prestamos" && (
        <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
            <BookMarked size={15} style={{ color: "var(--primary)" }} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>Historial de Préstamos ({myLoans.length})</span>
          </div>
          {myLoans.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-3">
              <BookOpen size={36} style={{ color: "var(--muted-foreground)" }} />
              <span style={{ fontSize: 14, color: "var(--muted-foreground)" }}>No tienes préstamos registrados.</span>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                  {["Libro", "F. Préstamo", "F. Devolución", "Estado"].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11.5, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myLoans.map((loan, i) => {
                  const book = getBook(loan.libroId);
                  const s = loanStatusInfo(loan.estado);
                  return (
                    <tr key={loan.id} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.012)" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div className="flex items-center gap-3">
                          {book && <BookCover book={book} size="xs" />}
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--foreground)" }}>{book?.titulo}</div>
                            <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{book?.autor}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--foreground)" }}>{formatDate(loan.fechaPrestamo)}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: loan.estado === "vencido" ? "#DC2626" : "var(--foreground)" }}>
                        {loan.fechaDevolucionReal ? formatDate(loan.fechaDevolucionReal) : formatDate(loan.fechaDevolucion)}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span className="rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Tab: Mis Reservas */}
      {tab === "reservas" && (
        <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
            <CalendarDays size={15} style={{ color: "var(--primary)" }} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>Mis Reservas ({myReservations.length})</span>
          </div>
          {myReservations.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-3">
              <CalendarDays size={36} style={{ color: "var(--muted-foreground)" }} />
              <span style={{ fontSize: 14, color: "var(--muted-foreground)" }}>No tienes reservas registradas.</span>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                  {["Libro", "F. Reserva", "Válida hasta", "Estado"].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11.5, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myReservations.map((resv, i) => {
                  const book = getBook(resv.libroId);
                  const s = resvStatusInfo(resv.estado);
                  return (
                    <tr key={resv.id} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.012)" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div className="flex items-center gap-3">
                          {book && <BookCover book={book} size="xs" />}
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--foreground)" }}>{book?.titulo}</div>
                            <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{book?.autor}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--foreground)" }}>{formatDate(resv.fechaReserva)}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--foreground)" }}>{formatDate(resv.fechaVencimiento)}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span className="rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Tab: Mi Perfil */}
      {tab === "perfil" && user && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: "var(--foreground)", marginBottom: 16 }}>Información Personal</h3>
            <div className="flex flex-col gap-3">
              {[
                { label: "Nombre completo", value: `${user.nombre} ${user.apellidos}` },
                { label: "Matrícula", value: user.matricula },
                { label: "Carrera / Programa", value: user.carrera },
                { label: "Tipo de usuario", value: user.tipo.charAt(0).toUpperCase() + user.tipo.slice(1) },
                { label: "Correo institucional", value: user.email },
                { label: "Teléfono", value: user.telefono },
                { label: "Fecha de registro", value: formatDate(user.fechaRegistro) },
              ].map((r) => (
                <div key={r.label} className="flex flex-col gap-0.5 rounded-lg px-3 py-2.5" style={{ background: "var(--muted)" }}>
                  <span style={{ fontSize: 11, color: "var(--muted-foreground)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{r.label}</span>
                  <span style={{ fontSize: 13.5, color: "var(--foreground)", fontWeight: 500 }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: "var(--foreground)", marginBottom: 12 }}>Estado de Cuenta</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between rounded-lg px-4 py-3" style={{ background: "var(--muted)" }}>
                  <span style={{ fontSize: 13.5, color: "var(--foreground)" }}>Estado</span>
                  <span className="rounded-md px-2 py-0.5 text-xs font-semibold" style={{ background: "#DCFCE7", color: "#16A34A" }}>Activo</span>
                </div>
                <div className="flex items-center justify-between rounded-lg px-4 py-3" style={{ background: "var(--muted)" }}>
                  <span style={{ fontSize: 13.5, color: "var(--foreground)" }}>Préstamos activos</span>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--foreground)" }}>{myActiveLoans.length} / {user.limitePrestamos}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg px-4 py-3" style={{ background: "var(--muted)" }}>
                  <span style={{ fontSize: 13.5, color: "var(--foreground)" }}>Préstamos históricos</span>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--foreground)" }}>{myLoans.length}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg px-4 py-3" style={{ background: "var(--muted)" }}>
                  <span style={{ fontSize: 13.5, color: "var(--foreground)" }}>Multas pendientes</span>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: myOverdueLoans.length > 0 ? "#DC2626" : "#16A34A" }}>
                    {myOverdueLoans.length > 0 ? `${myOverdueLoans.length} préstamo(s) vencido(s)` : "Sin multas"}
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-xl p-5" style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={15} style={{ color: "var(--primary)" }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>Política de Préstamos</span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {[
                  `Máximo ${user.limitePrestamos} préstamos simultáneos`,
                  "Período estándar: 14 días naturales",
                  "Renovaciones permitidas: hasta 2 veces",
                  "Reservas vigentes por 7 días",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <div className="rounded-full" style={{ width: 4, height: 4, background: "var(--primary)", flexShrink: 0 }} />
                    <span style={{ fontSize: 12.5, color: "var(--muted-foreground)" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
