import { BookOpen, BookMarked, Users, CalendarDays, AlertTriangle, Clock, TrendingUp, CheckCircle2 } from "lucide-react";
import { BOOKS, INITIAL_LOANS, USERS, INITIAL_RESERVATIONS } from "./data";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  warning?: boolean;
}

function StatCard({ icon, label, value, sub, accent, warning }: StatCardProps) {
  return (
    <div
      className="rounded-xl p-5 flex items-start gap-4"
      style={{
        background: accent ? "var(--primary)" : warning ? "#FFF7ED" : "var(--card)",
        border: warning ? "1px solid #FED7AA" : "1px solid var(--border)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="flex items-center justify-center rounded-lg"
        style={{
          width: 44,
          height: 44,
          flexShrink: 0,
          background: accent ? "rgba(255,255,255,0.15)" : warning ? "#FFEDD5" : "var(--secondary)",
          color: accent ? "#fff" : warning ? "#C2410C" : "var(--primary)",
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 13, color: accent ? "rgba(255,255,255,0.75)" : warning ? "#92400E" : "var(--muted-foreground)", marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1, color: accent ? "#fff" : warning ? "#7C2D12" : "var(--foreground)", fontFamily: "'Playfair Display', serif" }}>
          {value}
        </div>
        {sub && (
          <div style={{ fontSize: 12, marginTop: 3, color: accent ? "rgba(255,255,255,0.65)" : warning ? "#92400E" : "var(--muted-foreground)" }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

function statusLabel(estado: string) {
  if (estado === "activo") return { label: "Activo", color: "#16A34A", bg: "#DCFCE7" };
  if (estado === "vencido") return { label: "Vencido", color: "#DC2626", bg: "#FEE2E2" };
  return { label: "Devuelto", color: "#6B7A99", bg: "#F1F5F9" };
}

export function Dashboard() {
  const totalLibros = BOOKS.length;
  const totalEjemplares = BOOKS.reduce((a, b) => a + b.totalEjemplares, 0);
  const prestamosActivos = INITIAL_LOANS.filter((l) => l.estado === "activo" || l.estado === "vencido").length;
  const prestamosVencidos = INITIAL_LOANS.filter((l) => l.estado === "vencido").length;
  const usuariosActivos = USERS.filter((u) => u.estado === "activo").length;
  const reservasPendientes = INITIAL_RESERVATIONS.filter((r) => r.estado === "pendiente").length;
  const librosDisponibles = BOOKS.filter((b) => b.disponibles > 0).length;

  const recentLoans = [...INITIAL_LOANS]
    .filter((l) => l.estado !== "devuelto")
    .sort((a, b) => new Date(b.fechaPrestamo).getTime() - new Date(a.fechaPrestamo).getTime())
    .slice(0, 6);

  const overdueLoans = INITIAL_LOANS.filter((l) => l.estado === "vencido");

  function getBook(id: string) {
    return BOOKS.find((b) => b.id === id);
  }
  function getUser(id: string) {
    return USERS.find((u) => u.id === id);
  }
  function formatDate(str: string) {
    return new Date(str).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
  }
  function daysOverdue(str: string) {
    const diff = new Date().getTime() - new Date(str).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "var(--foreground)", marginBottom: 2 }}>
          Panel de Control
        </h1>
        <p style={{ fontSize: 13.5, color: "var(--muted-foreground)" }}>
          Resumen general del sistema — {new Date().toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<BookOpen size={22} />} label="Títulos en Catálogo" value={totalLibros} sub={`${totalEjemplares} ejemplares totales`} accent />
        <StatCard icon={<BookMarked size={22} />} label="Préstamos Activos" value={prestamosActivos} sub={`${librosDisponibles} títulos disponibles`} />
        <StatCard icon={<Users size={22} />} label="Usuarios Registrados" value={USERS.length} sub={`${usuariosActivos} activos`} />
        <StatCard icon={<CalendarDays size={22} />} label="Reservas Pendientes" value={reservasPendientes} sub="En espera de confirmación" />
        {prestamosVencidos > 0 && (
          <StatCard icon={<AlertTriangle size={22} />} label="Préstamos Vencidos" value={prestamosVencidos} sub="Requieren atención inmediata" warning />
        )}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Active Loans */}
        <div className="rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2">
              <Clock size={16} style={{ color: "var(--primary)" }} />
              <span style={{ fontWeight: 600, fontSize: 14, color: "var(--foreground)" }}>Préstamos Recientes</span>
            </div>
            <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{recentLoans.length} activos</span>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {recentLoans.map((loan) => {
              const book = getBook(loan.libroId);
              const user = getUser(loan.usuarioId);
              const s = statusLabel(loan.estado);
              return (
                <div key={loan.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {book?.titulo}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 1 }}>
                      {user?.nombre} {user?.apellidos}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: s.bg, color: s.color }}>
                      {s.label}
                    </span>
                    <div style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 2 }}>
                      {formatDate(loan.fechaDevolucion)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overdue Alerts */}
        <div className="rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} style={{ color: "#DC2626" }} />
              <span style={{ fontWeight: 600, fontSize: 14, color: "var(--foreground)" }}>Alertas de Vencimiento</span>
            </div>
            <span style={{ fontSize: 12, color: "#DC2626", fontWeight: 500 }}>{overdueLoans.length} vencidos</span>
          </div>
          {overdueLoans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <CheckCircle2 size={32} style={{ color: "#16A34A" }} />
              <span style={{ fontSize: 13.5, color: "var(--muted-foreground)" }}>Sin préstamos vencidos</span>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {overdueLoans.map((loan) => {
                const book = getBook(loan.libroId);
                const user = getUser(loan.usuarioId);
                const days = daysOverdue(loan.fechaDevolucion);
                return (
                  <div key={loan.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="flex-1 min-w-0">
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {book?.titulo}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 1 }}>
                        {user?.nombre} {user?.apellidos} · {user?.matricula}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: "#FEE2E2", color: "#DC2626" }}>
                        {days}d vencido
                      </span>
                      <div style={{ fontSize: 11, color: "#DC2626", marginTop: 2 }}>
                        Venció: {formatDate(loan.fechaDevolucion)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Category distribution */}
      <div className="rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <TrendingUp size={16} style={{ color: "var(--primary)" }} />
          <span style={{ fontWeight: 600, fontSize: 14, color: "var(--foreground)" }}>Distribución por Área</span>
        </div>
        <div className="px-5 py-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from(new Set(BOOKS.map((b) => b.categoria))).map((cat) => {
            const items = BOOKS.filter((b) => b.categoria === cat);
            const total = items.reduce((a, b) => a + b.totalEjemplares, 0);
            const disp = items.reduce((a, b) => a + b.disponibles, 0);
            const pct = total > 0 ? Math.round((disp / total) * 100) : 0;
            return (
              <div key={cat}>
                <div className="flex justify-between mb-1">
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--foreground)" }}>{cat}</span>
                  <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{disp}/{total}</span>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: 6, background: "var(--muted)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: pct > 50 ? "#16A34A" : pct > 20 ? "var(--accent)" : "#DC2626" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
