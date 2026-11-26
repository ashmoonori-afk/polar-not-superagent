// Checks an instatoon page plan (JSON) against the rules in SKILL.md and references/layout.md that can be decided
// before drawing: page count, text budget, framing variety and the topic-prop rules. Layout-measured checks (sizes
// in pixels, face overlap, line weight, colours) run on the rendered page; see references/layout.md.
// usage: bun skills/instatoon/scripts/check-spec.mjs <plan.json> [--previous <older.json> ...]
//        (exit 0 = pass, 1 = one line per failure; --previous adds the variety rules against those older plans)

export const LIMITS = {
  pages: [8, 10],
  balloonsPerPage: 3,
  balloonCharsPerLine: 12,
  narrationLines: 2,
  narrationCharsPerLine: 20,
  marksPerPage: 2,
};

export const PROP_RULES = {
  setMin: 3,
  setMax: 6,
  perPage: 3,
  otherPagesShare: 0.75,
  heroPages: 2,
  sizes: ["s", "m", "hero"],
};

// Variation knobs (owner feedback 2026-11-26: "모든 이미지가 다 다르게"). The renderer draws each id; these lists are the
// single source for both, so a plan cannot name a variant the renderer does not have.
export const VARIANTS = {
  layout: ["stack", "left", "right", "bottom", "sticker"],
  palette: ["cream", "mint", "peach", "sky", "butter", "lilac"],
  bg: ["plain", "dots", "grid", "stripes", "waves", "rays", "confetti"],
  titleFont: ["yeonsung", "dongle", "singleday", "gamja", "himelody", "nanumpen"],
  glow: ["mint", "yellow", "pink", "sky"],
};
// A new cover must differ from each of the last VARIETY.window covers in at least coverFields of the signature
// fields, and may not reuse any of their layout+palette pairs. Non-cover pages: at most panelSameShare of the
// positions may repeat the same pose+frame+side as the same position in any of those toons.
export const VARIETY = { window: 6, coverFields: 4, panelSameShare: 0.5 };

const plain = (s) => s.replace(/\*\*/g, "");
const frameOf = (p) => p.frame ?? "full";
const FLIP = { left: "right", right: "left", center: "center" };
// The side the reader sees: a mirrored page puts the character on the other side.
const sideOf = (p) => (p.mirror ? FLIP[p.side ?? "right"] : (p.side ?? "right"));
const propIds = (p) => [...(p.art ?? []), ...(p.props ?? []).filter((x) => x.id)].map((x) => x.id);
const isHero = (p) => (p.art ?? []).some((a) => a.size === "hero");

export function propErrors(plan) {
  const errs = [];
  const R = PROP_RULES;
  const set = (plan.propSet ?? []).map((x) => x.id);
  if (set.length < R.setMin || set.length > R.setMax)
    errs.push(`propSet has ${set.length} topic props; need ${R.setMin}-${R.setMax}`);
  if (new Set(set).size !== set.length) errs.push("propSet ids repeat");
  for (const x of plan.propSet ?? []) if (!x.why) errs.push(`propSet ${x.id}: no reason it belongs to the topic`);
  const used = new Set();
  plan.pages.forEach((p, i) => {
    const n = i + 1;
    const ids = propIds(p);
    for (const id of ids) {
      if (!set.includes(id)) errs.push(`page ${n}: prop ${id} is not in propSet`);
      used.add(id);
    }
    for (const a of [...(p.art ?? []), ...(p.props ?? []).filter((x) => x.id)])
      if (!R.sizes.includes(a.size ?? "m")) errs.push(`page ${n}: prop ${a.id} has size ${a.size}; use s, m or hero`);
    if (ids.length > R.perPage) errs.push(`page ${n}: ${ids.length} topic props; at most ${R.perPage}`);
    if (p.frame === "small" && !isHero(p)) errs.push(`page ${n}: small framing needs a hero prop`);
  });
  for (const id of set) if (!used.has(id)) errs.push(`propSet ${id} is never drawn`);
  if (!propIds(plan.pages[0]).length) errs.push("cover has no topic prop");
  if (isHero(plan.pages[0])) errs.push("cover cannot be a hero-prop page");
  const rest = plan.pages.slice(1);
  const withProp = rest.filter((p) => propIds(p).length).length;
  const need = Math.ceil(rest.length * R.otherPagesShare);
  if (withProp < need) errs.push(`only ${withProp}/${rest.length} non-cover pages have a topic prop; need ${need}`);
  const heroPages = plan.pages.filter(isHero).length;
  if (heroPages > R.heroPages) errs.push(`${heroPages} hero-prop pages; at most ${R.heroPages}`);
  return errs;
}

const layoutOf = (plan) => plan.pages[0]?.layout ?? "stack";
const paletteOf = (plan) => plan.palette ?? "cream";

export function coverSignature(plan) {
  const c = plan.pages[0] ?? {};
  return {
    layout: layoutOf(plan),
    palette: paletteOf(plan),
    bg: c.bg ?? plan.bg ?? "plain",
    titleFont: plan.titleFont ?? "yeonsung",
    pose: c.pose ?? "-",
    frame: frameOf(c),
    side: sideOf(c),
    glow: c.glow ?? "-",
    marks: [...(c.marks ?? [])].sort().join("+") || "-",
    art: propIds(c).sort().join("+") || "-",
  };
}

const panelKey = (p) => `${p.pose ?? "-"}/${frameOf(p)}/${sideOf(p)}`;

