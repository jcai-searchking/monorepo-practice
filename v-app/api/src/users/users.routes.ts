import { Router } from 'express';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { createUserSchema, userParamSchema, updateUserSchema } from './users.schemas';
import * as UserController from './users.controller'

const router = Router()

// Create User
router.post('/', validateBody(createUserSchema), UserController.createUser)

// Get User by ID
router.get('/:id', validateParams(userParamSchema), UserController.getUser)

// Update Partial User Data by ID
router.patch('/:id', validateParams(userParamSchema), validateBody(updateUserSchema), UserController.updateUser)

// Delete User by ID

export default router;