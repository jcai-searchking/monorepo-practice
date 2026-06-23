import { z } from 'zod'
import 'express'
import { Role } from '@prisma/client'

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string,
                role: Role 
            }
            validatedBody?: unknown
            validatedQuery?: unknown
            validatedParams?: unknown
        }
    }
}
