const TelegramBot = require("node-telegram-bot-api");
const token = "1138100515:AAFg3J4Xo7sSVu9FmEWYC4rR-Jh-f9gdpWE";
const bot = new TelegramBot(token, { polling: true });

exports.bot = bot;