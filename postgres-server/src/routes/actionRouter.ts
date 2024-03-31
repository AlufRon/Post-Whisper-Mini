import { Router } from 'express'
import { bulkCreateActions, createAction, createActionsPerBot, deleteAction, getActionStateSummary, getActionsByField, getAllActions, updateAction } from '../controllers/actionController';
const router = Router()

router.get('/', getAllActions)
router.get('/summary', getActionStateSummary)
router.get('/:field/:value', getActionsByField);
router.post('/', createAction)
router.post('/bulk', bulkCreateActions)
router.post('/for-bots', createActionsPerBot)
router.put('/:id', updateAction)
router.delete('/:id', deleteAction)

export default router