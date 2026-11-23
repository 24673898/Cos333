import { Link } from 'react-router-dom'
import { Printer } from 'lucide-react'
import { chapters } from '@/data/chapters'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RichMarkdown } from '@/components/Section'
import { useProgress } from '@/lib/store'

export default function BriefRevision() {
  const [progress, update] = useProgress()
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Brief revision — every chapter</h1>
          <p className="mt-1 text-muted-foreground">One page per chapter for the day before. Open a chapter for the in-depth notes.</p>
        </div>
        <Button variant="outline" onClick={() => window.print()} className="no-print">
          <Printer /> Print
        </Button>
      </div>
      <div className="no-print flex flex-wrap gap-1.5">
        {chapters.map((c) => (
          <a key={c.id} href={`#/brief`} onClick={(e) => { e.preventDefault(); document.getElementById('brief-' + c.id)?.scrollIntoView({ behavior: 'smooth' }) }}
            className="rounded-md border px-2 py-1 text-xs font-medium hover:bg-muted" style={{ color: c.hex, borderColor: c.hex + '55' }}>
            Ch {c.num}
          </a>
        ))}
      </div>
      {chapters.map((c) => (
        <Card key={c.id} id={'brief-' + c.id} className="scroll-mt-20 overflow-hidden break-inside-avoid">
          <div className={`flex flex-wrap items-center justify-between gap-2 bg-gradient-to-r ${c.color} px-5 py-3 text-white`}>
            <h2 className="font-bold">
              Chapter {c.num} · {c.title}
            </h2>
            <div className="no-print flex items-center gap-2">
              <button
                className="rounded-md bg-white/20 px-2 py-0.5 text-xs cursor-pointer"
                onClick={() => update((p) => ({ ...p, briefDone: { ...p.briefDone, [c.id]: !p.briefDone[c.id] } }))}
              >
                {progress.briefDone[c.id] ? 'Reviewed ✓' : 'Mark reviewed'}
              </button>
              <Link to={`/chapter/${c.id}`} className="rounded-md bg-white/20 px-2 py-0.5 text-xs">
                Full notes →
              </Link>
            </div>
          </div>
          <div className="p-5">
            <RichMarkdown md={c.brief} />
          </div>
        </Card>
      ))}
    </div>
  )
}
