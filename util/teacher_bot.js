const TelegramBot = require("node-telegram-bot-api");
const token = "924758367:AAFzGp5wNWgkx1ReXpLQn9FlPPx29Ab2wSs";
const bot = new TelegramBot(token, { polling: true });

module.exports = bot;