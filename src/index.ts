import './__global';
import { webhookCallback } from "grammy/web";
import { Env } from './env';
import { error, json, Router } from 'itty-router';
import { callback } from './routes/routers';
import { startCommand, submitCommand } from './bot/commands';
import { createBot } from './bot/settings';

const router = Router();
router.get("/callback/:apiProvider", callback);
router.all('*', (request: Request, env: Env, context: ExecutionContext) => {
	const bot = createBot(env);
	bot.command("submit", submitCommand);
	bot.command("start", startCommand);
	return webhookCallback(bot, "cloudflare-mod")(request, env, context);
});

export default {
	fetch: (request: Request, env: Env, context: ExecutionContext) =>
		router.handle(request, env, context).then(json).catch(error)
};
