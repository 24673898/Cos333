import type { ReactNode } from 'react'
import { lazy, Suspense } from 'react'

const LanguageTimeline = lazy(() => import('./LanguageTimeline'))

/* Shared SVG bits */
const stroke = 'var(--foreground)'
const muted = 'var(--muted-foreground)'
const primary = 'var(--primary)'

function Frame({ title, children, caption }: { title: string; children: ReactNode; caption?: string }) {
  return (
    <figure className="my-5 rounded-xl border bg-muted/40 p-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</div>
      <div className="overflow-x-auto">{children}</div>
      {caption && <figcaption className="mt-2 text-xs text-muted-foreground">{caption}</figcaption>}
    </figure>
  )
}

function Arrow({ id = 'arr' }: { id?: string }) {
  return (
    <defs>
      <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill={stroke} />
      </marker>
    </defs>
  )
}

/* ---------- Scheme: box-and-pointer (cons cells) ---------- */
function Cell({ x, y, car, last }: { x: number; y: number; car?: string; last?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={36} height={30} fill="var(--card)" stroke={stroke} />
      <rect x={x + 36} y={y} width={36} height={30} fill="var(--card)" stroke={stroke} />
      {last && <line x1={x + 36} y1={y + 30} x2={x + 72} y2={y} stroke={stroke} />}
      {car && (
        <text x={x + 18} y={y + 20} textAnchor="middle" fontSize="14" fontFamily="monospace" fill={primary} fontWeight={700}>
          {car}
        </text>
      )}
    </g>
  )
}

export function ConsCells() {
  // (A (B C) D)
  return (
    <Frame
      title="How Scheme stores lists — box-and-pointer (cons cells)"
      caption="Each cell is a cons: the left box is the car, the right box is the cdr (pointer to the rest). A diagonal line = empty list (). Top: '(A B C D). Bottom: '(A (B C) D) — the car of the 2nd cell points to a whole sub-list."
    >
      <svg viewBox="0 0 560 250" className="w-full max-w-[560px]" role="img">
        <Arrow />
        {/* (A B C D) */}
        <text x="0" y="22" fontSize="12" fill={muted} fontFamily="monospace">'(A B C D)</text>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <Cell x={10 + i * 110} y={32} car={'ABCD'[i]} last={i === 3} />
            {i < 3 && (
              <line x1={10 + i * 110 + 54} y1={47} x2={10 + (i + 1) * 110 - 2} y2={47} stroke={stroke} markerEnd="url(#arr)" />
            )}
          </g>
        ))}
        {/* (A (B C) D) */}
        <text x="0" y="122" fontSize="12" fill={muted} fontFamily="monospace">'(A (B C) D)</text>
        <Cell x={10} y={132} car="A" />
        <line x1={64} y1={147} x2={118} y2={147} stroke={stroke} markerEnd="url(#arr)" />
        <Cell x={120} y={132} />
        <line x1={138} y1={147} x2={138} y2={196} stroke={stroke} markerEnd="url(#arr)" />
        <line x1={174} y1={147} x2={228} y2={147} stroke={stroke} markerEnd="url(#arr)" />
        <Cell x={230} y={132} car="D" last />
        <Cell x={120} y={198} car="B" />
        <line x1={174} y1={213} x2={228} y2={213} stroke={stroke} markerEnd="url(#arr)" />
        <Cell x={230} y={198} car="C" last />
        <text x={330} y={150} fontSize="12" fill={muted}>(car lis) → A</text>
        <text x={330} y={170} fontSize="12" fill={muted}>(car (cdr lis)) → (B C)</text>
        <text x={330} y={190} fontSize="12" fill={muted}>(cdr (cdr lis)) → (D)</text>
        <text x={330} y={210} fontSize="12" fill={muted}>(cons 'Z lis) → (Z A (B C) D)</text>
      </svg>
    </Frame>
  )
}

