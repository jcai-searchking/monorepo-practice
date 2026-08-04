import { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors/AppErrors'
import { LobbyIdParamInput, UpdatePlayerInput, AddPlayerInput, LobbyPlayerParamInput } from './lobby-player.schemas'
import * as PlayerServices from './lobby-player.services'

export const listPlayers =  async (req: Request, res:Response, next: NextFunction) => {
    try {
        const { lobbyId } = req.validatedParams as LobbyIdParamInput
        const players = await PlayerServices.getLobbyPlayersService(lobbyId)
        return res.status(200).json({ success: true, players})
    } catch (error) {
        next(error)
    }
}


