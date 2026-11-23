import { useCallback, useEffect, useState } from 'react'

// All progress lives in this browser's localStorage under one key.
const KEY = 'cos333-progress-v1'

export interface Progress {
  studied: Record<string, boolean> // chapter id -> studied
  briefDone: Record<string, boolean> // chapter id -> brief summary reviewed
  mcq: Record<string, { correct: boolean; at: number }> // question id -> last attempt
  coding: Record<string, 'todo' | 'attempted' | 'solved'>
  cardsKnown: Record<string, boolean>
  mock: Record<string, { answers: Record<string, string>; submitted: boolean; score?: number }>
}

const empty: Progress = { studied: {}, briefDone: {}, mcq: {}, coding: {}, cardsKnown: {}, mock: {} }

function read(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...empty, ...JSON.parse(raw) } : empty
  } catch {
    return empty
  }
}

let state: Progress = read()
const listeners = new Set<() => void>()

function write(next: Progress) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* storage unavailable: keep in memory only */
  }
  listeners.forEach((l) => l())
}

export function useProgress() {
  const [, force] = useState(0)
  useEffect(() => {
    const l = () => force((n) => n + 1)
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  }, [])
  const update = useCallback((fn: (p: Progress) => Progress) => write(fn(state)), [])
  return [state, update] as const
}

export function resetProgress() {
  write(empty)
}

export function useTheme() {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem('cos333-theme') !== 'light'
    } catch {
      return true
    }
  })
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem('cos333-theme', dark ? 'dark' : 'light')
    } catch {
      /* ignore */
    }
  }, [dark])
  return [dark, setDark] as const
}
