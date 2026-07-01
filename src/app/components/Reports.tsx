import { useState, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import {
  TrendingUp, Calendar, Hash, AlertCircle, Download,
  Printer, FileText, BookOpen, BarChart2,
} from "lucide-react";
import { BOOKS, type Loan, type UserRole } from "./data";
import { BookCover } from "./BookCover";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BookStat {
  rank: number;
  bookId: string;
  titulo: string;
  autor: string;
  categoria: string;
  total: number;
  pct: number;
}

interface ReportParams {
  fechaInicio: string;
  fechaFin: string;
  topN: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BAR_COLORS = [
  "#C8921A", // 1 – gold
  "#1C3D73", // 2 – navy
  "#16A34A", // 3 – green
  "#7C3AED", // 4 – violet
  "#0369A1", // 5 – blue
  "#D97706", // 6 – amber
  "#DC2626", // 7 – red
  "#059669", // 8 – emerald
  "#9D174D", // 9 – pink
  "#374151", // 10 – slate
];

function barColor(rank: number) {
  return BAR_COLORS[(rank - 1) % BAR_COLORS.length];
}

function rankMedal(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

function generateReport(loans: Loan[], fechaInicio: string, fechaFin: string, topN: number): BookStat[] {
  const start = new Date(fechaInicio + "T00:00:00").getTime();
  const end   = new Date(fechaFin   + "T23:59:59").getTime();

  const counts: Record<string, number> = {};
  loans.forEach((l) => {
    const d = new Date(l.fechaPrestamo).getTime();
    if (d >= start && d <= end) {
      counts[l.libroId] = (counts[l.libroId] ?? 0) + 1;
    }
  });

  const grandTotal = Object.values(counts).reduce((a, b) => a + b, 0);

  return Object.entries(counts)
    .map(([bookId, total]) => {
      const book = BOOKS.find((b) => b.id === bookId);
      return {
        bookId,
        titulo:    book?.titulo    ?? "Título desconocido",
        autor:     book?.autor     ?? "—",
        categoria: book?.categoria ?? "—",
        total,
        pct: grandTotal > 0 ? Math.round((total / grandTotal) * 1000) / 10 : 0,
        rank: 0,
      };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, topN)
    .map((item, i) => ({ ...item, rank: i + 1 }));
}

function exportCSV(data: BookStat[], params: ReportParams) {
  const header = "Rank,Título,Autor,Categoría,Solicitudes,Porcentaje\n";
  const rows = data.map((r) =>
    `${r.rank},"${r.titulo}","${r.autor}","${r.categoria}",${r.total},${r.pct}%`
  ).join("\n");
  const blob = new Blob(["﻿" + header + rows], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = `reporte_libros_${params.fechaInicio}_${params.fechaFin}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportJSON(data: BookStat[], params: ReportParams) {
  const payload = {
    generado: new Date().toISOString(),
    periodo: { desde: params.fechaInicio, hasta: params.fechaFin },
    top: params.topN,
    resultados: data,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = `reporte_libros_${params.fechaInicio}_${params.fechaFin}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  const d: BookStat = payload[0].payload;
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", padding: "10px 14px", borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", maxWidth: 260 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: barColor(d.rank), textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>
        {rankMedal(d.rank)} Posición #{d.rank}
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--foreground)", marginBottom: 2, lineHeight: 1.3 }}>{d.titulo}</div>
      <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 6 }}>{d.autor}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: barColor(d.rank) }}>{d.total} solicitudes</div>
      <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{d.pct}% del período</div>
    </div>
  );
}

// ─── Custom X-axis tick (truncated title) ─────────────────────────────────────

