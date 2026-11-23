import { Link } from 'react-router-dom'
import { chapters } from '@/data/chapters'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Markdown } from '@/components/Markdown'

const schemeRules = `
| Category | Allowed |
|---|---|
| Function construction | \`lambda\`, \`define\` |
| Binding | \`let\` only — **not** \`let*\` or a named \`let\` |
| Arithmetic | \`+ - * / abs sqrt remainder modulo min max\` |
| Booleans | \`#t\`, \`#f\` |
| Equality predicates | \`= > < >= <= even? odd? zero? positive? negative? eqv? eq?\` |
| Logical | \`and or not\` |
| List predicates | \`list? null?\` |
| Conditionals | \`if cond else\` |
| Quoting / evaluation | \`quote\`, \`'\`, \`eval\` |
| List manipulation | \`list car cdr cons\` |
| I/O | \`display printf newline read\` |

- Use **DrRacket**; start the file with \`#lang racket\`; built-in names are **lowercase**.
- Helper functions are allowed.
- Using anything else (e.g. \`append\`, \`length\`, \`filter\`, \`map\`, \`let*\`) = **zero for the question**.
- **Read the list on the paper** — the 2025 exam list didn't include \`positive?\`. Use \`(> x 0)\` if it's missing.
`

const prologRules = `
- Use **SWI-Prolog**; consult your file and test interactively.
- Allowed: simple constants, variables, list manipulation (\`[H|T]\`), arithmetic and relational expressions (\`+ - * / < > =< >= =\`), the **\`is\`** operator, **cuts** (\`!\`) and the built-in **\`not\`**.
- **Not allowed:** if-then / if-then-else (\`->\`), the \`;\` "or" operator, \`|\` outside a list, and **every** other built-in predicate — including \`member\`, \`append\`, \`reverse\`, \`abs\`, \`length\`, \`sum_list\`, \`\\=\`. Write your own (rename them, e.g. \`myAppend\`).
- Helper propositions are allowed.
- Test with variables (\`?- p([1, 0, -2], X).\`) and **re-query** (press \`;\` or \`r\`) until \`false\` — **no invalid instantiations** may appear.
- Breaking the rules = **all marks for the question forfeited**.
`

const marking = `
- Both implementation questions are **marked by functionality tests**. A function that works for *some* cases beats one that attempts everything but crashes.
- Test **edge cases**: the empty list, a single element, all-matching, none-matching, negatives, zeros — not just the examples in the question.
- Name the function/proposition **exactly** as given and submit to the right upload slot (\`u99999999.scm\` / \`u99999999.pl\`). Check your upload preview.
- During the exam you may consult the Practical 2–4 specs and the MIT Scheme / SWI-Prolog manuals — for quick reference only.
`

const approach = `
1. **Do the two implementation questions early** while you're fresh (10/40 marks), then the theory. Budget ~30 minutes each.
2. For "select the most correct" questions, map each option to an evaluation criterion (readability, writability, reliability, cost, orthogonality). Usually exactly one statement is *true for the reason given*.
3. For output questions (closures, coroutines, binding, Ruby \`yield\`) **trace on paper** — write down each variable binding / bookmark. Type the output exactly (single spaces, no quotes).
4. Scenario questions ("a manager…", "a junior programmer…") need the reason that fits *that person*.
`

export default function ExamGuide() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Exam guide & rules</h1>
        <p className="mt-1 text-muted-foreground">
          From the lecturer's scope document, the 2026 exam paper and the practical specifications. The exam covers <b>all</b> semester
          material, including both semester tests' scope.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['~30 marks', 'Theory: multiple choice, output fill-ins, select-all-that-apply'],
          ['5 marks', 'One Scheme list-processing function (DrRacket)'],
          ['5 marks', 'One Prolog list-processing proposition (SWI-Prolog)'],
        ].map(([m, d]) => (
          <Card key={d} className="p-4">
            <div className="text-2xl font-extrabold text-primary">{m}</div>
            <div className="mt-1 text-sm text-muted-foreground">{d}</div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="mb-2 text-lg font-bold">How the code questions are marked</h2>
        <Markdown>{marking}</Markdown>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-2 flex items-center gap-2 text-lg font-bold">
            Scheme rules <Badge>Ch 15 · Practical 2</Badge>
          </h2>
          <Markdown>{schemeRules}</Markdown>
        </Card>
        <Card className="p-6">
          <h2 className="mb-2 flex items-center gap-2 text-lg font-bold">
            Prolog rules <Badge>Ch 16 · Practicals 3 & 4</Badge>
          </h2>
          <Markdown>{prologRules}</Markdown>
          <p className="mt-3 text-sm">
            Practise every past question in the <Link to="/coding" className="text-primary underline">Scheme & Prolog workbook</Link>.
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="mb-2 text-lg font-bold">Exam-day approach</h2>
        <Markdown>{approach}</Markdown>
      </Card>

      <Card className="p-6">
        <h2 className="mb-3 text-lg font-bold">Scope at a glance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr>
                <th className="py-2 pr-3">Chapter</th>
                <th className="py-2 pr-3">Weight</th>
                <th className="py-2 pr-3">Focus</th>
                <th className="py-2">Leave out</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map((c) => (
                <tr key={c.id} className="border-t align-top">
                  <td className="py-2 pr-3">
                    <Link to={`/chapter/${c.id}`} className="font-medium hover:text-primary">
                      {c.num}. {c.title}
                    </Link>
                  </td>
                  <td className="py-2 pr-3">
                    <Badge variant={c.weight === 'Very important' ? 'warning' : 'outline'}>{c.weight}</Badge>
                  </td>
                  <td className="py-2 pr-3 text-xs">{c.scope.in.join(' · ')}</td>
                  <td className="py-2 text-xs text-muted-foreground">{c.scope.out.join(' · ') || '—'}</td>
                </tr>
              ))}
              <tr className="border-t align-top">
                <td className="py-2 pr-3 font-medium">11. Abstract Data Types</td>
                <td className="py-2 pr-3"><Badge variant="outline">Not directly examinable</Badge></td>
                <td className="py-2 pr-3 text-xs" colSpan={2}>Read it if Chapter 12 terms are unclear (key terms are on slide 4 of Ch 12 Part 1).</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          The textbook covers material the slides don't (and vice versa) — the lecturer says to study both, and to learn the textbook's
          terminology precisely. Many slides have extra speaker notes in the PowerPoint files.
        </p>
      </Card>
    </div>
  )
}
