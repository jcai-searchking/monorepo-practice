import { OAuth2Client } from 'google-auth-library';
import { ENV } from '../config/env';
import { AppError } from '../errors/AppErrors';
import { googleUserPayloadSchema } from '../users/users.schemas'

const client = new OAuth2Client(ENV.GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(idToken: string) {
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