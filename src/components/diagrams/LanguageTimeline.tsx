import Chart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'

// Approximate first-appearance dates, only to show the ORDER and genealogy.
// Dates are NOT examinable (lecturer's scope document).
const langs: [string, number, string][] = [
  ['Fortran I', 1957, 'Scientific'],
  ['LISP', 1959, 'Functional'],
  ['ALGOL 60', 1960, 'Scientific'],
  ['COBOL', 1960, 'Business'],
  ['APL', 1962, 'Dynamic'],
  ['BASIC', 1964, 'Education'],
  ['PL/I', 1965, 'Everything'],
  ['SIMULA 67', 1967, 'Simulation / OO'],
  ['ALGOL 68', 1968, 'Orthogonal'],
  ['Pascal', 1971, 'Education'],
  ['C', 1972, 'Systems'],
  ['Prolog', 1972, 'Logic'],
  ['Scheme', 1975, 'Functional'],
  ['Smalltalk', 1980, 'Pure OO'],
  ['Ada', 1983, 'Embedded / DoD'],
  ['C++', 1985, 'OO + imperative'],
  ['Perl', 1987, 'Scripting'],
  ['Python', 1991, 'Scripting'],
  ['Java', 1995, 'OO, portable'],
  ['Ruby', 1995, 'Pure OO scripting'],
  ['JavaScript', 1995, 'Web client'],
  ['PHP', 1995, 'Web server'],
  ['C#', 2002, '.NET'],
]

export default function LanguageTimeline() {
  const dark = document.documentElement.classList.contains('dark')
  const options: ApexOptions = {
    chart: { type: 'scatter', toolbar: { show: false }, background: 'transparent', fontFamily: 'inherit', zoom: { enabled: false } },
    theme: { mode: dark ? 'dark' : 'light' },
    colors: ['#8b5cf6'],
    markers: { size: 7 },
    xaxis: { type: 'numeric', min: 1954, max: 2005, tickAmount: 10, labels: { formatter: (v) => String(Math.round(Number(v))) } },
    yaxis: { show: false, min: 0, max: langs.length + 1 },
    grid: { borderColor: dark ? '#333' : '#e5e7eb' },
    dataLabels: {
      enabled: true,
      formatter: (_v, o) => langs[o?.dataPointIndex ?? 0][0],
      offsetX: 0,
      offsetY: -6,
      background: { enabled: false },
      style: { fontSize: '10px', fontWeight: 600, colors: [dark ? '#e5e7eb' : '#374151'] },
    },
    tooltip: {
      custom: ({ dataPointIndex }) => {
        const [n, , d] = langs[dataPointIndex]
        return `<div style="padding:6px 10px;font-size:12px"><b>${n}</b><br/>${d}</div>`
      },
    },
  }
  const series = [{ name: 'Languages', data: langs.map(([, y], i) => ({ x: y, y: i + 1 })) }]
  return (
    <figure className="my-5 rounded-xl border bg-muted/40 p-4">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Order of appearance (dates only for orientation — not examinable)</div>
      <Chart options={options} series={series} type="scatter" height={360} />
    </figure>
  )
}
