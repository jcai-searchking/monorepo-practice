import { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors/AppErrors'

export const createLobbyPlayer = (req: Request, res:Response, next: NextFunction) => {
    try {
        if (!req.user) next()
            
    } catch (error) {
        
    }
}