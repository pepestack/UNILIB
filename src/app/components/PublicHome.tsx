import { useState } from "react";
import { Search, BookOpen, LogIn, Lock, X, BookText, ChevronDown } from "lucide-react";
import { BOOKS, type BookCategory } from "./data";
import { BookCover } from "./BookCover";

const CATEGORIES: BookCategory[] = [
  "Derecho", "Medicina", "Matemáticas", "Historia", "Administración",
  "Psicología", "Informática", "Arquitectura", "Sociología", "Literatura", "Ingeniería",
];

interface PublicHomeProps {
  onLogin: () => void;
}

function LoginPromptModal({ onLogin, onClose }: { onLogin: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="rounded-2xl w-full max-w-sm mx-4 overflow-hidden" style={{ background: "var(--card)", boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}>
        <div className="flex flex-col items-center px-8 py-8 gap-4">
          <div className="flex items-center justify-center rounded-full" style={{ width: 60, height: 60, background: "var(--secondary)" }}>
            <Lock size={26} style={{ color: "var(--primary)" }} />
          </div>
          <div className="text-center">
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: "var(--foreground)", marginBottom: 6 }}>
              Acceso Restringido
            </h3>
            <p style={{ fontSize: 14, color: "var(--muted-foreground)", lineHeight: 1.6 }}>
              Debes iniciar sesión con tu cuenta institucional para realizar préstamos o reservas de materiales.
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full mt-2">
            <button
              onClick={onLogin}
              className="flex items-center justify-center gap-2"
              style={{ width: "100%", padding: "11px", borderRadius: 8, border: "none", background: "var(--primary)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
            >
              <LogIn size={16} /> Iniciar Sesión
            </button>
            <button
              onClick={onClose}
              style={{ width: "100%", padding: "11px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--foreground)", fontSize: 14, cursor: "pointer" }}
            >
              Continuar explorando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PublicHome({ onLogin }: PublicHomeProps) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [showPrompt, setShowPrompt] = useState(false);
  const [detailBook, setDetailBook] = useState<typeof BOOKS[0] | null>(null);

  const filtered = BOOKS.filter((b) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || b.titulo.toLowerCase().includes(q) || b.autor.toLowerCase().includes(q) || b.isbn.includes(q) || b.categoria.toLowerCase().includes(q);
    const matchesCat = catFilter === "all" || b.categoria === catFilter;
    return matchesSearch && matchesCat;
  });

  const selStyle: React.CSSProperties = {
    padding: "9px 36px 9px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.15)", fontSize: 13.5, color: "#fff", cursor: "pointer", appearance: "none",
    backdropFilter: "blur(4px)",
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Inter', sans-serif", background: "var(--background)" }}>
      {/* Top nav */}
      <header
        className="flex items-center justify-between px-6 py-4 sticky top-0 z-40"
        style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-lg" style={{ width: 36, height: 36, background: "var(--primary)" }}>
            <BookText size={18} color="#fff" />
          </div>
          <div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "var(--foreground)" }}>UNILIB</span>
            <span style={{ fontSize: 12, color: "var(--muted-foreground)", marginLeft: 8 }}>Catálogo Público</span>
          </div>
        </div>
        <button
          onClick={onLogin}
          className="flex items-center gap-2"
          style={{ padding: "8px 18px", borderRadius: 7, border: "none", background: "var(--primary)", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}
        >
          <LogIn size={15} /> Iniciar Sesión
        </button>
      </header>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, var(--primary) 0%, #0D2040 100%)", padding: "64px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6" style={{ background: "rgba(200,146,26,0.2)", border: "1px solid rgba(200,146,26,0.4)" }}>
            <BookOpen size={13} style={{ color: "#C8921A" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#C8921A", letterSpacing: "0.06em", textTransform: "uppercase" }}>Acceso Abierto al Conocimiento</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 42, color: "#fff", lineHeight: 1.15, marginBottom: 16 }}>
            Catálogo Bibliográfico<br />UNILIB
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", marginBottom: 36, lineHeight: 1.7 }}>
            Explora nuestra colección de más de {BOOKS.reduce((a, b) => a + b.totalEjemplares, 0)} ejemplares en {BOOKS.length} títulos. Inicia sesión para realizar préstamos y reservas.
          </p>

          {/* Search bar */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <div style={{ position: "relative", flex: 1, maxWidth: 420, minWidth: 240 }}>
              <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.5)" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por título, autor, ISBN o área…"
                style={{
                  width: "100%", padding: "12px 14px 12px 42px", borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.12)",
                  fontSize: 14, color: "#fff", outline: "none", backdropFilter: "blur(8px)",
                }}
              />
            </div>
            <div style={{ position: "relative" }}>
              <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={selStyle}>
                <option value="all" style={{ color: "#000" }}>Todas las áreas</option>
                {CATEGORIES.map((c) => <option key={c} value={c} style={{ color: "#000" }}>{c}</option>)}
              </select>
              <ChevronDown size={13} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.6)", pointerEvents: "none" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Notice banner */}
      <div className="flex items-center justify-center gap-3 px-6 py-3" style={{ background: "#FEF3C7", borderBottom: "1px solid #FDE68A" }}>
        <Lock size={14} style={{ color: "#D97706" }} />
        <span style={{ fontSize: 13.5, color: "#92400E" }}>
          Estás navegando como invitado. Para realizar préstamos y reservas,{" "}
          <button onClick={onLogin} style={{ background: "none", border: "none", color: "#D97706", fontWeight: 700, cursor: "pointer", padding: 0, fontSize: 13.5, textDecoration: "underline" }}>
            inicia sesión
          </button>
          {" "}con tu cuenta institucional.
        </span>
      </div>

      {/* Catalog grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "var(--foreground)" }}>
            {filtered.length} {filtered.length === 1 ? "título encontrado" : "títulos encontrados"}
          </h2>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {filtered.map((book) => (
            <div
              key={book.id}
              className="rounded-xl overflow-hidden cursor-pointer transition-all"
              style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
              onClick={() => setDetailBook(book)}
            >
              <div className="flex gap-4 p-4">
                <BookCover book={book} size="md" />
                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", lineHeight: 1.35, marginBottom: 4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                      {book.titulo}
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--muted-foreground)", marginBottom: 6 }}>{book.autor}</div>
                    <span className="inline-flex rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: "var(--secondary)", color: "var(--primary)" }}>
                      {book.categoria}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: book.disponibles > 0 ? "#16A34A" : "#DC2626" }}>
                        {book.disponibles > 0 ? `${book.disponibles} disponibles` : "Sin existencias"}
                      </span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowPrompt(true); }}
                      className="flex items-center gap-1"
                      style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", fontSize: 12, cursor: "pointer", color: "var(--muted-foreground)" }}
                    >
                      <Lock size={11} /> Reservar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full flex flex-col items-center py-20 gap-3">
              <BookOpen size={40} style={{ color: "var(--muted-foreground)" }} />
              <div style={{ fontSize: 15, color: "var(--muted-foreground)" }}>No se encontraron títulos con los filtros aplicados.</div>
            </div>
          )}
        </div>
      </div>

      {/* Book detail modal */}
      {detailBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="rounded-2xl w-full max-w-md mx-4 overflow-hidden" style={{ background: "var(--card)", boxShadow: "0 24px 60px rgba(0,0,0,0.3)" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: "var(--foreground)" }}>Detalle del Libro</h3>
              <button onClick={() => setDetailBook(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}><X size={20} /></button>
            </div>
            <div className="px-6 py-5 flex gap-5">
              <BookCover book={detailBook} size="lg" />
              <div className="flex-1 min-w-0">
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: "var(--foreground)", lineHeight: 1.3, marginBottom: 4 }}>{detailBook.titulo}</h4>
                <p style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 8 }}>{detailBook.autor}</p>
                <div className="flex flex-col gap-1.5 mb-4">
                  {[
                    { label: "Editorial", value: detailBook.editorial },
                    { label: "Año", value: detailBook.anio },
                    { label: "ISBN", value: detailBook.isbn },
                    { label: "Área", value: detailBook.categoria },
                    { label: "Ubicación", value: detailBook.ubicacion },
                  ].map((r) => (
                    <div key={r.label} className="flex gap-2">
                      <span style={{ fontSize: 12, color: "var(--muted-foreground)", fontWeight: 600, minWidth: 60 }}>{r.label}:</span>
                      <span style={{ fontSize: 12, color: "var(--foreground)" }}>{r.value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: detailBook.disponibles > 0 ? "#16A34A" : "#DC2626", marginBottom: 12 }}>
                  {detailBook.disponibles > 0 ? `✓ ${detailBook.disponibles} ejemplares disponibles` : "✗ Sin existencias"}
                </div>
              </div>
            </div>
            <div className="px-6 pb-4">
              <p style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 12, lineHeight: 1.5 }}>{detailBook.descripcion}</p>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t" style={{ borderColor: "var(--border)" }}>
              <button onClick={() => setDetailBook(null)} style={{ flex: 1, padding: "9px", borderRadius: 7, border: "1px solid var(--border)", background: "transparent", fontSize: 13.5, cursor: "pointer", color: "var(--foreground)" }}>
                Cerrar
              </button>
              <button
                onClick={() => { setDetailBook(null); setShowPrompt(true); }}
                className="flex items-center justify-center gap-2"
                style={{ flex: 1, padding: "9px", borderRadius: 7, border: "none", background: "var(--primary)", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}
              >
                <Lock size={14} /> Iniciar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {showPrompt && <LoginPromptModal onLogin={() => { setShowPrompt(false); onLogin(); }} onClose={() => setShowPrompt(false)} />}
    </div>
  );
}
