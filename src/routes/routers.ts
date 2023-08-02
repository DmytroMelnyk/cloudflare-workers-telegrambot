import { stateToDeepLink } from '../bot/deep_link';
import { Env } from '../env';
import { IRequest } from 'itty-router';

const corsHeaders = {
    "Access-Control-Allow-Origin": "https://workout-app-7y2.pages.dev",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
};

export async function callback(request: IRequest, env: Env) {
    const code = request.query["code"] as string;
    if (!code) {
        return Response.json({ "Error": "No auth code" }, { status: 400 });
    }

    // const chatId = request.query["state"] as string;
    // if (!chatId) {
    //     return Response.json({ "Error": "No state with chatId" }, { status: 400 });
    // }

    const apiProvider = <string>request.params["apiProvider"];
    const deepLinkUrl = await stateToDeepLink(env, code!);
    console.log(deepLinkUrl);
    return Response.redirect(deepLinkUrl, 301);
}

export async function demoPost(request: IRequest, env: Env) {
    const body = await request.json();
    console.log(body);

    // Handle CORS preflight requests.
    return new Response('{"message": "ok"}', {
        headers: {
            ...corsHeaders,
        },
        status: 200
    });
}

export async function demoPostOptions(request: IRequest, env: Env) {
    if (
        request.headers.get("Origin") !== null &&
        request.headers.get("Access-Control-Request-Method") !== null &&
        request.headers.get("Access-Control-Request-Headers") !== null
    ) {
        // Handle CORS preflight requests.
        return new Response(null, {
            headers: {
                ...corsHeaders,
                "Access-Control-Allow-Headers": request.headers.get(
                    "Access-Control-Request-Headers"
                ),
            },
        });
    } else {
        // Handle standard OPTIONS request.
        return new Response(null, {
            headers: {
                Allow: "GET, HEAD, POST, OPTIONS",
            },
        });
    }
}