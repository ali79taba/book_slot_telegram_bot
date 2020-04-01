const register = require('../controller/register');
const bot = require("../util/bot");
const fields = require('../models/field');

exports.setPhoneNumber = (chatId) => {
    let response = "لطفا شماره همراه خودتون رو وارد کنید (ارتباط شما با استاد از طریق این شماره برقرار خواهد شد)";
    bot.bot.sendMessage(chatId, response, {reply_markup: JSON.stringify({force_reply: true})})
        .then(sentMessage => {
            bot.bot.onReplyToMessage(
                sentMessage.chat.id,
                sentMessage.message_id,
                register.setPhoneNumber
            );
        });
};

function getFieldAnother(chatId) {
    bot.bot.sendMessage(chatId, 'نام رشته خود را وارد کنید', {reply_markup: JSON.stringify({force_reply: true})})
        .then(sentMessage => {
            bot.bot.onReplyToMessage(
                sentMessage.chat.id,
                sentMessage.message_id,
                (msg)=>{
                    register.setField(msg.chat.id, msg.text);
                }
            );
        });
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
    bot.bot.sendMessage(chatId, 'رشته ی خود را انتخاب کنید', options).then((msg) => {
        bot.bot.once('callback_query', (msg) => {
            const value = msg.data;
            const chatId = msg.message.chat.id;
            if (value === 'سایر') {
                getFieldAnother(chatId);
            } else {
                register.setField(chatId, value);
            }
        })
    })
};

exports.setGerayesh = (chatId, field) => {
    let field_object = fields.find(o => o.name === field);
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
        bot.bot.sendMessage(chatId, 'گرایش خود را انتخاب کنید', options).then((msg) => {
            bot.bot.once('callback_query', (msg) => {
                const value = msg.data;
                const chatId = msg.message.chat.id;
                register.setGerayesh(chatId, value)
            })
        })
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
};

exports.setIntrested = (chatId) => {
    let response = "لطفا در صورت انتخاب استاد راهنما، نام استاد راهنما خود را وارد کنید و در غیر این صورت، به صورت مختصر در مورد زمینه کاری و تجربیات علمی خود توضیح دهید.";
    bot.bot.sendMessage(chatId, response, {reply_markup: JSON.stringify({force_reply: true})})
        .then(sentMessage => {
            bot.bot.onReplyToMessage(
                sentMessage.chat.id,
                sentMessage.message_id,
                register.setIntresting
            );
        });
};