import { Context, SessionFlavor, Bot, lazySession } from "grammy/web";
import { Env } from "../env";
import { KvAdapter } from "@grammyjs/storage-cloudflare";

export type BotContext = Context & SessionFlavor<SessionData> & {
    config: Env;
};

// https://grammy.dev/plugins/session#storage-enhancements
export interface SessionData {
    gapi_access_token: string | undefined;
}

// https://grammy.dev/plugins/session#session-keys
export function sessionKey(chatId: string | number) {
    return `chatId:${chatId}`;
}

export function createBot(env: Env) {
    const bot = new Bot<BotContext>(env.TG_BOT_TOKEN);

    bot.use((ctx, next) => {
        ctx.config = env;
        return next();
    });

    bot.use(lazySession({
        initial: (): SessionData => {
            return { gapi_access_token: undefined };
        },
        getSessionKey: ctx => ctx.chat ? sessionKey(ctx.chat.id) : undefined,
        storage: new KvAdapter<SessionData>(env.BOT_SESSION_DATA)
    }));

    return bot;
}