/**
 * Gera a imagem "Raio-X do teu negócio" no próprio navegador (nada é enviado a servidor)
 * e abre o compartilhamento do celular, ou baixa o arquivo no desktop.
 */
export async function compartilharRaioX(opts: { vazando: string[]; ok: string[]; quem: string }) {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const fam = '"Archivo Variable", Archivo, sans-serif';
  try {
    await Promise.all([document.fonts.load(`900 80px ${fam}`), document.fonts.load(`700 40px ${fam}`)]);
  } catch {
    /* segue com a fonte de fallback */
  }

  // fundo + vinheta
  ctx.fillStyle = "#0e2620";
  ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W * 0.3, H * 0.28, 40, W * 0.3, H * 0.28, W);
  g.addColorStop(0, "rgba(22,58,48,1)");
  g.addColorStop(1, "rgba(4,17,14,1)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  const x = 88;
  let y = 150;
  ctx.fillStyle = "#d99042";
  ctx.font = `700 34px ${fam}`;
  ctx.fillText("Raio-X do teu negócio", x, y);
  y += 54;
  ctx.fillStyle = "#9aa49f";
  ctx.font = `600 32px ${fam}`;
  ctx.fillText(opts.quem, x, y);

  y += 120;
  const n = opts.vazando.length;
  ctx.font = `900 104px ${fam}`;
  if (n) {
    ctx.fillStyle = "#f2ede3";
    ctx.fillText("TEU NEGÓCIO", x, y);
    y += 112;
    ctx.fillText(`TEM ${n} ${n === 1 ? "PORTA" : "PORTAS"}`, x, y);
    y += 112;
    ctx.fillStyle = "#dc4c2b";
    ctx.fillText("VAZANDO.", x, y);
  } else {
    ctx.fillStyle = "#d99042";
    ctx.fillText("TÁ BEM NA", x, y);
    y += 112;
    ctx.fillText("FRENTE.", x, y);
  }

  y += 90;
  const linha = (txt: string, cor: string, marca: string) => {
    ctx.fillStyle = cor;
    ctx.beginPath();
    ctx.arc(x + 22, y - 14, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#0e2620";
    ctx.font = `900 26px ${fam}`;
    ctx.textAlign = "center";
    ctx.fillText(marca, x + 22, y - 5);
    ctx.textAlign = "left";
    ctx.fillStyle = cor;
    ctx.font = `700 38px ${fam}`;
    ctx.fillText(txt, x + 70, y);
    y += 70;
  };
  opts.vazando.forEach((t) => linha(t, "#ef6a43", "✕"));
  opts.ok.forEach((t) => linha(t, "#d99042", "✓"));

  ctx.fillStyle = "#9aa49f";
  ctx.font = `600 30px ${fam}`;
  ctx.fillText(`Faz o teste: ${window.location.host}`, x, H - 96);
  ctx.fillStyle = "#f2ede3";
  ctx.font = `800 30px ${fam}`;
  ctx.fillText("Pronto pra Temporada, Floripa", x, H - 140);

  const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, "image/png"));
  if (!blob) return;
  const file = new File([blob], "raio-x-do-teu-negocio.png", { type: "image/png" });

  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: "Raio-X do teu negócio" });
      return;
    } catch (e) {
      if ((e as DOMException).name === "AbortError") return;
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