/* ---------- Scheme: recursion vs tail recursion ---------- */
export function TailRecursion() {
  const rows = [
    ['(factorial 3)', '(* 3 (factorial 2))'],
    ['(factorial 2)', '(* 2 (factorial 1))'],
    ['(factorial 1)', '(* 1 (factorial 0))'],
    ['(factorial 0)', '1'],
  ]
  const tail = ['(facthelper 3 1)', '(facthelper 2 3)', '(facthelper 1 6)', '→ 6']
  return (
    <Frame
      title="Normal recursion vs tail recursion"
      caption="Left: each call waits for the result of the next (pending multiplications pile up on the stack, then unwind). Right: the recursive call is the LAST operation, so nothing is pending — Scheme must convert it to iteration (constant stack)."
    >
      <svg viewBox="0 0 600 220" className="w-full max-w-[600px]">
        <text x="10" y="16" fontSize="12" fontWeight={700} fill={stroke}>Normal: stack grows, then unwinds</text>
        {rows.map((r, i) => (
          <g key={i}>
            <rect x={10 + i * 14} y={26 + i * 40} width={250} height={30} rx={6} fill="var(--accent)" stroke={primary} />
            <text x={20 + i * 14} y={45 + i * 40} fontSize="12" fontFamily="monospace" fill={stroke}>
              {r[0]} = {r[1]}
            </text>
          </g>
        ))}
        <text x="320" y="16" fontSize="12" fontWeight={700} fill={stroke}>Tail recursive: accumulator carries result</text>
        {tail.map((t, i) => (
          <g key={i}>
            <rect x={320} y={26 + i * 40} width={250} height={30} rx={6} fill="var(--card)" stroke="var(--success)" />
            <text x={332} y={45 + i * 40} fontSize="12" fontFamily="monospace" fill={stroke}>
              {t}
            </text>
          </g>
        ))}
        <text x="320" y="200" fontSize="11" fill={muted}>(define (facthelper n partial) (if (&lt;= n 1) partial (facthelper (- n 1) (* n partial))))</text>
      </svg>
    </Frame>
  )
}

/* ---------- Scheme / Prolog: list-processing recipe ---------- */
export function ListRecipe() {
  const steps = [
    ['1', 'Base case', 'Empty list → return () / 0 / #t', 'p([], []).'],
    ['2', 'Look at head', 'Test (car lis) / H with a predicate', 'H > 0, H < 0, H =:= 0'],
    ['3', 'Recurse on tail', '(f (cdr lis)) / p(T, R)', 'one case per kind of head'],
    ['4', 'Build result', 'cons new head onto recursive result', '[NewH | R] in the head of the rule'],
  ]
  return (
    <Frame title="The 4-step list-processing recipe (works for every exam implementation question)">
      <div className="grid gap-2 sm:grid-cols-4">
        {steps.map(([n, t, d, e]) => (
          <div key={n} className="rounded-lg border bg-card p-3">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{n}</span>
              <span className="text-sm font-semibold">{t}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{d}</p>
            <code className="mt-2 block rounded bg-muted px-2 py-1 font-mono text-[0.7rem]">{e}</code>
          </div>
        ))}
      </div>
    </Frame>
  )
}

/* ---------- Prolog: search tree with backtracking ---------- */
export function PrologTree() {
  return (
    <Frame
      title="Prolog search: depth-first, left-to-right, with backtracking"
      caption="Query ?- likes(jake, X), likes(darcie, X). Prolog satisfies the first subgoal (X = chocolate), then fails the second, so it REDOes the first subgoal from where it left off (X = apricots) and the second now succeeds."
    >
      <svg viewBox="0 0 620 250" className="w-full max-w-[620px]">
        <Arrow id="arr2" />
        <rect x={185} y={10} width={250} height={34} rx={8} fill="var(--accent)" stroke={primary} />
        <text x={310} y={32} textAnchor="middle" fontSize="12" fontFamily="monospace" fill={stroke}>likes(jake,X), likes(darcie,X)</text>
        <line x1={260} y1={44} x2={150} y2={92} stroke={stroke} markerEnd="url(#arr2)" />
        <line x1={360} y1={44} x2={470} y2={92} stroke={stroke} markerEnd="url(#arr2)" />
        <text x={150} y={68} fontSize="11" fill={muted}>① Call / Exit</text>
        <text x={420} y={68} fontSize="11" fill={muted}>④ Redo → Exit</text>
        <rect x={40} y={94} width={220} height={34} rx={8} fill="var(--card)" stroke={stroke} />
        <text x={150} y={116} textAnchor="middle" fontSize="12" fontFamily="monospace" fill={stroke}>X = chocolate</text>
        <rect x={360} y={94} width={220} height={34} rx={8} fill="var(--card)" stroke={stroke} />
        <text x={470} y={116} textAnchor="middle" fontSize="12" fontFamily="monospace" fill={stroke}>X = apricots</text>
        <line x1={150} y1={128} x2={150} y2={172} stroke={stroke} markerEnd="url(#arr2)" />
        <line x1={470} y1={128} x2={470} y2={172} stroke={stroke} markerEnd="url(#arr2)" />
        <text x={160} y={152} fontSize="11" fill={muted}>② Call</text>
        <text x={480} y={152} fontSize="11" fill={muted}>⑤ Call</text>
        <rect x={40} y={174} width={220} height={34} rx={8} fill="var(--card)" stroke="var(--danger)" />
        <text x={150} y={196} textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--danger)">likes(darcie,chocolate) ✗ ③ Fail</text>
        <rect x={360} y={174} width={220} height={34} rx={8} fill="var(--card)" stroke="var(--success)" />
        <text x={470} y={196} textAnchor="middle" fontSize="12" fontFamily="monospace" fill="var(--success)">likes(darcie,apricots) ✓ Exit</text>
        <text x={310} y={238} textAnchor="middle" fontSize="12" fill={stroke} fontWeight={700}>Answer: X = apricots</text>
      </svg>
    </Frame>
  )
}

