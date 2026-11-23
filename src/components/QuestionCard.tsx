import { useState } from 'react'
import { CheckCircle2, Circle, CircleCheck, CircleX, Square, SquareCheck } from 'lucide-react'
import type { Question } from '@/data/types'
import { chapterById } from '@/data/chapters'
import { Markdown } from './Markdown'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { answerText, isCorrect } from '@/lib/check'
import { useProgress } from '@/lib/store'
import { cn } from '@/lib/utils'

interface Props {
  q: Question
  index?: number
  /** exam mode: no feedback until `revealed`; value is controlled by the parent */
  exam?: { value?: string; onChange: (v: string) => void; revealed: boolean }
}

export function QuestionCard({ q, index, exam }: Props) {
  const [local, setLocal] = useState<string>('')
  const [submitted, setSubmitted] = useState(false)
  const [progress, update] = useProgress()
  const value = exam ? exam.value ?? '' : local
  const showResult = exam ? exam.revealed : submitted
  const correct = isCorrect(q, value)
  const ch = chapterById[q.chapter]
  const last = progress.mcq[q.id]

  const set = (v: string) => (exam ? exam.onChange(v) : setLocal(v))

  const submit = (v = value) => {
    if (exam || !v) return
    setSubmitted(true)
    const ok = isCorrect(q, v)
    update((p) => ({ ...p, mcq: { ...p.mcq, [q.id]: { correct: ok, at: Date.now() } } }))
  }

  const pickOption = (i: number) => {
    if (showResult) return
    if (q.kind === 'multi') {
      const cur = new Set(value.split(',').filter(Boolean).map(Number))
      if (cur.has(i)) cur.delete(i)
      else cur.add(i)
      set([...cur].sort().join(','))
    } else {
      set(String(i))
      if (!exam) submit(String(i))
    }
  }

  return (
    <Card className="p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        {index !== undefined && <span className="font-mono font-semibold text-muted-foreground">Q{index + 1}</span>}
        <Badge style={{ background: ch.hex + '22', color: ch.hex }}>Ch {ch.num}</Badge>
        <Badge variant="outline">{q.kind === 'fill' ? 'Fill in the output' : q.kind === 'multi' ? 'Select all that apply' : 'Multiple choice'}</Badge>
        <Badge variant={q.source.startsWith('20') ? 'warning' : 'outline'}>{q.source}</Badge>
        {!exam && last && (
          <span className={cn('ml-auto', last.correct ? 'text-success' : 'text-danger')}>
            last attempt: {last.correct ? 'correct' : 'wrong'}
          </span>
        )}
      </div>
      <Markdown>{q.prompt}</Markdown>

      {q.options && (
        <div className="mt-3 flex flex-col gap-2">
          {q.options.map((opt, i) => {
            const selected = q.kind === 'multi' ? value.split(',').includes(String(i)) : value === String(i)
            const isAns = q.kind === 'multi' ? (q.answer as number[]).includes(i) : q.answer === i
            const Icon = q.kind === 'multi' ? (selected ? SquareCheck : Square) : selected ? CircleCheck : Circle
            return (
              <button
                key={i}
                onClick={() => pickOption(i)}
                className={cn(
                  'flex items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors cursor-pointer',
                  !showResult && 'hover:border-primary/60 hover:bg-accent/40',
                  !showResult && selected && 'border-primary bg-accent/50',
                  showResult && isAns && 'border-success bg-success/10',
                  showResult && selected && !isAns && 'border-danger bg-danger/10',
                )}
              >
                <Icon className={cn('mt-0.5 size-4 shrink-0', selected ? 'text-primary' : 'text-muted-foreground')} />
                <span className="[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.85em]">
                  <Markdown className="[&_p]:m-0">{opt}</Markdown>
                </span>
              </button>
            )
          })}
        </div>
      )}

      {q.kind === 'fill' && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Output:</span>
          <input
            value={value}
            disabled={showResult}
            onChange={(e) => set(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="type the exact output"
            className="h-9 min-w-56 flex-1 rounded-lg border bg-background px-3 font-mono text-sm outline-none focus:border-primary"
          />
          {!exam && !showResult && (
            <Button size="sm" onClick={() => submit()} disabled={!value}>
              Check
            </Button>
          )}
        </div>
      )}
      {q.kind === 'multi' && !exam && !showResult && (
        <Button className="mt-3" size="sm" onClick={() => submit()} disabled={!value}>
          Check
        </Button>
      )}

      {showResult && (
        <div className={cn('mt-4 rounded-lg border p-3 text-sm', correct ? 'border-success/40 bg-success/5' : 'border-danger/40 bg-danger/5')}>
          <div className={cn('mb-1 flex items-center gap-1.5 font-semibold', correct ? 'text-success' : 'text-danger')}>
            {correct ? <CheckCircle2 className="size-4" /> : <CircleX className="size-4" />}
            {correct ? 'Correct' : value ? 'Not quite' : 'Not answered'}
          </div>
          {!correct && (
            <p className="mb-1">
              Answer: <span className="font-mono font-medium">{answerText(q)}</span>
            </p>
          )}
          {q.explanation && <Markdown className="text-[0.88rem]">{q.explanation}</Markdown>}
        </div>
      )}
      {!exam && showResult && (
        <button className="mt-2 text-xs text-muted-foreground underline cursor-pointer" onClick={() => { setSubmitted(false); setLocal('') }}>
          Try again
        </button>
      )}
    </Card>
  )
}
