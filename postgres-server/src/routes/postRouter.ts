import { Router } from 'express'
import { createPost, deletePost, getAllPosts, getPostById, updatePost, getPostsWithActionsById, bulkCreatePosts, getPostStateSummary } from '../controllers/postController';
import { formatDateFields } from '../middleware/formatDateFields';

const router = Router()

router.get('/', getAllPosts)
router.get('/summary', getPostStateSummary)
router.get('/:id', getPostById)
router.post('/', createPost)
router.post('/bulk-create', bulkCreatePosts)
router.put('/:id',formatDateFields, updatePost)
router.delete('/:id', deletePost)
router.get('/posts-with-actions/:id', getPostsWithActionsById);

export default router