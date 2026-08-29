import { Router } from 'express'
import { artifactNames, loadMockArtifact, loadMockCrm } from '../services/mockCrmService.js'

const router = Router()

router.get('/', async (request, response, next) => {
  try {
    const data = await loadMockCrm()
    response.json({ dashboard: data.dashboard, conversations: data.conversations })
  } catch (error) {
    next(error)
  }
})

router.get('/dashboard', async (request, response, next) => {
  try {
    const data = await loadMockCrm()
    response.json(data.dashboard)
  } catch (error) {
    next(error)
  }
})

router.get('/conversations', async (request, response, next) => {
  try {
    const data = await loadMockCrm()
    response.json(data.conversations)
  } catch (error) {
    next(error)
  }
})

router.get('/artifacts', (request, response) => {
  response.json({ artifacts: artifactNames })
})

router.get('/artifacts/:name', async (request, response, next) => {
  try {
    if (!artifactNames.includes(request.params.name)) {
      return response.status(404).json({ error: 'Mock data artifact not found' })
    }
    return response.json(await loadMockArtifact(request.params.name))
  } catch (error) {
    return next(error)
  }
})

export default router
