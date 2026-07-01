import { Shield, Users, BookOpen, BookMarked, CalendarDays, Activity } from "lucide-react";
import { BOOKS, USERS, INITIAL_LOANS, INITIAL_RESERVATIONS, type AuthUser } from "./data";

interface AdminProfileProps {
  authUser: AuthUser;
}

export function AdminProfile({ authUser }: AdminProfileProps) {
  const isAdmin = authUser.role === "admin";
  const roleLabel = isAdmin ? "Administrador del Sistema" : "Bibliotecario";
  const roleColor = isAdmin ? { bg: "#FEF3C7", color: "#92400E" } : { bg: "#DBEAFE", color: "#1E40AF" };

  const totalLoans = INITIAL_LOANS.length;
  const activeLoans = INITIAL_LOANS.filter((l) => l.estado !== "devuelto").length;
  const overdueLoans = INITIAL_LOANS.filter((l) => l.estado === "vencido").length;
  const totalUsers = USERS.length;
  const totalBooks = BOOKS.length;
  const pendingResvs = INITIAL_RESERVATIONS.filter((r) => r.estado === "pendiente").length;

  function formatDate(str: string) {
    return new Date(str).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col gap-5">
      {/* Profile header */}
      <div className="rounded-xl p-6 flex items-center gap-5" style={{ background: "var(--primary)", color: "#fff" }}>
        <div className="flex items-center justify-center rounded-full" style={{ width: 64, height: 64, background: "rgba(255,255,255,0.15)", flexShrink: 0 }}>
          <span style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{authUser.initials}</span>
        </div>
        <div className="flex-1">
          <div style={{ fontSize: 12, opacity: 0.65, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Perfil de usuario</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 24, lineHeight: 1.1 }}>{authUser.name}</h1>
          <div style={{ fontSize: 13.5, opacity: 0.75, marginTop: 4 }}>{authUser.email}</div>
          <div className="mt-3">
            <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: "rgba(200,146,26,0.25)", color: "#C8921A", border: "1px solid rgba(200,146,26,0.4)" }}>
              {roleLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Account info */}
        <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: "var(--foreground)", marginBottom: 14 }}>Información de Cuenta</h3>
          <div className="flex flex-col gap-2.5">
            {[
              { label: "Rol del sistema", value: roleLabel },
              { label: "Correo electrónico", value: authUser.email },
              { label: "Último acceso", value: formatDate(today) },
              { label: "Estado", value: "Activo" },
            ].map((r) => (
              <div key={r.label} className="flex flex-col gap-0.5 rounded-lg px-3 py-2.5" style={{ background: "var(--muted)" }}>
                <span style={{ fontSize: 11, color: "var(--muted-foreground)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{r.label}</span>
                <span style={{ fontSize: 13.5, color: "var(--foreground)", fontWeight: 500 }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System permissions */}
        <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: "var(--foreground)", marginBottom: 14 }}>Permisos del Sistema</h3>
          <div className="flex flex-col gap-2">
            {[
              { label: "Ver catálogo bibliográfico", allowed: true },
              { label: "Registrar y devolver préstamos", allowed: true },
              { label: "Gestionar reservas", allowed: true },
              { label: "Administrar usuarios", allowed: true },
              { label: "Agregar / editar libros", allowed: isAdmin },
              { label: "Eliminar títulos del catálogo", allowed: isAdmin },
              { label: "Configuración del sistema", allowed: isAdmin },
            ].map((p) => (
              <div key={p.label} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: "var(--muted)" }}>
                <span style={{ fontSize: 13, color: "var(--foreground)" }}>{p.label}</span>
                <span className="rounded-md px-2 py-0.5 text-xs font-semibold"
                  style={{ background: p.allowed ? "#DCFCE7" : "#F1F5F9", color: p.allowed ? "#16A34A" : "#9CA3AF" }}>
                  {p.allowed ? "✓ Permitido" : "✗ Restringido"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System stats */}
      <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 mb-4">
          <Activity size={16} style={{ color: "var(--primary)" }} />
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: "var(--foreground)" }}>Estado General del Sistema</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon: <BookOpen size={18} />, label: "Títulos en catálogo", value: totalBooks, color: "var(--primary)", bg: "var(--secondary)" },
            { icon: <Users size={18} />, label: "Usuarios registrados", value: totalUsers, color: "#7C3AED", bg: "#EDE9FE" },
            { icon: <BookMarked size={18} />, label: "Préstamos activos", value: activeLoans, color: "#1D6FA4", bg: "#DBEAFE" },
            { icon: <Shield size={18} />, label: "Préstamos vencidos", value: overdueLoans, color: "#DC2626", bg: "#FEE2E2" },
            { icon: <CalendarDays size={18} />, label: "Reservas pendientes", value: pendingResvs, color: "#D97706", bg: "#FEF3C7" },
            { icon: <Activity size={18} />, label: "Total préstamos hist.", value: totalLoans, color: "#16A34A", bg: "#DCFCE7" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg p-4 flex flex-col gap-2" style={{ background: "var(--muted)" }}>
              <div className="rounded-lg p-1.5 w-fit" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
