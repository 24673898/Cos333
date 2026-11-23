// Runs every model answer in src/content/coding-*.md against its listed tests,
// using Racket (DrRacket's engine) and SWI-Prolog. Prolog tests use findall, so
// extra (invalid) answers on re-query are caught too.
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { parseCoding } from '../src/lib/parse.ts'

const dir = mkdtempSync(join(tmpdir(), 'cos333-'))
const norm = (s: string) => s.replace(/\s+/g, '')
let fails = 0
let total = 0

function run(cmd: string, args: string[]) {
  try {
    return execFileSync(cmd, args, { encoding: 'utf8', timeout: 20000, stdio: ['ignore', 'pipe', 'pipe'] })
  } catch (e: any) {
    return 'ERROR: ' + (e.stdout ?? '') + (e.stderr ?? '')
  }
}

for (const q of parseCoding(readFileSync('src/content/coding-scheme.md', 'utf8'))) {
  const file = join(dir, q.id + '.rkt')
  writeFileSync(file, '#lang racket\n' + q.solution + '\n' + q.tests.map((t) => `(display ${t.call}) (newline)`).join('\n') + '\n')
  const out = run('racket', [file]).trim().split('\n')
  q.tests.forEach((t, i) => {
    total++
    if (norm(out[i] ?? '') !== norm(t.expected)) {
      fails++
      console.log(`FAIL ${q.id}: ${t.call} expected ${t.expected} got ${out[i]}`)
    }
  })
}

for (const q of parseCoding(readFileSync('src/content/coding-prolog.md', 'utf8'))) {
  const file = join(dir, q.id + '.pl')
  const lines = [':- style_check(-singleton).', q.facts ?? '', q.solution]
  q.tests.forEach((t, i) => {
    const vars = [...new Set(t.call.match(/\b[A-Z][A-Za-z0-9_]*\b/g) ?? [])]
    if (vars.length === 0) {
      lines.push(`t${i} :- ( ${t.call} -> write(true) ; write(false) ), nl.`)
    } else {
      const fmt = vars.map((v) => `${v} = ~w`).join(', ')
      lines.push(
        `t${i} :- findall([${vars.join(',')}], ${t.call}, L), ` +
          `forall(member([${vars.join(',')}], L), format("${fmt} | ", [${vars.join(',')}])), nl.`,
      )
    }
  })
  lines.push(`main :- ${q.tests.map((_, i) => `t${i}`).join(', ')}.`)
  writeFileSync(file, lines.join('\n') + '\n')
  const out = run('swipl', ['-q', '-g', 'main', '-t', 'halt', file]).trim().split('\n')
  q.tests.forEach((t, i) => {
    total++
    const got = (out[i] ?? '').split(/\s*\|\s*/).map((s) => norm(s)).filter(Boolean)
    const want = t.expected.split(' | ').map(norm)
    const isBool = want.length === 1 && (want[0] === 'true' || want[0] === 'false')
    const gotSet = [...new Set(got)].sort().join(';')
    const wantSet = [...new Set(want)].sort().join(';')
    const ok = isBool ? got[0] === want[0] : gotSet === wantSet
    if (!ok) {
      fails++
      console.log(`FAIL ${q.id}: ${t.call}\n   expected ${t.expected}\n   got      ${out[i]}`)
    } else if (!isBool && got.length !== new Set(got).size) {
      console.log(`note ${q.id}: ${t.call} repeats a valid answer (${got.length} answers, ${new Set(got).size} distinct)`)
    }
  })
}
console.log(`\n${total - fails}/${total} tests passed`)
process.exit(fails ? 1 : 0)
