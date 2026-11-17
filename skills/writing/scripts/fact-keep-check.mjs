#!/usr/bin/env bun
// fact-keep-check: after editing a Korean (or mixed) text, prove the edit kept every fact.
// Usage: bun scripts/fact-keep-check.mjs --before old.txt --after new.txt [--json]
// Exit 0 = every number kept with its subject, unit and sign; 1 = a number was lost, added, changed or re-paired.
// Negation and modality changes are warnings: rewording can move them legitimately, so a person must look.
// Built because im-not-ai's checks.py compares unsigned value sets: swapped counts and -5% -> 5% pass there.
import { readFileSync } from 'node:fs'

const SCALE = { 천: 1e3, 만: 1e4, 억: 1e8, 조: 1e12 }
const NUMBER = /([-+−]|마이너스\s?)?(\d[\d,]*(?:\.\d+)?)(?:([:/])(\d+))?\s?(천|만|억|조)?\s?(%|퍼센트|[A-Za-z]{1,4}|[가-힣]{1,2})?/gu
const SUBJECT = /([가-힣A-Za-z][가-힣A-Za-z_-]*)[^가-힣A-Za-z0-9,.;:!?\n]*$/u
const NEGATION = /않|못\s?[가-힣]|없[어다고는이을지네음]|아니|말[아고]/gu
const MODALITY = /수\s?있|수\s?없|해야|것\s?같|아마|반드시|꼭|일지도|할지도/gu
const PARTICLE = /(에서|으로|에게|까지|부터|이랑|하고|은|는|이|가|을|를|에|의|로|와|과|도|만)$/u

const clean = word => word.replace(PARTICLE, '') || word

/** Every number in the text with its sign, unit and the word just before it (its subject). */
export function extractNumbers(text) {
  const found = []
  for (const match of text.matchAll(NUMBER)) {
    const [, sign, digits, sep, tail, scale, unit] = match
    const base = Number(digits.replaceAll(',', ''))
    if (!Number.isFinite(base)) continue
    const negative = sign && sign.trim() !== '+'
    const value = sep ? `${base}${sep}${tail}` : (negative ? -1 : 1) * base * (scale ? SCALE[scale] : 1)
    const clause = text.slice(0, match.index).split(/[,.;!?\n]|그리고|하지만/).pop()
    const subject = clause.match(SUBJECT)?.[1]
    found.push({
      raw: match[0].trim(),
      value: String(value),
      unit: unit && !/^[가-힣]{2}$/.test(unit) ? unit : (unit?.[0] ?? ''),
      subject: subject ? clean(subject) : '',
    })
  }
  return found
}

const key = n => `${n.value}|${n.unit}`
const tally = (list, pick) => list.reduce((map, item) => map.set(pick(item), (map.get(pick(item)) ?? 0) + 1), new Map())
const count = (text, pattern) => (text.match(pattern) ?? []).length

export function checkFacts(before, after) {
  const problems = []
  const warnings = []
  const a = extractNumbers(before)
  const b = extractNumbers(after)
  const ta = tally(a, key)
  const tb = tally(b, key)
  for (const [k, n] of ta) {
    const m = tb.get(k) ?? 0
    if (m < n) {
      const item = a.find(x => key(x) === k)
      const flipped = b.find(x => x.unit === item.unit && x.value !== item.value && Math.abs(Number(x.value)) === Math.abs(Number(item.value)))
      problems.push(flipped ? `sign changed: "${item.raw}" became "${flipped.raw}"` : `number lost: "${item.raw}" (${n - m} of ${n} missing)`)
    }
  }
  for (const [k, n] of tb) {
    const m = ta.get(k) ?? 0
    if (n > m) {
      const item = b.find(x => key(x) === k)
      const isFlip = problems.some(p => p.startsWith('sign changed') && p.endsWith(`"${item.raw}"`))
      if (!isFlip) problems.push(`number added or changed: "${item.raw}"`)
    }
  }
  for (const x of a) {
    if (!x.subject) continue
    const same = b.filter(y => y.subject === x.subject && y.unit === x.unit)
    if (same.length && !same.some(y => y.value === x.value) && tb.get(key(x)) >= ta.get(key(x))) {
      problems.push(`pairing changed: "${x.subject} ${x.raw}" now reads "${same.map(y => `${y.subject} ${y.raw}`).join(', ')}"`)
    }
  }
  const neg = [count(before, NEGATION), count(after, NEGATION)]
  if (neg[0] !== neg[1]) warnings.push(`negation markers ${neg[0]} -> ${neg[1]}: confirm the meaning did not flip`)
  const mod = [count(before, MODALITY), count(after, MODALITY)]
  if (mod[0] !== mod[1]) warnings.push(`possibility/obligation markers ${mod[0]} -> ${mod[1]}: confirm certainty did not change`)
  return { ok: problems.length === 0, problems: [...new Set(problems)], warnings, numbers: { before: a.length, after: b.length } }
}

if (import.meta.main) {
  const args = process.argv.slice(2)
  const arg = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined }
  const beforePath = arg('--before')
  const afterPath = arg('--after')
  if (!beforePath || !afterPath) {
    console.error('usage: bun fact-keep-check.mjs --before old.txt --after new.txt [--json]')
    process.exit(2)
  }
  const result = checkFacts(readFileSync(beforePath, 'utf8'), readFileSync(afterPath, 'utf8'))
  if (args.includes('--json')) console.log(JSON.stringify(result))
  else {
    console.log(`${result.ok ? 'OK' : 'FAIL'} fact-keep-check numbers=${result.numbers.before}->${result.numbers.after}`)
    for (const p of result.problems) console.log(`  problem: ${p}`)
    for (const w of result.warnings) console.log(`  warning: ${w}`)
  }
  process.exit(result.ok ? 0 : 1)
}
