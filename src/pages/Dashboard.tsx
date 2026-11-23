import { Link } from 'react-router-dom'
import Chart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'
import { ArrowRight, Code2, Layers, ListChecks, ScrollText, Timer, Zap } from 'lucide-react'
import { chapters, codingQuestions, flashcards, questions } from '@/data/chapters'
import { useProgress, useTheme } from '@/lib/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

const quick = [
  { to: '/coding', label: 'Scheme & Prolog workbook', icon: Code2 },
  { to: '/brief', label: 'Brief revision · all chapters', icon: Zap },
  { to: '/questions', label: 'Question bank', icon: ListChecks },
  { to: '/mock', label: 'Mock exam (2026 format)', icon: Timer },
  { to: '/flashcards', label: 'Flashcards', icon: Layers },
  { to: '/exam-guide', label: 'Exam rules & allowed functions', icon: ScrollText },
]

const groups = [
  { title: 'Foundations', desc: 'How to judge a language, and where today’s languages came from.', ids: ['ch01', 'ch02'] },
  { title: 'Imperative building blocks', desc: 'Variables → types → expressions → control flow.', ids: ['ch05', 'ch06', 'ch07', 'ch08'] },
  { title: 'Abstraction', desc: 'Process abstraction (subprograms) and data abstraction (OOP).', ids: ['ch09', 'ch12'] },
  { title: 'Other paradigms + coding', desc: 'Functional (Scheme) and logic (Prolog) — one implementation question each.', ids: ['ch15', 'ch16'] },
]

