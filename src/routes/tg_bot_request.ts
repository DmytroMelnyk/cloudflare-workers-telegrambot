import { Bot } from "grammy/web";
import { BotContext } from "../bot/settings";
import { IRequest } from "itty-router";

export type TgBotRequest = {
    bot: Bot<BotContext>;
} & IRequest;