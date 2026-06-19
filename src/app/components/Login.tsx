import { useState } from "react";
import { BookText, Eye, EyeOff, Lock, User, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { DEMO_ACCOUNTS, type AuthUser } from "./data";

interface LoginProps {
  onLogin: (user: AuthUser) => void;
  onGuest: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  bibliotecario: "Bibliotecario",
  estudiante: "Estudiante",
};

const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  admin:        { bg: "#FEF3C7", color: "#92400E" },
  bibliotecario:{ bg: "#DBEAFE", color: "#1E40AF" },
  estudiante:   { bg: "#DCFCE7", color: "#166534" },
};

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

export function Login({ onLogin, onGuest }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAccounts, setShowAccounts] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const account = DEMO_ACCOUNTS.find(
        (a) => a.username === username.trim() && a.password === password
      );
      if (account) {
        onLogin({
          role: account.role,
          userId: account.userId,
          name: account.name,
          email: account.email,
          initials: getInitials(account.name),
        });
      } else {
        setError("Usuario o contraseña incorrectos. Verifique sus credenciales.");
        setLoading(false);
      }
    }, 800);
  }

  function quickLogin(username: string, password: string) {
    setUsername(username);
    setPassword(password);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px 10px 40px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--input-background)",
    fontSize: 14,
    color: "var(--foreground)",
    outline: "none",
    transition: "border-color 0.15s",
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--background)", fontFamily: "'Inter', sans-serif" }}>
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex flex-col justify-between p-12"
        style={{ width: 480, background: "var(--sidebar)", flexShrink: 0 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 48, height: 48, background: "var(--sidebar-primary)" }}
          >
            <BookText size={24} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, color: "#fff" }}>UNILIB</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Sistema Bibliotecario</div>
          </div>
        </div>

        {/* Feature list */}
        <div className="flex flex-col gap-6">
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 32, color: "#fff", lineHeight: 1.2, marginBottom: 16 }}>
              Gestión Académica Bibliotecaria Universitaria
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
              Sistema integral para el manejo de catálogos, préstamos, reservas e inventario de la colección bibliográfica.
            </p>
          </div>
          {[
            "Catálogo de más de 15,000 títulos",
            "Préstamos y renovaciones en línea",
            "Reservas anticipadas de materiales",
            "Control de inventario en tiempo real",
          ].map((feat) => (
            <div key={feat} className="flex items-center gap-3">
              <div className="rounded-full" style={{ width: 7, height: 7, background: "var(--sidebar-primary)", flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.65)" }}>{feat}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
          © 2026 UNILIB — Universidad Nacional · Todos los derechos reservados
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex items-center justify-center rounded-xl" style={{ width: 40, height: 40, background: "var(--primary)" }}>
              <BookText size={20} color="#fff" />
            </div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: "var(--foreground)" }}>UNILIB</div>
          </div>

          <div className="mb-8">
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 28, color: "var(--foreground)", marginBottom: 6 }}>
              Iniciar Sesión
            </h1>
            <p style={{ fontSize: 14, color: "var(--muted-foreground)" }}>
              Accede con tus credenciales institucionales
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Username */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", display: "block", marginBottom: 6 }}>
                Usuario institucional
              </label>
              <div style={{ position: "relative" }}>
                <User size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ej: mgonzalez"
                  style={inputStyle}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", display: "block", marginBottom: 6 }}>
                Contraseña
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña institucional"
                  style={{ ...inputStyle, paddingRight: 40 }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", padding: 0 }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg px-4 py-3" style={{ background: "#FEE2E2", border: "1px solid #FECACA" }}>
                <AlertCircle size={15} style={{ color: "#DC2626", flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "#991B1B" }}>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !username || !password}
              style={{
                width: "100%",
                padding: "11px",
                borderRadius: 8,
                border: "none",
                background: loading ? "var(--muted)" : "var(--primary)",
                color: loading ? "var(--muted-foreground)" : "#fff",
                fontSize: 14,
                fontWeight: 700,
                cursor: loading || !username || !password ? "not-allowed" : "pointer",
                letterSpacing: "0.02em",
                transition: "all 0.15s",
                opacity: !username || !password ? 0.6 : 1,
              }}
            >
              {loading ? "Verificando credenciales…" : "Iniciar Sesión"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>o</span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>

            {/* Guest access */}
            <button
              type="button"
              onClick={onGuest}
              style={{
                width: "100%",
                padding: "11px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--foreground)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Explorar catálogo sin cuenta
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6">
            <button
              onClick={() => setShowAccounts((v) => !v)}
              className="flex items-center gap-2 w-full"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)", fontSize: 13, padding: 0 }}
            >
              {showAccounts ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              Cuentas de demostración disponibles
            </button>
            {showAccounts && (
              <div className="mt-3 rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                <div className="px-4 py-2.5" style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    Haz clic para autocompletar
                  </span>
                </div>
                {DEMO_ACCOUNTS.map((acc) => {
                  const rc = ROLE_COLORS[acc.role];
                  return (
                    <button
                      key={acc.username}
                      type="button"
                      onClick={() => quickLogin(acc.username, acc.password)}
                      className="flex items-center gap-3 w-full px-4 py-3 border-b text-left transition-all"
                      style={{ background: "var(--card)", borderColor: "var(--border)", cursor: "pointer" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--secondary)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "var(--card)")}
                    >
                      <div
                        className="flex items-center justify-center rounded-full text-xs font-bold"
                        style={{ width: 32, height: 32, background: "var(--primary)", color: "#fff", flexShrink: 0 }}
                      >
                        {getInitials(acc.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--foreground)" }}>{acc.name}</div>
                        <div style={{ fontSize: 12, color: "var(--muted-foreground)", fontFamily: "monospace" }}>
                          {acc.username} / {acc.password}
                        </div>
                      </div>
                      <span
                        className="rounded-md px-2 py-0.5 text-xs font-semibold"
                        style={{ background: rc.bg, color: rc.color, flexShrink: 0 }}
                      >
                        {ROLE_LABELS[acc.role]}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
