import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Eye, EyeOff, FlaskConical, Lightbulb, NotebookPen, Shapes, UserRound } from 'lucide-react'
import { codingQuestions } from '@/data/chapters'
import type { CodingQuestion } from '@/data/types'
import { useProgress } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Markdown } from '@/components/Markdown'
import { CodeBlock } from '@/components/CodeBlock'
import { RichMarkdown } from '@/components/Section'
import patternsMd from '@/content/patterns.md?raw'

type Lang = 'all' | 'scheme' | 'prolog'
const statusLabel = { todo: 'Not started', attempted: 'Attempted', solved: 'Solved' } as const

function Reveal({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border">
      <button className="flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold cursor-pointer hover:bg-muted/60" onClick={() => setOpen(!open)}>
        {icon} {label}
        <span className="ml-auto flex items-center gap-1 text-xs font-normal text-muted-foreground">
          {open ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />} {open ? 'hide' : 'show'}
        </span>
      </button>
      {open && <div className="border-t px-4 pb-4 pt-2">{children}</div>}
    </div>
  )
}

function Scratchpad({ q }: { q: CodingQuestion }) {
  const key = 'cos333-draft-' + q.id
  const [text, setText] = useState('')
  useEffect(() => {
    try {
      setText(localStorage.getItem(key) ?? '')
    } catch {
      setText('')
    }
  }, [key])
  return (
    <textarea
      value={text}
      onChange={(e) => {
        setText(e.target.value)
        try {
          localStorage.setItem(key, e.target.value)
        } catch {
          /* ignore */
        }
      }}
      spellCheck={false}
      placeholder={q.lang === 'scheme' ? '(define (' + q.name + ' lis)\n  (cond\n    ((null? lis) ...)' : q.name + '([], []).\n' + q.name + '([H|T], ...) :- ...'}
      className="h-48 w-full rounded-lg border bg-[#1e1f26] p-3 font-mono text-[0.82rem] text-zinc-100 outline-none focus:border-primary"
    />
  )
}

