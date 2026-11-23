import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, RefreshCw, Send } from 'lucide-react'
import { codingQuestions, questions } from '@/data/chapters'
import type { ChapterId, CodingQuestion, Question } from '@/data/types'
import { isCorrect } from '@/lib/check'
import { useProgress } from '@/lib/store'
import { QuestionCard } from '@/components/QuestionCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Markdown } from '@/components/Markdown'

// 30 theory marks, spread like the 2026 paper (heavier on Ch 7–9), + 5 Scheme + 5 Prolog = 40
const blueprint: [ChapterId, number][] = [
  ['ch01', 3], ['ch02', 3], ['ch05', 3], ['ch06', 3], ['ch07', 4],
  ['ch08', 4], ['ch09', 5], ['ch12', 2], ['ch15', 2], ['ch16', 1],
]
const DURATION = 3 * 60 * 60 * 1000

// small deterministic PRNG so a paper can be restored from its seed
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}
function pick<T>(arr: T[], n: number, r: () => number): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a.slice(0, n)
}

function buildPaper(seed: number) {
  const r = rng(seed)
  const theory: Question[] = blueprint.flatMap(([ch, n]) => pick(questions.filter((q) => q.chapter === ch), n, r))
  const listQ = (lang: 'scheme' | 'prolog') =>
    codingQuestions.filter((q) => q.lang === lang && !q.facts && !/let|core/.test(q.pattern) && q.name !== 'computersConnected')
  const scheme = pick(listQ('scheme'), 1, r)[0]
  const prolog = pick(listQ('prolog'), 1, r)[0]
  return { theory, scheme, prolog }
}

const KEY = 'cos333-mock-v1'
interface Saved { seed: number; start: number; answers: Record<string, string>; submitted: boolean; self: { scheme: number; prolog: number } }

function load(): Saved | null {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? 'null')
  } catch {
    return null
  }
}

function CodingTask({ q, n, revealed, score, setScore }: { q: CodingQuestion; n: number; revealed: boolean; score: number; setScore: (v: number) => void }) {
  return (
    <Card className="p-5">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-mono font-semibold text-muted-foreground">Q{n}</span>
        <Badge>{q.lang === 'scheme' ? 'Scheme implementation · 5 marks' : 'Prolog implementation · 5 marks'}</Badge>
        <Badge variant="outline">{q.source}</Badge>
      </div>
      <h3 className="font-mono font-semibold">{q.name}</h3>
      <Markdown>{q.spec}</Markdown>
      <p className="mt-2 text-xs text-muted-foreground">
        Write and test it in {q.lang === 'scheme' ? 'DrRacket' : 'SWI-Prolog'} under exam rules. After submitting, run the test cases and mark yourself.
      </p>
      {revealed && (
        <div className="mt-3 space-y-2 rounded-lg border p-3">
          <div className="text-sm font-semibold">Self-mark: run these tests against your code</div>
          <ul className="font-mono text-xs">
            {q.tests.map((t) => (
              <li key={t.call}>{q.lang === 'prolog' ? `?- ${t.call}.` : t.call} → {t.expected.replaceAll(' | ', ' ; ')}</li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs text-muted-foreground">Your mark:</span>
            {[0, 1, 2, 3, 4, 5].map((v) => (
              <Button key={v} size="sm" variant={score === v ? 'default' : 'outline'} onClick={() => setScore(v)}>{v}</Button>
            ))}
          </div>
          <Link to={`/coding/${q.id}`} className="text-sm text-primary underline">Open model answer in the workbook →</Link>
        </div>
      )}
    </Card>
  )
}

export default function MockExam() {
  const [state, setState] = useState<Saved | null>(load)
  const [now, setNow] = useState(Date.now())
  const [, update] = useProgress()
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  const paper = useMemo(() => (state ? buildPaper(state.seed) : null), [state?.seed])

  const start = () => setState({ seed: Math.floor(Math.random() * 1e9), start: Date.now(), answers: {}, submitted: false, self: { scheme: 0, prolog: 0 } })

  if (!state || !paper) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-extrabold tracking-tight">Mock exam</h1>
        <Card className="space-y-3 p-6">
          <p>A full paper in the <b>2026 exam format</b>: 30 one-mark theory items drawn from all ten chapters, plus one Scheme and one Prolog list-processing implementation (5 marks each) — 40 marks, 3 hours.</p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>No feedback until you submit — like the real exam.</li>
            <li>Theory is marked automatically; you self-mark the code with the test cases provided.</li>
            <li>Your answers and timer are saved in this browser, so you can close the tab and continue.</li>
          </ul>
          <Button onClick={start}>Start a new paper</Button>
        </Card>
      </div>
    )
  }

  const left = Math.max(0, state.start + DURATION - now)
  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000)
    return `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  }
  const theoryScore = paper.theory.filter((q) => isCorrect(q, state.answers[q.id])).length
  const total = theoryScore + state.self.scheme + state.self.prolog
  const answered = paper.theory.filter((q) => state.answers[q.id]).length

  const submit = () => {
    setState({ ...state, submitted: true })
    update((p) => ({
      ...p,
      mcq: {
        ...p.mcq,
        ...Object.fromEntries(paper.theory.filter((q) => state.answers[q.id]).map((q) => [q.id, { correct: isCorrect(q, state.answers[q.id]), at: Date.now() }])),
      },
    }))
    window.scrollTo(0, 0)
  }

  return (
    <div className="space-y-5">
      <div className="sticky top-14 z-10 -mx-4 flex flex-wrap items-center gap-3 border-b bg-background/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <h1 className="text-lg font-bold">Mock exam</h1>
        {!state.submitted ? (
          <>
            <span className="flex items-center gap-1.5 font-mono text-sm"><Clock className="size-4" /> {fmt(left)}</span>
            <span className="text-sm text-muted-foreground">{answered}/{paper.theory.length} theory answered</span>
            <Button className="ml-auto" size="sm" onClick={submit}><Send /> Submit</Button>
          </>
        ) : (
          <>
            <Badge variant="success" className="text-sm">Theory {theoryScore}/30</Badge>
            <Badge className="text-sm">Total {total}/40 ({Math.round((total / 40) * 100)}%)</Badge>
            <Button className="ml-auto" size="sm" variant="outline" onClick={start}><RefreshCw /> New paper</Button>
          </>
        )}
      </div>
      {state.submitted && (
        <Card className="p-4 text-sm">
          Wrong answers are highlighted below with explanations. Self-mark the two implementation questions at the end to complete your total. Missed
          questions also show up under <Link to="/questions" className="text-primary underline">Question bank → Got wrong</Link>.
        </Card>
      )}
      {paper.theory.map((q, i) => (
        <QuestionCard
          key={q.id}
          q={q}
          index={i}
          exam={{
            value: state.answers[q.id],
            revealed: state.submitted,
            onChange: (v) => setState((s) => (s ? { ...s, answers: { ...s.answers, [q.id]: v } } : s)),
          }}
        />
      ))}
      <CodingTask q={paper.scheme} n={31} revealed={state.submitted} score={state.self.scheme} setScore={(v) => setState({ ...state, self: { ...state.self, scheme: v } })} />
      <CodingTask q={paper.prolog} n={32} revealed={state.submitted} score={state.self.prolog} setScore={(v) => setState({ ...state, self: { ...state.self, prolog: v } })} />
      {!state.submitted && (
        <div className="text-center">
          <Button size="lg" onClick={submit}><Send /> Submit paper</Button>
        </div>
      )}
    </div>
  )
}
