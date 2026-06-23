import { Router } from 'express';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { createUserSchema, userParamSchema, updateUserSchema } from './users.schemas';
import * as UserController from './users.controller'
import { requireAuth, requireAdmin } from '../middleware/auth.middleware'

const router = Router()

// Create User
router.post('/', validateBody(createUserSchema), UserController.createUser)

// Get User by ID
router.get('/:id', requireAuth, validateParams(userParamSchema), UserController.getUser)

// Update Partial Self
router.patch('/me', requireAuth, validateBody(updateUserSchema), UserController.updateUser)

// Delete Self
router.delete('/me', requireAuth, UserController.deleteUser)

//Admin Only Routes
// Update Partial User Data by ID
router.patch('/:id', requireAuth, requireAdmin, validateParams(userParamSchema), validateBody(updateUserSchema), UserController.updateUserById)

// Delete User by ID
router.delete('/:id', requireAuth, requireAdmin, validateParams(userParamSchema), UserController.deleteUserById)

export default router;