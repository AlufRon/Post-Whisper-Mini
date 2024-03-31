import { Router } from 'express'
import { getAllBots, getBotById, getBotByEmail, createBot, updateBot, deleteBot, bulkCreateBots, getBotStateSummary, getBotsWithActions } from "../controllers/botsController"
import normalizeEmail from '../middleware/normalizeEmail'
const router = Router()

router.get('/', getAllBots)
router.get('/summary', getBotStateSummary)
router.get('/email', normalizeEmail, getBotByEmail);
router.get('/with-actions', getBotsWithActions)
router.get('/:id', getBotById)
router.post('/', normalizeEmail, createBot)
router.post('/bulk-create', normalizeEmail, bulkCreateBots)
router.put('/:id', normalizeEmail, updateBot)
router.delete('/:id', deleteBot)

export default router