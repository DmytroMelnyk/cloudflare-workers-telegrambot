import { google } from "worker-auth-providers";
import { Env } from "../env";

export function getLoginUrl(env: Env, state: string | undefined = undefined) {
    return google.redirect({
        options: {
            clientId: env.GOOGLE_API_CLIENT_ID,
            redirectUrl: env.GOOGLE_API_REDIRECT_URL,
            scope: "https://www.googleapis.com/auth/spreadsheets",
            state: state
        }
    });
}

export function requestOAuth2Token(env: Env, code: string) {
    const redirectUrlWithCode = new URL(env.GOOGLE_API_REDIRECT_URL);
    redirectUrlWithCode.searchParams.append("code", code);
    return google.users({
        options: {
            clientId: env.GOOGLE_API_CLIENT_ID,
            redirectUrl: env.GOOGLE_API_REDIRECT_URL,
            clientSecret: env.GOOGLE_API_CLIENT_SECRET
        },
        request: new Request(redirectUrlWithCode.toString())
    });
}