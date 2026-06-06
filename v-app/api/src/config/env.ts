const requiredEnvVars = [
    "NODE_ENV",
    'DATABASE_URL',
    'GOOGLE_CLIENT_ID'
] as const;

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(
            `Missing required environment variable: ${envVar}`
        )
    }
}

export const ENV = {
    NODE_ENV: process.env.NODE_ENV!,
    DATABASE_URL: process.env.DATABASE_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
}