import './__global';
import { Bot, webhookCallback } from "grammy/web";
import { hydrate } from "@grammyjs/hydrate";
import { Env } from './env';
import { error, json, Router, createCors, IRequest } from 'itty-router';
import { callback, demoPost, checkInitData } from './routes/routers';
import { startCommand, submitCommand, testCommand, hearsWord, hearsWord2, bardResponse, bardResponseImage } from './bot/commands';
import { BotContext, createBot } from './bot/settings';
import { Menu } from '@grammyjs/menu';
import { TgBotRequest } from './routes/tg_bot_request';

const { preflight, corsify } = createCors({
	origins: ['https://workout-app-7y2.pages.dev'],
	headers: {
		"Access-Control-Allow-Credentials": "true",
	}
});

const withTgBot = (request: TgBotRequest, env: Env) => {
	const bot = createBot(env);
	request.bot = bot;
};

// https://grammy.dev/plugins/menu
const menu = new Menu<BotContext>("toggle")
	.text("<", ctx => { ctx.session.firstExcersize.set1RepetitionCount!--; ctx.menu.update(); })
	.text(ctx => `${ctx.session.firstExcersize.set1RepetitionCount}`)
	.text(">",
		ctx => {
			ctx.session.firstExcersize.set1RepetitionCount!++;
			ctx.menu.update();
		})
	.row()
	.text("<", ctx => { ctx.session.firstExcersize.set2RepetitionCount!--; ctx.menu.update(); })
	.text(ctx => `${ctx.session.firstExcersize.set2RepetitionCount}`)
	.text(">",
		ctx => {
			ctx.session.firstExcersize.set2RepetitionCount!++;
			ctx.menu.update();
		});

const router = Router();
router.all('*', preflight);
router.get("/callback/:apiProvider", callback);
// router.post("/demo/api", demoPost);
router.post<TgBotRequest>("/checkInitData", withTgBot, checkInitData);
router.all<TgBotRequest>('*', withTgBot, (request: TgBotRequest, env: Env, context: ExecutionContext) => {
	const bot = request.bot;
	bot.use(menu);
	bot.use(hydrate());
	bot.command("submit", submitCommand);
	bot.command("start", startCommand);
	bot.command("test", testCommand);
	bot.command("menu", ctx => ctx.reply("Check out this menu:", { reply_markup: menu }));
	bot.hears("X", hearsWord);
	bot.hears("Y", hearsWord2);
	// https://grammy.dev/guide/filter-queries
	bot.on("message:text", bardResponse);
	bot.on("message:photo", bardResponseImage);
	return webhookCallback(bot, "cloudflare-mod")(request, env, context);
});

export default {
	fetch: (request: Request, env: Env, context: ExecutionContext) =>
		router.handle(request, env, context).then(json).catch(error).then(corsify)
};
