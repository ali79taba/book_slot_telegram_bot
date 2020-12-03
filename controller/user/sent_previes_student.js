const User = require("../../models/user");
const {Op} = require('sequelize');
const {bot} = require('../../util/bot');
const sleep = require('sleep');

module.exports = async function sendPreviousStudent() {
    let users = await User.findAll({where: {updatedAt: {[Op.lte]: new Date('2020-11-01')}}});
    for (let user of users) {
        let res = "سلام دوباره :)\n" +
            "\n" +
            "✅ دوره جدید تکنوتز شروع شده!\n" +
            "\n" +
            "اگه هنوز موضوع پایان‌نامه ارشدت رو انتخاب نکردی، #تکنوتز برای تو عه!\n" +
            "\n";
        if (user.gerayesh && user.field)
            res += `تو برای گرایش ${user.gerayesh} از رشته ${user.field} اطلاعاتت رو تکمیل کردی.\n` +
                "\n";
        res += "اگه دوست داری اطلاعاتت رو اصلاح کنی و اساتید گرایشت رو ببینی از گزینه  اصلاح مشخصات استفاده کن.\n" +
            "\n";
        if (user.field && user.gerayesh)
            res += "اگر رشته و گرایشت هم درسته، که گزینه نمایش اساتید در گرایش من رو بزن که با اساتیدی که در گرایشت هستن آشنا بشی! \n" +
                "\n";
        res +=
            "پس بزن بریم!😎\n" +
            "\n" +
            "\n" +
            "راستی اگه سوالی داشتی، به ادمین تکنوتز پیام بده! \n" +
            "☎️ @Technothes_Admin"
        const inline_keyboard = [[{
            text: "اصلاح مشخصات",
            callback_data: "/start",
        }]]
        if(user.gerayesh && user.field){
            inline_keyboard[0].push({
                text: "نمایش اساتید در گرایش من",
                callback_data: "/show_teachers"
            });
        }
        const options = {
            reply_markup: JSON.stringify({
                inline_keyboard: inline_keyboard
            })
        };
        await bot.sendMessage(user.chatId, res, options)
        await sleep.msleep(500);
    }
}