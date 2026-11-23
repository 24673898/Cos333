import { Link, useParams } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Circle, ListChecks, Target, Zap } from 'lucide-react'
import { chapterById, chapters, questions } from '@/data/chapters'
import type { ChapterId } from '@/data/types'
import { useProgress } from '@/lib/store'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Markdown } from '@/components/Markdown'
import { RichMarkdown, slug } from '@/components/Section'
import { QuestionCard } from '@/components/QuestionCard'

export default function ChapterPage() {
  const { id } = useParams()
  const c = chapterById[id as ChapterId] ?? chapters[0]
  const [progress, update] = useProgress()
  const idx = chapters.findIndex((x) => x.id === c.id)
  const prev = chapters[idx - 1]
  const next = chapters[idx + 1]
  const qs = questions.filter((q) => q.chapter === c.id)
  const studied = !!progress.studied[c.id]

  return (
    <div className="space-y-6">
      <section className={`rounded-2xl bg-gradient-to-br ${c.color} p-6 text-white shadow-md sm:p-8`}>
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <span className="rounded-full bg-white/20 px-2.5 py-0.5">Chapter {c.num}</span>
          <span className="rounded-full bg-white/20 px-2.5 py-0.5">{c.weight}</span>
          <span className="rounded-full bg-white/20 px-2.5 py-0.5">{qs.length} practice questions</span>
        </div>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">{c.title}</h1>
        <p className="mt-2 text-white/85">{c.tagline}</p>
        <button
          onClick={() => update((p) => ({ ...p, studied: { ...p.studied, [c.id]: !studied } }))}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-900 cursor-pointer"
        >
          {studied ? <CheckCircle2 className="size-4 text-emerald-600" /> : <Circle className="size-4" />}
          {studied ? 'Studied' : 'Mark as studied'}
        </button>
      </section>

      <Card className="grid gap-4 p-5 sm:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-success">
            <Target className="size-4" /> In the exam scope
          </div>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {c.scope.in.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-danger">
            <AlertTriangle className="size-4" /> Not examinable
          </div>
          {c.scope.out.length ? (
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {c.scope.out.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Nothing excluded — the whole chapter is examinable.</p>
          )}
        </div>
      </Card>

      <Tabs defaultValue="notes" key={c.id}>
        <TabsList>
          <TabsTrigger value="notes">
            <BookOpen /> In-depth notes
          </TabsTrigger>
          <TabsTrigger value="brief">
            <Zap /> Brief summary
          </TabsTrigger>
          <TabsTrigger value="traps">
            <AlertTriangle /> Exam traps
          </TabsTrigger>
          <TabsTrigger value="practice">
            <ListChecks /> Practice ({qs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes">
          <div className="grid gap-6 lg:grid-cols-[1fr_200px]">
            <div className="space-y-4">
              {c.sections.map((s, i) => (
                <Card key={s.title} id={slug(s.title)} className="scroll-mt-20 p-5 sm:p-6">
                  <h2 className="mb-2 flex items-baseline gap-2 text-lg font-bold">
                    <span className="font-mono text-sm text-primary">{String(i + 1).padStart(2, '0')}</span>
                    {s.title}
                  </h2>
                  <RichMarkdown md={s.md} />
                </Card>
              ))}
            </div>
            <nav className="sticky top-20 hidden h-fit space-y-1 text-sm lg:block">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">On this page</div>
              {c.sections.map((s) => (
                <a key={s.title} href={`#/chapter/${c.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(slug(s.title))?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="block truncate text-muted-foreground hover:text-foreground">
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
        </TabsContent>

        <TabsContent value="brief">
          <Card className="p-6">
            <RichMarkdown md={c.brief} />
            <Button
              variant={progress.briefDone[c.id] ? 'success' : 'outline'}
              size="sm"
              className="mt-4"
              onClick={() => update((p) => ({ ...p, briefDone: { ...p.briefDone, [c.id]: !p.briefDone[c.id] } }))}
            >
              {progress.briefDone[c.id] ? 'Reviewed ✓' : 'Mark brief as reviewed'}
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="traps">
          <div className="space-y-2">
            {c.traps.map((t, i) => (
              <Card key={i} className="flex gap-3 p-4">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
                <Markdown className="[&_p]:m-0">{t}</Markdown>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="practice">
          <div className="space-y-4">
            {qs.map((q, i) => (
              <QuestionCard key={q.id} q={q} index={i} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between gap-3 pt-4">
        {prev ? (
          <Button variant="outline" asChild>
            <Link to={`/chapter/${prev.id}`}>
              <ArrowLeft /> Ch {prev.num}: {prev.title}
            </Link>
          </Button>
        ) : <span />}
        {next && (
          <Button variant="outline" asChild>
            <Link to={`/chapter/${next.id}`}>
              Ch {next.num}: {next.title} <ArrowRight />
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
