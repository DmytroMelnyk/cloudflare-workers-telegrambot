import './__global';
import { webhookCallback } from "grammy/web";
import { Env } from './env';
import { error, json, Router } from 'itty-router';
import { callback } from './routes/routers';
import { startCommand, submitCommand, testCommand } from './bot/commands';
import { BotContext, createBot } from './bot/settings';
import { Menu } from '@grammyjs/menu';
import { WebApp } from '@grammyjs/web-app';

const values = new Map<number, number>();

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
router.get("/callback/:apiProvider", callback);
router.all('*', (request: Request, env: Env, context: ExecutionContext) => {
	const bot = createBot(env);
	bot.use(menu);
	bot.command("submit", submitCommand);
	bot.command("start", startCommand);
	bot.command("test", testCommand);
	bot.command("menu", ctx => ctx.reply("Check out this menu:", { reply_markup: menu }));
	return webhookCallback(bot, "cloudflare-mod")(request, env, context);
});

export default {
	fetch: (request: Request, env: Env, context: ExecutionContext) =>
		router.handle(request, env, context).then(json).catch(error)
};
