const register = require('../controller/register');
const functionHandler = require('../controller/user/function_handler');

const bot = require("../util/bot");

const fields = require('../models/field');



exports.setPhoneNumber = (chatId) => {
    let response = "لطفا شماره همراه خودتون رو وارد کنید (ارتباط شما با استاد از طریق این شماره برقرار خواهد شد)";
    bot.bot.sendMessage(chatId, response);
    // bot.bot.sendMessage(chatId, response, {reply_markup: JSON.stringify({force_reply: true})})
    //     .then(sentMessage => {
    //         bot.bot.onReplyToMessage(
    //             sentMessage.chat.id,
    //             sentMessage.message_id,
    //             register.setPhoneNumber
    //         );
    //     });
};

exports.getFieldAnother = async function (chatId) {
    await functionHandler.updateState(chatId, 'set_another_field');
    bot.bot.sendMessage(chatId, 'نام رشته خود را وارد کنید');
    // bot.bot.sendMessage(chatId, 'نام رشته خود را وارد کنید', {reply_markup: JSON.stringify({force_reply: true})})
    //     .then(sentMessage => {
    //         bot.bot.onReplyToMessage(
    //             sentMessage.chat.id,
    //             sentMessage.message_id,
    //             (msg)=>{
    //                 register.setField(msg.chat.id, msg.text);
    //             }
    //         );
    //     });
}

exports.setField = (chatId) => {

    const inline_keyboard = [];
    for (const key in fields) {
        inline_keyboard.push([{
            text: fields[key].name,
            callback_data: fields[key].name,
        }])
    }
    const options = {
        reply_markup: JSON.stringify({
            inline_keyboard: inline_keyboard
        })
    };
    // console.log(options);
    functionHandler.updateState(chatId, 'setField').then(()=> {
        bot.bot.sendMessage(chatId, 'رشته ی خود را انتخاب کنید', options);
    });
};

exports.setGerayesh = (chatId, field) => {
    functionHandler.updateState(chatId, "set_gerayesh").then(_=>{
        let field_object = fields.find(o => o.name === field);
        if(!field_object){
            console.log("enter your not default gerayesh");
            let response = "گرایش خود را وارد کنید.";
            bot.bot.sendMessage(chatId, response, {reply_markup: JSON.stringify({force_reply: true})})
                .then(sentMessage => {
                    bot.bot.onReplyToMessage(
                        sentMessage.chat.id,
                        sentMessage.message_id,
                        (msg)=>{
                            register.setGerayesh(msg.chat.id, msg.text);
                        }
                    );
                });
            return;
        }
        if(field_object.gerayesh.length > 0){
            const inline_keyboard = [];
            const gerayesh = field_object.gerayesh;
            for (const key in gerayesh) {
                inline_keyboard.push([{
                    text: gerayesh[key],
                    callback_data: gerayesh[key],
                }])
            }
            const options = {
                reply_markup: JSON.stringify({
                    inline_keyboard: inline_keyboard
                })
            };
            functionHandler.updateState(chatId, 'setGerayesh');
            bot.bot.sendMessage(chatId, 'گرایش خود را انتخاب کنید', options)

        }else{
            let response = "گرایش خود را وارد کنید.";
            bot.bot.sendMessage(chatId, response, {reply_markup: JSON.stringify({force_reply: true})})
                .then(sentMessage => {
                    bot.bot.onReplyToMessage(
                        sentMessage.chat.id,
                        sentMessage.message_id,
                        (msg)=>{
                            register.setGerayesh(msg.chat.id, msg.text);
                        }
                    );
                });
        }
    });
};

exports.setReason = (chatId) => {
    // functionHandler.updateState(chatId, "setReason")
    const response = "برای اینکه استاد مشاور بهتر بتونه بهت کمک کنه، خوبه که بدونیم برای تعریف تز کدوم مورد برات اولویت داره؟"
    const inline_keyboard = [];
    const choices = ["آشنایی بیشتر با حیطه کاری استاد",
        "همکاری برای توسعه نتایج پایان نامه",
        "استخدام در شرکت ها",
        "انجام مشترک پروژه با شرکت",
        "استفاده از حمایت مالی شرکت",
        "مزایای نخبگی و کسری خدمت",
        "انتشار مقاله از پایان نامه",
        "سایر"
    ]
    for (const key in choices) {
        inline_keyboard.push([{
            text: choices[key],
            callback_data: choices[key],
        }])
    }
    const options = {
        reply_markup: JSON.stringify({
            inline_keyboard: inline_keyboard
        })
    };
    functionHandler.updateState(chatId, 'setReason').then(()=>{
        bot.bot.sendMessage(chatId, response, options);
    });
}

exports.setIntrested = (chatId) => {
    functionHandler.updateState(chatId, 'setIntresting');
    let response = "لطفا در صورت انتخاب استاد راهنما، نام استاد راهنما خود را وارد کنید و در غیر این صورت، به صورت مختصر در مورد زمینه کاری و تجربیات علمی خود توضیح دهید.";
    bot.bot.sendMessage(chatId, response);
    // bot.bot.sendMessage(chatId, response, {reply_markup: JSON.stringify({force_reply: true})})
    //     .then(sentMessage => {
    //         bot.bot.onReplyToMessage(
    //             sentMessage.chat.id,
    //             sentMessage.message_id,
    //             register.setIntresting
    //         );
    //     });
};