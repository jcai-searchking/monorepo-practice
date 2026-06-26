import { CreateLobbyInput } from "./lobby.schemas";
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client'
import { publicUserSelect } from "../user/user.services";

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