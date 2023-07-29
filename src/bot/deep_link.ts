import { Env } from "../env";

export interface StateConsumer<TState, TResult> {
    (env: Env, state: TState): TResult;
}

// https://core.telegram.org/api/links#bot-links
// https://stackoverflow.com/questions/37264827/telegram-bot-oauth-authorization
export async function stateToDeepLink<TState>(env: Env, state: TState | string) {
    const deeplink_token = crypto.randomUUID();
    const strState = state as string;
    if (strState)
        await env.BOT_SESSION_DATA.put(deeplink_token, strState);
    else {
        await env.BOT_SESSION_DATA.put(deeplink_token, JSON.stringify(state));
    }

    const botUrl = new URL(env.BOT_URL);
    botUrl.searchParams.append("start", deeplink_token);
    return botUrl.toString();
}

export async function retrieveStateFromDeepLink<TState, TResult>(env: Env, deeplink_token: string, consumeState: StateConsumer<TState, TResult>) {
    const state = await env.BOT_SESSION_DATA.get<TState>(deeplink_token);
    const response = await consumeState(env, state!);
    await env.BOT_SESSION_DATA.delete(deeplink_token);
    return response;
}