import type { Question } from '@/data/types'

const norm = (s: string) => s.trim().replace(/\s+/g, ' ').replace(/^["']|["']$/g, '').toLowerCase()

/** value encoding: mcq → "2", multi → "0,2", fill/tf → raw text */
export function isCorrect(q: Question, value: string | undefined): boolean {
  if (value === undefined || value === '') return false
  if (q.kind === 'fill') return norm(value).replace(/\s/g, '') === norm(String(q.answer)).replace(/\s/g, '')
  if (q.kind === 'multi') {
    const want = [...(q.answer as number[])].sort().join(',')
    const got = value.split(',').filter(Boolean).map(Number).sort().join(',')
    return want === got
  }
  return Number(value) === q.answer
}

export function answerText(q: Question): string {
  if (q.kind === 'fill') return String(q.answer)
  if (q.kind === 'multi') return (q.answer as number[]).map((i) => q.options![i]).join(' + ')
  return q.options![q.answer as number]
}
