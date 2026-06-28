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
import { DocProfile } from "./components/DocProfile";
import { AdminProfile } from "./components/AdminProfile";
import { AcquisitionRequests } from "./components/AcquisitionRequests";
import {
  INITIAL_LOANS, INITIAL_PURCHASE_REQUESTS, INITIAL_RESERVATIONS,
  type AuthUser, type Loan, type ModuleId, type PurchaseRequest, type Reservation, type UserRole,
} from "./components/data";

type AppState = "login" | "guest" | "authenticated";

const PAGE_TITLES: Record<ModuleId, string> = {
  dashboard: "Dashboard",
  catalogo: "Catálogo",
  prestamos: "Gestión de Préstamos",
  usuarios: "Gestión de Usuarios",
  reservas: "Reservas",
  "gestion-libros": "Gestión de Libros",
  "solicitudes-adquisicion": "Solicitudes de Adquisición",
  inicio: "Inicio",
  "mis-prestamos": "Mis Préstamos",
  "mis-reservas": "Mis Reservas",
  "mis-solicitudes": "Mis Solicitudes de Adquisición",
  perfil: "Mi Perfil",
};

function defaultModule(role: UserRole): ModuleId {
  if (role === "estudiante" || role === "docente") return "inicio";
  return "dashboard";
}

function roleLabel(role: UserRole) {
  if (role === "admin")         return "Admin";
  if (role === "bibliotecario") return "Bibliotecario";
  if (role === "docente")       return "Docente";
  return "Estudiante";
}

function roleBadgeStyle(role: UserRole) {
  if (role === "admin")         return { background: "#FEF3C7", color: "#92400E" };
  if (role === "bibliotecario") return { background: "#DBEAFE", color: "#1E40AF" };
  if (role === "docente")       return { background: "#EDE9FE", color: "#4C1D95" };
  return { background: "#DCFCE7", color: "#166534" };
}

