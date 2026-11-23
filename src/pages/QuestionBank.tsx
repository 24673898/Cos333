import { useMemo, useState } from 'react'
import { Shuffle } from 'lucide-react'
import { chapters, questions } from '@/data/chapters'
import type { ChapterId } from '@/data/types'
import { useProgress } from '@/lib/store'
import { shuffle } from '@/lib/utils'
import { QuestionCard } from '@/components/QuestionCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

type Src = 'all' | 'past' | 'practice' | 'output'
type Status = 'all' | 'new' | 'wrong'

export default function QuestionBank() {
  const [progress] = useProgress()
  const [ch, setCh] = useState<ChapterId | 'all'>('all')
  const [src, setSrc] = useState<Src>('all')
  const [status, setStatus] = useState<Status>('all')
  const [order, setOrder] = useState<string[] | null>(null)
  const [limit, setLimit] = useState(15)

  const list = useMemo(() => {
    let qs = questions.filter(
      (q) =>
        (ch === 'all' || q.chapter === ch) &&
        (src === 'all' ||
          (src === 'past' && /^20\d\d/.test(q.source)) ||
          (src === 'practice' && !/^20\d\d/.test(q.source)) ||
          (src === 'output' && q.kind === 'fill')) &&
        (status === 'all' || (status === 'new' && !progress.mcq[q.id]) || (status === 'wrong' && progress.mcq[q.id] && !progress.mcq[q.id].correct)),
    )
    if (order) qs = [...qs].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id))
    return qs
    // progress intentionally excluded so answering doesn't reshuffle/remove the card you're on
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ch, src, status, order])

  const attempted = questions.filter((q) => progress.mcq[q.id])
  const correct = attempted.filter((q) => progress.mcq[q.id].correct).length

  const chip = (active: boolean) => (active ? 'default' : 'outline') as 'default' | 'outline'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Question bank</h1>
        <p className="mt-1 text-muted-foreground">
          {questions.length} questions in the exam's style — past-paper questions (with worked study answers) and new practice.
          Answered {attempted.length}, correct {correct}.
        </p>
      </div>
      <Card className="space-y-3 p-4 text-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="w-16 text-xs text-muted-foreground">Chapter</span>
          <Button size="sm" variant={chip(ch === 'all')} onClick={() => { setCh('all'); setLimit(15) }}>All</Button>
          {chapters.map((c) => (
            <Button key={c.id} size="sm" variant={chip(ch === c.id)} onClick={() => { setCh(c.id); setLimit(15) }}>
              {c.num}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="w-16 text-xs text-muted-foreground">Source</span>
          {([['all', 'All'], ['past', 'Past papers'], ['practice', 'New practice'], ['output', 'Output tracing']] as [Src, string][]).map(([v, l]) => (
            <Button key={v} size="sm" variant={chip(src === v)} onClick={() => setSrc(v)}>{l}</Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="w-16 text-xs text-muted-foreground">Status</span>
          {([['all', 'All'], ['new', 'Unanswered'], ['wrong', 'Got wrong']] as [Status, string][]).map(([v, l]) => (
            <Button key={v} size="sm" variant={chip(status === v)} onClick={() => setStatus(v)}>{l}</Button>
          ))}
          <Button size="sm" variant="ghost" className="ml-auto" onClick={() => setOrder(shuffle(questions.map((q) => q.id)))}>
            <Shuffle /> Shuffle
          </Button>
        </div>
      </Card>
      <p className="text-xs text-muted-foreground">
        Past-paper answers are study answers worked out from the slides and textbook. Where your marked 2026 paper confirms an answer, the
        explanation says so.
      </p>
      <div className="space-y-4">
        {list.slice(0, limit).map((q, i) => (
          <QuestionCard key={q.id + (order ? 's' : '')} q={q} index={i} />
        ))}
        {list.length === 0 && <p className="text-muted-foreground">No questions match these filters.</p>}
      </div>
      {list.length > limit && (
        <div className="text-center">
          <Button variant="outline" onClick={() => setLimit(limit + 15)}>
            Show more ({list.length - limit} left)
          </Button>
        </div>
      )}
    </div>
  )
}
