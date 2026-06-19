import { useState } from "react";
import { Search, Plus, Package, AlertCircle, ChevronDown, X } from "lucide-react";
import { BOOKS, INVENTORY_ITEMS, type InventoryItem, type Book } from "./data";

function conditionBadge(condicion: string) {
  if (condicion === "excelente") return { label: "Excelente", color: "#16A34A", bg: "#DCFCE7" };
  if (condicion === "bueno") return { label: "Bueno", color: "#1D6FA4", bg: "#DBEAFE" };
  if (condicion === "regular") return { label: "Regular", color: "#D97706", bg: "#FEF3C7" };
  return { label: "Deteriorado", color: "#DC2626", bg: "#FEE2E2" };
}

interface AddCopiesModalProps {
  book: Book;
  onSave: (items: Omit<InventoryItem, "id">[]) => void;
  onClose: () => void;
}

function AddCopiesModal({ book, onSave, onClose }: AddCopiesModalProps) {
  const [cantidad, setCantidad] = useState(1);
  const [condicion, setCondicion] = useState<InventoryItem["condicion"]>("excelente");
  const today = new Date().toISOString().split("T")[0];

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)",
    background: "var(--input-background)", fontSize: 13.5, color: "var(--foreground)", outline: "none", appearance: "none",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}>
      <div className="rounded-xl w-full max-w-sm mx-4 overflow-hidden" style={{ background: "var(--card)", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: "var(--foreground)" }}>Agregar Ejemplares</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}><X size={18} /></button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="rounded-lg px-4 py-3" style={{ background: "var(--muted)" }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--foreground)" }}>{book.titulo}</div>
            <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{book.autor} — {book.ubicacion}</div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Cantidad a agregar</label>
            <input type="number" style={inputStyle} value={cantidad} onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))} min={1} max={20} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Condición</label>
            <select style={inputStyle} value={condicion} onChange={(e) => setCondicion(e.target.value as InventoryItem["condicion"])}>
              <option value="excelente">Excelente</option>
              <option value="bueno">Bueno</option>
              <option value="regular">Regular</option>
              <option value="deteriorado">Deteriorado</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t justify-end" style={{ borderColor: "var(--border)" }}>
          <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", fontSize: 13.5, cursor: "pointer", color: "var(--foreground)" }}>
            Cancelar
          </button>
          <button
            onClick={() => {
              const items: Omit<InventoryItem, "id">[] = Array.from({ length: cantidad }, (_, i) => ({
                libroId: book.id,
                codigoEjemplar: `${book.id}-NW${String(Date.now() + i).slice(-4)}`,
                condicion,
                disponible: true,
                fechaAdquisicion: today,
                ubicacion: book.ubicacion,
              }));
              onSave(items);
            }}
            style={{ padding: "8px 18px", borderRadius: 6, border: "none", background: "var(--primary)", color: "#fff", fontSize: 13.5, cursor: "pointer", fontWeight: 600 }}
          >
            Agregar {cantidad} Ejemplar{cantidad > 1 ? "es" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

interface BookInventoryPanelProps {
  book: Book;
  items: InventoryItem[];
  onAddCopies: () => void;
  onUpdateCondition: (itemId: string, condicion: InventoryItem["condicion"]) => void;
}

function BookInventoryPanel({ book, items, onAddCopies, onUpdateCondition }: BookInventoryPanelProps) {
  const available = items.filter((i) => i.disponible).length;
  const availPct = items.length > 0 ? (available / items.length) * 100 : 0;

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      {/* Book header */}
      <div className="px-5 py-4 border-b flex items-start justify-between gap-4" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="flex items-center justify-center rounded-lg" style={{ width: 40, height: 52, background: "var(--secondary)", flexShrink: 0 }}>
            <Package size={18} style={{ color: "var(--primary)" }} />
          </div>
          <div className="min-w-0">
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{book.titulo}</div>
            <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 1 }}>{book.autor}</div>
            <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Ubicación: <span style={{ fontWeight: 600, color: "var(--foreground)" }}>{book.ubicacion}</span></div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <div style={{ fontSize: 18, fontWeight: 700, color: available === 0 ? "#DC2626" : "var(--foreground)", fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>
              {available}/{items.length}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>disponibles</div>
            <div className="rounded-full overflow-hidden mt-1" style={{ height: 4, background: "var(--muted)", width: 60 }}>
              <div className="h-full rounded-full" style={{ width: `${availPct}%`, background: availPct === 0 ? "#DC2626" : availPct < 40 ? "#D97706" : "#16A34A" }} />
            </div>
          </div>
          <button
            onClick={onAddCopies}
            className="flex items-center gap-1"
            style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: "var(--secondary)", color: "var(--primary)", fontSize: 12, cursor: "pointer", fontWeight: 600 }}
          >
            <Plus size={13} /> Ejemplares
          </button>
        </div>
      </div>

      {/* Copies table */}
      {items.length > 0 && (
        <div className="overflow-x-auto">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--muted)" }}>
                {["Código", "Condición", "Estado", "Adquisición"].map((h) => (
                  <th key={h} style={{ padding: "7px 14px", textAlign: "left", fontSize: 10.5, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => {
                const cond = conditionBadge(item.condicion);
                return (
                  <tr key={item.id} style={{ borderTop: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.012)" }}>
                    <td style={{ padding: "8px 14px", fontSize: 12, color: "var(--foreground)", fontFamily: "monospace" }}>{item.codigoEjemplar}</td>
                    <td style={{ padding: "8px 14px" }}>
                      <select
                        value={item.condicion}
                        onChange={(e) => onUpdateCondition(item.id, e.target.value as InventoryItem["condicion"])}
                        style={{ padding: "3px 22px 3px 8px", borderRadius: 5, border: "1px solid var(--border)", background: cond.bg, color: cond.color, fontSize: 11.5, fontWeight: 600, cursor: "pointer", appearance: "none" }}
                      >
                        <option value="excelente">Excelente</option>
                        <option value="bueno">Bueno</option>
                        <option value="regular">Regular</option>
                        <option value="deteriorado">Deteriorado</option>
                      </select>
                    </td>
                    <td style={{ padding: "8px 14px" }}>
                      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
                        style={{ background: item.disponible ? "#DCFCE7" : "#F1F5F9", color: item.disponible ? "#16A34A" : "#6B7A99" }}>
                        {item.disponible ? "Disponible" : "Prestado"}
                      </span>
                    </td>
                    <td style={{ padding: "8px 14px", fontSize: 12, color: "var(--muted-foreground)" }}>
                      {new Date(item.fechaAdquisicion).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>(INVENTORY_ITEMS);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [availFilter, setAvailFilter] = useState("all");
  const [addCopiesBook, setAddCopiesBook] = useState<Book | null>(null);

  const categories = Array.from(new Set(BOOKS.map((b) => b.categoria)));

  function getBookItems(bookId: string) {
    return items.filter((i) => i.libroId === bookId);
  }

  function handleAddCopies(newItems: Omit<InventoryItem, "id">[]) {
    const withIds = newItems.map((item, idx) => ({
      ...item,
      id: `I${String(items.length + idx + 1).padStart(3, "0")}`,
    }));
    setItems((prev) => [...prev, ...withIds]);
    setAddCopiesBook(null);
  }

  function handleUpdateCondition(itemId: string, condicion: InventoryItem["condicion"]) {
    setItems((prev) => prev.map((i) => i.id === itemId ? { ...i, condicion } : i));
  }

  const filteredBooks = BOOKS.filter((b) => {
    const q = search.toLowerCase();
    const bItems = getBookItems(b.id);
    const available = bItems.filter((i) => i.disponible).length;
    const matchesSearch = !q || b.titulo.toLowerCase().includes(q) || b.autor.toLowerCase().includes(q) || b.ubicacion.toLowerCase().includes(q);
    const matchesCat = catFilter === "all" || b.categoria === catFilter;
    const matchesAvail = availFilter === "all" || (availFilter === "disponible" ? available > 0 : available === 0);
    return matchesSearch && matchesCat && matchesAvail;
  });

  const totalEjemplares = items.length;
  const totalDisponibles = items.filter((i) => i.disponible).length;
  const totalPrestados = items.filter((i) => !i.disponible).length;
  const deteriorados = items.filter((i) => i.condicion === "deteriorado").length;

  const selStyle: React.CSSProperties = {
    padding: "7px 32px 7px 10px", borderRadius: 6, border: "1px solid var(--border)",
    background: "var(--card)", fontSize: 13, color: "var(--foreground)", cursor: "pointer", appearance: "none",
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "var(--foreground)" }}>Control de Inventario</h1>
        <p style={{ fontSize: 13.5, color: "var(--muted-foreground)", marginTop: 2 }}>Gestión de ejemplares físicos por título</p>
      </div>

      {/* Stats */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {[
          { label: "Total Ejemplares", value: totalEjemplares, color: "var(--primary)", bg: "var(--secondary)" },
          { label: "Disponibles", value: totalDisponibles, color: "#16A34A", bg: "#DCFCE7" },
          { label: "En Préstamo", value: totalPrestados, color: "#1D6FA4", bg: "#DBEAFE" },
          { label: "Deteriorados", value: deteriorados, color: "#DC2626", bg: "#FEE2E2" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "'Playfair Display', serif", lineHeight: 1.1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Deteriorated alert */}
      {deteriorados > 0 && (
        <div className="rounded-lg px-4 py-3 flex items-center gap-3" style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}>
          <AlertCircle size={16} style={{ color: "#D97706", flexShrink: 0 }} />
          <span style={{ fontSize: 13.5, color: "#92400E" }}>
            <strong>{deteriorados} ejemplares</strong> se encuentran en condición deteriorada y podrían requerir reposición.
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, autor o ubicación…"
            style={{ width: "100%", padding: "8px 10px 8px 34px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", fontSize: 13.5, outline: "none", color: "var(--foreground)" }}
          />
        </div>
        <div className="relative">
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={selStyle}>
            <option value="all">Todas las áreas</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted-foreground)" }} />
        </div>
        <div className="relative">
          <select value={availFilter} onChange={(e) => setAvailFilter(e.target.value)} style={selStyle}>
            <option value="all">Disponibilidad</option>
            <option value="disponible">Con existencias</option>
            <option value="agotado">Sin disponibles</option>
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted-foreground)" }} />
        </div>
      </div>

      {/* Book inventory panels */}
      <div className="flex flex-col gap-4">
        {filteredBooks.map((book) => {
          const bookItems = getBookItems(book.id);
          return (
            <BookInventoryPanel
              key={book.id}
              book={book}
              items={bookItems}
              onAddCopies={() => setAddCopiesBook(book)}
              onUpdateCondition={handleUpdateCondition}
            />
          );
        })}
        {filteredBooks.length === 0 && (
          <div className="rounded-xl py-16 text-center" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <Package size={32} style={{ color: "var(--muted-foreground)", margin: "0 auto 8px" }} />
            <div style={{ fontSize: 14, color: "var(--muted-foreground)" }}>No se encontraron títulos con los filtros aplicados.</div>
          </div>
        )}
      </div>

      {addCopiesBook && (
        <AddCopiesModal
          book={addCopiesBook}
          onSave={handleAddCopies}
          onClose={() => setAddCopiesBook(null)}
        />
      )}
    </div>
  );
}
