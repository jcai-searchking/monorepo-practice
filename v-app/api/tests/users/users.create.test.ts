import { createUser } from '../../src/users/users.services';
import { prisma } from '../../src/prisma';
import argon2 from 'argon2';
import {
    jest,
    describe,
    it,
    expect,
    beforeEach,
    afterEach,
} from '@jest/globals';

// Unit Test
jest.mock('../../src/prisma', () => ({
    // Corrected path for prisma mock
    prisma: {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    },
}));
jest.mock('argon2', () => ({
    hash: jest.fn(),
}));

describe('createUser', () => {
    // This clears our "tape recorders" before every test so old data doesn't leak
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully hash the password and save the user', async () => {
        //1. Set the stage
        const mockInput = {
            // Missing comma fixed here
            email: 'test@example.com',
            password: 'Password123!',
            name: 'Test User',
            birthDate: new Date('1991-01-01'),
            role: 'PLAYER',
        };

        const mockReturnedUser = {
            id: '123',
            email: mockInput.email,
            name: mockInput.name,
            birthDate: mockInput.birthDate,
            passwordHash: 'fake_hashed_password', // Added passwordHash
            role: mockInput.role,
            createdAt: new Date(),
        };
        jest.mocked(prisma.user.findUnique).mockResolvedValueOnce(null); // "No duplicate found!"
        jest.mocked(argon2.hash).mockResolvedValue('fake_hashed_password'); // "Here is the hash!"
        jest.mocked(prisma.user.create).mockResolvedValue(mockReturnedUser); // "Here is the saved user!"

        // --- 2. ACT (Run the play) ---
        // Note: Make sure the function name here matches what you imported at the top!
        const result = await createUser(mockInput);

        // --- 3. ASSERT (Check the tape recorders) ---
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { email: mockInput.email },
        });

        expect(argon2.hash).toHaveBeenCalledWith(mockInput.password);

        expect(prisma.user.create).toHaveBeenCalledWith(
            expect.objectContaining({
                data: expect.objectContaining({
                    email: mockInput.email,
                    passwordHash: 'fake_hashed_password',
                    name: mockInput.name,
                }),
            }),
        );

        expect(result).toEqual(mockReturnedUser);
    });
});
