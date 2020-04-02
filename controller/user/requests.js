const User = require('../../models/user');
const Pending =require('../../models/pendingAccept');
const acceptedRequest = require('../../models/acceptedRequest');
const Rejected = require('../../models/reject');
const Teacher = require("../../models/teacher");

const {bot} = require('../../util/bot');

const mainView = require('../../view/student_main_page');
const functionHandler = require('./function_handler');

exports.request_info = async (msg)=>{
    const chatId = msg.chat.id;
    const user = await User.findOne({where:{chatId:chatId}});
    const pendings = await Pending.findAll({where:{userId:user.id}});
    const acceptings = await acceptedRequest.findAll({where:{userId:user.id}});
    const rejectings = await Rejected.findAll({where:{userId:user.id}});

    let response = "";
    if(pendings.length > 0){

        response = "استاد هایی که درخواست شما به آن ها در لیست انتظار است :" + "\n" + "\n";
        for(const index in pendings){
            const pending = pendings[index];
            const teacher = await Teacher.findOne({where:{id:pending.teacherId}});
            response += teacher.first_name + " " + teacher.last_name + "\n" + "\n";
        }
        response += "------------\n";
    }

    if(acceptings.length > 0){
        response += "استاد هایی که درخواست شما را تایید کرده اند" + "\n" + "\n";
        for(const index in acceptings){
            const accepting = acceptings[index];
            const teacher = await Teacher.findOne({where:{id:accepting.teacherId}});
            response += teacher.first_name + " " + teacher.last_name + "\n" + "\n";
        }
        response += "------------\n";
    }

    if(rejectings.length > 0){
        response += "استاد هایی که درخواست شما را رد کرده اند" + "\n" + "\n";
        for(const index in rejectings){
            const rejecting = rejectings[index];
            const teacher = await Teacher.findOne({where:{id:rejecting.teacherId}});
            response += teacher.first_name + " " + teacher.last_name + "\n";
            if(rejecting.description){
                response += "دلیل رد شدن درخواست : " + rejecting.description + "\n";
            }
            response += "\n";
        }
    }
    if(response.length >0){
        await bot.sendMessage(chatId, response).then();
    }else{
        await bot.sendMessage(chatId, "شما فعلا درخواستی ندارید!").then();
    }
    functionHandler.updateState(chatId, "1");
    mainView.show_list(chatId);
};