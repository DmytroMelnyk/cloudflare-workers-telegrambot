import { Context, SessionFlavor, Bot, lazySession, session } from "grammy/web";
import { Env } from "../env";
import { KvAdapter } from "@grammyjs/storage-cloudflare";
import { HydrateFlavor } from "@grammyjs/hydrate";
import { Content } from "@google/generative-ai";

export type BotContext = Context & SessionFlavor<SessionData> & HydrateFlavor<Context> & {
    config: Env;
};

// https://grammy.dev/plugins/session#storage-enhancements
export interface SessionData {
    gapi_access_token: string | undefined;
    content: Content[];
    firstExcersize: {
        set1RepetitionCount: number | undefined,
        set2RepetitionCount: number | undefined,
        set3RepetitionCount: number | undefined,
        set4RepetitionCount: number | undefined,
    };
}

// https://grammy.dev/plugins/session#session-keys
export function sessionKey(chatId: string | number) {
    return `chatId:${chatId}`;
}

export function createBot(env: Env) {
    const bot = new Bot<BotContext>(env.TG_BOT_TOKEN);

    bot.use(async (ctx, next) => {
        try {
            ctx.config = env;
            await next();
        } catch (error) {
            console.log(error);
        }
    });

    bot.use(session({
        initial: (): SessionData => {
            return {
                gapi_access_token: undefined,
                firstExcersize: {
                    set1RepetitionCount: 6,
                    set2RepetitionCount: 6,
                    set3RepetitionCount: 6,
                    set4RepetitionCount: undefined
                }
            };
        },
        getSessionKey: ctx => ctx.chat ? sessionKey(ctx.chat.id) : undefined,
        storage: new KvAdapter<SessionData>(env.BOT_SESSION_DATA)
    }));

    return bot;
}