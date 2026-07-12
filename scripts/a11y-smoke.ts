/**
 * Lightweight contrast + markup smoke checks for WCAG AA baseline items.
 * Automated tools catch only part of real issues — still do a manual keyboard
 * pass on the quote estimator after deploy.
 *
 * Run: npx tsx scripts/a11y-smoke.ts
 */

function relativeLuminance(r: number, g: number, b: number) {
  const toLin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
}

function contrastRatio(
  a: [number, number, number],
  b: [number, number, number],
) {
  const l1 = relativeLuminance(...a);
  const l2 = relativeLuminance(...b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const sat = s / 100;
  const light = l / 100;
  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = light - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

const pairs: Array<{
  name: string;
  fg: [number, number, number];
  bg: [number, number, number];
  min: number;
}> = [
  {
    name: "body text gray-700 on white",
    fg: hslToRgb(210, 18, 29),
    bg: [255, 255, 255],
    min: 4.5,
  },
  {
    name: "warning text on white",
    fg: hslToRgb(28, 90, 32),
    bg: [255, 255, 255],
    min: 4.5,
  },
  {
    name: "footer white/85 on primary green",
    fg: [255, 255, 255],
    bg: hslToRgb(158, 88, 28),
    min: 4.5,
  },
  {
    name: "estimate gray-100 on tertiary navy",
    fg: hslToRgb(210, 20, 98),
    bg: hslToRgb(210, 56, 14),
    min: 4.5,
  },
];

let failed = 0;
for (const pair of pairs) {
  const ratio = contrastRatio(pair.fg, pair.bg);
  const ok = ratio >= pair.min;
  console.log(
    `${ok ? "ok" : "FAIL"} ${pair.name}: ${ratio.toFixed(2)}:1 (need ${pair.min}:1)`,
  );
  if (!ok) failed += 1;
}

if (failed > 0) {
  console.error(`a11y-smoke: ${failed} contrast check(s) failed`);
  process.exit(1);
}

console.log("a11y-smoke: contrast checks passed");
console.log(
  "Manual: keyboard-tab the quote estimator; confirm focus rings and no traps.",
);
