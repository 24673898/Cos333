import type { Chapter, ChapterId, CodingQuestion, Flashcard, Question } from './types'
import { parseChapter, parseCoding, parseQuestions, toFlashcards } from '@/lib/parse'

const chapterMd = import.meta.glob('../content/chapters/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const questionMd = import.meta.glob('../content/questions/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
import schemeMd from '../content/coding-scheme.md?raw'
import prologMd from '../content/coding-prolog.md?raw'

interface Meta {
  id: ChapterId
  num: number
  title: string
  tagline: string
  color: string
  hex: string
  weight: Chapter['weight']
  scope: Chapter['scope']
}

// Scope notes paraphrase the lecturer's "Exam 2026 scope" document.
const meta: Meta[] = [
  {
    id: 'ch01', num: 1, title: 'Preliminaries', tagline: 'Reasons to study PLs, evaluation criteria, orthogonality, implementation methods',
    color: 'from-indigo-500 to-violet-600', hex: '#6366f1', weight: 'Important',
    scope: {
      in: ['Whole chapter', 'Scenario questions on reasons to study PL concepts (answer must fit the person)', 'Apply evaluation criteria to real and hypothetical languages', 'Orthogonality — will definitely be tested'],
      out: ['Discussion of Figure 1.2', 'Section 1.7.4', 'Section 1.8', 'Detailed steps of the compilation and hybrid processes'],
    },
  },
  {
    id: 'ch02', num: 2, title: 'Evolution of the Major Languages', tagline: 'Environment → effect → contribution for each language',
    color: 'from-sky-500 to-blue-600', hex: '#0ea5e9', weight: 'Examinable',
    scope: {
      in: ['For each language: development environment, how it shaped the language, main contribution(s)', 'Section 2.20 only as far as the slides go'],
      out: ['Sections 2.1, 2.2, 2.6.2, 2.9.2', 'Version-specific features, dates, machine models, designer names, committee details', 'Finer details in general'],
    },
  },
  {
    id: 'ch05', num: 5, title: 'Names, Bindings, and Scopes', tagline: 'Binding times, variable lifetimes, static vs dynamic scope',
    color: 'from-emerald-500 to-teal-600', hex: '#10b981', weight: 'Examinable',
    scope: { in: ['The whole chapter'], out: [] },
  },
  {
    id: 'ch06', num: 6, title: 'Data Types', tagline: 'Arrays, records, unions, pointers, type checking',
    color: 'from-teal-500 to-cyan-600', hex: '#14b8a6', weight: 'Examinable',
    scope: {
      in: ['Everything not excluded below', 'Discriminated unions (slides show a graphical example)', 'Section 6.15 — only the slide content'],
      out: ['Implementation sections 6.3.5, 6.5.9, 6.6.2, 6.7.4, 6.10.5, 6.11.7', 'Sections 6.4, 6.5.4, 6.12, 6.16'],
    },
  },
  {
    id: 'ch07', num: 7, title: 'Expressions and Assignment', tagline: 'Precedence, coercion, short-circuit evaluation, assignment forms',
    color: 'from-amber-500 to-orange-600', hex: '#f59e0b', weight: 'Examinable',
    scope: { in: ['The whole chapter', 'Side effects and referential transparency (Chapter 15 slides)'], out: [] },
  },
  {
    id: 'ch08', num: 8, title: 'Statement-Level Control Structures', tagline: 'Selection, loops, Ruby blocks, guarded commands',
    color: 'from-orange-500 to-red-500', hex: '#f97316', weight: 'Examinable',
    scope: {
      in: ['Ruby blocks (8.3.4)', 'Guarded commands (8.5) — pay special attention'],
      out: ['Section 8.2.2.3', 'Section 8.3.1.4', 'Last paragraph and example of 8.3.2.2 (pretest loops in functional languages)'],
    },
  },
  {
    id: 'ch09', num: 9, title: 'Subprograms', tagline: 'Parameter passing, binding of passed subprograms, generics, closures, coroutines',
    color: 'from-rose-500 to-pink-600', hex: '#f43f5e', weight: 'Very important',
    scope: {
      in: ['All terminology', 'Referencing environments', 'Parameter-passing methods', 'Sections 9.6 and 9.7 — very important', 'Generic subprograms in C++, Java and C# (C# slides go deeper)', 'Closures — trace JavaScript closures like MakeAdder', 'Coroutines — give the output of pseudocode'],
      out: ['Section 9.5.3', 'Section 9.10.4'],
    },
  },
  {
    id: 'ch12', num: 12, title: 'Support for Object-Oriented Programming', tagline: 'Design issues, Smalltalk, C++, Java, C#, Ruby',
    color: 'from-fuchsia-500 to-purple-600', hex: '#d946ef', weight: 'Very important',
    scope: {
      in: ['Everything except the sections below', 'Chapter 11 helps with terms (see slide 4 of Ch 12 Part 1) but is not directly examinable'],
      out: ['Sections 12.5 and 12.6'],
    },
  },
  {
    id: 'ch15', num: 15, title: 'Functional Programming — Scheme', tagline: 'Side effects, referential transparency, Scheme list processing',
    color: 'from-violet-500 to-purple-700', hex: '#8b5cf6', weight: 'Very important',
    scope: {
      in: ['Up to and including 15.5, plus 15.5.11 (Scheme list-processing examples)', 'Slide material from 7.2.2, 8.2.2.4, 6.9 and 5.5.2', 'Analyse and write programs no more complex than member, equalsimp, equal, append and Practical 2', 'One Scheme list-processing implementation question (DrRacket)'],
      out: ['Sections 15.2 and 15.4', 'Lambda expressions in 15.5.4', 'Common Lisp, ML, Haskell, F#, FP support in imperative languages'],
    },
  },
  {
    id: 'ch16', num: 16, title: 'Logic Programming — Prolog', tagline: 'Predicate calculus, resolution, Prolog lists, deficiencies',
    color: 'from-blue-500 to-indigo-700', hex: '#3b82f6', weight: 'Very important',
    scope: {
      in: ['The whole chapter', 'Write programs no more complex than member, append, reverse and Practicals 3 and 4', 'One Prolog list-processing implementation question (SWI-Prolog)', 'Same language restrictions as Practicals 3 and 4'],
      out: [],
    },
  },
]

const parsed = Object.fromEntries(
  Object.entries(chapterMd).map(([path, md]) => [path.match(/(ch\d+)\.md$/)![1], parseChapter(md)]),
)

export const chapters: Chapter[] = meta.map((m) => {
  const p = parsed[m.id]
  return { ...m, sections: p?.sections ?? [], brief: p?.brief ?? '', traps: p?.traps ?? [] }
})

export const chapterById = Object.fromEntries(chapters.map((c) => [c.id, c])) as Record<ChapterId, Chapter>

export const flashcards: Flashcard[] = meta.flatMap((m) => toFlashcards(m.id, parsed[m.id]?.flashcards ?? []))

export const questions: Question[] = meta.flatMap((m) => {
  const entry = Object.entries(questionMd).find(([path]) => path.endsWith(`/${m.id}.md`))
  return entry ? parseQuestions(m.id, entry[1]) : []
})

export const schemeQuestions: CodingQuestion[] = parseCoding(schemeMd)
export const prologQuestions: CodingQuestion[] = parseCoding(prologMd)
export const codingQuestions = [...schemeQuestions, ...prologQuestions]
