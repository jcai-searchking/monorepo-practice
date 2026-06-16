import { prisma } from '../prisma';
import argon2 from 'argon2';
import { CreateUserInput, UpdateUserInput, GoogleUserPayload } from './users.schemas';
import { AppError } from '../errors/AppErrors';

export const createUser = async (data: CreateUserInput) => {
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
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

export const updateUserService = async (id: string, updateData: UpdateUserInput) => {
    const user = await prisma.user.findFirst({
        where: { id, deletedAt: null }
    })
    if (!user) throw new AppError('User not found', 404)

    const { password, ...data } = updateData;
    let passwordHash: string | undefined;

    if (password) {
        passwordHash = await argon2.hash(password);
    }

    return await prisma.user.update({
        where: { id },
        data: {
            ...data,
            ...(passwordHash && { passwordHash }),
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
}

export const deleteUserService = async (id: string) => {
    const user = await prisma.user.findFirst({
        where: { id, deletedAt: null }
    })
    if (!user) throw new AppError('User not found', 404)

    return await prisma.user.update({
        where: { id },
        data: {
            deletedAt: new Date()
        },
        select: { id: true, email: true, name: true, deletedAt: true }
    })
}

export const findUserByGoogleSub = async (googleSub: string) => {
    return await prisma.user.findUnique({
        where: { googleSub },
        select: {
            id: true,
            email: true,
            googleSub: true,
        }
    })
}

export const findUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            googleSub: true,
            deletedAt: true,
        }
    })
}

export const createGoogleUser = async (claims: GoogleUserPayload) => {
    return await prisma.user.create({
        data: {
            email: claims.email,
            name: claims.name,
            googleSub: claims.sub,
            pictureUrl: claims.picture,
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            pictureUrl: true
        },
    })
}

export const linkGoogleAccount = async (id: string, googleSub: string) => {
    return await prisma.user.update({
        where: { id },
        data: { googleSub },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            pictureUrl: true,
            createdAt: true,
        }
    })
}
