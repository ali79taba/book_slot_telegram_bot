const Pending = require('../../models/pendingAccept');
const Accepted = require('../../models/acceptedRequest');

const teacher_bot = require('../../util/teacher_bot');

const mainView = require('../../view/admin/main_view_admin');

function acceptingRequest(chatId, arguments) {
    console.log(arguments);
    const teacherId = arguments[0];
    const userId = arguments[1];
    const type = arguments[2];
    if(type === "yes"){
        Pending.destroy({where: {teacherId: teacherId, userId: userId}});
        Accepted.create({teacherId: teacherId, userId: userId});
        teacher_bot.sendMessage(chatId, "درخواست دانشجوی مورد نظر قبول شد");
        mainView.view(chatId);
    }else{
        Pending.destroy({where: {teacherId: teacherId, userId: userId}});
        teacher_bot.sendMessage(chatId, "درخواست دانشجوی مورد نظر رد شد");
        mainView.view(chatId);
    }
}

exports.AdminCallbackQueryHandler = (msg)=> {
    const data = msg.data;
    const arguments = data.split('_');
    const chatId = msg.message.chat.id;
    if(arguments[0] === "accepting"){
        arguments.splice(0,1);
        acceptingRequest(chatId, arguments);
    }
};
