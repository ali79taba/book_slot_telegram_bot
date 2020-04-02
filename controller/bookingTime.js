const {bot} = require("../util/bot");
const fixNumber = require("../util/persian_numbers");

const User = require("../models/user");
const Teacher = require("../models/teacher");
const Pending = require("../models/pendingAccept");
const Accepted = require('../models/acceptedRequest');
const TimeSlot = require('../models/timeSlot');
const Rejected = require('../models/reject');

const show_teachers_view = require("../view/show_teachers");
const view = require("../view/register");
const main_view = require('../view/student_main_page');
const functionHandler = require('./user/function_handler');

const teacher_bot = require('../util/teacher_bot');

exports.bookSlot =async (msg)=>{
    const chatId = msg.chat.id;
    functionHandler.updateState(chatId, "1");
    const user = await User.findOne({where:{chatId:chatId}});
    const slotTimeId = fixNumber(msg.text);
    const slots =await TimeSlot.findAll({where:{userId: user.id}});
    const request_cnt = slots.length;
    console.log(request_cnt);
    if(request_cnt >= user.limit_slot_number){
        bot.sendMessage(chatId, "شما بیش از این نمی توانید بازه مشاوره ثبت کنید برای ثبت بیشتر درخواست به آیدی @Technothes_Admin مراجعه کنید.").then();
        main_view.show_list(chatId);
    }else{
        TimeSlot.findOne({where: {id:slotTimeId, userId: null}}).then(async slotTime=>{
            if(slotTime){
                slotTime.userId = user.id;
                slotTime.save();
                const teacher = await Teacher.findOne({where:{id:slotTime.teacherId}});
                const response = "بازه زمانی مورد نظر با موفقیت ثبت شد" + "\n" +
                    "راه ارتباطی با استاد " + teacher.first_name  + " " + teacher.last_name + " : " + teacher.contact;
                bot.sendMessage(chatId, response).then();
                if(teacher.chatId){
                    teacher_bot.sendMessage(teacher.chatId, "قرار های مشاوره شما با دانشجویان تغییراتی داشته برای مشاهده زمان های مشاوره /show_slots رو بزنید.").then();
                }
                main_view.show_list(chatId);
            }
        })
    }
};

exports.SelectSlot = async (msg) => {
    const chatId = msg.chat.id;
    const user = await User.findOne({where:{chatId:chatId}});
    const teacherId = fixNumber(msg.text);
    const accepted = await Accepted.findOne({where: {teacherId: teacherId, userId:user.id}});
    if (accepted) {
        TimeSlot.findAll({where: {teacherId: teacherId, userId: null}}).then(timeSlots => {
            let response = "لطفا کد زمان مورد نظر خود را انتخاب کنید" + "\n";
            for (let index in timeSlots) {
                let timeSlot = timeSlots[index];
                response += `کد بازه :‌ ` + timeSlot.id + "\n" + timeSlot.description + "\n";
            }
            if(timeSlots.length === 0){
                bot.sendMessage(chatId, "استاد انتخابی شما فعلا وقت خالی ندارند");
                functionHandler.updateState(chatId, "1");
                main_view.show_list(chatId);
            }else{
                functionHandler.updateState(chatId, "get_teacher_id_for_get_slot");
                bot.sendMessage(chatId, response);
                // bot.sendMessage(chatId, response, {reply_markup: JSON.stringify({force_reply: true})})
                //     .then(sentMessage => {
                //         bot.onReplyToMessage(
                //             sentMessage.chat.id,
                //             sentMessage.message_id,
                //             (msg) => {
                //                 this.bookSlot(msg,user);
                //             }
                //         );
                //     });
            }
        })
    }
};

exports.showAccepted = async (msg, match) => {
    const chatId = msg.chat.id;
    const user = await User.findOne({where: {chatId: chatId}});
    const acceptedRequests = await Accepted.findAll({where: {userId: user.id}});

    if(acceptedRequests.length === 0){
        await bot.sendMessage(chatId, "فعلا استادی درخواست شما را تایید نکرده لطفا منتظر تایید استاد باشید");
        functionHandler.updateState(chatId, "");
        main_view.show_list(chatId);
        return;
    }

    let response = "استاد هایی که در خواست شما را تایید کردند " + "\n";
    for (const id in acceptedRequests) {
        const teacherId = acceptedRequests[id].teacherId;
        const teacher = await Teacher.findOne({where: {id: teacherId}});
        response += `نام استاد :‌ ${teacher.first_name + " " + teacher.last_name} ` + "    " + `کد استاد :‌ ${teacher.id}` + "\n";
    }
    await bot.sendMessage(chatId, response);
    functionHandler.updateState(chatId, 'get_teacher_code_for_booking');
    response = "برای ادامه مرحله کد استاد را وارد کنید" + "\n";
    await bot.sendMessage(chatId, response);
    // await bot.sendMessage(chatId, response, {reply_markup: JSON.stringify({force_reply: true})})
    //     .then(sentMessage => {
    //         bot.onReplyToMessage(
    //             sentMessage.chat.id,
    //             sentMessage.message_id,
    //             (msg) => {
    //                 this.SelectSlot(msg, user);
    //             }
    //         );
    //     });
};

exports.showSlots = async (msg, match)=>{
    const chatId = msg.chat.id;
    const user = await User.findOne({where:{chatId : chatId}});
    if(user){
        const timeSlots = await TimeSlot.findAll({where:{userId:user.id}});
        if(timeSlots.length === 0){
            await bot.sendMessage(chatId, "شما بازه زمانی خاصی را قبلا انتخاب نکرده اید")
        }else{
            let response = "بازه هایی که شما انتخاب کرده اید" + "\n";
            for(let index in timeSlots){
                const timeSlot = timeSlots[index];
                const teacher = await Teacher.findOne({where:{id:timeSlot.teacherId}});
                response += "کد بازه :‌ " + timeSlot.id + "\n" + "زمان بازه‌ :‌ " + timeSlot.description;
                response += "\n" + "نام استاد :‌ " + teacher.first_name + " " + teacher.last_name + "\n" +
                    "راه ارتباطی با استاد : " + teacher.contact + "\n" +
                    "--------\n";
            }
            await bot.sendMessage(chatId, response);
            main_view.show_list(chatId);
        }
    }
    functionHandler.updateState(chatId, '1');
};

exports.deleteSlot =async (msg) => {
    const chatId = msg.chat.id;
    const user = await User.findOne({where:{chatId:chatId}});
    const slotId = fixNumber(msg.text);
    const timeSlot = await TimeSlot.findOne({where: {id:slotId, userId:user.id}});
    if(timeSlot){
        timeSlot.userId = null;
        timeSlot.save();
        await bot.sendMessage(chatId, "بازه زمانی مورد نظر شما حذف شد");
    }else{
        await bot.sendMessage(chatId, "کد بازه زمانی انتخاب شده درست نیست.");
    }
    functionHandler.updateState(chatId, "1");
    main_view.show_list(chatId);

};

exports.SelectSlotForDelete =async (msg, match) => {
    const chatId = msg.chat.id;
    functionHandler.updateState(chatId, "get_slotId_for_delete");
    const user = await User.findOne({where: {chatId:chatId}});
    const response = "برای حذف بازه های انتخابی خود کد بازه را وارد کنید";
    bot.sendMessage(chatId, response, {reply_markup: JSON.stringify({force_reply: true})})
        .then(sentMessage => {
            bot.onReplyToMessage(
                sentMessage.chat.id,
                sentMessage.message_id,
                (msg) => {
                    this.deleteSlot(msg, user);
                }
            );
        });
};


