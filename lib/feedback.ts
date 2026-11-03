/**
 * Som e vibração do teste. Tudo é gerado por código (Web Audio), sem baixar arquivos,
 * e só toca em resposta a um toque da pessoa. Um único botão liga e desliga os dois.
 */

type Listener = () => void;
const listeners = new Set<Listener>();
const CHAVE = "pt-som";

let ligado = true;
let lido = false;
let ctx: AudioContext | null = null;

function ler() {
  if (lido || typeof window === "undefined") return;
  lido = true;
  try {
    const v = window.localStorage.getItem(CHAVE);
    if (v === "0") ligado = false;
  } catch {
    /* sem storage: fica ligado */
  }
}

export function somLigado(): boolean {
  ler();
  return ligado;
}

export function alternarSom() {
  ler();
  ligado = !ligado;
  try {
    window.localStorage.setItem(CHAVE, ligado ? "1" : "0");
  } catch {
    /* ignora */
  }
  listeners.forEach((l) => l());
  if (ligado) tocar("tap");
}

export function assinarSom(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tom(a: AudioContext, freq: number, ini: number, dur: number, vol: number, tipo: OscillatorType = "sine", freqFim?: number) {
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = tipo;
  o.frequency.setValueAtTime(freq, ini);
  if (freqFim) o.frequency.exponentialRampToValueAtTime(freqFim, ini + dur);
  g.gain.setValueAtTime(0.0001, ini);
  g.gain.exponentialRampToValueAtTime(vol, ini + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, ini + dur);
  o.connect(g).connect(a.destination);
  o.start(ini);
  o.stop(ini + dur + 0.02);
}

function ruido(a: AudioContext, ini: number, dur: number, vol: number, corte: number) {
  const n = Math.floor(a.sampleRate * dur);
  const buf = a.createBuffer(1, n, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3);
  const src = a.createBufferSource();
  src.buffer = buf;
  const f = a.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = corte;
  const g = a.createGain();
  g.gain.value = vol;
  src.connect(f).connect(g).connect(a.destination);
  src.start(ini);
}

export type Som = "tap" | "vazou" | "carimbo" | "aprovado";

export function tocar(som: Som) {
  if (!somLigado()) return;
  const a = audio();
  if (!a) return;
  const t = a.currentTime + 0.005;
  switch (som) {
    case "tap":
      tom(a, 620, t, 0.07, 0.05, "sine", 420);
      break;
    case "vazou":
      tom(a, 220, t, 0.16, 0.08, "triangle", 120);
      break;
    case "carimbo":
      ruido(a, t, 0.14, 0.5, 900);
      tom(a, 110, t, 0.18, 0.22, "sine", 55);
      break;
    case "aprovado":
      [659.3, 830.6, 987.8].forEach((f, i) => tom(a, f, t + i * 0.11, 0.5, 0.07, "sine"));
      break;
  }
}

/** Vibração curta no Android (iPhone ignora). Segue o mesmo botão do som. */
export function vibrar(padrao: number | number[]) {
  if (!somLigado() || typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try {
    navigator.vibrate(padrao);
  } catch {
    /* ignora */
  }
}
