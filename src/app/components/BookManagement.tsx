import { useState } from "react";
import { Search, Plus, Edit2, Trash2, X, Package, AlertCircle, ChevronDown, BookOpen } from "lucide-react";
import { BOOKS, INVENTORY_ITEMS, type Book, type BookCategory, type InventoryItem } from "./data";
import { BookCover } from "./BookCover";

const CATEGORIES: BookCategory[] = [
  "Derecho", "Medicina", "Matemáticas", "Historia", "Administración",
  "Psicología", "Informática", "Arquitectura", "Sociología", "Literatura", "Ingeniería",
];
const EDITORIALES = ["Porrúa", "Wolters Kluwer", "Cengage Learning", "Grijalbo", "McGraw-Hill", "Pearson", "Reverté", "Gustavo Gili", "Alianza Editorial", "Real Academia Española"];

// ─── Book Form ────────────────────────────────────────────────────────────────

interface BookFormProps {
  initial?: Partial<Book>;
  onSave: (book: Omit<Book, "id">) => void;
  onClose: () => void;
}

function BookForm({ initial, onSave, onClose }: BookFormProps) {
  const [form, setForm] = useState({
    isbn: initial?.isbn ?? "",
    titulo: initial?.titulo ?? "",
    autor: initial?.autor ?? "",
    editorial: initial?.editorial ?? "",
    anio: initial?.anio ?? new Date().getFullYear(),
    categoria: (initial?.categoria ?? "Derecho") as BookCategory,
    totalEjemplares: initial?.totalEjemplares ?? 1,
    disponibles: initial?.disponibles ?? 1,
    ubicacion: initial?.ubicacion ?? "",
    descripcion: initial?.descripcion ?? "",
  });

  const field = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setForm((p) => ({ ...p, [k]: val }));
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)",
    background: "var(--input-background)", fontSize: 13.5, color: "var(--foreground)", outline: "none",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}>
      <div className="rounded-xl w-full max-w-lg mx-4 overflow-hidden" style={{ background: "var(--card)", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: "var(--foreground)" }}>
            {initial?.titulo ? "Editar Libro" : "Nuevo Libro"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-foreground)" }}><X size={20} /></button>
        </div>
        <div className="px-6 py-5 grid gap-3 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>ISBN *</label>
              <input style={inputStyle} value={form.isbn} onChange={field("isbn")} placeholder="978-000-000-000-0" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Año *</label>
              <input type="number" style={inputStyle} value={form.anio} onChange={field("anio")} min={1900} max={2030} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Título *</label>
            <input style={inputStyle} value={form.titulo} onChange={field("titulo")} placeholder="Título del libro" />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Autor(es) *</label>
            <input style={inputStyle} value={form.autor} onChange={field("autor")} placeholder="Apellido, Nombre" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Editorial</label>
              <select style={{ ...inputStyle, appearance: "none" }} value={form.editorial} onChange={field("editorial")}>
                <option value="">Seleccionar…</option>
                {EDITORIALES.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Categoría *</label>
              <select style={{ ...inputStyle, appearance: "none" }} value={form.categoria} onChange={field("categoria")}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Total Ejemplares</label>
              <input type="number" style={inputStyle} value={form.totalEjemplares} onChange={field("totalEjemplares")} min={1} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Disponibles</label>
              <input type="number" style={inputStyle} value={form.disponibles} onChange={field("disponibles")} min={0} max={form.totalEjemplares} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Ubicación (estante)</label>
            <input style={inputStyle} value={form.ubicacion} onChange={field("ubicacion")} placeholder="Ej: A-12-3" />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Descripción</label>
            <textarea style={{ ...inputStyle, resize: "vertical" }} rows={3} value={form.descripcion} onChange={field("descripcion")} placeholder="Breve descripción del contenido..." />
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t justify-end" style={{ borderColor: "var(--border)" }}>
          <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", fontSize: 13.5, cursor: "pointer", color: "var(--foreground)" }}>
            Cancelar
          </button>
          <button
            onClick={() => { if (form.titulo && form.isbn && form.autor) onSave(form); }}
            style={{ padding: "8px 18px", borderRadius: 6, border: "none", background: "var(--primary)", color: "#fff", fontSize: 13.5, cursor: "pointer", fontWeight: 600 }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

function DeleteConfirm({ bookTitle, onConfirm, onClose }: { bookTitle: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}>
      <div className="rounded-xl w-full max-w-sm mx-4 p-6" style={{ background: "var(--card)", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-full p-2" style={{ background: "#FEE2E2" }}>
            <Trash2 size={18} style={{ color: "#DC2626" }} />
          </div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: "var(--foreground)" }}>Eliminar Libro</h3>
        </div>
        <p style={{ fontSize: 13.5, color: "var(--muted-foreground)", marginBottom: 6, lineHeight: 1.6 }}>
          ¿Estás seguro de que deseas eliminar <strong style={{ color: "var(--foreground)" }}>"{bookTitle}"</strong> del catálogo?
        </p>
        <p style={{ fontSize: 12.5, color: "#DC2626", marginBottom: 20 }}>Esta acción no se puede deshacer.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} style={{ padding: "8px 18px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", fontSize: 13.5, cursor: "pointer", color: "var(--foreground)" }}>
            Cancelar
          </button>
          <button onClick={onConfirm} style={{ padding: "8px 18px", borderRadius: 6, border: "none", background: "#DC2626", color: "#fff", fontSize: 13.5, cursor: "pointer", fontWeight: 600 }}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Inventory Panel ──────────────────────────────────────────────────────────

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
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 4 }}>Cantidad</label>
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

