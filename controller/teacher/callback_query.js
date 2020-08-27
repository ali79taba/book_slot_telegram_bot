const Pending = require('../../models/pendingAccept');
const Accepted = require('../../models/acceptedRequest');
const Teacher = require('../../models/teacher');
const User = require('../../models/user');
const Rejected = require('../../models/reject');

const teacher_bot = require('../../util/teacher_bot');

const {bot} = require('../../util/bot');

const mainView = require('../../view/teacher_main_page');

async function handleRejectionWithText(msg, teacherId, userId) {
    const chatId = msg.chat.id;
    Pending.destroy({where: {teacherId: teacherId, userId: userId}});
    Rejected.create({where: {teacherId: teacherId, userId: userId, description: msg.text}});
    teacher_bot.sendMessage(chatId, "درخواست دانشجوی مورد نظر رد شد").then();
    const teacher = await Teacher.findOne({where: {id: teacherId}});
    const response = "درخواست مشاوره شما با استاد " + teacher.first_name + " " + teacher.last_name + " با کد (استاد) " + teacher.id + " رد شد." + "\n" +
        "دلیل رد : " + msg.text  + "\n" +
        "(اکنون شما می توانید با دستور /start رزومه خود را اصلاح کنید و مجددا برای استاد مورد نظر خود، درخواست مشاوره ثبت کنید)";
    const user = await User.findOne({where: {id: userId}});
    await bot.sendMessage(user.chatId, response).then();
    mainView.showMain(chatId);
}

exports.sendAcceptRequestMessageForUser = async function (teacherId, userId){
    const teacher = await Teacher.findOne({where: {id: teacherId}});
    const response = "درخواست مشاوره شما با استاد " + teacher.first_name + " " + teacher.last_name + " با کد (استاد) " + teacher.id + " تایید شد." + "\n" +
        "(اکنون شما می توانید با دستور /book_time زمان مشاوره خود را انتخاب کنید.)";
    const user = await User.findOne({where: {id: userId}});
    await bot.sendMessage(user.chatId, response).then();
}

async function acceptingRequest(chatId, arguments) {
    console.log(arguments);
    const teacherId = arguments[0];
    const userId = arguments[1];
    const type = arguments[2];
    if (type === "yes") {
        Pending.destroy({where: {teacherId: teacherId, userId: userId}});
        Accepted.create({teacherId: teacherId, userId: userId});
        teacher_bot.sendMessage(chatId, "درخواست دانشجوی مورد نظر قبول شد").then();
        this.sendAcceptRequestMessageForUser(teacherId, userId).then();
    } else if (type === "no") {
        Pending.destroy({where: {teacherId: teacherId, userId: userId}});
        Rejected.create({where: {teacherId: teacherId, userId: userId}});
        teacher_bot.sendMessage(chatId, "درخواست دانشجوی مورد نظر رد شد");
        const response = "درخواست مشاوره شما با استاد " + teacher.first_name + " " + teacher.last_name + " با کد (استاد) " + teacher.id + " رد شد." + "\n" +
            "(اکنون شما می توانید با دستور /start رزومه خود را اصلاح کنید و مجددا برای استاد مورد نظر خود، درخواست مشاوره ثبت کنید)";
        const user = await User.findOne({where: {id: userId}});
        await bot.sendMessage(user.chatId, response).then();
        mainView.showMain(chatId);
    } else {
        teacher_bot.sendMessage(chatId, "لطفا دلیل خود را برای رد این درخواست بنویسید.", {reply_markup: JSON.stringify({force_reply: true})})
            .then(sentMessage => {
                teacher_bot.onReplyToMessage(
                    sentMessage.chat.id,
                    sentMessage.message_id,
                    (msg) => {
                        handleRejectionWithText(msg, teacherId, userId);
                    }
                );
            })
    }
}


exports.teacherCallbackQueryHandler = (msg) => {
    const data = msg.data;
    const arguments = data.split('_');
    const chatId = msg.message.chat.id;
    if (arguments[0] === "accepting") {
        arguments.splice(0, 1);
        acceptingRequest(chatId, arguments);
    }
};


