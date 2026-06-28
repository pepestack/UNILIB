import {
  LayoutDashboard, BookOpen, BookMarked, Users, CalendarDays,
  BookText, LogOut, User, Library, Home, ShoppingCart,
} from "lucide-react";
import type { ModuleId, UserRole } from "./data";

interface NavItem { id: ModuleId; label: string; icon: React.ReactNode }

const ADMIN_NAV: NavItem[] = [
  { id: "dashboard",            label: "Dashboard",               icon: <LayoutDashboard size={17} /> },
  { id: "catalogo",             label: "Catálogo",                icon: <BookOpen size={17} /> },
  { id: "prestamos",            label: "Gestión de Préstamos",    icon: <BookMarked size={17} /> },
  { id: "usuarios",             label: "Gestión de Usuarios",     icon: <Users size={17} /> },
  { id: "reservas",             label: "Reservas",                icon: <CalendarDays size={17} /> },
  { id: "gestion-libros",       label: "Gestión de Libros",       icon: <Library size={17} /> },
  { id: "solicitudes-adquisicion", label: "Adquisiciones",        icon: <ShoppingCart size={17} /> },
];

const BIBLIOTECARIO_NAV: NavItem[] = [
  { id: "dashboard",            label: "Dashboard",               icon: <LayoutDashboard size={17} /> },
  { id: "catalogo",             label: "Catálogo",                icon: <BookOpen size={17} /> },
  { id: "prestamos",            label: "Gestión de Préstamos",    icon: <BookMarked size={17} /> },
  { id: "reservas",             label: "Reservas",                icon: <CalendarDays size={17} /> },
  { id: "solicitudes-adquisicion", label: "Adquisiciones",        icon: <ShoppingCart size={17} /> },
];

const ESTUDIANTE_NAV: NavItem[] = [
  { id: "inicio",               label: "Inicio",                  icon: <Home size={17} /> },
  { id: "catalogo",             label: "Catálogo",                icon: <BookOpen size={17} /> },
  { id: "mis-prestamos",        label: "Mis Préstamos",           icon: <BookMarked size={17} /> },
  { id: "mis-reservas",         label: "Mis Reservas",            icon: <CalendarDays size={17} /> },
];

const DOCENTE_NAV: NavItem[] = [
  { id: "inicio",               label: "Inicio",                  icon: <Home size={17} /> },
  { id: "catalogo",             label: "Catálogo",                icon: <BookOpen size={17} /> },
  { id: "mis-prestamos",        label: "Mis Préstamos",           icon: <BookMarked size={17} /> },
  { id: "mis-reservas",         label: "Mis Reservas",            icon: <CalendarDays size={17} /> },
  { id: "mis-solicitudes",      label: "Mis Adquisiciones",       icon: <ShoppingCart size={17} /> },
];

function getNav(role: UserRole): NavItem[] {
  if (role === "admin")         return ADMIN_NAV;
  if (role === "bibliotecario") return BIBLIOTECARIO_NAV;
  if (role === "docente")       return DOCENTE_NAV;
  return ESTUDIANTE_NAV;
}

function getRoleLabel(role: UserRole) {
  if (role === "admin")         return "Administrador";
  if (role === "bibliotecario") return "Bibliotecario";
  if (role === "docente")       return "Docente";
  return "Estudiante";
}

function getBadge(id: ModuleId, pendingLoans: number, pendingAcq: number): number | undefined {
  if (id === "prestamos" && pendingLoans > 0)          return pendingLoans;
  if (id === "solicitudes-adquisicion" && pendingAcq > 0) return pendingAcq;
  return undefined;
}

interface SidebarProps {
  active: ModuleId;
  onNavigate: (id: ModuleId) => void;
  role: UserRole;
  userName: string;
  userEmail: string;
  userInitials: string;
  onLogout: () => void;
  pendingLoans?: number;
  pendingAcquisitions?: number;
}

export function Sidebar({ active, onNavigate, role, userName, userEmail, userInitials, onLogout, pendingLoans = 0, pendingAcquisitions = 0 }: SidebarProps) {
  const navItems = getNav(role);

  function NavButton({ item }: { item: NavItem }) {
    const isActive = active === item.id;
    const badge = getBadge(item.id, pendingLoans, pendingAcquisitions);
    return (
      <button
        onClick={() => onNavigate(item.id)}
        className="flex items-center gap-3 rounded-md px-3 py-2.5 w-full text-left transition-all duration-150"
        style={{ background: isActive ? "var(--sidebar-primary)" : "transparent", color: isActive ? "#fff" : "var(--sidebar-foreground)", fontWeight: isActive ? 600 : 400, fontSize: 13.5, cursor: "pointer", border: "none", outline: "none" }}
        onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "var(--sidebar-accent)"; e.currentTarget.style.color = "#fff"; } }}
        onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--sidebar-foreground)"; } }}
      >
        <span style={{ opacity: isActive ? 1 : 0.7, flexShrink: 0 }}>{item.icon}</span>
        <span className="flex-1 truncate">{item.label}</span>
        {badge !== undefined && (
          <span style={{ background: isActive ? "rgba(255,255,255,0.3)" : "#DC2626", color: "#fff", borderRadius: 10, padding: "0 6px", fontSize: 10.5, fontWeight: 700, flexShrink: 0 }}>
            {badge}
          </span>
        )}
      </button>
    );
  }

  return (
    <aside className="flex flex-col h-full" style={{ background: "var(--sidebar)", color: "var(--sidebar-foreground)", width: 252, flexShrink: 0 }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: "var(--sidebar-border)" }}>
        <div className="flex items-center justify-center rounded-lg" style={{ background: "var(--sidebar-primary)", width: 36, height: 36, flexShrink: 0 }}>
          <BookText size={18} color="#fff" />
        </div>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "#fff", lineHeight: 1.1 }}>UNILIB</div>
          <div style={{ fontSize: 10, color: "var(--sidebar-foreground)", opacity: 0.5, letterSpacing: "0.06em", textTransform: "uppercase" }}>Gestión Bibliotecaria</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--sidebar-foreground)", opacity: 0.4, padding: "4px 8px 6px" }}>
          {role === "estudiante" || role === "docente" ? "Mi Biblioteca" : "Módulos"}
        </div>
        {navItems.map((item) => <NavButton key={item.id} item={item} />)}

        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--sidebar-foreground)", opacity: 0.4, padding: "4px 8px 6px" }}>Cuenta</div>
          <NavButton item={{ id: "perfil", label: "Mi Perfil", icon: <User size={17} /> }} />
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t" style={{ borderColor: "var(--sidebar-border)" }}>
        <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-md" style={{ background: "var(--sidebar-accent)" }}>
          <div className="flex items-center justify-center rounded-full text-xs font-bold" style={{ width: 32, height: 32, background: "var(--sidebar-primary)", color: "#fff", flexShrink: 0 }}>
            {userInitials}
          </div>
          <div className="overflow-hidden flex-1">
            <div style={{ fontSize: 12.5, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userName}</div>
            <div style={{ fontSize: 10.5, color: "var(--sidebar-foreground)", opacity: 0.5 }}>{getRoleLabel(role)}</div>
          </div>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 w-full px-3 py-2 rounded-md transition-all"
          style={{ color: "var(--sidebar-foreground)", opacity: 0.55, background: "transparent", border: "none", cursor: "pointer", fontSize: 13 }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.background = "var(--sidebar-accent)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.55"; e.currentTarget.style.background = "transparent"; }}
        >
          <LogOut size={14} /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
