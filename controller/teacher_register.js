const Teacher = require('../models/teacher');
const teacher_bot = require('../util/teacher_bot');
const fixNumber = require('../util/persian_numbers');
const mainView = require('../view/teacher_main_page');

exports.handleCode = (msg) => {
    const chatId = msg.chat.id;
    let code = fixNumber(msg.text);
    Teacher.findOne({where: {code: code}}).then(teacher=>{
        if(teacher){
            teacher.chatId = chatId;
            teacher.save();
            teacher_bot.sendMessage(chatId,"آقای " + teacher.first_name + " " + teacher.last_name + " شما با موفقیت وارد شدید");
            mainView.showMain(chatId);
        }else{
            teacher_bot.sendMessage(chatId, "کد شما درست نمی باشد! دوبار /start را بزنید");
        }
    })
};

exports.teacherRegister = (msg, match) => {
    const chatId = msg.chat.id;
    Teacher.findOne({where: {chatId: chatId}})
        .then(teacher => {
            if (teacher) {
                let response = "با سلام به ربات خوش آمدید";
                teacher_bot.sendMessage(chatId, response);
            } else {
                let response = "با سلام لطفا کد معرف خود را وارد کنید";
                teacher_bot.sendMessage(chatId, response, {reply_markup: JSON.stringify({force_reply: true})})
                    .then(sentMessage => {
                        teacher_bot.onReplyToMessage(
                            sentMessage.chat.id,
                            sentMessage.message_id,
                            this.handleCode
                        );
                    })
            }
        })
        .catch(err => {
            console.log(err);
        });
};