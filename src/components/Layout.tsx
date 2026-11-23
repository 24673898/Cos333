import { useEffect, useState, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  BookOpenText, Code2, GraduationCap, Layers, LayoutDashboard, ListChecks, Menu, Moon, ScrollText, Sun, Timer, X, Zap,
} from 'lucide-react'
import { chapters } from '@/data/chapters'
import { useProgress, useTheme } from '@/lib/store'
import { cn } from '@/lib/utils'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/exam-guide', label: 'Exam guide & rules', icon: ScrollText },
  { to: '/brief', label: 'Brief revision (all chapters)', icon: Zap },
  { to: '/coding', label: 'Scheme & Prolog workbook', icon: Code2 },
  { to: '/questions', label: 'Question bank', icon: ListChecks },
  { to: '/flashcards', label: 'Flashcards', icon: Layers },
  { to: '/mock', label: 'Mock exam', icon: Timer },
]

function SideLink({ to, end, children, onClick }: { to: string; end?: boolean; children: ReactNode; onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors [&_svg]:size-4 [&_svg]:shrink-0',
          isActive ? 'bg-accent font-medium text-accent-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )
      }
    >
      {children}
    </NavLink>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  const [dark, setDark] = useTheme()
  const [open, setOpen] = useState(false)
  const [progress] = useProgress()
  const loc = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [loc.pathname])

  const sidebar = (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-4">
      <NavLink to="/" className="flex items-center gap-2.5 px-1" onClick={() => setOpen(false)}>
        <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 font-mono text-lg font-bold text-white">
          λ
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-semibold">COS 333</span>
          <span className="block text-xs text-muted-foreground">Programming Languages</span>
        </span>
      </NavLink>
      <nav className="flex flex-col gap-0.5">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <SideLink key={to} to={to} end={end} onClick={() => setOpen(false)}>
            <Icon /> {label}
          </SideLink>
        ))}
      </nav>
      <div>
        <div className="mb-1.5 flex items-center gap-2 px-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <BookOpenText className="size-3.5" /> Chapters
        </div>
        <nav className="flex flex-col gap-0.5">
          {chapters.map((c) => (
            <SideLink key={c.id} to={`/chapter/${c.id}`} onClick={() => setOpen(false)}>
              <span
                className="flex size-5 shrink-0 items-center justify-center rounded-md text-[0.65rem] font-bold text-white"
                style={{ background: c.hex }}
              >
                {c.num}
              </span>
              <span className="truncate">{c.title}</span>
              {progress.studied[c.id] && <span className="ml-auto text-success">✓</span>}
            </SideLink>
          ))}
        </nav>
      </div>
      <div className="mt-auto flex items-center gap-2 rounded-lg border p-2.5 text-xs text-muted-foreground">
        <GraduationCap className="size-4 shrink-0" />
        Progress is saved in this browser only.
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-card lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r bg-card">{sidebar}</aside>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="no-print sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background/85 px-4 backdrop-blur">
          <button className="rounded-lg p-2 hover:bg-muted lg:hidden cursor-pointer" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <span className="text-sm text-muted-foreground max-lg:hidden">COS 333 exam study hub</span>
          <button
            className="rounded-lg p-2 hover:bg-muted cursor-pointer"
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  )
}
