import type { Book } from "./data";

const CATEGORY_PALETTES: Record<string, { bg: string; spine: string; text: string; pattern: string }> = {
  Derecho:        { bg: "#1C3D73", spine: "#C8921A", text: "#E8EDF5", pattern: "#FFFFFF08" },
  Medicina:       { bg: "#881337", spine: "#FB7185", text: "#FFE4E6", pattern: "#FFFFFF08" },
  Matemáticas:    { bg: "#134E4A", spine: "#2DD4BF", text: "#CCFBF1", pattern: "#FFFFFF08" },
  Historia:       { bg: "#78350F", spine: "#F59E0B", text: "#FEF3C7", pattern: "#FFFFFF08" },
  Administración: { bg: "#4C1D95", spine: "#A78BFA", text: "#EDE9FE", pattern: "#FFFFFF08" },
  Psicología:     { bg: "#1E3A8A", spine: "#60A5FA", text: "#DBEAFE", pattern: "#FFFFFF08" },
  Informática:    { bg: "#064E3B", spine: "#34D399", text: "#D1FAE5", pattern: "#FFFFFF08" },
  Arquitectura:   { bg: "#1E293B", spine: "#94A3B8", text: "#F1F5F9", pattern: "#FFFFFF08" },
  Sociología:     { bg: "#312E81", spine: "#818CF8", text: "#E0E7FF", pattern: "#FFFFFF08" },
  Literatura:     { bg: "#7F1D1D", spine: "#F87171", text: "#FEE2E2", pattern: "#FFFFFF08" },
  Ingeniería:     { bg: "#374151", spine: "#9CA3AF", text: "#F9FAFB", pattern: "#FFFFFF08" },
};

const DEFAULT_PALETTE = { bg: "#334155", spine: "#94A3B8", text: "#F1F5F9", pattern: "#FFFFFF08" };

interface BookCoverProps {
  book: Book;
  size?: "xs" | "sm" | "md" | "lg";
}

const SIZES = {
  xs: { width: 32, height: 44, spineW: 4, fontSize: 11, showLabel: false },
  sm: { width: 48, height: 66, spineW: 5, fontSize: 18, showLabel: false },
  md: { width: 72, height: 100, spineW: 7, fontSize: 28, showLabel: true },
  lg: { width: 108, height: 150, spineW: 10, fontSize: 42, showLabel: true },
};

export function BookCover({ book, size = "sm" }: BookCoverProps) {
  const palette = CATEGORY_PALETTES[book.categoria] ?? DEFAULT_PALETTE;
  const dim = SIZES[size];
  const initial = book.titulo.replace(/^(El |La |Los |Las |Un |Una |The |A )/, "")[0]?.toUpperCase() ?? "?";

  return (
    <div
      style={{
        width: dim.width,
        height: dim.height,
        background: palette.bg,
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        boxShadow: "2px 3px 8px rgba(0,0,0,0.28), inset -1px 0 0 rgba(0,0,0,0.15)",
      }}
    >
      {/* Spine */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: dim.spineW, background: palette.spine, zIndex: 2 }} />

      {/* Diagonal stripe pattern */}
      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0, width: dim.width * 0.3,
        background: `repeating-linear-gradient(135deg, transparent 0px, transparent 3px, ${palette.pattern} 3px, ${palette.pattern} 5px)`,
      }} />

      {/* Horizontal rule */}
      <div style={{ position: "absolute", top: "28%", left: dim.spineW + 4, right: 4, height: 1, background: palette.spine, opacity: 0.4 }} />
      <div style={{ position: "absolute", top: "30%", left: dim.spineW + 4, right: 4, height: 1, background: palette.spine, opacity: 0.2 }} />

      {/* Big initial letter */}
      <div style={{
        position: "absolute",
        top: "38%",
        left: "50%",
        transform: "translate(-38%, -50%)",
        fontSize: dim.fontSize,
        fontWeight: 800,
        color: palette.text,
        opacity: 0.18,
        fontFamily: "'Playfair Display', serif",
        lineHeight: 1,
        userSelect: "none",
      }}>
        {initial}
      </div>

      {/* Category label at bottom */}
      {dim.showLabel && (
        <div style={{
          position: "absolute", bottom: 0, left: dim.spineW, right: 0,
          padding: "3px 5px",
          background: "rgba(0,0,0,0.35)",
        }}>
          <div style={{
            fontSize: 7.5,
            color: palette.text,
            opacity: 0.85,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {book.categoria}
          </div>
        </div>
      )}

      {/* Shine overlay */}
      <div style={{
        position: "absolute", top: 0, left: dim.spineW, right: "60%", bottom: 0,
        background: "linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 100%)",
        pointerEvents: "none",
      }} />
    </div>
  );
}
