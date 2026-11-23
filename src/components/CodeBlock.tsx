import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import scheme from 'react-syntax-highlighter/dist/esm/languages/prism/scheme'
import prolog from 'react-syntax-highlighter/dist/esm/languages/prism/prolog'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp'
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java'
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import csharp from 'react-syntax-highlighter/dist/esm/languages/prism/csharp'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

SyntaxHighlighter.registerLanguage('scheme', scheme)
SyntaxHighlighter.registerLanguage('prolog', prolog)
SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('js', javascript)
SyntaxHighlighter.registerLanguage('cpp', cpp)
SyntaxHighlighter.registerLanguage('c', cpp)
SyntaxHighlighter.registerLanguage('java', java)
SyntaxHighlighter.registerLanguage('ruby', ruby)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('csharp', csharp)

export function CodeBlock({ code, lang = 'text' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="group relative my-3 overflow-hidden rounded-lg border border-white/5 bg-[#1e1f26] text-[0.82rem]">
      <div className="flex items-center justify-between border-b border-white/5 px-3 py-1 text-[0.7rem] uppercase tracking-wide text-zinc-400">
        <span>{lang === 'text' ? 'code' : lang}</span>
        <button
          className="flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-white/10 cursor-pointer"
          onClick={() => {
            navigator.clipboard?.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 1200)
          }}
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={lang}
        style={oneDark}
        customStyle={{ margin: 0, padding: '0.85rem 1rem', background: 'transparent', fontSize: 'inherit' }}
        codeTagProps={{ style: { fontFamily: 'var(--font-mono)' } }}
      >
        {code.replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  )
}
