const show_teachers_controloer = require("../controller/show_teachers");
const functionHadler = require('../controller/user/function_handler');

const bot = require("../util/bot");
const fix_number = require('../util/persian_numbers');

const request = require('request');

const main_view = require('./student_main_page');

const Teacher = require('../models/teacher');

exports.whichWant = (msg) => {
    const chatId = msg.chat.id;
    let teacherId = fix_number(msg.text);
    Teacher.findOne({where: {id: teacherId}}).then(async teacher => {
        if (teacher) {
            // await show_one_teacher(chatId, teacher).catch(err => {
            //     console.log("ERR WHILE SHOW TEACHER PIC");
            // });
            // let response = "۱. درخواست از استاد" + "\n" + "۲.نشان دادن زمان های خالی استاد";
            // bot.bot
            //     .sendMessage(chatId, response, {
            //         reply_markup: JSON.stringify({force_reply: true})
            //     })
            //     .then(sentMessage => {
            //         bot.bot.onReplyToMessage(
            //             sentMessage.chat.id,
            //             sentMessage.message_id,
            //             (message) => {
            //                 show_teachers_controloer.controlHandler(message, teacherId);
            //             }
            //             // show_teachers_controloer.controlHandler
            //         );
            //     });
            msg.text = "1";
            await show_teachers_controloer.controlHandler(msg, teacherId);
        }else{
            functionHadler.updateState(chatId, "");
            bot.bot.sendMessage(chatId, "کد وارد شده غلط می باشد");
            main_view.show_list(chatId);
        }
    });

};

async function show_one_teacher(chatId, teacher) {
    let pic_stream;
    let caption = "نام استاد : " + teacher.first_name + " " + teacher.last_name + "\n";
    if(teacher.description){
        caption += teacher.description + "\n";
    }
    caption +=  "کد استاد : " + teacher.id;
    let show_pic = true;
    // pic_stream = request.get(teacher.image_link).on('error', function(err) { show_pic = false});
    pic_stream = await request.get(teacher.image_link, function (error, response, body) {
        if (error)
            show_pic = false;
    });
    if (!show_pic) {
        await bot.bot.sendMessage(chatId, caption);
    } else {
        await bot.bot.sendPhoto(chatId, pic_stream, {caption: caption});
    }
}

exports.show_teachers = async (chatId, teachers) => {
    let response = "";
    if (teachers.length === 0) {
        response = "فعلا استادی در گرایش شما وجود ندارد.😕\n" +
            "در تلاشیم به زودی اساتید مرتبط با گرایش شما را به ربات اضافه کنیم!\n" +
            "\n" +
            "از طریق کانال @TechnoThes در جریان اخرین اتفاقات تکنوتز باشید.";
        await bot.bot.sendMessage(chatId, response);
        functionHadler.updateState(chatId, '');
    } else {
        let caption = "";
        response = "برای درخواست مشاوره از استاد کد استاد مورد نظر خود را انتخاب کنید\n";
        functionHadler.updateState(chatId,'get_teacher_code');
        for (const i in teachers) {
            await show_one_teacher(chatId, teachers[i]).catch(err=>{
                console.log("ERR WHILE SHOW TEACHER PIC");
                console.log("teacherId : ", i);
            });
            // const teacher = teachers[i];
            // caption += "نام استاد : " + teacher.first_name + " " + teacher.last_name + "\n" + "کد استاد : " + teacher.id + "\n------\n";
        }
        // await bot.bot.sendMessage(chatId, caption);
        await bot.bot.sendMessage(chatId, response)
        // await bot.bot
        //     .sendMessage(chatId, response, {
        //         reply_markup: JSON.stringify({force_reply: true})
        //     })
        //     .then(sentMessage => {
        //         bot.bot.onReplyToMessage(
        //             sentMessage.chat.id,
        //             sentMessage.message_id,
        //             this.whichWant
        //         );
        //     });
    }
};
