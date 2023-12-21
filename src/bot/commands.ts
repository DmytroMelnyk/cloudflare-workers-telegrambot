import { InlineKeyboard, Keyboard } from "grammy/web";
import { google } from "worker-auth-providers";
import { getSpreadsheetValues } from '../spreadsheets/spreadsheet';
import { BotContext } from "./settings";
import { getLoginUrl, requestOAuth2Token } from "../spreadsheets/gauth";
import { retrieveStateFromDeepLink } from "./deep_link";
import { Menu } from "@grammyjs/menu";
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from 'openai';

export async function startCommand(ctx: BotContext) {
    const deeplink_token = ctx.match as string;
    if (deeplink_token) {
        const response = await retrieveStateFromDeepLink(ctx.config, deeplink_token, requestOAuth2Token);
        const session = ctx.session;
        session.gapi_access_token = response.tokens["access_token"];
    }

    await ctx.reply(`Hey, pick a time!`, {
        reply_markup: new Keyboard().text("A").text("B").row().text("X"),
    });
}

export async function submitCommand(ctx: BotContext) {
    const session = ctx.session;
    if (session.gapi_access_token) {
        var values = await getSpreadsheetValues("16hjAjPu6A_OwQ0SN1604laTUMy48N_yGKhkgGWNbBqI", "Sheet1", session.gapi_access_token);
        console.log(values);
        await ctx.reply("response with gSheet data");
    }
    else {
        const authorizeUrl = await getLoginUrl(ctx.config);
        await ctx.reply("Proceed with Google Auth?", {
            reply_markup: new InlineKeyboard().url("🗝️", authorizeUrl)
        });
    }
}

export async function testCommand(ctx: BotContext) {

    await ctx.reply("1", {
        reply_markup: new InlineKeyboard().webApp("google", "https://workout-app-7y2.pages.dev/")
    });

    //ctx.api.answerWebAppQuery()
}

export async function hearsWord(ctx: BotContext) {
    const statusMessage = await ctx.reply("Processing...");
    const response = await fetch(`http://api.scraperapi.com/?api_key=${ctx.config.SCRAPER_API_KEY}&country_code=us&url=https://generativelanguage.googleapis.com/v1beta/models/text-bison-001:generateText?key=${ctx.config.BARD_API_TOKEN}`, {
        method: 'POST',
        body: JSON.stringify({
            prompt: {
                text: "Write a story about a magic backpack."
            }
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    await statusMessage.editText(await response.text());
}

export async function hearsWord2(ctx: BotContext) {
    const statusMessage = await ctx.reply("Processing...");

    const openai = new OpenAI({
        apiKey: ctx.config.CHAT_GPT_TOKEN, // This is the default and can be omitted
    });

    const stream = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Say this is a test' }],
        stream: true,
    });
    for await (const chunk of stream) {
        statusMessage.editText(chunk.choices[0]?.delta?.content || '');
    }
}

export async function bardResponse(ctx: BotContext) {
    const resp = await fetch("https://ifconfig.me/");
    console.log(await resp.text());
    const statusMessage = await ctx.reply("Processing...");
    const genAI = new GoogleGenerativeAI(ctx.config.BARD_API_TOKEN);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    let chat = model.startChat({
        history: ctx.session.content,
        // generationConfig: {
        //     maxOutputTokens: 100,
        // },
    });
    const result = await chat.sendMessageStream(ctx.message?.text!);
    let text = "";
    for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        text += chunkText;
        await statusMessage.editText(text);
    }

    // ctx.session.content = await chat.getHistory();
}
