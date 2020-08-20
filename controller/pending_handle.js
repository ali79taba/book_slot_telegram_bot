const Teacher = require('../models/teacher');
const Pending = require('../models/pendingAccept');
const teacher_bot = require('../util/teacher_bot');
const fixNumber = require('../util/persian_numbers');
const User = require('../models/user');
const Accepted = require('../models/acceptedRequest');

const mainView = require('../view/teacher_main_page');

exports.pendingHandle = (msg, match) => {
    const chatId = msg.chat.id;
    Teacher.findOne({where: {chatId: chatId}}).then(teacher => {
        Pending.findAll({where: {teacherId: teacher.id}})
            .then(async pendingList => {
                if (pendingList.length === 0) {
                    let response = "شما هنوز درخواستی ندارید";
                    teacher_bot.sendMessage(chatId, response).then().catch();
                } else {
                    let response = "لیست دانشجویانی که به شما درخواست دادند :\n";
                    for (let contract in pendingList) {
                        let student = await User.findOne({where: {id: pendingList[contract].userId}});
                        response += `نام : ${student.name}    کد شناسایی : ${student.id}\n`;
                    }
                    await teacher_bot.sendMessage(chatId, response);
                }
                mainView.showMain(chatId);
            })
            .catch(err => {
                console.log(err);
            });
    });
};

async function acceptOrDenied(msg, teacherId, userId) {
    const chatId = msg.chat.id;
    const inline_keyboard = [
        [{
            text: "تایید",
            callback_data: "accepting" + "_" + teacherId + "_" + userId + "_" + "yes",
        }],
        [{
            text: "رد",
            callback_data: "accepting" + "_" + teacherId + "_" + userId + "_" + "no",
        }],
        [{
            text: "رد به همراه توضیحات",
            callback_data: "accepting" + "_" + teacherId + "_" + userId + "_" + "no_with_text",
        }]
    ];
    const options = {
        reply_markup: JSON.stringify({
            inline_keyboard: inline_keyboard
        })
    };
    await teacher_bot.sendMessage(chatId, 'دانشجو را تایید یا رد می کنید ؟', options);
}

exports.showStudent = (msg, teacherId) => {
    const chatId = msg.chat.id;
    const userId = fixNumber(msg.text);
    Pending.findOne({where: {userId: fixNumber(userId), teacherId: teacherId}}).then(pend => {
        if (pend) {
            acceptOrDenied(msg, teacherId, userId).catch((err) => {
                console.log(err);
                teacher_bot.sendMessage(chatId, "در حذف کردن مشکلی به وجود آمده دوباره امتحان کنید");
            });
            console.log("REQUEST ACCEPTED $$$$");
        } else {
            teacher_bot.sendMessage(chatId, "این دانشجو درخواست از شما در لیست انتظار ندارد")
        }
    })

};

exports.acceptingGetCode = (msg, match) => {
    const chatId = msg.chat.id;
    Teacher.findOne({where: {chatId: chatId}}).then(teacher => {
        if (teacher) {
            teacher_bot.sendMessage(chatId, 'لطفا کد دانشجو مورد نظر را وارد کنید', {reply_markup: JSON.stringify({force_reply: true})})
                .then(sentMessage => {
                    teacher_bot.onReplyToMessage(
                        sentMessage.chat.id,
                        sentMessage.message_id,
                        (msg) => {
                            this.showStudent(msg, teacher.id);
                        }
                    );
                });
        }
    })
};