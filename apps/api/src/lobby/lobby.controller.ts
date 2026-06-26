import { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors/AppErrors'
import { CreateLobbyInput } from './lobby.schemas'
import * as LobbyServices from './lobby.services'

export const createLobby = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new AppError('Authentication required', 401))
        }
        const lobbydata = req.validatedBody as CreateLobbyInput
        const lobby = await LobbyServices.createLobbyService(lobbydata, req.user.id)
        return res.status(201).json({message: "Lobby created successfully", lobby})
    } catch (error) {
        next(error)
    }
}