import { Fragment } from 'react'
import { Markdown } from './Markdown'
import { diagrams } from './diagrams'

/** Markdown with `<!-- diagram:key -->` markers replaced by the matching diagram component. */
export function RichMarkdown({ md }: { md: string }) {
  const parts = md.split(/<!--\s*diagram:(\w+)\s*-->/)
  return (
    <>
      {parts.map((p, i) => {
        if (i % 2 === 1) {
          const D = diagrams[p]
          return D ? <Fragment key={i}>{D()}</Fragment> : null
        }
        return p.trim() ? <Markdown key={i}>{p}</Markdown> : null
      })}
    </>
  )
}

export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
