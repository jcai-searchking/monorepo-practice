import { prisma } from '../prisma';                                 
import { AppError } from '../errors/AppErrors';
import { AddPlayerInput, UpdatePlayerInput } from "./lobby-player.schemas"


export const addLobbyPlayerService = async (playerInput: AddPlayerInput, lobbyId: string, hostId: string) => {
    const lobby = await prisma.lobby.findUnique({
        where: { id: lobbyId},
        select: { id: true,
                hostId : true }
    })

    if (!lobby) throw new AppError("Lobby not found", 404)
    
    if (lobby.hostId !== hostId ) throw new AppError("Forbidden", 403)
    return prisma.lobbyPlayer.create({
        data: {
            lobbyId,
            userId: playerInput.userId ?? null,
            guestName: playerInput.guestName ?? null,
            position: playerInput.position ?? '',
        },
        include: {
            user: { select: { id: true, name: true, pictureUrl: true } }
        }
    })
    
}

export const getLobbyPlayersService = async (lobbyId: string) => {
    return prisma.lobbyPlayer.findMany({
        where: { lobbyId },
        orderBy: { joinedAt: 'asc' },
        include: {
            user: {
                select: { id: true, name: true, pictureUrl:true }
            }
        }
     })
}

export const updateLobbyPlayerService = async (playerId: string, lobbyId:string, hostId:string, data: UpdatePlayerInput) => {
    const lobby = await prisma.lobby.findUnique({
        where: {id: lobbyId},
        select: {hostId: true , players:true}
    })

    const player = await prisma.lobbyPlayer.findUnique({
        where: { id: playerId },
        select: { lobbyId: true}
    })

    if ( !lobby ) throw new AppError('does not exist', 404)
    if ( !player || player.lobbyId != lobbyId ) throw new AppError('Player not found', 404)
    
    return prisma.lobbyPlayer.update({
        where: { id: playerId },
        data,
        include: {
            user: { select: { id: true, name: true, pictureUrl: true } }
        }
    })
}