import { Database, LoaderCircle, TriangleAlert } from 'lucide-react'

function DataState({ error }) {
  return (
    <div className="data-state">
      <div>{error ? <TriangleAlert size={27} /> : <LoaderCircle className="spin" size={27} />}</div>
      <h2>{error ? 'Could not load CRM data' : 'Loading business data'}</h2>
      <p>{error?.message ?? 'Reading the linked mock CRM artifacts…'}</p>
      {error && <Database size={18} />}
    </div>
  )
}

export default DataState
