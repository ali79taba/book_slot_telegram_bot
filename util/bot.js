const appKey = require('./app_keys');

const TelegramBot = require("node-telegram-bot-api");
const token = appKey.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

exports.bot = bot;