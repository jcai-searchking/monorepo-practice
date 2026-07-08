export const environment = {
  production: false,
  // Base URL of the Express API (see apps/api/src/server.ts — default port 3001)
  apiBaseUrl: 'http://localhost:3001',
  // Google Identity Services client id (from apps/api/scratch/google-test.html).
  // NOTE: add http://localhost:4200 as an "Authorized JavaScript origin" for this
  // client in Google Cloud Console, or sign-in will fail with an origin error.
  googleClientId:
    '632039701652-478v5m9fu3l48eq4gvs3n0n64j2is7e3.apps.googleusercontent.com',
};
