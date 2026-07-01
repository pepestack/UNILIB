import { useState } from "react";
import { BookMarked, CalendarDays, CheckCircle2, AlertTriangle, Clock, ShoppingCart, BookOpen } from "lucide-react";
import { BOOKS, USERS, INITIAL_RESERVATIONS, type AuthUser, type Loan, type PurchaseRequest } from "./data";
import { BookCover } from "./BookCover";

type Tab = "inicio" | "prestamos" | "reservas" | "solicitudes" | "perfil";

interface DocProfileProps {
  authUser: AuthUser;
  initialTab?: Tab;
  loans?: Loan[];
  purchaseRequests?: PurchaseRequest[];
}

function formatDate(str: string) {
  return new Date(str).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

function daysUntil(str: string) {
  return Math.ceil((new Date(str).getTime() - Date.now()) / 86400000);
}

function loanStatusInfo(estado: string) {
  if (estado === "pendiente")  return { label: "Pendiente aprobación", color: "#D97706", bg: "#FEF3C7" };
  if (estado === "activo")     return { label: "Activo",               color: "#1D6FA4", bg: "#DBEAFE" };
  if (estado === "vencido")    return { label: "Vencido",              color: "#DC2626", bg: "#FEE2E2" };
  if (estado === "rechazado")  return { label: "Rechazado",            color: "#6B7A99", bg: "#F1F5F9" };
  return { label: "Devuelto", color: "#16A34A", bg: "#DCFCE7" };
}

function purchaseStatusInfo(estado: string) {
  if (estado === "pendiente")      return { label: "Pendiente",       color: "#D97706", bg: "#FEF3C7" };
  if (estado === "en_evaluacion")  return { label: "En evaluación",   color: "#1D6FA4", bg: "#DBEAFE" };
  if (estado === "aprobada")       return { label: "Aprobada",        color: "#16A34A", bg: "#DCFCE7" };
  return { label: "Rechazada", color: "#6B7A99", bg: "#F1F5F9" };
}

function tipoLabel(tipo: PurchaseRequest["tipo"]) {
  if (tipo === "libro_fisico")       return "Libro físico";
  if (tipo === "libro_electronico")  return "Libro electrónico";
  return "Licencia digital";
}

export function DocProfile({ authUser, initialTab = "inicio", loans = [], purchaseRequests = [] }: DocProfileProps) {
  const [tab, setTab] = useState<Tab>(initialTab);

  const user = USERS.find((u) => u.id === authUser.userId);
  const myLoans = loans.filter((l) => l.usuarioId === authUser.userId);
  const myActiveLoans = myLoans.filter((l) => l.estado === "activo" || l.estado === "vencido" || l.estado === "pendiente");
  const myOverdueLoans = myLoans.filter((l) => l.estado === "vencido");
  const myReservations = INITIAL_RESERVATIONS.filter((r) => r.usuarioId === authUser.userId);
  const myPendingResvs = myReservations.filter((r) => r.estado === "pendiente" || r.estado === "confirmada");
  const myPurchaseRequests = purchaseRequests.filter((r) => r.usuarioId === authUser.userId);
  const myPendingPurchases = myPurchaseRequests.filter((r) => r.estado === "pendiente" || r.estado === "en_evaluacion");

  function getBook(id: string) { return BOOKS.find((b) => b.id === id); }

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "inicio",      label: "Inicio" },
    { id: "prestamos",   label: "Mis Préstamos",  badge: myActiveLoans.length },
    { id: "reservas",    label: "Mis Reservas",   badge: myPendingResvs.length },
    { id: "solicitudes", label: "Solicitudes de Adquisición", badge: myPendingPurchases.length },
    { id: "perfil",      label: "Mi Perfil" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ background: "linear-gradient(135deg, #4C1D95 0%, #1C3D73 100%)", color: "#fff" }}>
        <div className="flex items-center justify-center rounded-full" style={{ width: 60, height: 60, background: "rgba(255,255,255,0.15)", flexShrink: 0 }}>
          <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{authUser.initials}</span>
        </div>
        <div className="flex-1">
          <div style={{ fontSize: 11, opacity: 0.65, textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 2 }}>Portal Docente</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, lineHeight: 1.1 }}>{authUser.name}</h1>
          {user && <div style={{ fontSize: 13, opacity: 0.7, marginTop: 3 }}>{user.carrera} · {user.matricula}</div>}
        </div>
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          <div className="text-center">
            <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{myActiveLoans.length}</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Préstamos</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{myPendingPurchases.length}</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>En evaluación</div>
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
          <button key={t.id} onClick={() => setTab(t.id)} className="flex items-center gap-1.5"
            style={{ padding: "6px 13px", borderRadius: 6, border: "none", cursor: "pointer", background: tab === t.id ? "var(--primary)" : "transparent", color: tab === t.id ? "#fff" : "var(--muted-foreground)", fontSize: 13, fontWeight: tab === t.id ? 600 : 400 }}>
            {t.label}
            {t.badge !== undefined && t.badge > 0 && (
              <span style={{ background: tab === t.id ? "rgba(255,255,255,0.25)" : "var(--muted)", color: tab === t.id ? "#fff" : "var(--muted-foreground)", borderRadius: 4, padding: "0 5px", fontSize: 11, fontWeight: 700 }}>{t.badge}</span>
            )}
          </button>
        ))}
      </div>
      </div>

      {/* ── Inicio ── */}
      {tab === "inicio" && (
        <div className="flex flex-col gap-4">
          {myOverdueLoans.length > 0 && (
            <div className="rounded-xl px-5 py-4 flex items-start gap-4" style={{ background: "#FEE2E2", border: "1px solid #FECACA" }}>
              <AlertTriangle size={20} style={{ color: "#DC2626", flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#991B1B", marginBottom: 2 }}>Tienes {myOverdueLoans.length} préstamo(s) vencido(s)</div>
                <div style={{ fontSize: 13, color: "#B91C1C" }}>Acércate a la biblioteca o contacta al bibliotecario para regularizar tu situación.</div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Active loans */}
            <div className="rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                <BookMarked size={15} style={{ color: "var(--primary)" }} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>Préstamos Vigentes</span>
              </div>
              {myActiveLoans.length === 0 ? (
                <div className="flex flex-col items-center py-10 gap-2">
                  <CheckCircle2 size={26} style={{ color: "#16A34A" }} />
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
                          {loan.tipo === "externo" && <div style={{ fontSize: 11, color: "#7C3AED", fontWeight: 600 }}>Externo × {loan.cantidad ?? 1}</div>}
                          {loan.estado !== "pendiente" && <div style={{ fontSize: 11.5, color: days < 0 ? "#DC2626" : days <= 3 ? "#D97706" : "var(--muted-foreground)" }}>
                            {days < 0 ? `${Math.abs(days)}d vencido` : days === 0 ? "Vence hoy" : `${days}d restantes`}
                          </div>}
                        </div>
                        <span className="rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: s.bg, color: s.color, flexShrink: 0 }}>{s.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Purchase requests preview */}
            <div className="rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                <ShoppingCart size={15} style={{ color: "#16A34A" }} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>Solicitudes de Adquisición</span>
              </div>
              {myPurchaseRequests.length === 0 ? (
                <div className="flex flex-col items-center py-10 gap-2">
                  <ShoppingCart size={26} style={{ color: "var(--muted-foreground)" }} />
                  <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>Sin solicitudes enviadas</span>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {myPurchaseRequests.slice(0, 4).map((req) => {
                    const s = purchaseStatusInfo(req.estado);
                    return (
                      <div key={req.id} className="flex items-center gap-3 px-5 py-3">
                        <div className="flex-1 min-w-0">
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{req.titulo}</div>
                          <div style={{ fontSize: 11.5, color: "var(--muted-foreground)" }}>{tipoLabel(req.tipo)} · {req.cantidad} uds.</div>
                        </div>
                        <span className="rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: s.bg, color: s.color, flexShrink: 0 }}>{s.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {user && (
            <div className="rounded-xl px-5 py-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--foreground)" }}>Capacidad de Préstamos</span>
                <span style={{ fontSize: 13, color: "var(--muted-foreground)" }}>{myActiveLoans.length} de {user.limitePrestamos} utilizados</span>
              </div>
              <div className="rounded-full overflow-hidden" style={{ height: 8, background: "var(--muted)" }}>
                <div className="h-full rounded-full" style={{ width: `${(myActiveLoans.length / user.limitePrestamos) * 100}%`, background: myActiveLoans.length >= user.limitePrestamos ? "#DC2626" : myActiveLoans.length >= user.limitePrestamos * 0.7 ? "#D97706" : "var(--primary)" }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Mis Préstamos ── */}
      {tab === "prestamos" && (
        <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
            <BookMarked size={15} style={{ color: "var(--primary)" }} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>Historial de Préstamos ({myLoans.length})</span>
          </div>
          {myLoans.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-3">
              <BookOpen size={36} style={{ color: "var(--muted-foreground)" }} />
              <span style={{ fontSize: 14, color: "var(--muted-foreground)" }}>Sin préstamos registrados.</span>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                  {["Libro", "Tipo", "Solicitud", "Devolución", "Estado"].map((h) => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11.5, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myLoans.map((loan, i) => {
                  const book = getBook(loan.libroId);
                  const s = loanStatusInfo(loan.estado);
                  return (
                    <tr key={loan.id} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.012)" }}>
                      <td style={{ padding: "12px 14px" }}>
                        <div className="flex items-center gap-3">
                          {book && <BookCover book={book} size="xs" />}
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--foreground)" }}>{book?.titulo}</div>
                            <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{book?.autor}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        {loan.tipo === "externo"
                          ? <span style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED", background: "#EDE9FE", borderRadius: 4, padding: "2px 7px" }}>Externo × {loan.cantidad ?? 1}</span>
                          : <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Regular</span>
                        }
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 13, color: "var(--foreground)" }}>{formatDate(loan.fechaPrestamo)}</td>
                      <td style={{ padding: "12px 14px", fontSize: 13, color: loan.estado === "vencido" ? "#DC2626" : "var(--foreground)" }}>
                        {loan.fechaDevolucionReal ? formatDate(loan.fechaDevolucionReal) : formatDate(loan.fechaDevolucion)}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
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

      {/* ── Mis Reservas ── */}
      {tab === "reservas" && (
        <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: "var(--border)" }}>
            <CalendarDays size={15} style={{ color: "var(--primary)" }} />
            <span style={{ fontWeight: 600, fontSize: 14 }}>Mis Reservas ({myReservations.length})</span>
          </div>
          {myReservations.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-3">
              <CalendarDays size={36} style={{ color: "var(--muted-foreground)" }} />
              <span style={{ fontSize: 14, color: "var(--muted-foreground)" }}>Sin reservas registradas.</span>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                  {["Libro", "F. Reserva", "Válida hasta", "Estado"].map((h) => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11.5, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myReservations.map((resv, i) => {
                  const book = getBook(resv.libroId);
                  const color = resv.estado === "pendiente" ? "#D97706" : resv.estado === "confirmada" ? "#1D6FA4" : resv.estado === "cancelada" ? "#6B7A99" : "#16A34A";
                  const bg    = resv.estado === "pendiente" ? "#FEF3C7" : resv.estado === "confirmada" ? "#DBEAFE" : resv.estado === "cancelada" ? "#F1F5F9" : "#DCFCE7";
                  const label = resv.estado.charAt(0).toUpperCase() + resv.estado.slice(1);
                  return (
                    <tr key={resv.id} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.012)" }}>
                      <td style={{ padding: "12px 14px" }}>
                        <div className="flex items-center gap-3">
                          {book && <BookCover book={book} size="xs" />}
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--foreground)" }}>{book?.titulo}</div>
                            <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{book?.autor}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 13, color: "var(--foreground)" }}>{formatDate(resv.fechaReserva)}</td>
                      <td style={{ padding: "12px 14px", fontSize: 13, color: "var(--foreground)" }}>{formatDate(resv.fechaVencimiento)}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span className="rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: bg, color }}>{label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Solicitudes de Adquisición ── */}
      {tab === "solicitudes" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-lg px-4 py-3 flex items-center gap-3" style={{ background: "#EDE9FE", border: "1px solid #DDD6FE" }}>
            <ShoppingCart size={15} style={{ color: "#7C3AED", flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#4C1D95" }}>
              Tus propuestas de adquisición son revisadas por el bibliotecario. El proceso puede tomar varios días hábiles.
            </span>
          </div>
          {myPurchaseRequests.length === 0 ? (
            <div className="rounded-xl flex flex-col items-center py-16 gap-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <ShoppingCart size={36} style={{ color: "var(--muted-foreground)" }} />
              <span style={{ fontSize: 14, color: "var(--muted-foreground)" }}>Sin solicitudes de adquisición enviadas.</span>
              <p style={{ fontSize: 13, color: "var(--muted-foreground)", textAlign: "center", maxWidth: 300 }}>Ve al Catálogo y usa el botón <strong>"Solicitar Adquisición"</strong> en cualquier libro para proponer una compra.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {myPurchaseRequests.map((req) => {
                const s = purchaseStatusInfo(req.estado);
                return (
                  <div key={req.id} className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", fontFamily: "'Playfair Display', serif" }}>{req.titulo}</div>
                        <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginTop: 2 }}>{req.autor}{req.editorial ? ` · ${req.editorial}` : ""}{req.anio ? ` (${req.anio})` : ""}</div>
                      </div>
                      <span className="rounded-md px-2 py-0.5 text-xs font-semibold whitespace-nowrap" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[
                        { label: "Tipo", value: tipoLabel(req.tipo) },
                        { label: "Cantidad / Usuarios", value: req.cantidad },
                        { label: "Asignatura", value: req.asignatura || "—" },
                      ].map((r) => (
                        <div key={r.label} className="rounded-lg px-3 py-2" style={{ background: "var(--muted)" }}>
                          <div style={{ fontSize: 10.5, color: "var(--muted-foreground)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{r.label}</div>
                          <div style={{ fontSize: 13, color: "var(--foreground)", fontWeight: 500, marginTop: 1 }}>{r.value}</div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-lg px-3 py-2.5" style={{ background: "var(--muted)" }}>
                      <div style={{ fontSize: 11, color: "var(--muted-foreground)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Justificación</div>
                      <p style={{ fontSize: 13, color: "var(--foreground)", lineHeight: 1.6 }}>{req.justificacion}</p>
                    </div>
                    {req.observaciones && (
                      <div className="rounded-lg px-3 py-2.5 mt-2" style={{ background: req.estado === "aprobada" ? "#DCFCE7" : req.estado === "rechazada" ? "#FEE2E2" : "#DBEAFE" }}>
                        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3, color: req.estado === "aprobada" ? "#16A34A" : req.estado === "rechazada" ? "#DC2626" : "#1D6FA4" }}>
                          Respuesta del bibliotecario
                        </div>
                        <p style={{ fontSize: 13, color: "var(--foreground)", lineHeight: 1.6 }}>{req.observaciones}</p>
                      </div>
                    )}
                    <div style={{ fontSize: 11.5, color: "var(--muted-foreground)", marginTop: 8 }}>
                      <Clock size={11} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
                      Enviada el {formatDate(req.fechaSolicitud)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Mi Perfil ── */}
      {tab === "perfil" && user && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: "var(--foreground)", marginBottom: 14 }}>Información Académica</h3>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Nombre completo",   value: `${user.nombre} ${user.apellidos}` },
                { label: "Nombramiento",       value: user.matricula },
                { label: "Facultad / Área",    value: user.carrera },
                { label: "Correo institucional", value: user.email },
                { label: "Teléfono",           value: user.telefono },
                { label: "Fecha de registro",  value: formatDate(user.fechaRegistro) },
              ].map((r) => (
                <div key={r.label} className="rounded-lg px-3 py-2.5" style={{ background: "var(--muted)" }}>
                  <div style={{ fontSize: 11, color: "var(--muted-foreground)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{r.label}</div>
                  <div style={{ fontSize: 13.5, color: "var(--foreground)", fontWeight: 500, marginTop: 1 }}>{r.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: "var(--foreground)", marginBottom: 12 }}>Privilegios Docentes</h3>
              <div className="flex flex-col gap-2">
                {[
                  { label: `Préstamos simultáneos: hasta ${user.limitePrestamos}`, ok: true },
                  { label: "Préstamos externos (múltiples ejemplares)", ok: true },
                  { label: "Duración extendida: hasta 180 días", ok: true },
                  { label: "Solicitud de adquisiciones bibliográficas", ok: true },
                  { label: "Propuesta de licencias digitales", ok: true },
                  { label: "Acceso a zonas de investigación restringidas", ok: true },
                ].map((p) => (
                  <div key={p.label} className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: "var(--muted)" }}>
                    <CheckCircle2 size={13} style={{ color: "#16A34A", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "var(--foreground)" }}>{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
