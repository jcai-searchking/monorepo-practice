import { createUser } from '../../src/users/users.services';
import { prisma } from '../../src/prisma';
import argon2 from 'argon2';
import { Role } from '@prisma/client';
import { jest } from '@jest/globals'
import { mock } from 'node:test';

// Unit Test
jest.mock('../prisma', () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
            create: jest.fn()
        },
    },
}));

jest.mock('argon2', () => ({
    hash: jest.fn(),
}));

describe('createUser', ()=> {
    // This clears our "tape recorders" before every test so old data doesn't leak
    beforeEach(() => {
        jest.clearAllMocks()
    });
    
    it('should successfully hash the password and save the user', async () => {
        //1. Set the stage
        const mockInput = {
            email: 'test@example.com',
            password: 'Password123!'
            name: 'Test User',
            birthDate: new Date('1991-01-01'),
            role: Role.PLAYER,
        };

        const mockReturnedUser = {
            id: '123',
            email: mockInput.email,
            name: mockInput.name,
            birthDate: mockInput.birthDate,
            role: mockInput.role,
            createdAt: new Date()
        };
        (prisma.user.findUnique as jest.Mock).mockResolvedValue(null); // "No duplicate found!"
        (argon2.hash as jest.Mock).mockResolvedValue('fake_hashed_password'); // "Here is the hash!"
        (prisma.user.create as jest.Mock).mockResolvedValue(mockReturnedUser); // "Here is the saved user!"

        // --- 2. ACT (Run the play) ---
        // Note: Make sure the function name here matches what you imported at the top! 
        const result = await createUser(mockInput);

        // --- 3. ASSERT (Check the tape recorders) ---
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: {email: mockInput.email}
        })

        expect(argon2.hash).toHaveBeenCalledWith(mockInput.password)

        expect(prisma.user.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    email: mockInput.email,
                    passwordHash: 'fake_hashed_password',
                    name: mockInput.name,
                })
            })
        )

        expect(result).toEqual(mockReturnedUser)
    })
})
