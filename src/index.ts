import './__global';
import { Bot, webhookCallback } from "grammy/web";
import { Env } from './env';

export default {
	fetch(request: Request, env: Env, context: ExecutionContext) {
		const bot = new Bot(env.TG_BOT_TOKEN);
		bot.command("start", async (ctx) => {
			await ctx.reply("Hello, world!");
		});

		return webhookCallback(bot, "cloudflare-mod")(request, env, context);
	}
};

