import { useEffect, useState } from 'react'
import { loadMockCrm } from '../services/mockCrm.js'

function useCrmData() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    loadMockCrm()
      .then((result) => active && setData(result))
      .catch((loadError) => active && setError(loadError))
    return () => { active = false }
  }, [])

  return { data, error, isLoading: !data && !error }
}

export default useCrmData
