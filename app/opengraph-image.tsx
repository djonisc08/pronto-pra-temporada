import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Teu cliente te procurou hoje… e achou o vizinho. Faz o teste grátis de 10 segundos.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PINS = [
  { x: 860, y: 170, c: "#dc4c2b", s: 1.3 },
  { x: 990, y: 120, c: "#d99042", s: 0.9 },
  { x: 1070, y: 260, c: "#d99042", s: 0.9 },
  { x: 900, y: 360, c: "#d99042", s: 0.9 },
  { x: 1040, y: 440, c: "#4d6a61", s: 1 },
];

export default async function OgImage() {
  const dir = join(process.cwd(), "node_modules/@fontsource/archivo/files");
  const [black, bold] = await Promise.all([
    readFile(join(dir, "archivo-latin-900-normal.woff")),
    readFile(join(dir, "archivo-latin-700-normal.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "radial-gradient(ellipse 80% 70% at 25% 30%, #163a30 0%, #0e2620 55%, #04110e 100%)",
          fontFamily: "Archivo",
        }}
      >
        {PINS.map((p, i) => (
          <svg key={i} width={40 * p.s} height={52 * p.s} viewBox="-16 -48 32 48" style={{ position: "absolute", left: p.x, top: p.y }}>
            <path d="M0 0 C -9 -13 -16 -21 -16 -31 A 16 16 0 1 1 16 -31 C 16 -21 9 -13 0 0 Z" fill={p.c} />
            <circle cx="0" cy="-31" r="5.5" fill="#fff6ec" />
          </svg>
        ))}
        <div style={{ display: "flex", flexDirection: "column", padding: "72px 80px", width: 820 }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#d99042" }}>Pronto pra Temporada · Floripa</div>
          <div style={{ marginTop: 40, fontSize: 64, fontWeight: 900, lineHeight: 0.98, color: "#f2ede3", textTransform: "uppercase" }}>
            Teu cliente te procurou hoje…
          </div>
          <div style={{ marginTop: 10, fontSize: 92, fontWeight: 900, lineHeight: 0.95, color: "#dc4c2b", textTransform: "uppercase" }}>
            e achou o vizinho.
          </div>
          <div style={{ marginTop: 36, fontSize: 30, fontWeight: 700, color: "#9aa49f" }}>Faz o teste grátis de 10 segundos.</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo", data: black, weight: 900, style: "normal" },
        { name: "Archivo", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