function CustomXTick({ x, y, payload }: any) {
  const title: string = payload.value ?? "";
  const truncated = title.length > 14 ? title.slice(0, 13) + "…" : title;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={12} textAnchor="middle" fill="var(--foreground)"
        style={{ fontSize: 11, fontFamily: "'Inter', sans-serif" }}>
        {truncated}
      </text>
    </g>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ReportsProps {
  loans: Loan[];
  role: UserRole;
}

export function Reports({ loans, role }: ReportsProps) {
  const [params, setParams] = useState<ReportParams>({ fechaInicio: "", fechaFin: "", topN: 10 });
  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState<BookStat[] | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const isStaff = role === "admin" || role === "bibliotecario";

  function validate(): string[] {
    const errs: string[] = [];
    if (!params.fechaInicio)  errs.push("La fecha de inicio es requerida.");
    if (!params.fechaFin)     errs.push("La fecha de fin es requerida.");
    if (params.fechaInicio && params.fechaFin && params.fechaInicio > params.fechaFin)
      errs.push("La fecha de inicio no puede ser posterior a la fecha de fin.");
    if (!params.topN || params.topN < 1 || params.topN > 50)
      errs.push("La cantidad de resultados debe ser un número entre 1 y 50.");
    return errs;
  }

  function handleGenerate() {
    const errs = validate();
    if (errs.length > 0) { setErrors(errs); setResult(null); return; }
    setErrors([]);
    setResult(generateReport(loans, params.fechaInicio, params.fechaFin, params.topN));
  }

  function handlePrint() {
    window.print();
  }

  const inputStyle: React.CSSProperties = {
    padding: "9px 12px", borderRadius: 7, border: "1px solid var(--border)",
    background: "var(--card)", fontSize: 13.5, color: "var(--foreground)", outline: "none",
  };

  const totalLoansInPeriod = result?.reduce((a, b) => a + b.total, 0) ?? 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "var(--foreground)" }}>
          Reportes y Estadísticas
        </h1>
        <p style={{ fontSize: 13.5, color: "var(--muted-foreground)", marginTop: 2 }}>
          Libros más solicitados en un período determinado
        </p>
      </div>

      {/* Parameter form */}
      <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={16} style={{ color: "var(--primary)" }} />
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)" }}>Parámetros del Reporte</h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <Calendar size={11} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
              Fecha de inicio
            </label>
            <input
              type="date"
              style={inputStyle}
              value={params.fechaInicio}
              max={params.fechaFin || undefined}
              onChange={(e) => setParams((p) => ({ ...p, fechaInicio: e.target.value }))}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <Calendar size={11} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
              Fecha de fin
            </label>
            <input
              type="date"
              style={inputStyle}
              value={params.fechaFin}
              min={params.fechaInicio || undefined}
              onChange={(e) => setParams((p) => ({ ...p, fechaFin: e.target.value }))}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <Hash size={11} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
              Top resultados (1–50)
            </label>
            <input
              type="number"
              style={{ ...inputStyle, width: 90 }}
              value={params.topN}
              min={1}
              max={50}
              onChange={(e) => setParams((p) => ({ ...p, topN: Math.max(1, Math.min(50, Number(e.target.value))) }))}
            />
          </div>
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2"
            style={{ padding: "9px 20px", borderRadius: 7, border: "none", background: "var(--primary)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
          >
            <TrendingUp size={16} /> Generar Reporte
          </button>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mt-4 rounded-lg px-4 py-3 flex flex-col gap-1.5" style={{ background: "#FEE2E2", border: "1px solid #FECACA" }}>
            {errors.map((err, i) => (
              <div key={i} className="flex items-center gap-2">
                <AlertCircle size={14} style={{ color: "#DC2626", flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "#991B1B" }}>{err}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      {result !== null && (
        <div ref={printRef} className="flex flex-col gap-5">
          {result.length === 0 ? (
            /* Empty state */
            <div className="rounded-xl flex flex-col items-center py-16 gap-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <BookOpen size={40} style={{ color: "var(--muted-foreground)" }} />
              <div style={{ fontSize: 16, fontWeight: 600, color: "var(--foreground)" }}>Sin datos para el período</div>
              <p style={{ fontSize: 13.5, color: "var(--muted-foreground)", textAlign: "center", maxWidth: 340 }}>
                No se registraron préstamos entre el{" "}
                <strong>{new Date(params.fechaInicio + "T12:00:00").toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}</strong>
                {" "}y el{" "}
                <strong>{new Date(params.fechaFin + "T12:00:00").toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}</strong>.
              </p>
            </div>
          ) : (
            <>
              {/* Report header + export buttons */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={16} style={{ color: "var(--primary)" }} />
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>
                      Top {result.length} Libros más Solicitados
                    </h2>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>
                    Período:{" "}
                    {new Date(params.fechaInicio + "T12:00:00").toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                    {" — "}
                    {new Date(params.fechaFin + "T12:00:00").toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                    {" · "}
                    <strong>{totalLoansInPeriod} solicitudes</strong> en el período
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap print-hide">
                  <button onClick={() => exportCSV(result, params)} className="flex items-center gap-1.5"
                    style={{ padding: "7px 14px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--card)", fontSize: 13, cursor: "pointer", color: "var(--foreground)", fontWeight: 500 }}>
                    <Download size={14} /> CSV
                  </button>
                  <button onClick={() => exportJSON(result, params)} className="flex items-center gap-1.5"
                    style={{ padding: "7px 14px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--card)", fontSize: 13, cursor: "pointer", color: "var(--foreground)", fontWeight: 500 }}>
                    <FileText size={14} /> JSON
                  </button>
                  <button onClick={handlePrint} className="flex items-center gap-1.5"
                    style={{ padding: "7px 14px", borderRadius: 7, border: "none", background: "var(--primary)", color: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
                    <Printer size={14} /> Imprimir
                  </button>
                </div>
              </div>

              {/* Bar chart */}
              <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--muted-foreground)", marginBottom: 16 }}>
                  Solicitudes por título — período seleccionado
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    data={result}
                    margin={{ top: 8, right: 20, left: 0, bottom: 48 }}
                    barCategoryGap="30%"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis
                      dataKey="titulo"
                      tick={<CustomXTick />}
                      tickLine={false}
                      axisLine={{ stroke: "var(--border)" }}
                      interval={0}
                    />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      width={28}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.5 }} />
                    <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={52}>
                      {result.map((entry, idx) => (
                        <Cell key={`bar-cell-${idx}`} fill={barColor(entry.rank)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                {/* Legend dots */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
                  {result.map((entry) => (
                    <div key={entry.bookId} className="flex items-center gap-1.5">
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: barColor(entry.rank), flexShrink: 0 }} />
                      <span style={{ fontSize: 11.5, color: "var(--muted-foreground)" }}>
                        #{entry.rank} {entry.titulo.length > 22 ? entry.titulo.slice(0, 21) + "…" : entry.titulo}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed table */}
              <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)" }}>Tabla de Resultados Detallada</span>
                </div>
                <div className="overflow-x-auto">
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                        {["Pos.", "", "Título / Autor", "Área", "Solicitudes", "% del período"].map((h) => (
                          <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11.5, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.map((item, i) => {
                        const book = BOOKS.find((b) => b.id === item.bookId);
                        return (
                          <tr key={item.bookId} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.012)" }}>
                            <td style={{ padding: "12px 14px" }}>
                              <div
                                className="flex items-center justify-center rounded-lg text-sm font-bold"
                                style={{ width: 36, height: 36, background: barColor(item.rank) + "20", color: barColor(item.rank), fontFamily: "'Playfair Display', serif", fontSize: item.rank <= 3 ? 18 : 14 }}
                              >
                                {item.rank <= 3 ? rankMedal(item.rank) : `#${item.rank}`}
                              </div>
                            </td>
                            <td style={{ padding: "12px 14px", width: 52 }}>
                              {book && <BookCover book={book} size="xs" />}
                            </td>
                            <td style={{ padding: "12px 14px", maxWidth: 280 }}>
                              <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--foreground)", fontFamily: "'Playfair Display', serif", lineHeight: 1.3 }}>{item.titulo}</div>
                              <div style={{ fontSize: 12, color: "var(--muted-foreground)", marginTop: 1 }}>{item.autor}</div>
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                              <span className="rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: "var(--secondary)", color: "var(--primary)" }}>
                                {item.categoria}
                              </span>
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                              <div className="flex items-center gap-2">
                                <div className="rounded-full overflow-hidden" style={{ height: 6, width: 80, background: "var(--muted)", flexShrink: 0 }}>
                                  <div style={{ height: "100%", width: `${(item.total / (result[0]?.total || 1)) * 100}%`, background: barColor(item.rank), borderRadius: 3 }} />
                                </div>
                                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)" }}>{item.total}</span>
                              </div>
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                              <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--muted-foreground)" }}>{item.pct}%</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: "var(--muted)", borderTop: "2px solid var(--border)" }}>
                        <td colSpan={4} style={{ padding: "10px 14px", fontSize: 13, fontWeight: 700, color: "var(--foreground)", textAlign: "right" }}>
                          Total solicitudes en período:
                        </td>
                        <td style={{ padding: "10px 14px", fontSize: 14, fontWeight: 700, color: "var(--primary)" }}>
                          {totalLoansInPeriod}
                        </td>
                        <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 600, color: "var(--muted-foreground)" }}>100%</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Footer note */}
              {!isStaff && (
                <p style={{ fontSize: 12.5, color: "var(--muted-foreground)", textAlign: "center" }}>
                  Los datos reflejan las solicitudes registradas en el sistema para el período indicado.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
