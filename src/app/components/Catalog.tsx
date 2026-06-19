import { useState } from "react";
import { Search, X, ChevronDown, BookOpen } from "lucide-react";
import { BOOKS, type Book, type BookCategory } from "./data";
import { BookCover } from "./BookCover";

const CATEGORIES: BookCategory[] = [
  "Derecho", "Medicina", "Matemáticas", "Historia", "Administración",
  "Psicología", "Informática", "Arquitectura", "Sociología", "Literatura", "Ingeniería",
];

function AvailBadge({ disponibles, total }: { disponibles: number; total: number }) {
  const color = disponibles === 0 ? "#DC2626" : disponibles < total * 0.4 ? "#D97706" : "#16A34A";
  const bg = disponibles === 0 ? "#FEE2E2" : disponibles < total * 0.4 ? "#FEF3C7" : "#DCFCE7";
  return (
    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: bg, color }}>
      {disponibles}/{total}
    </span>
  );
}

interface BookDetailProps {
  book: Book;
  onClose: () => void;
}

function BookDetail({ book, onClose }: BookDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}>
      <div className="rounded-xl w-full max-w-md mx-4 overflow-hidden" style={{ background: "var(--card)", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "var(--foreground)" }}>Detalle del Libro</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}><X size={20} /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <BookCover book={book} size="md" />
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)", fontFamily: "'Playfair Display', serif", lineHeight: 1.3, marginBottom: 4 }}>{book.titulo}</div>
              <div style={{ fontSize: 13, color: "var(--muted-foreground)", marginBottom: 6 }}>{book.autor}</div>
              <AvailBadge disponibles={book.disponibles} total={book.totalEjemplares} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "ISBN", value: book.isbn },
              { label: "Editorial", value: book.editorial },
              { label: "Año", value: book.anio },
              { label: "Categoría", value: book.categoria },
              { label: "Ubicación", value: book.ubicacion },
              { label: "Ejemplares", value: `${book.totalEjemplares} totales` },
            ].map((r) => (
              <div key={r.label} className="rounded-lg px-3 py-2" style={{ background: "var(--muted)" }}>
                <div style={{ fontSize: 11, color: "var(--muted-foreground)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{r.label}</div>
                <div style={{ fontSize: 13.5, color: "var(--foreground)", fontWeight: 500, marginTop: 1 }}>{r.value}</div>
              </div>
            ))}
          </div>
          {book.descripcion && (
            <div>
              <div style={{ fontSize: 12, color: "var(--muted-foreground)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Descripción</div>
              <p style={{ fontSize: 13.5, color: "var(--foreground)", lineHeight: 1.6 }}>{book.descripcion}</p>
            </div>
          )}
        </div>
        <div className="flex px-6 py-4 border-t justify-end" style={{ borderColor: "var(--border)" }}>
          <button onClick={onClose} style={{ padding: "8px 20px", borderRadius: 6, border: "none", background: "var(--primary)", color: "#fff", fontSize: 13.5, cursor: "pointer", fontWeight: 600 }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export function Catalog() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [availFilter, setAvailFilter] = useState<string>("all");
  const [detailBook, setDetailBook] = useState<Book | null>(null);

  const filtered = BOOKS.filter((b) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || b.titulo.toLowerCase().includes(q) || b.autor.toLowerCase().includes(q) || b.isbn.includes(q);
    const matchesCat = catFilter === "all" || b.categoria === catFilter;
    const matchesAvail = availFilter === "all" || (availFilter === "disponible" ? b.disponibles > 0 : b.disponibles === 0);
    return matchesSearch && matchesCat && matchesAvail;
  });

  const selStyle: React.CSSProperties = {
    padding: "7px 32px 7px 10px", borderRadius: 6, border: "1px solid var(--border)",
    background: "var(--card)", fontSize: 13, color: "var(--foreground)", cursor: "pointer", appearance: "none",
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "var(--foreground)" }}>Catálogo</h1>
        <p style={{ fontSize: 13.5, color: "var(--muted-foreground)", marginTop: 2 }}>{BOOKS.length} títulos disponibles en la colección</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, autor o ISBN…"
            style={{ width: "100%", padding: "8px 10px 8px 34px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", fontSize: 13.5, color: "var(--foreground)", outline: "none" }}
          />
        </div>
        <div className="relative">
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={selStyle}>
            <option value="all">Todas las áreas</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted-foreground)" }} />
        </div>
        <div className="relative">
          <select value={availFilter} onChange={(e) => setAvailFilter(e.target.value)} style={selStyle}>
            <option value="all">Disponibilidad</option>
            <option value="disponible">Con existencias</option>
            <option value="agotado">Sin existencias</option>
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
                {["", "ISBN", "Título / Autor", "Editorial", "Área", "Año", "Ejemplares"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11.5, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "var(--muted-foreground)", fontSize: 14 }}>No se encontraron libros con los filtros aplicados.</td></tr>
              )}
              {filtered.map((book, i) => (
                <tr
                  key={book.id}
                  style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.012)", cursor: "pointer", transition: "background 0.1s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--secondary)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.012)")}
                  onClick={() => setDetailBook(book)}
                >
                  <td style={{ padding: "10px 14px", width: 52 }}>
                    <BookCover book={book} size="xs" />
                  </td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "var(--muted-foreground)", fontFamily: "monospace", whiteSpace: "nowrap" }}>{book.isbn}</td>
                  <td style={{ padding: "10px 14px", maxWidth: 240 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--foreground)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{book.titulo}</div>
                    <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{book.autor}</div>
                  </td>
                  <td style={{ padding: "10px 14px", fontSize: 13, color: "var(--foreground)", whiteSpace: "nowrap" }}>{book.editorial}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: "var(--secondary)", color: "var(--primary)" }}>{book.categoria}</span>
                  </td>
                  <td style={{ padding: "10px 14px", fontSize: 13, color: "var(--foreground)" }}>{book.anio}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <AvailBadge disponibles={book.disponibles} total={book.totalEjemplares} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t" style={{ borderColor: "var(--border)" }}>
          <span style={{ fontSize: 12.5, color: "var(--muted-foreground)" }}>
            Mostrando {filtered.length} de {BOOKS.length} títulos · Haz clic en un libro para ver el detalle
          </span>
        </div>
      </div>

      {!filtered.length && search && (
        <div className="flex flex-col items-center py-10 gap-3">
          <BookOpen size={36} style={{ color: "var(--muted-foreground)" }} />
        </div>
      )}

      {detailBook && <BookDetail book={detailBook} onClose={() => setDetailBook(null)} />}
    </div>
  );
}
