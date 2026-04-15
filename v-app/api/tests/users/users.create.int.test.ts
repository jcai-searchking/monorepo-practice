import { createUser } from '../../src/users/users.services';
import { prisma } from '../../src/prisma'; 
import { Role } from '@prisma/client';
import argon2 from 'argon2';
import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import { mock } from 'node:test';

describe('createUser Integration', () => {
    // 1. setup: wipe database
    beforeAll(async () => {
        await prisma.user.deleteMany();
    })
    // 2. cleanup: wipe the database after every single test
    // ensures tests dont interfere with each other
    afterEach(async () => {
        await prisma.user.deleteMany();
    })
    // 3. teardown: close the connection so Jest can exit
    afterAll(async () => {
        await prisma.$disconnect();
    })

    it('should successfully save user to a REAL database', async () => {
        const mockInput = {
            email: 'User@test.com',
            password: 'SecuredPassword123!',
            name: 'Real DB User',
            birthDate: new Date('1995-05-20'),
            role: Role.PLAYER,
        }

        // -- ACT --
        const result = await createUser(mockInput);

        // --- ASSERT ---

        // 1. check if function return the correct object
        expect(result).toHaveProperty('id');
        expect(result.email).toBe(mockInput.email);

        // 2. Query the actual databse to see if it's really there
        const userInDb = await prisma.user.findUnique({
            where: { email: mockInput.email}
        })

        expect(userInDb).not.toBeNull();
        expect(userInDb?.name).toBe('Real DB User')

        // 3.Verify that the password was hashed correctly in the DB
        // It should NOT be plain text password
        expect(userInDb?.passwordHash).not.toBe(mockInput.password);

        const isValid = await argon2.verify(userInDb!.passwordHash, mockInput.password)
        expect(isValid).toBe(true)
    })

    it('should throw an error when user is already in the system', async () => {
        const mockInput = {
            email: 'duplicate@test.com',
            password: 'Password123!',
            name: 'User 1',
            birthDate: new Date('2001-01-01'),
            role: Role.PLAYER,
        }

        const duplicateEmail = {
            email: 'duplicate@test.com',
            password: 'Password123!',
            name: 'User 2',
            birthDate: new Date('2002-01-02'),
            role: Role.PLAYER,
        }

        await createUser(mockInput)
        await expect(createUser(duplicateEmail)).rejects.toThrow()
    })

})