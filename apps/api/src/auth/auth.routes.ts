import { googleLoginSchema } from './auth.schemas'
import { Router } from 'express'
import { validateBody } from '../middleware/validate'
import { googleLoginController } from './auth.controller'

const router = Router()

router.post('/google', validateBody(googleLoginSchema), googleLoginController);

export default router;