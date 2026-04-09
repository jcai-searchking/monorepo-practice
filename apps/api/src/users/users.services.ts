import { prisma } from '../prisma';
import argon2 from 'argon2';
import { CreateUserInput } from './users.schemas';
import { AppError } from '../errors/AppErrors';

export const createUser = async (data: CreateUserInput) => {
    const existingUser = await prisma.user.findUnique({
        where: {email: data.email}
    })

    if (existingUser) {
        throw new AppError('This email is already registered. Please log in with your email', 409)
    }
    
    const passwordHash = await argon2.hash(data.password);

    return await prisma.user.create({
        data: {
            email: data.email,
            passwordHash,
            name: data.name,
            birthDate: data.birthDate,
            role: data.role,
        },
        select: {
            id: true,
            email: true,
            name: true,
            birthDate: true,
            role: true,
            createdAt: true,
        },
    });
};

export const getUserByIdService = async (id: string) => {
    const user = await prisma.user.findFirst({
        where: { id, deletedAt: null },
        select: {
            id: true,
            email: true,
            name: true,
            birthDate: true,
            role: true,
            createdAt: true
        }
    })
    if (!user) throw new AppError('User not found', 404)
    return user
}