function Detail({ q }: { q: CodingQuestion }) {
  const [progress, update] = useProgress()
  const nav = useNavigate()
  const list = codingQuestions.filter((x) => x.lang === q.lang)
  const i = list.findIndex((x) => x.id === q.id)
  const status = progress.coding[q.id] ?? 'todo'
  const setStatus = (s: 'todo' | 'attempted' | 'solved') => update((p) => ({ ...p, coding: { ...p.coding, [q.id]: s } }))

  return (
    <div className="space-y-5" key={q.id}>
      <Button variant="ghost" size="sm" onClick={() => nav('/coding')}>
        <ArrowLeft /> All coding questions
      </Button>
      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge variant={q.lang === 'scheme' ? 'default' : 'outline'} className={q.lang === 'prolog' ? 'border-blue-500/40 text-blue-500' : ''}>
            {q.lang === 'scheme' ? 'Scheme · DrRacket' : 'Prolog · SWI-Prolog'}
          </Badge>
          <Badge variant={/20\d\d/.test(q.source) ? 'warning' : 'outline'}>{q.source}</Badge>
          <Badge variant="outline">pattern: {q.pattern}</Badge>
          {q.attempt && <Badge variant="danger">your attempt: {q.attempt.score}</Badge>}
        </div>
        <h1 className="mt-3 font-mono text-xl font-bold">{q.name}</h1>
        <div className="mt-3">
          <Markdown>{q.spec}</Markdown>
        </div>
        {q.facts && (
          <div className="mt-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Supplied facts</div>
            <CodeBlock code={q.facts} lang="prolog" />
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {(['todo', 'attempted', 'solved'] as const).map((s) => (
            <Button key={s} size="sm" variant={status === s ? (s === 'solved' ? 'success' : 'secondary') : 'outline'} onClick={() => setStatus(s)}>
              {statusLabel[s]}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <NotebookPen className="size-4" /> Your attempt (scratchpad — saved in this browser)
        </div>
        <Scratchpad q={q} />
        <p className="mt-2 text-xs text-muted-foreground">
          Write it here or in {q.lang === 'scheme' ? 'DrRacket' : 'SWI-Prolog'}, run the tests below, then compare with the model answer.
        </p>
      </Card>

      <div className="space-y-3">
        <Reveal label="Hint / method" icon={<Lightbulb className="size-4 text-warning" />}>
          <Markdown>{q.hint}</Markdown>
        </Reveal>
        <Reveal label="Model answer (tested in Racket / SWI-Prolog)" icon={<Eye className="size-4 text-success" />}>
          <CodeBlock code={q.solution} lang={q.lang} />
          <Markdown>{q.explanation}</Markdown>
        </Reveal>
        <Reveal label={`Test cases (${q.tests.length}) — run these yourself`} icon={<FlaskConical className="size-4 text-primary" />}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground">
                  <th className="py-1.5 pr-4">{q.lang === 'scheme' ? 'Application' : 'Query'}</th>
                  <th className="py-1.5">Expected</th>
                </tr>
              </thead>
              <tbody className="font-mono text-[0.8rem]">
                {q.tests.map((t) => (
                  <tr key={t.call} className="border-t align-top">
                    <td className="py-1.5 pr-4">{q.lang === 'prolog' ? `?- ${t.call}.` : t.call}</td>
                    <td className="py-1.5">
                      {t.expected.split(' | ').map((e, k) => (
                        <div key={k}>{e}{q.lang === 'prolog' && t.expected.includes(' | ') && k < t.expected.split(' | ').length - 1 ? ' ;' : ''}</div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {q.lang === 'prolog' && (
            <p className="mt-2 text-xs text-muted-foreground">
              Re-query with <code>;</code> (or <code>r</code>) after each answer: no other answers may appear. For family-style questions
              a valid answer may repeat (several proofs) — that's fine.
            </p>
          )}
        </Reveal>
        {q.attempt && (
          <Reveal label={`Review of your own submission (${q.attempt.score})`} icon={<UserRound className="size-4 text-danger" />}>
            <CodeBlock code={q.attempt.code} lang={q.lang} />
            <Markdown>{q.attempt.review}</Markdown>
          </Reveal>
        )}
      </div>

      <div className="flex justify-between">
        {i > 0 ? (
          <Button variant="outline" asChild>
            <Link to={`/coding/${list[i - 1].id}`}>
              <ArrowLeft /> {list[i - 1].name}
            </Link>
          </Button>
        ) : <span />}
        {i < list.length - 1 && (
          <Button variant="outline" asChild>
            <Link to={`/coding/${list[i + 1].id}`}>
              {list[i + 1].name} <ArrowRight />
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}

export default function CodingWorkbook() {
  const { qid } = useParams()
  const [lang, setLang] = useState<Lang>('all')
  const [progress] = useProgress()
  const q = codingQuestions.find((x) => x.id === qid)
  const shown = useMemo(() => codingQuestions.filter((x) => lang === 'all' || x.lang === lang), [lang])
  if (q) return <Detail q={q} />

  const solved = codingQuestions.filter((x) => progress.coding[x.id] === 'solved').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Scheme & Prolog workbook</h1>
        <p className="mt-1 text-muted-foreground">
          Every implementation question from the 2022–2026 exams, semester tests and Practicals 2–4, plus new practice. Each has a
          hint, a model answer tested in Racket / SWI-Prolog, and test cases. {solved}/{codingQuestions.length} solved.
        </p>
      </div>
      <Tabs defaultValue="questions">
        <TabsList>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="patterns">
            <Shapes /> Pattern cheat sheet
          </TabsTrigger>
        </TabsList>
        <TabsContent value="questions" className="space-y-4">
          <div className="flex gap-2">
            {(['all', 'scheme', 'prolog'] as Lang[]).map((l) => (
              <Button key={l} size="sm" variant={lang === l ? 'default' : 'outline'} onClick={() => setLang(l)}>
                {l === 'all' ? 'All' : l === 'scheme' ? 'Scheme' : 'Prolog'}
              </Button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {shown.map((x) => {
              const st = progress.coding[x.id] ?? 'todo'
              return (
                <Link key={x.id} to={`/coding/${x.id}`}>
                  <Card className="h-full p-4 transition hover:border-primary/50 hover:shadow-md">
                    <div className="flex items-center gap-2 text-xs">
                      <span className={cn('rounded px-1.5 py-0.5 font-semibold', x.lang === 'scheme' ? 'bg-violet-500/15 text-violet-500' : 'bg-blue-500/15 text-blue-500')}>
                        {x.lang === 'scheme' ? 'Scheme' : 'Prolog'}
                      </span>
                      <span className="text-muted-foreground">{x.source}</span>
                      <span className={cn('ml-auto', st === 'solved' ? 'text-success' : st === 'attempted' ? 'text-warning' : 'text-muted-foreground')}>
                        {statusLabel[st]}
                      </span>
                    </div>
                    <div className="mt-2 font-mono text-sm font-semibold">{x.name}</div>
                    <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                      <span>{x.pattern}</span>
                      {x.attempt && <span className="text-danger">· your attempt: {x.attempt.score}</span>}
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </TabsContent>
        <TabsContent value="patterns">
          <Card className="p-6">
            <RichMarkdown md={patternsMd} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
