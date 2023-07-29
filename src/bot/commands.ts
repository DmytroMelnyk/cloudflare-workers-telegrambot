import { Keyboard } from "grammy/web";
import { google } from "worker-auth-providers";
import { getSpreadsheetValues } from '../spreadsheets/spreadsheet';
import { BotContext } from "./settings";
import { getLoginUrl, requestOAuth2Token } from "../spreadsheets/gauth";
import { retrieveStateFromDeepLink } from "./deep_link";

export async function startCommand(ctx: BotContext) {
    const deeplink_token = ctx.match as string;
    if (deeplink_token) {
        const response = await retrieveStateFromDeepLink(ctx.config, deeplink_token, requestOAuth2Token);
        const session = await ctx.session;
        session.gapi_access_token = response.tokens["access_token"];
    }

    await ctx.reply(`Hey, pick a time!`, {
        reply_markup: new Keyboard().text("A").text("B").row().text("X"),
    });
}

export async function submitCommand(ctx: BotContext) {
    const session = await ctx.session;
    if (session.gapi_access_token) {
        var values = await getSpreadsheetValues("16hjAjPu6A_OwQ0SN1604laTUMy48N_yGKhkgGWNbBqI", "Sheet1", session.gapi_access_token);
        console.log(values);
        await ctx.reply("response with gSheet data");
    }
    else {
        const authorizeUrl = await getLoginUrl(ctx.config);
        await ctx.reply(authorizeUrl);
    }
}