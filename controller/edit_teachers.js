const fixNumber = require("../util/persian_numbers");
const admin_bot = require('../util/admin_bot');

const Teacher = require("../models/teacher");
const TimeSlot = require('../models/timeSlot');

const fs = require('fs');
const Stream = require('stream');
const https = require('https');

const path = require('path');
const root_path = require('../util/path');
const Excel = require('exceljs');
const updateDataBase = require('./admin/updateTeacherDataBase');
const updateExcel = require('./admin/updateExcelFromDatabase');
const mainView = require('../view/admin/main_view_admin');


async function saveFile(fileId){
    const link = await admin_bot.getFileLink(fileId);
    const file = await fs.createWriteStream(path.join(root_path, 'data', 'updated.xlsx'));
    https.get(link, async function (response) {
        await response.pipe(file);
        file.on('finish', function () {
            updateDataBase.updateDataBase(path.join(root_path, 'data', 'updated.xlsx').toString());
        });

    })
}

exports.sendLastModify = (msg, match) => {
    const chatId = msg.chat.id;
    updateExcel.createLastVersionExcel().then(async () => {
        await admin_bot.sendDocument(
            chatId,
            path.join(root_path, 'data', 'lastVersion.xlsx'),
            {contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        await mainView.view(chatId);
    });
};

function getFile(msg) {
    const chatId = msg.chat.id;
    console.log("this save file");
    saveFile(msg.document.file_id)
        .then(() => {
            admin_bot.sendMessage(chatId, "تغغیرات مورد نظر با موفقیت انجام شد.");
            mainView.view(chatId);
        })
        .catch((err) => {
            admin_bot.sendMessage(chatId, "اعمال تغییرات با مشکل مواجه شد");
            mainView.view(chatId);
        })
}

exports.editTeacherExcel = (msg, match) => {
    const chatId = msg.chat.id;
    admin_bot.sendMessage(chatId, "قبل از ارسال فایل مطمئن شوید که اکسل نهایی دریافت شده عوض نشده باشد");
    admin_bot.sendMessage(chatId, "فایل اصلاح شده را بفرستید");
    admin_bot.removeListener('document', getFile);
    admin_bot.once(
        'document',
        getFile
    )
};

//
// const show_teachers_view = require("../view/show_teachers");
// const view = require("../view/register");
//
// exports.bookSlot = (msg, user)=>{
//     const chatId = msg.chat.id;
//     const slotTimeId = fixNumber(msg.text);
//     TimeSlot.findOne({where: {id:slotTimeId, userId: null}}).then(slotTime=>{
//         if(slotTime){
//             slotTime.userId = user.id;
//             slotTime.save();
//             bot.sendMessage(chatId, "بازه زمانی مورد نظر با موفقیت ثبت شد").then();
//         }
//     })
// };
//
// exports.SelectSlot = async (msg, user) => {
//     const chatId = msg.chat.id;
//     const teacherId = fixNumber(msg.text);
//     const accepted = await Accepted.findOne({where: {teacherId: teacherId, userId:user.id}});
//     if (accepted) {
//         TimeSlot.findAll({where: {teacherId: teacherId, userId: null}}).then(timeSlots => {
//             let response = "لطفا کد زمان مورد نظر خود را انتخاب کنید" + "\n";
//             for (let index in timeSlots) {
//                 let timeSlot = timeSlots[index];
//                 response += `کد بازه :‌ ` + timeSlot.id + "\n" + timeSlot.description + "\n";
//             }
//             if(timeSlots.length === 0){
//                 bot.sendMessage(chatId, "استاد انتخابی شما فعلا وقت خالی ندارند");
//             }else{
//                 bot.sendMessage(chatId, response, {reply_markup: JSON.stringify({force_reply: true})})
//                     .then(sentMessage => {
//                         bot.onReplyToMessage(
//                             sentMessage.chat.id,
//                             sentMessage.message_id,
//                             (msg) => {
//                                 this.bookSlot(msg,user);
//                             }
//                         );
//                     });
//             }
//         })
//     }
// };
