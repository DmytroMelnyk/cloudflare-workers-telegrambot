import { stateToDeepLink } from '../bot/deep_link';
import { Env } from '../env';
import { IRequest } from 'itty-router';

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