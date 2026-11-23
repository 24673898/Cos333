export type ChapterId = 'ch01' | 'ch02' | 'ch05' | 'ch06' | 'ch07' | 'ch08' | 'ch09' | 'ch12' | 'ch15' | 'ch16'

export interface Section {
  title: string
  md: string
  diagram?: string // key into the diagram registry
}

export interface Chapter {
  id: ChapterId
  num: number
  title: string
  tagline: string
  color: string // tailwind gradient classes
  hex: string
  weight: 'Very important' | 'Important' | 'Examinable'
  scope: { in: string[]; out: string[] } // from the lecturer's exam scope
  sections: Section[] // in-depth notes
  brief: string // one-page markdown summary
  traps: string[] // exam traps / "select the most correct" patterns
}

export type QKind = 'mcq' | 'multi' | 'fill' | 'tf'

export interface Question {
  id: string
  chapter: ChapterId
  kind: QKind
  prompt: string // markdown, may include code blocks
  options?: string[]
  answer: number | number[] | string // index, indices, or exact text for fill
  explanation: string
  source: string // e.g. "2026 Exam Q2" or "Practice"
}

export interface CodingTest {
  call: string
  expected: string
}

export interface CodingQuestion {
  id: string
  lang: 'scheme' | 'prolog'
  name: string
  source: string
  pattern: string
  spec: string
  hint: string
  solution: string
  explanation: string
  tests: CodingTest[]
  facts?: string // supplied fact base for Prolog knowledge-base questions
  attempt?: { score: string; code: string; review: string } // the student's own submitted attempt
}

export interface Flashcard {
  id: string
  chapter: ChapterId
  front: string
  back: string
}