// previous: older plans, oldest first; only the last VARIETY.window are compared.
export function varietyErrors(plan, previous) {
  const errs = [];
  const sig = coverSignature(plan);
  const fields = Object.keys(sig);
  const panels = plan.pages.slice(1).map(panelKey);
  for (const old of previous.slice(-VARIETY.window)) {
    const o = coverSignature(old);
    const differ = fields.filter((k) => sig[k] !== o[k]);
    if (differ.length < VARIETY.coverFields)
      errs.push(
        `cover too close to ${old.id}: differs only in ${differ.join(",") || "nothing"}; need ${VARIETY.coverFields} of ${fields.join(",")}`,
      );
    if (sig.layout === o.layout && sig.palette === o.palette)
      errs.push(`cover reuses ${old.id}'s layout ${o.layout} on palette ${o.palette}`);
    const theirs = old.pages.slice(1).map(panelKey);
    const same = panels.filter((k, i) => k === theirs[i]).length;
    if (same > panels.length * VARIETY.panelSameShare)
      errs.push(
        `panels repeat ${old.id}: ${same}/${panels.length} pages have the same pose/frame/side at the same position; at most ${Math.floor(panels.length * VARIETY.panelSameShare)}`,
      );
  }
  return errs;
}

function variantErrors(plan) {
  const errs = [];
  const bad = (what, v, n) => {
    if (v !== undefined && !VARIANTS[what].includes(v)) errs.push(`${n}${what} ${v}; use ${VARIANTS[what].join(", ")}`);
  };
  bad("palette", plan.palette, "");
  bad("titleFont", plan.titleFont, "");
  bad("bg", plan.bg, "");
  plan.pages.forEach((p, i) => {
    bad("bg", p.bg, `page ${i + 1}: `);
    bad("glow", p.glow, `page ${i + 1}: `);
    if (i > 0 && p.layout) errs.push(`page ${i + 1}: layout is for the cover only`);
    if (p.zoom !== undefined && (p.zoom < 0.85 || p.zoom > 1.15))
      errs.push(`page ${i + 1}: zoom ${p.zoom}; use 0.85-1.15`);
    if (p.charTilt !== undefined && Math.abs(p.charTilt) > 8)
      errs.push(`page ${i + 1}: charTilt ${p.charTilt}; use -8..8`);
  });
  bad("layout", plan.pages[0]?.layout, "cover ");
  const c = plan.pages[0];
  if (c && ["left", "right"].includes(c.layout) && sideOf(c) === c.layout)
    errs.push(`cover layout ${c.layout} puts the title on the ${c.layout}; the character must stand on the other side`);
  return errs;
}

export function planErrors(plan) {
  const errs = variantErrors(plan);
  const pages = plan.pages ?? [];
  if (pages[0]?.role !== "cover") errs.push("first page must be the cover");
  if (pages.length < LIMITS.pages[0] || pages.length > LIMITS.pages[1])
    errs.push(`${pages.length} pages; need ${LIMITS.pages[0]}-${LIMITS.pages[1]}`);
  if (plan.alt && plan.alt.length !== pages.length) errs.push("one alt line per page");
  pages.forEach((p, i) => {
    const n = i + 1;
    const balloons = p.balloons ?? [];
    if (balloons.length > LIMITS.balloonsPerPage) errs.push(`page ${n}: more than ${LIMITS.balloonsPerPage} balloons`);
    if (balloons.filter((b) => b.who === "shout").length > 1) errs.push(`page ${n}: more than one shout`);
    for (const b of balloons)
      for (const line of plain(b.text).split("\n"))
        if ([...line].length > LIMITS.balloonCharsPerLine)
          errs.push(`page ${n}: balloon line over ${LIMITS.balloonCharsPerLine} chars: ${line}`);
    if (p.narration) {
      const lines = plain(p.narration).split("\n");
      if (lines.length > LIMITS.narrationLines) errs.push(`page ${n}: narration over ${LIMITS.narrationLines} lines`);
      for (const l of lines)
        if ([...l].length > LIMITS.narrationCharsPerLine)
          errs.push(`page ${n}: narration line over ${LIMITS.narrationCharsPerLine} chars`);
    }
    if ((p.marks ?? []).length > LIMITS.marksPerPage) errs.push(`page ${n}: more than ${LIMITS.marksPerPage} marks`);
    const prev = pages[i - 1];
    if (prev?.pose && p.pose && frameOf(p) === frameOf(prev) && sideOf(p) === sideOf(prev))
      errs.push(`page ${n}: same frame and side as the page before`);
  });
  const frames = new Set(pages.filter((p) => p.pose && p.frame !== "small").map(frameOf));
  if (frames.size < 3) errs.push(`only ${frames.size} framings used; need full, big and close`);
  if (pages[0] && !["big", "close"].includes(pages[0].frame)) errs.push("cover character must be big or close");
  return [...errs, ...propErrors(plan)];
}

if (import.meta.main) {
  const [file, flag, ...older] = process.argv.slice(2);
  if (!file || (flag && flag !== "--previous")) {
    console.error("usage: bun check-spec.mjs <plan.json> [--previous <older.json> ...]");
    process.exit(2);
  }
  const plan = await Bun.file(file).json();
  const previous = await Promise.all(older.map((f) => Bun.file(f).json()));
  const errs = [...planErrors(plan), ...varietyErrors(plan, previous)];
  for (const e of errs) console.log(`FAIL ${e}`);
  if (errs.length) process.exitCode = 1;
  else console.log("PASS");
}
