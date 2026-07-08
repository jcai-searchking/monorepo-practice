import express from 'express'
import { Router } from 'express'
import { createLobby } from './lobby.controller'
import { createLobbySchema, lobbyParamSchema } from './lobby.schemas'
import { requireAuth, requireRole } from '../middleware/auth.middleware'
import { Role } from '@prisma/client'
import { validateBody, validateParams, validateQuery } from '../middleware/validate'

import * as LobbyController from './lobby.controller'


const router = Router()

router.get('/', LobbyController.listLobbies)
router.get('/:id', validateParams(lobbyParamSchema), LobbyController.getLobby)

router.post('/', requireAuth, requireRole(Role.HOST, Role.ADMIN), validateBody(createLobbySchema), LobbyController.createLobby)


export default router