/* ---------- Prolog: resolution approaches ---------- */
export function ChainingDiagram() {
  return (
    <Frame title="Top-down vs bottom-up resolution">
      <div className="grid gap-3 sm:grid-cols-2 text-sm">
        <div className="rounded-lg border bg-card p-3">
          <div className="font-semibold">Bottom-up (forward chaining)</div>
          <div className="mt-2 font-mono text-xs text-muted-foreground">facts → rules → … → goal</div>
          <p className="mt-2 text-xs">Start from facts, derive new facts until the goal appears. Good when there are many possibly-relevant facts.</p>
        </div>
        <div className="rounded-lg border border-primary bg-accent/40 p-3">
          <div className="font-semibold">Top-down (backward chaining) — Prolog</div>
          <div className="mt-2 font-mono text-xs text-muted-foreground">goal → subgoals → … → facts</div>
          <p className="mt-2 text-xs">Start from the query and work back to facts. Good when the set of possible answers is small. Prolog also uses depth-first search over subgoals.</p>
        </div>
      </div>
    </Frame>
  )
}

/* ---------- Chapter 5: static vs dynamic scope ---------- */
export function ScopeDiagram() {
  return (
    <Frame
      title="Static vs dynamic scope (Big → Sub1 → Sub2, Sub2 refers to X)"
      caption="Static scope follows the TEXT (where Sub2 is declared → Big's X). Dynamic scope follows the CALL CHAIN (who called Sub2 → Sub1's X)."
    >
      <svg viewBox="0 0 600 200" className="w-full max-w-[600px]">
        <Arrow id="arr3" />
        <rect x={10} y={10} width={330} height={180} rx={10} fill="none" stroke={stroke} />
        <text x={22} y={30} fontSize="12" fontFamily="monospace" fill={stroke}>Big {'{'} declare X  ← static</text>
        <rect x={30} y={45} width={290} height={55} rx={8} fill="var(--card)" stroke={muted} />
        <text x={42} y={66} fontSize="12" fontFamily="monospace" fill={stroke}>Sub1 {'{'} declare X  ← dynamic</text>
        <text x={42} y={86} fontSize="12" fontFamily="monospace" fill={muted}>call Sub2 {'}'}</text>
        <rect x={30} y={110} width={290} height={45} rx={8} fill="var(--card)" stroke={primary} />
        <text x={42} y={137} fontSize="12" fontFamily="monospace" fill={primary}>Sub2 {'{'} refer to X {'}'}</text>
        <text x={22} y={178} fontSize="12" fontFamily="monospace" fill={muted}>call Sub1 {'}'}</text>
        <line x1={330} y1={132} x2={430} y2={60} stroke="var(--success)" markerEnd="url(#arr3)" />
        <line x1={330} y1={136} x2={430} y2={140} stroke="var(--warning)" markerEnd="url(#arr3)" />
        <text x={438} y={56} fontSize="12" fill="var(--success)" fontWeight={700}>Static scope:</text>
        <text x={438} y={74} fontSize="12" fill={stroke}>X in Big</text>
        <text x={438} y={136} fontSize="12" fill="var(--warning)" fontWeight={700}>Dynamic scope:</text>
        <text x={438} y={154} fontSize="12" fill={stroke}>X in Sub1</text>
      </svg>
    </Frame>
  )
}

