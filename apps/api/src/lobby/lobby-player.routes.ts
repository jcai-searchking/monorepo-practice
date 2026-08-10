import { Router } from 'express'
import { Role } from '@prisma/client'
import { requireAuth, requireRole } from '../middleware/auth.middleware'
import { validateBody, validateParams } from '../middleware/validate'
import { lobbyIdParamSchema, addLobbyPlayerSchema } from './lobby-player.schemas'
import * as PlayerController from './lobby-player.controller'

const router = Router()

router.get('/:lobbyId/players', validateParams(lobbyIdParamSchema), PlayerController.listPlayers)
router.post('/:lobbyId/players', requireAuth, requireRole(Role.HOST, Role.ADMIN), validateParams(lobbyIdParamSchema), validateBody(addLobbyPlayerSchema), PlayerController.addPlayer)

export default router