import { z } from 'zod';
import { Role } from '@prisma/client';

export const createUserSchema = z.object({
    email: z.string().email().toLowerCase().trim(),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least 1 lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least 1 number')
        .regex(/[^a-zA-Z0-9]/, 'Password must contain at least 1 special character'),
    name: z.string().trim(),
    birthDate: z.coerce.date(),
    role: z
        .enum([Role.ADMIN, Role.HOST, Role.PLAYER])
        .optional()
        .default(Role.PLAYER),
});

export const userParamSchema = z.object({
    id: z.string().trim().cuid('Invalid user ID format')
})

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UserParamInput = z.infer<typeof userParamSchema>