/* ---------- Chapter 5: variable lifetime categories ---------- */
export function LifetimeDiagram() {
  const cols = [
    ['Static', 'Before run time', 'Whole program', 'C static locals', 'var(--primary)'],
    ['Stack-dynamic', 'Declaration elaborated', 'Until block/subprogram ends', 'C locals, Java method locals', 'var(--success)'],
    ['Explicit heap-dynamic', 'Programmer directive (new)', 'Until delete / garbage collected', 'C++ new, Java objects', 'var(--warning)'],
    ['Implicit heap-dynamic', 'Assignment', 'Rebound on every assignment', 'APL vars, JS/Perl/PHP arrays & strings', 'var(--danger)'],
  ]
  return (
    <Frame title="Four lifetime categories of variables (storage binding)">
      <div className="grid gap-2 sm:grid-cols-4">
        {cols.map(([n, a, l, e, c]) => (
          <div key={n} className="rounded-lg border bg-card p-3" style={{ borderTop: `3px solid ${c}` }}>
            <div className="text-sm font-semibold">{n}</div>
            <dl className="mt-2 space-y-1 text-xs">
              <dt className="text-muted-foreground">Bound when</dt>
              <dd>{a}</dd>
              <dt className="text-muted-foreground">Lives</dt>
              <dd>{l}</dd>
              <dt className="text-muted-foreground">Example</dt>
              <dd>{e}</dd>
            </dl>
          </div>
        ))}
      </div>
    </Frame>
  )
}

/* ---------- Chapter 6: discriminated union ---------- */
export function UnionDiagram() {
  return (
    <Frame
      title="Discriminated union (tagged) — a shape that is a Circle, Triangle or Rectangle"
      caption="The tag (discriminant) records which variant is stored. The language checks it, so reading Side_1 while Form = Circle is detected as an error. A free union (C/C++) has no tag — you could read the bits as the wrong type."
    >
      <svg viewBox="0 0 600 150" className="w-full max-w-[600px]">
        <rect x={10} y={30} width={110} height={60} fill="var(--accent)" stroke={primary} />
        <text x={65} y={55} textAnchor="middle" fontSize="12" fill={stroke} fontWeight={700}>Form (tag)</text>
        <text x={65} y={75} textAnchor="middle" fontSize="12" fontFamily="monospace" fill={primary}>= Circle</text>
        <rect x={120} y={30} width={140} height={60} fill="var(--card)" stroke={stroke} />
        <text x={190} y={65} textAnchor="middle" fontSize="12" fill={stroke}>Filled, Color</text>
        <rect x={260} y={30} width={330} height={60} fill="var(--card)" stroke={stroke} strokeDasharray="4 3" />
        <text x={425} y={22} textAnchor="middle" fontSize="11" fill={muted}>variant part (shares the same memory)</text>
        <text x={275} y={55} fontSize="12" fontFamily="monospace" fill="var(--success)">Circle: Diameter ✓</text>
        <text x={275} y={75} fontSize="12" fontFamily="monospace" fill={muted}>Triangle: Left_Side, Right_Side, Angle ✗</text>
        <text x={275} y={120} fontSize="12" fontFamily="monospace" fill={muted}>Rectangle: Side_1, Side_2 ✗</text>
      </svg>
    </Frame>
  )
}

