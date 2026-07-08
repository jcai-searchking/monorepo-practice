import { CreateLobbyInput } from "./lobby.schemas";
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client'
import { publicUserSelect } from "../user/user.services";
import { AppError } from '../errors/AppErrors';

export const publicLobbySelect = {
    id: true,
    lobbyName: true,
    location: true,
    startTime: true,
    endTime: true,
    price: true,
    skillLevel: true,
    genderFormat: true,
    allowToApply: true,
    createdAt: true,
    host: { select: publicUserSelect }
} satisfies Prisma.LobbySelect


export const createLobbyService = async (data:CreateLobbyInput, hostId: string) => {
    return prisma.lobby.create({ 
        data: {...data, hostId },
        select: publicLobbySelect,
    })
}

export const listActiveLobbiesService = async () => {
    return prisma.lobby.findMany({
        where: { endTime: { gt: new Date() } },
        orderBy: { startTime: 'asc' },
        select: publicLobbySelect,
    })
}

export const getLobbyByIdService = async (id: string) => {
    const lobby = await prisma.lobby.findUnique({
        where: { id },
        select: publicLobbySelect,
    })
    if (!lobby) throw new AppError('Lobby not found', 404)
    return lobby
}