export default function App() {
  const [appState, setAppState] = useState<AppState>("login");
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [activeModule, setActiveModule] = useState<ModuleId>("dashboard");
  const [loans, setLoans] = useState<Loan[]>(INITIAL_LOANS);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>(INITIAL_PURCHASE_REQUESTS);

  function handleLogin(user: AuthUser) {
    setAuthUser(user);
    setActiveModule(defaultModule(user.role));
    setAppState("authenticated");
  }

  function handleLogout() {
    setAuthUser(null);
    setActiveModule("dashboard");
    setAppState("login");
  }

  // ── Loan request (student / docente → pendiente)
  function handleRequestLoan(
    bookId: string,
    userId: string,
    tipo: "regular" | "externo" = "regular",
    cantidad = 1,
    dias = 14,
    justificacion = "",
  ) {
    const today = new Date().toISOString().split("T")[0];
    const due   = new Date(Date.now() + dias * 86400000).toISOString().split("T")[0];
    const newLoan: Loan = {
      id: `P${String(loans.length + 1).padStart(3, "0")}`,
      libroId: bookId,
      usuarioId: userId,
      fechaPrestamo: today,
      fechaDevolucion: due,
      estado: "pendiente",
      renovaciones: 0,
      tipo,
      cantidad: tipo === "externo" ? cantidad : undefined,
      justificacion: justificacion || undefined,
    };
    setLoans((prev) => [newLoan, ...prev]);
  }

  // ── Reservation request (student / docente)
  function handleRequestReservation(bookId: string, userId: string) {
    const today = new Date().toISOString().split("T")[0];
    const due   = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
    const newResv: Reservation = {
      id: `R${String(reservations.length + 1).padStart(3, "0")}`,
      libroId: bookId,
      usuarioId: userId,
      fechaReserva: today,
      fechaVencimiento: due,
      estado: "pendiente",
    };
    setReservations((prev) => [newResv, ...prev]);
  }

  // ── Purchase request (docente)
  function handleRequestPurchase(req: Omit<PurchaseRequest, "id" | "estado" | "fechaSolicitud">) {
    const newReq: PurchaseRequest = {
      ...req,
      id: `SQ${String(purchaseRequests.length + 1).padStart(3, "0")}`,
      estado: "pendiente",
      fechaSolicitud: new Date().toISOString().split("T")[0],
    };
    setPurchaseRequests((prev) => [newReq, ...prev]);
  }

  const pendingLoans = loans.filter((l) => l.estado === "pendiente").length;
  const pendingAcq   = purchaseRequests.filter((r) => r.estado === "pendiente" || r.estado === "en_evaluacion").length;

  // ── Login / guest views
  if (appState === "login") return <Login onLogin={handleLogin} onGuest={() => setAppState("guest")} />;
  if (appState === "guest") return <PublicHome onLogin={() => setAppState("login")} />;
  if (!authUser) return null;

  const role = authUser.role;
  const badgeStyle = roleBadgeStyle(role);
  const isStaff = role === "admin" || role === "bibliotecario";
  const isUser  = role === "estudiante" || role === "docente";

  // Student tab mapping
  function studentTab(mod: ModuleId) {
    if (mod === "mis-prestamos") return "prestamos";
    if (mod === "mis-reservas")  return "reservas";
    if (mod === "perfil")        return "perfil";
    return "inicio";
  }

  // Docente tab mapping
  function docenteTab(mod: ModuleId) {
    if (mod === "mis-prestamos")  return "prestamos";
    if (mod === "mis-reservas")   return "reservas";
    if (mod === "mis-solicitudes") return "solicitudes";
    if (mod === "perfil")         return "perfil";
    return "inicio";
  }

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
        pendingLoans={isStaff ? pendingLoans : 0}
        pendingAcquisitions={isStaff ? pendingAcq : 0}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-7 py-4 border-b"
          style={{ background: "var(--card)", borderColor: "var(--border)", flexShrink: 0, boxShadow: "0 1px 0 var(--border)" }}>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>UNILIB</span>
            <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>/</span>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--foreground)" }}>{PAGE_TITLES[activeModule]}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full px-3 py-1 text-xs font-semibold" style={badgeStyle}>{roleLabel(role)}</span>
            <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
              {new Date().toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
            </span>
            <div className="rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
              style={{ width: 30, height: 30, background: "var(--primary)", color: "#fff" }}
              onClick={() => setActiveModule("perfil")} title="Mi perfil">
              {authUser.initials}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-7 py-6">
          {/* ── Staff (admin / bibliotecario) ── */}
          {isStaff && (
            <>
              {activeModule === "dashboard"  && <Dashboard />}
              {activeModule === "catalogo"   && <Catalog />}
              {activeModule === "prestamos"  && <Loans loans={loans} onLoansChange={setLoans} />}
              {activeModule === "usuarios"   && <Users />}
              {activeModule === "reservas"   && <Reservations />}
              {activeModule === "gestion-libros" && role === "admin" && <BookManagement />}
              {activeModule === "solicitudes-adquisicion" && (
                <AcquisitionRequests purchaseRequests={purchaseRequests} onRequestsChange={setPurchaseRequests} />
              )}
              {activeModule === "perfil" && <AdminProfile authUser={authUser} />}
            </>
          )}

          {/* ── Estudiante ── */}
          {role === "estudiante" && (
            <>
              {activeModule !== "catalogo" && (
                <StudentProfile
                  key={activeModule}
                  authUser={authUser}
                  initialTab={studentTab(activeModule) as any}
                  loans={loans}
                />
              )}
              {activeModule === "catalogo" && (
                <Catalog
                  authUser={authUser}
                  loans={loans}
                  onRequestLoan={handleRequestLoan}
                  onRequestReservation={handleRequestReservation}
                  onNavigate={setActiveModule}
                />
              )}
            </>
          )}

          {/* ── Docente ── */}
          {role === "docente" && (
            <>
              {activeModule !== "catalogo" && (
                <DocProfile
                  key={activeModule}
                  authUser={authUser}
                  initialTab={docenteTab(activeModule) as any}
                  loans={loans}
                  purchaseRequests={purchaseRequests}
                />
              )}
              {activeModule === "catalogo" && (
                <Catalog
                  authUser={authUser}
                  loans={loans}
                  onRequestLoan={handleRequestLoan}
                  onRequestReservation={handleRequestReservation}
                  onRequestPurchase={handleRequestPurchase}
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