/* ---------- Chapter 9: parameter passing models ---------- */
export function ParamPassing() {
  const rows = [
    ['Pass-by-value', 'in', 'copy value in', 'C, C++, Java (refs by value), C#'],
    ['Pass-by-result', 'out', 'copy value out on return', 'Ada out, C# out'],
    ['Pass-by-value-result', 'inout', 'copy in, then copy out', 'Ada in out (scalars), Fortran'],
    ['Pass-by-reference', 'inout', 'pass access path (address)', 'C++ &, C pointers, C# ref, Perl @_'],
    ['Pass-by-name', 'inout', 'textual substitution, bound at use', 'ALGOL 60 (not used today)'],
  ]
  return (
    <Frame title="Five implementation models of parameter passing">
      <svg viewBox="0 0 600 120" className="w-full max-w-[600px]">
        <Arrow id="arr4" />
        <rect x={20} y={35} width={120} height={50} rx={8} fill="var(--card)" stroke={stroke} />
        <text x={80} y={64} textAnchor="middle" fontSize="12" fill={stroke}>Caller (actual)</text>
        <rect x={460} y={35} width={120} height={50} rx={8} fill="var(--card)" stroke={stroke} />
        <text x={520} y={64} textAnchor="middle" fontSize="12" fill={stroke}>Callee (formal)</text>
        <line x1={140} y1={45} x2={458} y2={45} stroke="var(--success)" markerEnd="url(#arr4)" />
        <text x={300} y={40} textAnchor="middle" fontSize="11" fill="var(--success)">in mode (value)</text>
        <line x1={458} y1={60} x2={142} y2={60} stroke="var(--warning)" markerEnd="url(#arr4)" />
        <text x={300} y={74} textAnchor="middle" fontSize="11" fill="var(--warning)">out mode (result)</text>
        <line x1={140} y1={80} x2={458} y2={80} stroke={primary} strokeDasharray="5 4" />
        <text x={300} y={100} textAnchor="middle" fontSize="11" fill={primary}>inout: copy both ways OR share an access path</text>
      </svg>
      <table className="mt-3 w-full text-xs">
        <thead>
          <tr className="text-left text-muted-foreground">
            <th className="py-1">Method</th>
            <th>Mode</th>
            <th>How data moves</th>
            <th>Examples</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-t">
              <td className="py-1.5 font-medium">{r[0]}</td>
              <td>{r[1]}</td>
              <td>{r[2]}</td>
              <td className="text-muted-foreground">{r[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Frame>
  )
}

/* ---------- Chapter 9: shallow / deep / ad hoc binding ---------- */
export function BindingDiagram() {
  const cards = [
    ['Shallow', 'Environment of the CALL that runs the passed subprogram (inside sub4)', 'x in sub4 → 4', 'var(--warning)'],
    ['Deep', 'Environment where the passed subprogram is DEFINED (sub2 inside sub1)', 'x in sub1 → 1', 'var(--success)'],
    ['Ad hoc', 'Environment of the call that PASSED it as a parameter (in sub3)', 'x in sub3 → 3', 'var(--primary)'],
  ]
  return (
    <Frame title="Referencing environment of a passed subprogram (slide example)">
      <div className="grid gap-3 md:grid-cols-[1fr_1.4fr]">
        <pre className="rounded-lg bg-[#1e1f26] p-3 font-mono text-xs leading-5 text-zinc-200">{`fun sub1() {
  var x = 1
  fun sub2() { print x }
  fun sub3() {
    var x = 3
    call sub4(sub2)   // passes sub2
  }
  fun sub4(subx) {
    var x = 4
    call subx()       // runs sub2
  }
  call sub3()
}`}</pre>
        <div className="space-y-2">
          {cards.map(([n, d, r, c]) => (
            <div key={n} className="rounded-lg border bg-card p-3" style={{ borderLeft: `4px solid ${c}` }}>
              <div className="flex items-center justify-between">
                <span className="font-semibold">{n} binding</span>
                <code className="rounded bg-muted px-2 py-0.5 text-xs">{r}</code>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{d}</p>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">Memory hook: <b>S</b>hallow = where it'<b>s</b> run · <b>D</b>eep = where it's <b>D</b>efined · <b>A</b>d hoc = where it was h<b>a</b>nded over.</p>
        </div>
      </div>
    </Frame>
  )
}

/* ---------- Chapter 9: coroutines ---------- */
export function CoroutineDiagram() {
  return (
    <Frame
      title="Coroutines: resume jumps back to where a coroutine last stopped"
      caption="2026 exam example. main resumes B → B prints Third, resumes A → A (first time, so from the top) prints First, resumes B → B continues AFTER its last resume: prints Fourth and ends. Output: Third First Fourth. ('Second' is never printed because nothing resumes A again.)"
    >
      <svg viewBox="0 0 600 210" className="w-full max-w-[600px]">
        <Arrow id="arr5" />
        {['main', 'A', 'B'].map((n, i) => (
          <g key={n}>
            <text x={70 + i * 220} y={18} textAnchor="middle" fontSize="13" fontWeight={700} fill={stroke}>
              {n}
            </text>
            <line x1={70 + i * 220} y1={26} x2={70 + i * 220} y2={200} stroke={muted} strokeDasharray="3 4" />
          </g>
        ))}
        <line x1={70} y1={40} x2={508} y2={40} stroke={primary} markerEnd="url(#arr5)" />
        <text x={290} y={35} textAnchor="middle" fontSize="11" fill={primary}>resume B</text>
        <rect x={500} y={48} width={100} height={22} rx={5} fill="var(--accent)" />
        <text x={550} y={63} textAnchor="middle" fontSize="11" fontFamily="monospace" fill={stroke}>print Third</text>
        <line x1={510} y1={80} x2={292} y2={80} stroke={primary} markerEnd="url(#arr5)" />
        <text x={400} y={75} textAnchor="middle" fontSize="11" fill={primary}>resume A (start)</text>
        <rect x={240} y={88} width={100} height={22} rx={5} fill="var(--accent)" />
        <text x={290} y={103} textAnchor="middle" fontSize="11" fontFamily="monospace" fill={stroke}>print First</text>
        <line x1={300} y1={120} x2={508} y2={120} stroke={primary} markerEnd="url(#arr5)" />
        <text x={400} y={115} textAnchor="middle" fontSize="11" fill={primary}>resume B (continue)</text>
        <rect x={500} y={128} width={100} height={22} rx={5} fill="var(--accent)" />
        <text x={550} y={143} textAnchor="middle" fontSize="11" fontFamily="monospace" fill={stroke}>print Fourth</text>
        <text x={550} y={172} textAnchor="middle" fontSize="11" fill={muted}>B ends</text>
        <text x={290} y={190} textAnchor="middle" fontSize="11" fill="var(--danger)">"Second" never runs</text>
      </svg>
    </Frame>
  )
}

/* ---------- Chapter 9: closures ---------- */
export function ClosureDiagram() {
  return (
    <Frame
      title="A closure = function + the referencing environment it was created in"
      caption="Each call to makeAdder creates a NEW environment with its own x. The returned anonymous function keeps that environment alive (unlimited extent), even after makeAdder has returned."
    >
      <svg viewBox="0 0 600 140" className="w-full max-w-[600px]">
        <Arrow id="arr6" />
        <rect x={10} y={20} width={180} height={44} rx={8} fill="var(--card)" stroke={stroke} />
        <text x={100} y={47} textAnchor="middle" fontSize="12" fontFamily="monospace" fill={stroke}>add10 = makeAdder(10)</text>
        <rect x={10} y={80} width={180} height={44} rx={8} fill="var(--card)" stroke={stroke} />
        <text x={100} y={107} textAnchor="middle" fontSize="12" fontFamily="monospace" fill={stroke}>add5 = makeAdder(5)</text>
        <line x1={190} y1={42} x2={268} y2={42} stroke={stroke} markerEnd="url(#arr6)" />
        <line x1={190} y1={102} x2={268} y2={102} stroke={stroke} markerEnd="url(#arr6)" />
        <rect x={270} y={20} width={180} height={44} rx={8} fill="var(--accent)" stroke={primary} />
        <text x={360} y={40} textAnchor="middle" fontSize="11" fontFamily="monospace" fill={stroke}>function(y){'{'} y + x {'}'}</text>
        <text x={360} y={56} textAnchor="middle" fontSize="11" fontFamily="monospace" fill={primary}>env: x = 10</text>
        <rect x={270} y={80} width={180} height={44} rx={8} fill="var(--accent)" stroke={primary} />
        <text x={360} y={100} textAnchor="middle" fontSize="11" fontFamily="monospace" fill={stroke}>function(y){'{'} y + x {'}'}</text>
        <text x={360} y={116} textAnchor="middle" fontSize="11" fontFamily="monospace" fill={primary}>env: x = 5</text>
        <text x={470} y={47} fontSize="12" fontFamily="monospace" fill="var(--success)">add10(20) → 30</text>
        <text x={470} y={107} fontSize="12" fontFamily="monospace" fill="var(--success)">add5(20) → 25</text>
      </svg>
    </Frame>
  )
}

/* ---------- Chapter 12: diamond inheritance ---------- */
export function DiamondDiagram() {
  return (
    <Frame
      title="Diamond inheritance → implicit name collision"
      caption="If A defines operation(), D inherits it twice — once through B and once through C — an IMPLICIT collision (D's programmer never wrote anything). Defining it only in B or only in C gives D a single copy; defining it in D simply overrides."
    >
      <svg viewBox="0 0 300 220" className="w-full max-w-[300px]">
        <Arrow id="arr7" />
        {[
          ['A', 150, 25],
          ['B', 70, 110],
          ['C', 230, 110],
          ['D', 150, 195],
        ].map(([n, x, y]) => (
          <g key={n as string}>
            <circle cx={x as number} cy={y as number} r={22} fill="var(--accent)" stroke={primary} />
            <text x={x as number} y={(y as number) + 5} textAnchor="middle" fontSize="15" fontWeight={700} fill={stroke}>
              {n}
            </text>
          </g>
        ))}
        <line x1={84} y1={93} x2={134} y2={42} stroke={stroke} markerEnd="url(#arr7)" />
        <line x1={216} y1={93} x2={166} y2={42} stroke={stroke} markerEnd="url(#arr7)" />
        <line x1={134} y1={178} x2={84} y2={128} stroke={stroke} markerEnd="url(#arr7)" />
        <line x1={166} y1={178} x2={216} y2={128} stroke={stroke} markerEnd="url(#arr7)" />
      </svg>
    </Frame>
  )
}

/* ---------- Chapter 8: dangling else ---------- */
export function DanglingElse() {
  const items = [
    ['Java / C / C#', 'Semantic rule: else matches the NEAREST if. Use braces { } to force the outer match.'],
    ['Perl', 'All then/else clauses MUST be compound (braces) → no ambiguity possible.'],
    ['Ruby', 'Clauses are statement sequences closed by end → no ambiguity.'],
    ['Python', 'Indentation decides which if owns the else → no ambiguity (but mixing tabs/spaces is risky).'],
  ]
  return (
    <Frame title="How languages resolve nested if / dangling else">
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map(([l, d]) => (
          <div key={l} className="rounded-lg border bg-card p-3">
            <div className="text-sm font-semibold">{l}</div>
            <p className="mt-1 text-xs text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </Frame>
  )
}

/* ---------- Chapter 1: implementation methods ---------- */
export function ImplementationDiagram() {
  const items = [
    ['Compilation', 'Source → machine code once. Slow translation, FAST execution.', 'C, C++, Fortran, COBOL'],
    ['Pure interpretation', 'Interpreter decodes every statement each time. 10–100× slower, more space, great error messages.', 'JavaScript, PHP'],
    ['Hybrid', 'Source → intermediate code (e.g. byte code) → interpreted. Portable.', 'Java (JVM), Perl'],
    ['JIT', 'Hybrid + compile a subprogram to machine code the first time it is called; keep it.', 'Java, .NET (C#)'],
  ]
  return (
    <Frame title="Implementation methods">
      <div className="grid gap-2 sm:grid-cols-4">
        {items.map(([n, d, e]) => (
          <div key={n} className="rounded-lg border bg-card p-3">
            <div className="text-sm font-semibold">{n}</div>
            <p className="mt-1 text-xs">{d}</p>
            <p className="mt-2 text-xs text-muted-foreground">{e}</p>
          </div>
        ))}
      </div>
    </Frame>
  )
}

export function Timeline() {
  return (
    <Suspense fallback={<div className="my-5 h-64 animate-pulse rounded-xl bg-muted" />}>
      <LanguageTimeline />
    </Suspense>
  )
}

export const diagrams: Record<string, () => ReactNode> = {
  cons: ConsCells,
  tail: TailRecursion,
  recipe: ListRecipe,
  prologTree: PrologTree,
  chaining: ChainingDiagram,
  scope: ScopeDiagram,
  lifetime: LifetimeDiagram,
  union: UnionDiagram,
  params: ParamPassing,
  binding: BindingDiagram,
  coroutine: CoroutineDiagram,
  closure: ClosureDiagram,
  diamond: DiamondDiagram,
  danglingElse: DanglingElse,
  impl: ImplementationDiagram,
  timeline: Timeline,
}
