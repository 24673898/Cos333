// Pure parsers for the Markdown content files in src/content.
// Kept free of Vite/React imports so scripts/test-solutions.ts can reuse them in Node.
import type { ChapterId, CodingQuestion, CodingTest, Flashcard, QKind, Question, Section } from '../data/types.ts'

/** Split text on lines matching `re`, ignoring lines inside ``` code fences. */
function splitOutsideFences(text: string, re: RegExp): { head: string; body: string }[] {
  const out: { head: string; body: string }[] = []
  let cur: { head: string; lines: string[] } | null = null
  let fence = false
  for (const line of text.split('\n')) {
    if (/^\s*```/.test(line)) fence = !fence
    const m = !fence ? re.exec(line) : null
    if (m) {
      if (cur) out.push({ head: cur.head, body: cur.lines.join('\n').trim() })
      cur = { head: m[1].trim(), lines: [] }
    } else if (cur) cur.lines.push(line)
  }
  if (cur) out.push({ head: cur.head, body: cur.lines.join('\n').trim() })
  return out
}

export interface ParsedChapter {
  sections: Section[]
  brief: string
  traps: string[]
  flashcards: { front: string; back: string }[]
}

export function parseChapter(md: string): ParsedChapter {
  const parts = Object.fromEntries(splitOutsideFences(md, /^# (.+)$/).map((p) => [p.head.toLowerCase(), p.body]))
  const sections = splitOutsideFences(parts['notes'] ?? '', /^## (.+)$/).map((s) => ({ title: s.head, md: s.body }))
  const traps = (parts['traps'] ?? '')
    .split('\n')
    .filter((l) => l.startsWith('- '))
    .map((l) => l.slice(2).trim())
  const flashcards = (parts['flashcards'] ?? '')
    .split(/\n\s*\n/)
    .map((block) => {
      const q = /^Q:\s*([\s\S]*?)\nA:\s*([\s\S]*)$/m.exec(block.trim())
      return q ? { front: q[1].trim(), back: q[2].trim() } : null
    })
    .filter((x): x is { front: string; back: string } => !!x)
  return { sections, brief: parts['brief'] ?? '', traps, flashcards }
}

export function toFlashcards(chapter: ChapterId, cards: { front: string; back: string }[]): Flashcard[] {
  return cards.map((c, i) => ({ id: `${chapter}-fc${i + 1}`, chapter, ...c }))
}

/**
 * Question format:
 *   ### id | kind | source
 *   prompt markdown (may contain code fences)
 *   - [ ] wrong option
 *   - [x] right option
 *   = exact answer (fill-in questions)
 *   > explanation (one or more lines)
 */
export function parseQuestions(chapter: ChapterId, md: string): Question[] {
  return splitOutsideFences(md, /^### (.+)$/).map(({ head, body }) => {
    const [id, kind, source] = head.split('|').map((s) => s.trim())
    const prompt: string[] = []
    const options: string[] = []
    const correct: number[] = []
    const expl: string[] = []
    let fill = ''
    let fence = false
    for (const line of body.split('\n')) {
      if (/^\s*```/.test(line)) fence = !fence
      if (!fence && /^- \[( |x)\] /.test(line)) {
        if (line[3] === 'x') correct.push(options.length)
        options.push(line.slice(6).trim())
      } else if (!fence && line.startsWith('= ')) fill = line.slice(2).trim()
      else if (!fence && line.startsWith('>')) expl.push(line.replace(/^>\s?/, ''))
      else prompt.push(line)
    }
    const k = kind as QKind
    return {
      id,
      chapter,
      kind: k,
      prompt: prompt.join('\n').trim(),
      options: options.length ? options : undefined,
      answer: k === 'fill' ? fill : k === 'multi' ? correct : correct[0],
      explanation: expl.join('\n').trim(),
      source: source || 'Practice',
    }
  })
}

/**
 * Coding question format:
 *   ### id | lang | name | source | pattern
 *   #### spec / #### hint / #### solution / #### explanation / #### tests / #### facts / #### attempt <score>
 * Tests: one per line, `call ==> expected`.
 */
export function parseCoding(md: string): CodingQuestion[] {
  return splitOutsideFences(md, /^### (.+)$/).map(({ head, body }) => {
    const [id, lang, name, source, pattern] = head.split('|').map((s) => s.trim())
    const sub = splitOutsideFences(body, /^#### (.+)$/)
    const get = (k: string) => sub.find((s) => s.head.toLowerCase().startsWith(k))
    const stripFence = (s = '') => s.replace(/^```\w*\n/, '').replace(/\n```\s*$/, '')
    const tests: CodingTest[] = (get('tests')?.body ?? '')
      .split('\n')
      .filter((l) => l.includes('==>'))
      .map((l) => {
        const [call, expected] = l.split('==>').map((s) => s.trim())
        return { call, expected }
      })
    const att = get('attempt')
    let attempt: CodingQuestion['attempt']
    if (att) {
      const score = att.head.replace(/^attempt\s*/i, '').trim()
      const m = /```\w*\n([\s\S]*?)\n```/.exec(att.body)
      attempt = { score, code: m ? m[1] : '', review: att.body.replace(/```\w*\n[\s\S]*?\n```/, '').trim() }
    }
    return {
      id,
      lang: lang as 'scheme' | 'prolog',
      name,
      source,
      pattern,
      spec: get('spec')?.body ?? '',
      hint: get('hint')?.body ?? '',
      solution: stripFence(get('solution')?.body),
      explanation: get('explanation')?.body ?? '',
      tests,
      facts: get('facts') ? stripFence(get('facts')!.body) : undefined,
      attempt,
    }
  })
}
