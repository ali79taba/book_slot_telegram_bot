const TelegramBot = require("node-telegram-bot-api");
const token = "1143090429:AAGglxADLqtnJGqmtKdzf073FvULpBR_17M";
const bot = new TelegramBot(token, { polling: true });

module.exports = bot;

