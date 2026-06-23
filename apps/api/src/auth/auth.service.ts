import { OAuth2Client } from 'google-auth-library';
import { ENV } from '../config/env';
import { AppError } from '../errors/AppErrors';
import { googleUserPayloadSchema } from '../users/users.schemas'
import * as UserServices from '../users/users.services'
import type { GoogleUserPayload } from '../users/users.schemas'

const client = new OAuth2Client(ENV.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (idToken: string) => {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: ENV.GOOGLE_CLIENT_ID
    })
    const payload = ticket.getPayload();
    if (payload === undefined) {
        throw new AppError('Invalid Google Token', 401)
    }

    const result = googleUserPayloadSchema.safeParse({
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        emailVerified: payload.email_verified,
    })

    if (!result.success) {
        throw new AppError("Invalid Google Token", 401)
    }

    return result.data
}

export const findOrCreateGoogleUser = async (claims: GoogleUserPayload) => {
    // finduserbygooglesub if exists return login
    const existingByGoogleSub = await UserServices.findUserByGoogleSub(claims.sub)
    if (existingByGoogleSub !== null) {
        return existingByGoogleSub
    }

    // finduserby email if not email verfieid reutrn 409 error
    const existingByEmail = await UserServices.findUserByEmail(claims.email)

    if (existingByEmail !== null) {
        if (claims.emailVerified !== true) {
            throw new AppError('Account Conflict - please login with email', 409)
        }
        if (existingByEmail.googleSub === null) {
            return UserServices.linkGoogleAccount(existingByEmail.id, claims.sub)
        }
        throw new AppError('Account Conflict - please login with email', 409)
    }

    // no matches no sub no email -> return create new account
    return UserServices.createGoogleUser(claims)
} 

