import { Router } from 'express';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import { createUserSchema, userParamSchema } from './users.schemas';
import * as UserController from './users.controller'

const router = Router()

// Create User
router.post('/', validateBody(createUserSchema), UserController.createUser)

// Get User by ID
router.get('/:id', validateParams(userParamSchema), UserController.getUser)


export default router;