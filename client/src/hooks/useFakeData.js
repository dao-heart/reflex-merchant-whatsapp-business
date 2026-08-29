import { useSyncExternalStore } from 'react'
import { getFakeDataSnapshot, subscribeFakeData } from '../services/fakeDataStore.js'

function useFakeData() {
  return useSyncExternalStore(subscribeFakeData, getFakeDataSnapshot, getFakeDataSnapshot)
}

export default useFakeData
