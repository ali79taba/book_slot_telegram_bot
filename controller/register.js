const User = require("../models/user");
const bot = require("../util/bot");
const view = require('../view/register');
const fixNumber = require('../util/persian_numbers');
const fields = require('../models/field');


const setUserName = (msg) => {
    const chatId = msg.chat.id;
    User.findAll({where: {chatId: chatId}})
        .then(user => {
            if (user.length > 0) {
                user[0].name = msg.text;
                user[0].save();
                view.setPhoneNumber(chatId);
            }
        })
        .catch(err => {
            console.log(err);
        });

};

exports.setPhoneNumber = (msg) => {
    const chatId = msg.chat.id;
    User.findAll({where: {chatId: chatId}})
        .then(user => {
            if (user.length > 0) {
                console.log(msg.text);
                user[0].phone_number = msg.text;
                user[0].save();
                view.setField(chatId);
            }
        })
        .catch(err => {
            console.log(err);
        });

};

exports.setField = (chatId, value) => {
    User.findAll({where: {chatId: chatId}})
        .then(user => {
            if (user.length > 0) {
                user[0].field = value;
                user[0].save();
                view.setGerayesh(chatId, value);
            }
        })
        .catch(err => {
            console.log(err);
        });
};

async function setGrade(msg) {
    const chatId = msg.chat.id;
    const user = await User.findOne({where:{chatId:chatId}});
    if(user){
        user.grade = msg.text;
        user.save();
        view.setIntrested(chatId);
    }
}

function getGrade(chatId){
    bot.bot.sendMessage(chatId,"لطفا مطقع تحصیلی خود را وارد کنید", {reply_markup: JSON.stringify({force_reply: true})})
        .then(sentMessage => {
            bot.bot.onReplyToMessage(
                sentMessage.chat.id,
                sentMessage.message_id,
                setGrade
            );
        });
}

async function setUni(msg){
    const chatId = msg.chat.id;
    const uni = msg.text;
    const user = await User.findOne({where:{chatId:chatId}});
    if(user){
        user.uni = uni;
        user.save();
        getGrade(chatId);
    }
}

function getUni(chatId){
    bot.bot.sendMessage(chatId, "لطفا نام دانشگاه خود را وارد کنید", {reply_markup: JSON.stringify({force_reply: true})})
        .then(sentMessage => {
            bot.bot.onReplyToMessage(
                sentMessage.chat.id,
                sentMessage.message_id,
                setUni
            );
        });
}

exports.setGerayesh = (chatId, value) => {
    User.findAll({where: {chatId: chatId}})
        .then(user => {
            if (user.length > 0) {
                user[0].gerayesh = value;
                user[0].save();
                getUni(chatId);
            }
        })
        .catch(err => {
            console.log(err);
        });
};

exports.setIntresting = (msg) => {
    const chatId = msg.chat.id;
    User.findAll({where: {chatId: chatId}})
        .then(user => {
            if (user.length > 0) {
                user[0].intresting = msg.text;
                user[0].save();
                const response = "مشخصات شما دریافت شد. در هر مرحله از کار، در صورت تمایل به اصلاح مشخصات، با دستور /start می توانید مشخصات ثبت نام خود را اصلاح کنید. \n" +
                    "اکنون می توانید با دستور " +
                    "/show_teachers" +
                    " ، استاد های گرایش خود را مشاهده کنید.";
                bot.bot.sendMessage(chatId, response);
            }
        })
        .catch(err => {
            console.log(err);
            bot.bot.sendMessage(chatId, "فرايند ثبت نام شما به مشکل خورد دوباره امتحان کنید");
        });
};

exports.createUser = (msg, match) => {
    const chatId = msg.chat.id;
    const starter = "سلام\n" +
        "به ربات تکنوتز خوش آمدید!\n" +
        "تکنوتز تلاش می کند فرصت استفاده از تجربه فارغ التحصیلان دانشگاهی صنعت دیده را برای شما فراهم کند.\n" +
        "شما برای استفاده از اساتید تکنوتز لازم است در این ربات ثبت نام کنید و اطلاعات خود را وارد کنید.\n" +
        "این اطلاعات برای تایید حوزه تخصصی شما و معرفی اولیه شما به استاد استفاده می شود و در صورت تکمیل نبودن یا مرتبط نبودن اطلاعات ممکن است درخواست گفت و گوی شما با استاد توسط ادمین تایید نشود.\n" +
        "لطفا برای شکل گیری بهتر گفت و گو اطلاعات خواسته شده را تکمیل نمایید.";
    bot.bot.sendMessage(chatId, starter).then();
    User.findAll({where: {chatId: chatId}})
        .then(user => {
            if (user.length === 0) {
                User.create({chatId: chatId});
            }
        })
        .catch(err => {
            console.log(err);
        });
    let response = "لطفا نام و نام خانوادگی خود را وارد کنید";
    bot.bot.sendMessage(chatId, response, {reply_markup: JSON.stringify({force_reply: true})})
        .then(sentMessage => {
            bot.bot.onReplyToMessage(
                sentMessage.chat.id,
                sentMessage.message_id,
                setUserName
            );
        });
};
