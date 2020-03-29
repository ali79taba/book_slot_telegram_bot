const {bot} = require("../util/bot");
const fixNumber = require("../util/persian_numbers");

module.exports.show_list = (chatId) => {
    const response = "/show_teachers " + "نشان دادن استاد ها و درخواست تاییدیه از استاد" + "\n" +
        "/book_time " + " درخواست زمان " + "\n" +
        "/show_slots " + " نشان دادن بازه هایی که انتخاب کردید" + "\n" +
        "/delete_slot " + " حذف بازه های انتخاب شده " + "\n" ;
    bot.sendMessage(chatId, response);
};