import { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors/AppErrors'
import { LobbyIdParamInput, UpdatePlayerInput, AddPlayerInput, LobbyPlayerParamInput } from './lobby-player.schemas'
import * as PlayerServices from './lobby-player.services'

export const addPlayer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) return next(new AppError('Authentication required', 401))
        const { lobbyId } = req.validatedParams as LobbyIdParamInput
        const playerData = req.validatedBody as AddPlayerInput 
        const player = await PlayerServices.addLobbyPlayerService(lobbyId, req.user, playerData)
        return res.status(201).json({
            player 
        })
    } catch (error) {
        next(error)
    }
}

export const listPlayers =  async (req: Request, res:Response, next: NextFunction) => {
    try {
        const { lobbyId } = req.validatedParams as LobbyIdParamInput
        const players = await PlayerServices.getLobbyPlayersService(lobbyId)
        return res.status(200).json({ players})
    } catch (error) {
        next(error)
    }
}

