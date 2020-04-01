const Pending = require('../../models/pendingAccept');
const Accepted = require('../../models/acceptedRequest');
const User = require('../../models/user');
const Teacher = require('../../models/teacher');
const Reject = require('../../models/reject');

const teacher_bot = require('../../util/teacher_bot');
const admin_bot = require('../../util/admin_bot');
const {bot} = require('../../util/bot');

const mainView = require('../../view/admin/main_view_admin');

const fix_number = require('../../util/persian_numbers');

async function acceptingRequest(chatId, arguments) {
    const teacherId = arguments[0];
    const userId = arguments[1];
    const type = arguments[2];
    if (type === "yes") {
        Pending.destroy({where: {teacherId: teacherId, userId: userId}});
        Accepted.create({teacherId: teacherId, userId: userId});
        admin_bot.sendMessage(chatId, "درخواست دانشجوی مورد نظر قبول شد").then();
        const user = await User.findOne({where: {id: userId}});
        const teacher = await Teacher.findOne({where: {id: teacherId}});
        const response = "درخواست مشاوره شما با استاد " + teacher.first_name + " " + teacher.last_name + " با کد (استاد) " + teacher.id + " تایید شد.";
        await bot.sendMessage(user.chatId, response).then();
        mainView.view(chatId);
    } else if(type === "no"){
        Pending.destroy({where: {teacherId: teacherId, userId: userId}});
        Reject.create({teacherId: teacherId, userId: userId});
        const teacher = await Teacher.findOne({where:{id:teacherId}});
        const response = "درخواست مشاوره شما با استاد " + teacher.first_name + " " + teacher.last_name + " با کد (استاد) " + teacher.id + " رد شد." + "\n" ;
        const user = await User.findOne({where:{id:userId}});
        await bot.sendMessage(user.chatId, response).then();
        admin_bot.sendMessage(chatId, "درخواست دانشجوی مورد نظر رد شد").then();
        mainView.view(chatId);
    }else {
        Pending.destroy({where: {teacherId: teacherId, userId: userId}});
        await admin_bot.sendMessage(chatId, "لطفا دلیل خود را وارد کنید.", {reply_markup: JSON.stringify({force_reply: true})})
            .then(sentMessage => {
                admin_bot.onReplyToMessage(
                    sentMessage.chat.id,
                    sentMessage.message_id,
                    async (msg)=>{
                        Reject.create({teacherId:teacherId, userId:userId, description:msg.text});
                        const teacher = await Teacher.findOne({where:{id:teacherId}});
                        const response = "درخواست مشاوره شما با استاد " + teacher.first_name + " " + teacher.last_name + " با کد (استاد) " + teacher.id + " رد شد." + "\n" +
                            "دلیل رد : " + msg.text;
                        const user = await User.findOne({where:{id:userId}});
                        await bot.sendMessage(user.chatId, response).then();
                        await admin_bot.sendMessage(chatId, "درخواست دانشجوی مورد نظر رد شد").then();
                        mainView.view(chatId);
                    }
                );
            });

    }
}

async function addLimitRequestTeacher(chatId, userId){
    const user = await User.findOne({where:{id:userId}});
    admin_bot.sendMessage(chatId, "لطفا حداکثر مقداری که دانشجوی مورد نظر می تواند از استاد درخواست کند را وارد کنید.", {reply_markup: JSON.stringify({force_reply: true})})
        .then(sentMessage => {
            admin_bot.onReplyToMessage(
                sentMessage.chat.id,
                sentMessage.message_id,
                async(msg)=>{
                    user.limit_request_number = +fix_number(msg.text);
                    user.save();
                    admin_bot.sendMessage(chatId, "محدودیت تعداد درخواست دانشجو عوض شد.").then();
                    mainView.view(chatId);
                }
            );
        });
}

async function addLimitRequestSlotTime(chatId, userId){
    const user = await User.findOne({where:{id:userId}});
    admin_bot.sendMessage(chatId, "لطفا حداکثر مقداری که دانشجوی مورد نظر می تواند از اسلات داشته باشد را وارد کنید.", {reply_markup: JSON.stringify({force_reply: true})})
        .then(sentMessage => {
            admin_bot.onReplyToMessage(
                sentMessage.chat.id,
                sentMessage.message_id,
                async(msg)=>{
                    user.limit_slot_number = +fix_number(msg.text);
                    user.save();
                    admin_bot.sendMessage(chatId, "محدودیت حداکثر اسلات دانشجو عوض شد.").then();
                    mainView.view(chatId);
                }
            );
        });
}



exports.AdminCallbackQueryHandler = (msg) => {
    const data = msg.data;
    const arguments = data.split('_');
    const chatId = msg.message.chat.id;
    if (arguments[0] === "accepting") {
        arguments.splice(0, 1);
        acceptingRequest(chatId, arguments).then();
    }else if(arguments[0] === "appendLimitRequestTeacher"){
        addLimitRequestTeacher(chatId, arguments[1]).then();
    }else if(arguments[0] === "appendLimitRequestTimeSlot"){
        addLimitRequestSlotTime(chatId, arguments[1]).then();
    }
};