export default function Dashboard() {
  const [progress] = useProgress()
  const [dark] = useTheme()

  const studied = chapters.filter((c) => progress.studied[c.id]).length
  const attempted = questions.filter((q) => progress.mcq[q.id])
  const right = attempted.filter((q) => progress.mcq[q.id].correct).length
  const solved = codingQuestions.filter((q) => progress.coding[q.id] === 'solved').length
  const known = flashcards.filter((f) => progress.cardsKnown[f.id]).length

  const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0)
  const radial: ApexOptions = {
    chart: { type: 'radialBar', background: 'transparent', fontFamily: 'inherit' },
    theme: { mode: dark ? 'dark' : 'light' },
    colors: ['#8b5cf6', '#10b981', '#f59e0b', '#3b82f6'],
    labels: ['Chapters studied', 'Questions correct', 'Coding solved', 'Cards known'],
    plotOptions: {
      radialBar: {
        hollow: { size: '28%' },
        track: { background: dark ? '#2a2a35' : '#ececf3' },
        dataLabels: { name: { fontSize: '12px' }, value: { fontSize: '14px' }, total: { show: true, label: 'Overall', formatter: (w) => Math.round(w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0) / 4) + '%' } },
      },
    },
    legend: { show: true, position: 'bottom', fontSize: '12px' },
  }
  const radialSeries = [
    pct(studied, chapters.length),
    pct(right, questions.length),
    pct(solved, codingQuestions.length),
    pct(known, flashcards.length),
  ]

  const patterns = Object.entries(
    codingQuestions
      .filter((q) => /20\d\d/.test(q.source))
      .reduce<Record<string, number>>((acc, q) => {
        const key = q.pattern.replace(/ with a parameter/, '')
        acc[key] = (acc[key] ?? 0) + 1
        return acc
      }, {}),
  ).sort((a, b) => b[1] - a[1])
  const bar: ApexOptions = {
    chart: { type: 'bar', toolbar: { show: false }, animations: { enabled: false }, background: 'transparent', fontFamily: 'inherit' },
    theme: { mode: dark ? 'dark' : 'light' },
    colors: ['#8b5cf6'],
    plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '60%' } },
    xaxis: { categories: patterns.map((p) => p[0]), tickAmount: 4 },
    grid: { borderColor: dark ? '#333' : '#e5e7eb' },
    dataLabels: { enabled: false },
    tooltip: { y: { formatter: (v) => `${v} past test/exam questions` } },
  }

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-fuchsia-600 p-7 text-white shadow-lg sm:p-9">
        <div className="text-xs font-semibold uppercase tracking-widest text-white/75">COS 333 · Programming Languages · University of Pretoria</div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Your exam study hub λ</h1>
        <p className="mt-3 max-w-2xl text-white/85">
          In-depth and brief summaries for all ten examinable chapters, a tested Scheme & Prolog workbook built from every past
          paper, a question bank, flashcards and a mock exam in the 2026 format.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {quick.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm transition hover:bg-white"
            >
              <Icon className="size-4" /> {label}
            </Link>
          ))}
        </div>
        <div className="pointer-events-none absolute -right-6 -top-10 font-mono text-[11rem] font-black leading-none text-white/10">(λ)</div>
      </section>

      <section className="grid gap-4 md:grid-cols-5">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Exam format (as in 2026)</CardTitle>
            <CardDescription>Closed book, online, 3 hours, 40 marks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
              <span>~30 theory items (MCQ, output fill-ins, select-all)</span>
              <Badge className="shrink-0 whitespace-nowrap">1 mark each</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
              <span>Scheme list-processing function (DrRacket)</span>
              <Badge className="shrink-0 whitespace-nowrap">5 marks</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
              <span>Prolog list-processing proposition (SWI-Prolog)</span>
              <Badge className="shrink-0 whitespace-nowrap">5 marks</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Code is marked by functionality tests: code that works for some cases beats code that crashes for all of them.
            </p>
            <Link to="/exam-guide" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              Rules & allowed functions <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>
        <Card className="md:col-span-3">
          <CardHeader className="pb-0">
            <CardTitle>Your progress</CardTitle>
            <CardDescription>Saved in this browser</CardDescription>
          </CardHeader>
          <CardContent>
            <Chart options={radial} series={radialSeries} type="radialBar" height={290} />
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-bold">How the chapters fit together</h2>
        <p className="mt-1 text-sm text-muted-foreground">Study top to bottom; the coding questions come from the last group.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {groups.map((g, gi) => (
            <Card key={g.title} className="p-4">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-primary">{gi + 1}</span>
                <h3 className="font-semibold">{g.title}</h3>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{g.desc}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {g.ids.map((id) => {
                  const c = chapters.find((x) => x.id === id)!
                  return (
                    <Link
                      key={id}
                      to={`/chapter/${id}`}
                      className="rounded-md border px-2 py-1 text-xs font-medium hover:bg-muted"
                      style={{ borderColor: c.hex + '66', color: c.hex }}
                    >
                      Ch {c.num} · {c.title.split(' —')[0]}
                    </Link>
                  )
                })}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-5">
        <Card className="md:col-span-3">
          <CardHeader className="pb-0">
            <CardTitle>What the implementation questions look like</CardTitle>
            <CardDescription>Past Scheme & Prolog questions (2022–2026) grouped by pattern</CardDescription>
          </CardHeader>
          <CardContent>
            <Chart options={bar} series={[{ name: 'Questions', data: patterns.map((p) => p[1]) }]} type="bar" height={280} />
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Repeated every year</CardTitle>
            <CardDescription>Patterns to have on autopilot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5 text-sm">
            {[
              ['Scheme: keep / change / drop list elements by sign or parity', '2022–2026 exams'],
              ['Prolog: the same, with guarded rules', '2023–2026 exams, every ST2'],
              ['Prolog family relations (parent → sibling → …)', 'ST2 2022, 2023, 2025'],
              ['Scheme formula with let (volume / area)', 'every ST1 2022–2026'],
              ['Output tracing: Ruby yield, closures, coroutines, binding', '2026 exam'],
            ].map(([t, y]) => (
              <div key={t} className="rounded-lg border p-2.5">
                <div className="font-medium">{t}</div>
                <div className="text-xs text-muted-foreground">{y}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-bold">Chapters</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {chapters.map((c) => {
            const qs = questions.filter((q) => q.chapter === c.id)
            const done = qs.filter((q) => progress.mcq[q.id]?.correct).length
            return (
              <Link key={c.id} to={`/chapter/${c.id}`}>
                <Card className="h-full p-4 transition hover:border-primary/50 hover:shadow-md">
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} text-sm font-bold text-white`}
                    >
                      {c.num}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold leading-tight">{c.title}</h3>
                        {c.weight === 'Very important' && <Badge variant="warning">Very important</Badge>}
                        {progress.studied[c.id] && <Badge variant="success">Studied</Badge>}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{c.tagline}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <Progress value={qs.length ? (done / qs.length) * 100 : 0} className="h-1.5" />
                        <span className="shrink-0">
                          {done}/{qs.length} Qs
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
