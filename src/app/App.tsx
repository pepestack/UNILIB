import { useState } from "react";
import { Login } from "./components/Login";
import { PublicHome } from "./components/PublicHome";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { Catalog } from "./components/Catalog";
import { Loans } from "./components/Loans";
import { Users } from "./components/Users";
import { Reservations } from "./components/Reservations";
import { BookManagement } from "./components/BookManagement";
import { StudentProfile } from "./components/StudentProfile";
import { AdminProfile } from "./components/AdminProfile";
import { INITIAL_LOANS, type AuthUser, type Loan, type ModuleId, type UserRole } from "./components/data";

type AppState = "login" | "guest" | "authenticated";

const PAGE_TITLES: Record<ModuleId, string> = {
  dashboard: "Dashboard",
  catalogo: "Catálogo",
  prestamos: "Gestión de Préstamos",
  usuarios: "Gestión de Usuarios",
  reservas: "Reservas",
  "gestion-libros": "Gestión de Libros",
  inicio: "Inicio",
  "mis-prestamos": "Mis Préstamos",
  "mis-reservas": "Mis Reservas",
  perfil: "Mi Perfil",
};

function defaultModule(role: UserRole): ModuleId {
  if (role === "estudiante") return "inicio";
  return "dashboard";
}

export default function App() {
  const [appState, setAppState] = useState<AppState>("login");
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [activeModule, setActiveModule] = useState<ModuleId>("dashboard");
  const [loans, setLoans] = useState<Loan[]>(INITIAL_LOANS);

  function handleLogin(user: AuthUser) {
    setAuthUser(user);
    setActiveModule(defaultModule(user.role));
    setAppState("authenticated");
  }

  function handleGuest() {
    setAppState("guest");
  }

  function handleLogout() {
    setAuthUser(null);
    setActiveModule("dashboard");
    setAppState("login");
  }

  function handleRequestLoan(bookId: string, userId: string) {
    const today = new Date().toISOString().split("T")[0];
    const dueDate = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];
    const newLoan: Loan = {
      id: `P${String(loans.length + 1).padStart(3, "0")}`,
      libroId: bookId,
      usuarioId: userId,
      fechaPrestamo: today,
      fechaDevolucion: dueDate,
      estado: "activo",
      renovaciones: 0,
    };
    setLoans((prev) => [newLoan, ...prev]);
  }

  if (appState === "login") {
    return <Login onLogin={handleLogin} onGuest={handleGuest} />;
  }

  if (appState === "guest") {
    return <PublicHome onLogin={() => setAppState("login")} />;
  }

  if (!authUser) return null;

  const role = authUser.role;

  return (
    <div className="flex h-full overflow-hidden" style={{ fontFamily: "'Inter', sans-serif", background: "var(--background)" }}>
      <Sidebar
        active={activeModule}
        onNavigate={setActiveModule}
        role={role}
        userName={authUser.name}
        userEmail={authUser.email}
        userInitials={authUser.initials}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header
          className="flex items-center justify-between px-7 py-4 border-b"
          style={{ background: "var(--card)", borderColor: "var(--border)", flexShrink: 0, boxShadow: "0 1px 0 var(--border)" }}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>UNILIB</span>
            <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>/</span>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--foreground)" }}>{PAGE_TITLES[activeModule]}</span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                background: role === "admin" ? "#FEF3C7" : role === "bibliotecario" ? "#DBEAFE" : "#DCFCE7",
                color: role === "admin" ? "#92400E" : role === "bibliotecario" ? "#1E40AF" : "#166534",
              }}
            >
              {role === "admin" ? "Admin" : role === "bibliotecario" ? "Bibliotecario" : "Estudiante"}
            </span>
            <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
              {new Date().toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
            </span>
            <div
              className="rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
              style={{ width: 30, height: 30, background: "var(--primary)", color: "#fff" }}
              onClick={() => setActiveModule("perfil")}
              title="Mi perfil"
            >
              {authUser.initials}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-7 py-6">
          {(role === "admin" || role === "bibliotecario") && (
            <>
              {activeModule === "dashboard" && <Dashboard />}
              {activeModule === "catalogo" && <Catalog />}
              {activeModule === "prestamos" && <Loans />}
              {activeModule === "usuarios" && <Users />}
              {activeModule === "reservas" && <Reservations />}
              {activeModule === "gestion-libros" && role === "admin" && <BookManagement />}
              {activeModule === "perfil" && <AdminProfile authUser={authUser} />}
            </>
          )}

          {role === "estudiante" && (
            <>
              {activeModule === "inicio" && (
                <StudentProfile authUser={authUser} initialTab="inicio" loans={loans} />
              )}
              {activeModule === "mis-prestamos" && (
                <StudentProfile authUser={authUser} initialTab="prestamos" loans={loans} />
              )}
              {activeModule === "mis-reservas" && (
                <StudentProfile authUser={authUser} initialTab="reservas" loans={loans} />
              )}
              {activeModule === "perfil" && (
                <StudentProfile authUser={authUser} initialTab="perfil" loans={loans} />
              )}
              {activeModule === "catalogo" && (
                <Catalog
                  authUser={authUser}
                  loans={loans}
                  onRequestLoan={handleRequestLoan}
                  onNavigate={setActiveModule}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
