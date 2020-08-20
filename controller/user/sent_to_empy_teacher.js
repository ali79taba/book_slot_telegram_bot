const User = require('../../models/user');
const Teacher = require('../../models/teacher');
const Accepted = require('../../models/acceptedRequest');
const {bot} = require('../../util/bot');
const TimeSlot = require('../../models/timeSlot');

const sleep = require('sleep');

module.exports.sendEmptyTeacher = async () => {
    let users = await User.findAll();
    for (let index in users) {
        const user = users[index];
        let res = "سلام " + user.name + " عزیز\n" +
            "فاز اول کار ما تموم شده و ما وظیفه خودمون میدونیم که بابت اینکه نتونستیم در رشته و گرایش شما استادی بهتون معرفی کنیم، عذرخواهی کنیم!\n" +
            "\n" +
            "در فاز دوم تکنوتز تلاش می کنیم استادهای درجه یک برات هماهنگ کنیم که بتونی باشون مشورت کنی. 💪\n" +
            "\n" +
            "راستی اتفاقات جدید تکنوتز رو تو کانالمون بهت اطلاع میدیم.\n" +
            "\n" +
            "⬇️⬇️ حالا اگر مایل هستی، روی دکمه پایین بزن ⬇️⬇️\n" +
            "\n" +
            "راستی اگر سوالی داری یا راهنمایی لازم داری میتونی به ادمین تکنوتز پیام بدی. آیدی ادمین:\n" +
            "@Technothes_Admin";
        const teacher = await Teacher.findOne({where: {gerayesh: user.gerayesh}});
        if (!teacher && user.name && user.grade && user.gerayesh && user.uni && user.intresting && user.phone_number && user.field) {
            const inline_keyboard = [[{
                text: "ورود به کانال تکنوتز",
                url: "https://t.me/technothesis",
            }]]
            const options = {
                reply_markup: JSON.stringify({
                    inline_keyboard: inline_keyboard
                })
            };
            await bot.sendMessage(user.chatId, res, options)
            await sleep.msleep(500);
        }
    }
}

module.exports.sendEmptyTimeSlot = async () => {
    let users = await User.findAll();
    for (let index in users) {
        const user = users[index];
        let res = "سلام " + user.name + " عزیز\n" +
            "\n" +
            "طرح تکنوتز به پایان رسید و شما ضمن پیدا کردن استاد مناسب، زمانی رو برای برقراری ارتباط تنظیم نکردید.\n" +
            "\n" +
            "دونستن دلیل این اتفاق میتونه ما رو در دوره های بعدیمون خیلی کمک کنه🔽";
        const accepted = await Accepted.findOne({where: {userId: user.id}});
        const timeSlot = await TimeSlot.findOne({where: {userId: user.id}});
        if (accepted && !timeSlot) {
            const inline_keyboard = [
                [{
                    text: "دستم خورد 😃",
                    callback_data: "voteNotHaveSlot_1",
                }],
                [{
                    text: "فقط میخواستم عملکرد بات رو ببینم",
                    callback_data: "voteNotHaveSlot_2",
                }],
                [{
                    text: "وقت مشترکی با استاد پیدا نکردم",
                    callback_data: "voteNotHaveSlot_3",
                }],
                [{
                    text: "دقیقا نمی دونستم چی باید به استاد بگم",
                    callback_data: "voteNotHaveSlot_4",
                }],
                [{
                    text: "روند ربات واضح نبود🤨، فکر میکردم با استاد قرار ملاقات ست کردم",
                    callback_data: "voteNotHaveSlot_5",

                }]
            ]
            const options = {
                reply_markup: JSON.stringify({
                    inline_keyboard: inline_keyboard
                })
            };
            await bot.sendMessage(user.chatId, res, options)
            await sleep.msleep(500);
        }
    }
}

module.exports.sendForCompleteInfo = async () => {
    let users = await User.findAll();
    for (let index in users) {
        const user = users[index];
        if (!user.name || !user.grade || !user.gerayesh || !user.uni || !user.intresting || !user.phone_number || !user.field) {
            let res = "سلام " + user.name + " عزیز\n" +
                "امیدوارم صحیح و سالم باشی!\n" +
                "\n" +
                "شما فرآیند ثبت نام تو ربات تکنوتز رو شروع کردی، ولی تکمیل نکردی و ما کمکی از دستمون برنیومد!😕\n" +
                "الان فاز اول تکنوتز تموم شده ولی اگه شما رشته و گرایشت رو وارد کنی، میتونیم برای فاز دوم که به زودی شروع میشه، اساتید متنوعی مربوط به گرایشت هماهنگ کنیم و برای مشورت بهت معرفی کنیم.\n" +
                "\n" +
                "⬇️⬇️ حالا اگر مایل هستی، روی دکمه پایین بزن ⬇️⬇️\n" +
                "\n" +
                "راستی اگر سوالی داری یا راهنمایی لازم داری میتونی به ادمین تکنوتز پیام بدی. آیدی ادمین:\n" +
                "@Technothes_Admin";
            const inline_keyboard = [[{
                text: "تکمیل ثبت نام",
                callback_data: "start",
            }]]
            const options = {
                reply_markup: JSON.stringify({
                    inline_keyboard: inline_keyboard
                })
            };
            await bot.sendMessage(user.chatId, res, options)
            await sleep.msleep(500);
        }
    }
}