// ─── Main Component ───────────────────────────────────────────────────────────

type ManagementTab = "libros" | "inventario";

export function BookManagement() {
  const [books, setBooks] = useState<Book[]>(BOOKS);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(INVENTORY_ITEMS);
  const [tab, setTab] = useState<ManagementTab>("libros");

  // Books tab state
  const [bookSearch, setBookSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [showBookForm, setShowBookForm] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [deleteBook, setDeleteBook] = useState<Book | null>(null);

  // Inventory tab state
  const [invSearch, setInvSearch] = useState("");
  const [invCatFilter, setInvCatFilter] = useState("all");
  const [invAvailFilter, setInvAvailFilter] = useState("all");
  const [addCopiesBook, setAddCopiesBook] = useState<Book | null>(null);

  function getBookItems(bookId: string) { return inventoryItems.filter((i) => i.libroId === bookId); }

  function handleSaveBook(data: Omit<Book, "id">) {
    if (editBook) {
      setBooks((prev) => prev.map((b) => b.id === editBook.id ? { ...data, id: editBook.id } : b));
      setEditBook(null);
    } else {
      const newBook: Book = { ...data, id: `B${String(books.length + 1).padStart(3, "0")}` };
      setBooks((prev) => [...prev, newBook]);
      setShowBookForm(false);
    }
  }

  function handleDeleteBook(bookId: string) {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    setInventoryItems((prev) => prev.filter((i) => i.libroId !== bookId));
    setDeleteBook(null);
  }

  function handleAddCopies(newItems: Omit<InventoryItem, "id">[]) {
    const withIds = newItems.map((item, idx) => ({
      ...item,
      id: `I${String(inventoryItems.length + idx + 1).padStart(3, "0")}`,
    }));
    setInventoryItems((prev) => [...prev, ...withIds]);
    setAddCopiesBook(null);
  }

  function handleUpdateCondition(itemId: string, condicion: InventoryItem["condicion"]) {
    setInventoryItems((prev) => prev.map((i) => i.id === itemId ? { ...i, condicion } : i));
  }

  const filteredBooks = books.filter((b) => {
    const q = bookSearch.toLowerCase();
    const matchesSearch = !q || b.titulo.toLowerCase().includes(q) || b.autor.toLowerCase().includes(q) || b.isbn.includes(q);
    return matchesSearch && (catFilter === "all" || b.categoria === catFilter);
  });

  const filteredInvBooks = books.filter((b) => {
    const q = invSearch.toLowerCase();
    const bItems = getBookItems(b.id);
    const available = bItems.filter((i) => i.disponible).length;
    const matchesSearch = !q || b.titulo.toLowerCase().includes(q) || b.autor.toLowerCase().includes(q) || b.ubicacion.toLowerCase().includes(q);
    const matchesCat = invCatFilter === "all" || b.categoria === invCatFilter;
    const matchesAvail = invAvailFilter === "all" || (invAvailFilter === "disponible" ? available > 0 : available === 0);
    return matchesSearch && matchesCat && matchesAvail;
  });

  const totalEjemplares = inventoryItems.length;
  const totalDisponibles = inventoryItems.filter((i) => i.disponible).length;
  const deteriorados = inventoryItems.filter((i) => i.condicion === "deteriorado").length;

  const selStyle: React.CSSProperties = {
    padding: "7px 32px 7px 10px", borderRadius: 6, border: "1px solid var(--border)",
    background: "var(--card)", fontSize: 13, color: "var(--foreground)", cursor: "pointer", appearance: "none",
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "var(--foreground)" }}>Gestión de Libros</h1>
        <p style={{ fontSize: 13.5, color: "var(--muted-foreground)", marginTop: 2 }}>Administración del catálogo y control de inventario físico</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: "var(--card)", border: "1px solid var(--border)", width: "fit-content" }}>
        {[
          { id: "libros" as ManagementTab, label: "Catálogo (edición)", icon: <BookOpen size={14} /> },
          { id: "inventario" as ManagementTab, label: "Inventario físico", icon: <Package size={14} /> },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="flex items-center gap-2"
            style={{ padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer", background: tab === t.id ? "var(--primary)" : "transparent", color: tab === t.id ? "#fff" : "var(--muted-foreground)", fontSize: 13, fontWeight: tab === t.id ? 600 : 400 }}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ── BOOKS TAB ── */}
      {tab === "libros" && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 flex-wrap">
              <div className="relative" style={{ maxWidth: 360, flex: 1 }}>
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
                <input value={bookSearch} onChange={(e) => setBookSearch(e.target.value)} placeholder="Buscar por título, autor o ISBN…"
                  style={{ width: "100%", padding: "8px 10px 8px 34px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", fontSize: 13.5, outline: "none", color: "var(--foreground)" }} />
              </div>
              <div className="relative">
                <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} style={selStyle}>
                  <option value="all">Todas las áreas</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted-foreground)" }} />
              </div>
            </div>
            <button onClick={() => setShowBookForm(true)} className="flex items-center gap-2 ml-4"
              style={{ padding: "9px 16px", borderRadius: 7, border: "none", background: "var(--primary)", color: "#fff", fontSize: 13.5, cursor: "pointer", fontWeight: 600, flexShrink: 0 }}>
              <Plus size={16} /> Nuevo Libro
            </button>
          </div>

          <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div className="overflow-x-auto">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                    {["", "ISBN", "Título / Autor", "Área", "Año", "Ejemplares", "Acciones"].map((h) => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11.5, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.length === 0 && (
                    <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "var(--muted-foreground)" }}>No se encontraron libros.</td></tr>
                  )}
                  {filteredBooks.map((book, i) => {
                    const availColor = book.disponibles === 0 ? "#DC2626" : book.disponibles < book.totalEjemplares * 0.4 ? "#D97706" : "#16A34A";
                    const availBg = book.disponibles === 0 ? "#FEE2E2" : book.disponibles < book.totalEjemplares * 0.4 ? "#FEF3C7" : "#DCFCE7";
                    return (
                      <tr key={book.id} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.012)" }}>
                        <td style={{ padding: "10px 14px", width: 52 }}>
                          <BookCover book={book} size="xs" />
                        </td>
                        <td style={{ padding: "10px 14px", fontSize: 12, color: "var(--muted-foreground)", fontFamily: "monospace", whiteSpace: "nowrap" }}>{book.isbn}</td>
                        <td style={{ padding: "10px 14px", maxWidth: 220 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{book.titulo}</div>
                          <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{book.autor}</div>
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          <span className="rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: "var(--secondary)", color: "var(--primary)" }}>{book.categoria}</span>
                        </td>
                        <td style={{ padding: "10px 14px", fontSize: 13, color: "var(--foreground)" }}>{book.anio}</td>
                        <td style={{ padding: "10px 14px" }}>
                          <span className="rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: availBg, color: availColor }}>{book.disponibles}/{book.totalEjemplares}</span>
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setEditBook(book)} className="flex items-center gap-1"
                              style={{ padding: "5px 10px", borderRadius: 5, border: "1px solid var(--border)", background: "transparent", fontSize: 12, cursor: "pointer", color: "var(--muted-foreground)" }}>
                              <Edit2 size={12} /> Editar
                            </button>
                            <button onClick={() => setDeleteBook(book)} className="flex items-center gap-1"
                              style={{ padding: "5px 10px", borderRadius: 5, border: "none", background: "#FEE2E2", fontSize: 12, cursor: "pointer", color: "#DC2626", fontWeight: 600 }}>
                              <Trash2 size={12} /> Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t" style={{ borderColor: "var(--border)" }}>
              <span style={{ fontSize: 12.5, color: "var(--muted-foreground)" }}>Mostrando {filteredBooks.length} de {books.length} títulos</span>
            </div>
          </div>
        </>
      )}

      {/* ── INVENTORY TAB ── */}
      {tab === "inventario" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Total Ejemplares", value: totalEjemplares, color: "var(--primary)", bg: "var(--secondary)" },
              { label: "Disponibles", value: totalDisponibles, color: "#16A34A", bg: "#DCFCE7" },
              { label: "Deteriorados", value: deteriorados, color: "#DC2626", bg: "#FEE2E2" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "'Playfair Display', serif", lineHeight: 1.1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
          {deteriorados > 0 && (
            <div className="rounded-lg px-4 py-3 flex items-center gap-3" style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}>
              <AlertCircle size={16} style={{ color: "#D97706", flexShrink: 0 }} />
              <span style={{ fontSize: 13.5, color: "#92400E" }}>
                <strong>{deteriorados} ejemplares</strong> en condición deteriorada podrían requerir reposición.
              </span>
            </div>
          )}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted-foreground)" }} />
              <input value={invSearch} onChange={(e) => setInvSearch(e.target.value)} placeholder="Buscar por título, autor o ubicación…"
                style={{ width: "100%", padding: "8px 10px 8px 34px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", fontSize: 13.5, outline: "none", color: "var(--foreground)" }} />
            </div>
            <div className="relative">
              <select value={invCatFilter} onChange={(e) => setInvCatFilter(e.target.value)} style={selStyle}>
                <option value="all">Todas las áreas</option>
                {Array.from(new Set(books.map((b) => b.categoria))).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted-foreground)" }} />
            </div>
            <div className="relative">
              <select value={invAvailFilter} onChange={(e) => setInvAvailFilter(e.target.value)} style={selStyle}>
                <option value="all">Disponibilidad</option>
                <option value="disponible">Con existencias</option>
                <option value="agotado">Sin disponibles</option>
              </select>
              <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted-foreground)" }} />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {filteredInvBooks.map((book) => {
              const bookItems = getBookItems(book.id);
              const available = bookItems.filter((i) => i.disponible).length;
              const availPct = bookItems.length > 0 ? (available / bookItems.length) * 100 : 0;
              return (
                <div key={book.id} className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <div className="px-5 py-4 border-b flex items-start justify-between gap-4" style={{ borderColor: "var(--border)" }}>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <BookCover book={book} size="xs" />
                      <div className="min-w-0">
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{book.titulo}</div>
                        <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{book.autor} · {book.ubicacion}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <div style={{ fontSize: 16, fontWeight: 700, color: available === 0 ? "#DC2626" : "var(--foreground)", fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{available}/{bookItems.length}</div>
                        <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>disponibles</div>
                        <div className="rounded-full overflow-hidden mt-1" style={{ height: 4, background: "var(--muted)", width: 60 }}>
                          <div className="h-full rounded-full" style={{ width: `${availPct}%`, background: availPct === 0 ? "#DC2626" : availPct < 40 ? "#D97706" : "#16A34A" }} />
                        </div>
                      </div>
                      <button onClick={() => setAddCopiesBook(book)} className="flex items-center gap-1"
                        style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: "var(--secondary)", color: "var(--primary)", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                        <Plus size={13} /> Ejemplares
                      </button>
                    </div>
                  </div>
                  {bookItems.length > 0 && (
                    <div className="overflow-x-auto">
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ background: "var(--muted)" }}>
                            {["Código", "Condición", "Estado", "Adquisición"].map((h) => (
                              <th key={h} style={{ padding: "7px 14px", textAlign: "left", fontSize: 10.5, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {bookItems.map((item, ii) => {
                            const cond = conditionBadge(item.condicion);
                            return (
                              <tr key={item.id} style={{ borderTop: "1px solid var(--border)", background: ii % 2 === 0 ? "transparent" : "rgba(0,0,0,0.012)" }}>
                                <td style={{ padding: "8px 14px", fontSize: 12, color: "var(--foreground)", fontFamily: "monospace" }}>{item.codigoEjemplar}</td>
                                <td style={{ padding: "8px 14px" }}>
                                  <select value={item.condicion} onChange={(e) => handleUpdateCondition(item.id, e.target.value as InventoryItem["condicion"])}
                                    style={{ padding: "3px 22px 3px 8px", borderRadius: 5, border: "1px solid var(--border)", background: cond.bg, color: cond.color, fontSize: 11.5, fontWeight: 600, cursor: "pointer", appearance: "none" }}>
                                    <option value="excelente">Excelente</option>
                                    <option value="bueno">Bueno</option>
                                    <option value="regular">Regular</option>
                                    <option value="deteriorado">Deteriorado</option>
                                  </select>
                                </td>
                                <td style={{ padding: "8px 14px" }}>
                                  <span className="rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: item.disponible ? "#DCFCE7" : "#F1F5F9", color: item.disponible ? "#16A34A" : "#6B7A99" }}>
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
            })}
            {filteredInvBooks.length === 0 && (
              <div className="rounded-xl py-16 text-center" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <Package size={32} style={{ color: "var(--muted-foreground)", margin: "0 auto 8px" }} />
                <div style={{ fontSize: 14, color: "var(--muted-foreground)" }}>No se encontraron títulos con los filtros aplicados.</div>
              </div>
            )}
          </div>
        </>
      )}

      {(showBookForm || editBook) && (
        <BookForm initial={editBook ?? undefined} onSave={handleSaveBook} onClose={() => { setShowBookForm(false); setEditBook(null); }} />
      )}
      {deleteBook && (
        <DeleteConfirm bookTitle={deleteBook.titulo} onConfirm={() => handleDeleteBook(deleteBook.id)} onClose={() => setDeleteBook(null)} />
      )}
      {addCopiesBook && (
        <AddCopiesModal book={addCopiesBook} onSave={handleAddCopies} onClose={() => setAddCopiesBook(null)} />
      )}
    </div>
  );
}
