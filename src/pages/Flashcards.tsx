import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, RotateCcw, Shuffle } from 'lucide-react'
import { chapterById, chapters, flashcards } from '@/data/chapters'
import type { ChapterId } from '@/data/types'
import { useProgress } from '@/lib/store'
import { cn, shuffle } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Markdown } from '@/components/Markdown'
import { Progress } from '@/components/ui/progress'

export default function Flashcards() {
  const [progress, update] = useProgress()
  const [sel, setSel] = useState<ChapterId[]>([])
  const [hideKnown, setHideKnown] = useState(false)
  const [seed, setSeed] = useState(0)
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const deck = useMemo(() => {
    const d = flashcards.filter((f) => (sel.length === 0 || sel.includes(f.chapter)) && !(hideKnown && progress.cardsKnown[f.id]))
    return seed ? shuffle(d) : d
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel, hideKnown, seed])
  const card = deck[Math.min(i, deck.length - 1)]
  const known = deck.filter((f) => progress.cardsKnown[f.id]).length

  const go = (d: number) => {
    setFlipped(false)
    setI((x) => (deck.length ? (x + d + deck.length) % deck.length : 0))
  }
  const toggle = (id: ChapterId) => {
    setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
    setI(0)
    setFlipped(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Flashcards</h1>
        <p className="mt-1 text-muted-foreground">Tap the card to flip it. Pick chapters to focus on, shuffle, and mark the ones you know.</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Button size="sm" variant={sel.length === 0 ? 'default' : 'outline'} onClick={() => { setSel([]); setI(0) }}>All chapters</Button>
        {chapters.map((c) => (
          <Button key={c.id} size="sm" variant={sel.includes(c.id) ? 'default' : 'outline'} onClick={() => toggle(c.id)}>
            Ch {c.num}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Button size="sm" variant="ghost" onClick={() => { setSeed(seed + 1); setI(0); setFlipped(false) }}><Shuffle /> Shuffle</Button>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={hideKnown} onChange={(e) => { setHideKnown(e.target.checked); setI(0) }} /> Hide cards I know
        </label>
        <span className="ml-auto text-muted-foreground">{known}/{deck.length} known</span>
      </div>
      <Progress value={deck.length ? (known / deck.length) * 100 : 0} />

      {card ? (
        <>
          <div className="flip mx-auto max-w-2xl cursor-pointer select-none" onClick={() => setFlipped(!flipped)}>
            <div className={cn('flip-inner min-h-64', flipped && 'flipped')}>
              <div className="flip-face flex min-h-64 flex-col rounded-2xl border bg-card p-7 shadow-sm">
                <div className="text-xs font-semibold" style={{ color: chapterById[card.chapter].hex }}>
                  Ch {chapterById[card.chapter].num} · {chapterById[card.chapter].title}
                </div>
                <div className="flex flex-1 items-center justify-center text-center text-lg font-semibold">
                  <Markdown>{card.front}</Markdown>
                </div>
                <div className="text-center text-xs text-muted-foreground">tap to flip</div>
              </div>
              <div className="flip-face flip-back flex min-h-64 flex-col rounded-2xl border border-primary/50 bg-accent/40 p-7 shadow-sm">
                <div className="text-xs font-semibold text-muted-foreground">Answer</div>
                <div className="flex flex-1 items-center justify-center text-center">
                  <Markdown>{card.back}</Markdown>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="icon" onClick={() => go(-1)} aria-label="Previous"><ArrowLeft /></Button>
            <span className="w-20 text-center text-sm text-muted-foreground">{Math.min(i, deck.length - 1) + 1} / {deck.length}</span>
            <Button variant="outline" size="icon" onClick={() => go(1)} aria-label="Next"><ArrowRight /></Button>
            <Button
              variant={progress.cardsKnown[card.id] ? 'success' : 'secondary'}
              onClick={() => {
                update((p) => ({ ...p, cardsKnown: { ...p.cardsKnown, [card.id]: !p.cardsKnown[card.id] } }))
                if (!progress.cardsKnown[card.id]) go(1)
              }}
            >
              {progress.cardsKnown[card.id] ? <><RotateCcw /> Unmark</> : <><Check /> I know this</>}
            </Button>
          </div>
        </>
      ) : (
        <p className="text-center text-muted-foreground">No cards left — untick "Hide cards I know" to review them again.</p>
      )}
    </div>
  )
}
