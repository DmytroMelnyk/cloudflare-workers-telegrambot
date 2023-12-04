import { stateToDeepLink } from '../bot/deep_link';
import { validate } from '../bot/web_app';
import { Env } from '../env';
import { IRequest, error, json } from 'itty-router';
import { TgBotRequest } from './tg_bot_request';

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
    return new Response('{"message": "ok"}');
}

export async function checkInitData(request: TgBotRequest, env: Env) {
    const telegramInitData = await request.json();
    const urlParams = new URLSearchParams(telegramInitData["_auth"]);
    const chat_id = Number(JSON.parse(urlParams.get("user")!)["id"]);
    await request.bot.api.sendMessage(chat_id, "message");

    if (await validate(urlParams, env.TG_BOT_TOKEN)) {
        return json({
            ok: "check success"
        });
    }
    else {
        return error(401, {
            error: "hash mismatch"
        });
    }
}
