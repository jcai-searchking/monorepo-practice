import { z } from 'zod'
import { SkillLevel } from '@prisma/client'
import { GenderFormat} from '@prisma/client'

export const createLobbySchema = z.object({
    lobbyName: z.string().trim().min(3).max(30),
    location: z.string().trim().min(3),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    price: z.number().min(0),
    skillLevel: z.enum(SkillLevel),
    genderFormat: z.enum(GenderFormat),
    allowToApply: z.boolean()
}).refine((d) => d.endTime > d.startTime, { message: 'End time must be after start time', path: ["endTime"] })
.refine((d) => d.startTime > new Date(), { message: "Start time cannot be in the past", path: ["startTime"] })

export type CreateLobbyInput = z.infer<typeof createLobbySchema>