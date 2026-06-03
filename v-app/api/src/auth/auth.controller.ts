import type { GoogleLoginInput } from './auth.schemas'
import type { Request, Response, NextFunction } from 'express';

export async function googleLoginController(req: Request<{}, {}, GoogleLoginInput>, res: Response, next: NextFunction) {

    try {
        const { idToken } = req.validatedBody as GoogleLoginInput
        return res.status(501).json({ message: 'Google login not implemented' })
    } catch (error) {
        next(error)
    }

}