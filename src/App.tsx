import { lazy, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '@/components/Layout'

const Dashboard = lazy(() => import('@/pages/Dashboard'))
const ChapterPage = lazy(() => import('@/pages/ChapterPage'))
const BriefRevision = lazy(() => import('@/pages/BriefRevision'))
const CodingWorkbook = lazy(() => import('@/pages/CodingWorkbook'))
const QuestionBank = lazy(() => import('@/pages/QuestionBank'))
const Flashcards = lazy(() => import('@/pages/Flashcards'))
const MockExam = lazy(() => import('@/pages/MockExam'))
const ExamGuide = lazy(() => import('@/pages/ExamGuide'))

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-muted" />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/exam-guide" element={<ExamGuide />} />
          <Route path="/chapter/:id" element={<ChapterPage />} />
          <Route path="/brief" element={<BriefRevision />} />
          <Route path="/coding" element={<CodingWorkbook />} />
          <Route path="/coding/:qid" element={<CodingWorkbook />} />
          <Route path="/questions" element={<QuestionBank />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/mock" element={<MockExam />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
        </Suspense>
      </Layout>
    </HashRouter>
  )
}
