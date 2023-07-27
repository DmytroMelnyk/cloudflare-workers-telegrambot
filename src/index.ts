import './__global';
import { Bot, webhookCallback, Keyboard, } from "grammy/web";
import { Env } from './env';

export default {
	fetch(request: Request, env: Env, context: ExecutionContext) {
		const bot = new Bot(env.TG_BOT_TOKEN);
		bot.command("start", async (ctx) => {
			const keyboard = new Keyboard();

			// Sending the component to the user
			keyboard.text("A").text("B").row();

			await ctx.reply("Hey, pick a time!", {
				reply_markup: keyboard,
			});
		});

		return webhookCallback(bot, "cloudflare-mod")(request, env, context);
	}
};

