const User = require("../models/user");
const bot = require("../util/bot");
const view = require('../view/register');
const fixNumber = require('../util/persian_numbers');
const fields = require('../models/field');

const callback_variable = require('../util/callback_handler_variable');
const showTeacher = require('./show_teachers');
const functionHandler = require('./user/function_handler');


exports.setUserName = (msg) => {
    const chatId = msg.chat.id;
    functionHandler.updateState(chatId, 'get_phone_number');
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
    functionHandler.updateState(chatId, 'set_gerayesh');
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

exports.setGrade =async (chatId, grade)=>{
    const user = await User.findOne({where:{chatId:chatId}});
    if(user){
        user.grade = grade;
        user.save();
        view.setReason(chatId);
    }
};

function getGrade(chatId){
    const inline_keyboard = [
        [{
            text:"کارشناسی",
            callback_data: callback_variable.GRADE + "_" + "کارشناسی",
        }],
        [{
            text:"کارشناسی ارشد",
            callback_data: callback_variable.GRADE + "_" + "کارشناسی ارشد",
        }],
        [{
            text:"دکتری",
            callback_data: callback_variable.GRADE + "_" + "دکتری",
        }],
    ];
    const options = {
        reply_markup: JSON.stringify({
            inline_keyboard: inline_keyboard
        })
    };
    bot.bot.sendMessage(chatId, 'مقطع تحصیلی خود را انتخاب کنید', options);
    // bot.bot.sendMessage(chatId,"لطفا مطقع تحصیلی خود را وارد کنید", {reply_markup: JSON.stringify({force_reply: true})})
    //     .then(sentMessage => {
    //         bot.bot.onReplyToMessage(
    //             sentMessage.chat.id,
    //             sentMessage.message_id,
    //             setGrade
    //         );
    //     });
}


exports.setUni = async (msg)=>{
    const chatId = msg.chat.id;
    functionHandler.updateState(chatId, 'getGrade');
    const uni = msg.text;
    const user = await User.findOne({where:{chatId:chatId}});
    if(user){
        user.uni = uni;
        user.save();
        getGrade(chatId);
    }
};

function getUni(chatId){
    functionHandler.updateState(chatId, "get_uni");
    bot.bot.sendMessage(chatId, "لطفا نام دانشگاه خود را وارد کنید");
    // bot.bot.sendMessage(chatId, "لطفا نام دانشگاه خود را وارد کنید", {reply_markup: JSON.stringify({force_reply: true})})
    //     .then(sentMessage => {
    //         bot.bot.onReplyToMessage(
    //             sentMessage.chat.id,
    //             sentMessage.message_id,
    //             setUni
    //         );
    //     });
}

exports.setGerayesh = (chatId, value) => {
    functionHandler.updateState(chatId, 'get_uni');
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

exports.setReasonQuestion = (chatId, data) => {
    console.log(data);
    User.findOne({where: {chatId: chatId}})
        .then(user =>{
            if(user){
                user.reasonQuestion = data;
                user.save();
                view.setIntrested(chatId);
            }
        })
        .catch(err => {
            console.log(err);
            bot.bot.sendMessage(chatId, "فرايند ثبت نام شما به مشکل خورد دوباره امتحان کنید");
        })
}

exports.setIntresting = (msg) => {
    const chatId = msg.chat.id;
    User.findAll({where: {chatId: chatId}})
        .then(user => {
            if (user.length > 0) {
                user[0].intresting = msg.text;
                user[0].save();
                const response = "مشخصات شما دریافت شد. در هر مرحله از کار، در صورت تمایل به اصلاح مشخصات، با دستور /start می توانید مشخصات ثبت نام خود را اصلاح کنید. \n" +
                    "اکنون اساتید مربوط به گرایش تان را برایتان ارسال می کنیم"
                bot.bot.sendMessage(chatId, response);
                showTeacher.showTeachers(msg);
            }
        })
        .catch(err => {
            console.log(err);
            bot.bot.sendMessage(chatId, "فرايند ثبت نام شما به مشکل خورد دوباره امتحان کنید");
        });
};

exports.createUser = (msg, match) => {
    const chatId = msg.chat.id;
    const starter = "📝 بذارید در فرآیند ثبت نام کمکتون کنم تا به استاد موردنظرتون برسید.\n" +
        "\n" +
        "من اطلاعات زیر رو صرفا برای اتصال مناسب به استادی که بتونه کمکتون کنه و بهینه شدن وقتی که شما و استاد صرف می کنید به کار می برم.\n" +
        "\n" +
        "متشکرم از اعتماد شما";
    bot.bot.sendMessage(chatId, starter).then();
    User.findAll({where: {chatId: chatId}})
        .then(user => {
            if (user.length === 0) {
                User.create({chatId: chatId, limit_request_number:5, limit_slot_number: 5});
            }
        })
        .catch(err => {
            console.log(err);
        });
    functionHandler.updateState(chatId, 'get_name');
    let response = "لطفا نام و نام خانوادگی خودتون رو وارد کنید";
    bot.bot.sendMessage(chatId, response);
    // bot.bot.sendMessage(chatId, response, {reply_markup: JSON.stringify({force_reply: true})})
    //     .then(sentMessage => {
    //         bot.bot.onReplyToMessage(
    //             sentMessage.chat.id,
    //             sentMessage.message_id,
    //             setUserName
    //         );
    //     });
};
