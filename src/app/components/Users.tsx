import { useState } from "react";
import { Search, Plus, X, User, ChevronDown, BookMarked } from "lucide-react";
import { USERS, INITIAL_LOANS, BOOKS, type User as UserType } from "./data";

function userTypeBadge(tipo: string) {
  if (tipo === "docente") return { label: "Docente", color: "#7C3AED", bg: "#EDE9FE" };
  if (tipo === "administrativo") return { label: "Administrativo", color: "#0369A1", bg: "#E0F2FE" };
  return { label: "Estudiante", color: "#1D6FA4", bg: "#DBEAFE" };
}

function userStatusBadge(estado: string) {
  if (estado === "activo") return { label: "Activo", color: "#16A34A", bg: "#DCFCE7" };
  if (estado === "suspendido") return { label: "Suspendido", color: "#D97706", bg: "#FEF3C7" };
  return { label: "Inactivo", color: "#6B7A99", bg: "#F1F5F9" };
}

function formatDate(str: string) {
  return new Date(str).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

interface UserFormProps {
  initial?: Partial<UserType>;
  onSave: (u: Omit<UserType, "id" | "prestamosActivos">) => void;
  onClose: () => void;
}

const CARRERAS = [
  "Licenciatura en Derecho", "Medicina", "Ingeniería en Sistemas", "Administración de Empresas",
  "Arquitectura", "Psicología", "Sociología", "Licenciatura en Historia", "Matemáticas",
  "Informática", "Facultad de Derecho", "Facultad de Psicología", "Facultad de Matemáticas",
  "Administración General",
];

function UserForm({ initial, onSave, onClose }: UserFormProps) {
  const [form, setForm] = useState({
    nombre: initial?.nombre ?? "",
    apellidos: initial?.apellidos ?? "",
    matricula: initial?.matricula ?? "",
    carrera: initial?.carrera ?? "Licenciatura en Derecho",
    tipo: (initial?.tipo ?? "estudiante") as UserType["tipo"],
    email: initial?.email ?? "",
    telefono: initial?.telefono ?? "",
    limitePrestamos: initial?.limitePrestamos ?? 3,
    fechaRegistro: initial?.fechaRegistro ?? new Date().toISOString().split("T")[0],
    estado: (initial?.estado ?? "activo") as UserType["estado"],
  });

  const field = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const val = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm((p) => ({ ...p, [k]: val }));
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)",
    background: "var(--input-background)", fontSize: 13.5, color: "var(--foreground)", outline: "none", appearance: "none",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}>
      <div className="rounded-xl w-full max-w-lg mx-4 overflow-hidden" style={{ background: "var(--card)", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "var(--foreground)" }}>
            {initial?.nombre ? "Editar Usuario" : "Nuevo Usuario"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}><X size={20} /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Nombre(s) *</label>
              <input style={inputStyle} value={form.nombre} onChange={field("nombre")} placeholder="Nombre(s)" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Apellidos *</label>
              <input style={inputStyle} value={form.apellidos} onChange={field("apellidos")} placeholder="Apellidos" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Matrícula / Nómina *</label>
              <input style={inputStyle} value={form.matricula} onChange={field("matricula")} placeholder="20210345" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Tipo de Usuario</label>
              <select style={inputStyle} value={form.tipo} onChange={field("tipo")}>
                <option value="estudiante">Estudiante</option>
                <option value="docente">Docente</option>
                <option value="administrativo">Administrativo</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Carrera / Facultad</label>
            <select style={inputStyle} value={form.carrera} onChange={field("carrera")}>
              {CARRERAS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Correo Electrónico *</label>
            <input type="email" style={inputStyle} value={form.email} onChange={field("email")} placeholder="usuario@unilib.edu.mx" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Teléfono</label>
              <input style={inputStyle} value={form.telefono} onChange={field("telefono")} placeholder="55-1234-5678" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Límite de Préstamos</label>
              <input type="number" style={inputStyle} value={form.limitePrestamos} onChange={field("limitePrestamos")} min={1} max={10} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Fecha de Registro</label>
              <input type="date" style={inputStyle} value={form.fechaRegistro} onChange={field("fechaRegistro")} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Estado</label>
              <select style={inputStyle} value={form.estado} onChange={field("estado")}>
                <option value="activo">Activo</option>
                <option value="suspendido">Suspendido</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t justify-end" style={{ borderColor: "var(--border)" }}>
          <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", fontSize: 13.5, cursor: "pointer", color: "var(--foreground)" }}>
            Cancelar
          </button>
          <button
            onClick={() => { if (form.nombre && form.apellidos && form.matricula && form.email) onSave(form); }}
            style={{ padding: "8px 18px", borderRadius: 6, border: "none", background: "var(--primary)", color: "#fff", fontSize: 13.5, cursor: "pointer", fontWeight: 600 }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

interface UserDetailProps {
  user: UserType;
  onClose: () => void;
  onEdit: () => void;
}

function UserDetail({ user, onClose, onEdit }: UserDetailProps) {
  const userLoans = INITIAL_LOANS.filter((l) => l.usuarioId === user.id);
  const type = userTypeBadge(user.tipo);
  const status = userStatusBadge(user.estado);
  function getBook(id: string) { return BOOKS.find((b) => b.id === id); }
  function loanStatus(estado: string) {
    if (estado === "activo") return { label: "Activo", color: "#1D6FA4", bg: "#DBEAFE" };
    if (estado === "vencido") return { label: "Vencido", color: "#DC2626", bg: "#FEE2E2" };
    return { label: "Devuelto", color: "#16A34A", bg: "#DCFCE7" };
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}>
      <div className="rounded-xl w-full max-w-lg mx-4 overflow-hidden" style={{ background: "var(--card)", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "var(--foreground)" }}>Perfil de Usuario</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}><X size={20} /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
          {/* User header */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center rounded-full" style={{ width: 56, height: 56, background: "var(--secondary)", flexShrink: 0 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "var(--primary)" }}>
                {user.nombre[0]}{user.apellidos[0]}
              </span>
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "var(--foreground)", fontFamily: "'Playfair Display', serif" }}>
                {user.nombre} {user.apellidos}
              </div>
              <div style={{ fontSize: 13, color: "var(--muted-foreground)" }}>{user.carrera}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: type.bg, color: type.color }}>{type.label}</span>
                <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: status.bg, color: status.color }}>{status.label}</span>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Matrícula", value: user.matricula },
              { label: "Correo", value: user.email },
              { label: "Teléfono", value: user.telefono },
              { label: "Registro", value: formatDate(user.fechaRegistro) },
              { label: "Préstamos activos", value: `${user.prestamosActivos} / ${user.limitePrestamos}` },
            ].map((r) => (
              <div key={r.label} className="rounded-lg px-3 py-2" style={{ background: "var(--muted)" }}>
                <div style={{ fontSize: 11, color: "var(--muted-foreground)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{r.label}</div>
                <div style={{ fontSize: 13, color: "var(--foreground)", fontWeight: 500, marginTop: 1 }}>{r.value}</div>
              </div>
            ))}
          </div>

          {/* Loan history */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookMarked size={14} style={{ color: "var(--primary)" }} />
              <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--foreground)" }}>Historial de Préstamos ({userLoans.length})</span>
            </div>
            {userLoans.length === 0 ? (
              <div style={{ fontSize: 13, color: "var(--muted-foreground)", textAlign: "center", padding: "12px 0" }}>Sin préstamos registrados.</div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {userLoans.map((loan) => {
                  const book = getBook(loan.libroId);
                  const s = loanStatus(loan.estado);
                  return (
                    <div key={loan.id} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: "var(--muted)" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--foreground)" }}>{book?.titulo}</div>
                        <div style={{ fontSize: 11.5, color: "var(--muted-foreground)" }}>{formatDate(loan.fechaPrestamo)} — {formatDate(loan.fechaDevolucion)}</div>
                      </div>
                      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t justify-end" style={{ borderColor: "var(--border)" }}>
          <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", fontSize: 13.5, cursor: "pointer", color: "var(--foreground)" }}>
            Cerrar
          </button>
          <button onClick={onEdit} style={{ padding: "8px 18px", borderRadius: 6, border: "none", background: "var(--primary)", color: "#fff", fontSize: 13.5, cursor: "pointer", fontWeight: 600 }}>
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}

export function Users() {
  const [users, setUsers] = useState<UserType[]>(USERS);
  const [search, setSearch] = useState("");
  const [tipoFilter, setTipoFilter] = useState("all");
  const [estadoFilter, setEstadoFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState<UserType | null>(null);
  const [detailUser, setDetailUser] = useState<UserType | null>(null);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || u.nombre.toLowerCase().includes(q) || u.apellidos.toLowerCase().includes(q) || u.matricula.toLowerCase().includes(q) || u.carrera.toLowerCase().includes(q);
    const matchesTipo = tipoFilter === "all" || u.tipo === tipoFilter;
    const matchesEstado = estadoFilter === "all" || u.estado === estadoFilter;
    return matchesSearch && matchesTipo && matchesEstado;
  });

  function handleSave(data: Omit<UserType, "id" | "prestamosActivos">) {
    if (editUser) {
      setUsers((prev) => prev.map((u) => u.id === editUser.id ? { ...data, id: editUser.id, prestamosActivos: editUser.prestamosActivos } : u));
      setEditUser(null);
    } else {
      const newUser: UserType = { ...data, id: `U${String(users.length + 1).padStart(3, "0")}`, prestamosActivos: 0 };
      setUsers((prev) => [...prev, newUser]);
      setShowForm(false);
    }
  }

  const selStyle: React.CSSProperties = {
    padding: "7px 32px 7px 10px", borderRadius: 6, border: "1px solid var(--border)",
    background: "var(--card)", fontSize: 13, color: "var(--foreground)", cursor: "pointer", appearance: "none",
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "var(--foreground)" }}>Gestión de Usuarios</h1>
          <p style={{ fontSize: 13.5, color: "var(--muted-foreground)", marginTop: 2 }}>{users.length} usuarios registrados en el sistema</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
          style={{ padding: "9px 16px", borderRadius: 7, border: "none", background: "var(--primary)", color: "#fff", fontSize: 13.5, cursor: "pointer", fontWeight: 600 }}
        >
          <Plus size={16} /> Nuevo Usuario
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, matrícula o carrera…"
            style={{ width: "100%", padding: "8px 10px 8px 34px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", fontSize: 13.5, outline: "none", color: "var(--foreground)" }}
          />
        </div>
        <div className="relative">
          <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)} style={selStyle}>
            <option value="all">Todos los tipos</option>
            <option value="estudiante">Estudiantes</option>
            <option value="docente">Docentes</option>
            <option value="administrativo">Administrativos</option>
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted-foreground)" }} />
        </div>
        <div className="relative">
          <select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)} style={selStyle}>
            <option value="all">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="suspendido">Suspendidos</option>
            <option value="inactivo">Inactivos</option>
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
                {["Usuario", "Matrícula", "Carrera", "Tipo", "Préstamos", "Estado", "Acciones"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11.5, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "var(--muted-foreground)", fontSize: 14 }}>No se encontraron usuarios con los filtros aplicados.</td></tr>
              )}
              {filtered.map((user, i) => {
                const type = userTypeBadge(user.tipo);
                const status = userStatusBadge(user.estado);
                const loanPct = (user.prestamosActivos / user.limitePrestamos) * 100;
                return (
                  <tr
                    key={user.id}
                    style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.012)", cursor: "pointer", transition: "background 0.1s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--secondary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.012)")}
                    onClick={() => setDetailUser(user)}
                  >
                    <td style={{ padding: "11px 14px" }}>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center rounded-full" style={{ width: 34, height: 34, background: "var(--secondary)", flexShrink: 0 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)" }}>
                            {user.nombre[0]}{user.apellidos[0]}
                          </span>
                        </div>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--foreground)" }}>{user.nombre} {user.apellidos}</div>
                          <div style={{ fontSize: 11.5, color: "var(--muted-foreground)" }}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "11px 14px", fontSize: 12.5, color: "var(--foreground)", fontFamily: "monospace", whiteSpace: "nowrap" }}>{user.matricula}</td>
                    <td style={{ padding: "11px 14px", fontSize: 13, color: "var(--foreground)", maxWidth: 180, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.carrera}</td>
                    <td style={{ padding: "11px 14px" }}>
                      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: type.bg, color: type.color }}>{type.label}</span>
                    </td>
                    <td style={{ padding: "11px 14px", width: 100 }}>
                      <div className="flex items-center gap-2">
                        <div className="rounded-full overflow-hidden flex-1" style={{ height: 6, background: "var(--muted)", minWidth: 50 }}>
                          <div className="h-full rounded-full" style={{ width: `${loanPct}%`, background: loanPct >= 100 ? "#DC2626" : loanPct >= 66 ? "#D97706" : "var(--primary)" }} />
                        </div>
                        <span style={{ fontSize: 12, color: "var(--muted-foreground)", flexShrink: 0 }}>{user.prestamosActivos}/{user.limitePrestamos}</span>
                      </div>
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: status.bg, color: status.color }}>{status.label}</span>
                    </td>
                    <td style={{ padding: "11px 14px" }} onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditUser(user); }}
                        style={{ padding: "5px 10px", borderRadius: 5, border: "1px solid var(--border)", background: "transparent", fontSize: 12, cursor: "pointer", color: "var(--muted-foreground)" }}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t" style={{ borderColor: "var(--border)" }}>
          <span style={{ fontSize: 12.5, color: "var(--muted-foreground)" }}>Mostrando {filtered.length} de {users.length} usuarios</span>
        </div>
      </div>

      {(showForm || editUser) && (
        <UserForm
          initial={editUser ?? undefined}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditUser(null); }}
        />
      )}
      {detailUser && (
        <UserDetail
          user={detailUser}
          onClose={() => setDetailUser(null)}
          onEdit={() => { setEditUser(detailUser); setDetailUser(null); }}
        />
      )}
    </div>
  );
}
