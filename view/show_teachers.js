const show_teachers_controloer = require("../controller/show_teachers");

const bot = require("../util/bot");
const fix_number = require('../util/persian_numbers');

const request = require('request');

const main_view = require('./student_main_page');

const Teacher = require('../models/teacher');

exports.whichWant = msg => {
    const chatId = msg.chat.id;
    let teacherId = fix_number(msg.text);
    Teacher.findOne({where: {id: teacherId}}).then(async teacher => {
        if (teacher) {
            // await show_one_teacher(chatId, teacher).catch(err => {
            //     console.log("ERR WHILE SHOW TEACHER PIC");
            // });
            let response = "۱. درخواست از استاد" + "\n" + "۲.نشان دادن زمان های خالی استاد";
            bot.bot
                .sendMessage(chatId, response, {
                    reply_markup: JSON.stringify({force_reply: true})
                })
                .then(sentMessage => {
                    bot.bot.onReplyToMessage(
                        sentMessage.chat.id,
                        sentMessage.message_id,
                        (message) => {
                            show_teachers_controloer.controlHandler(message, teacherId);
                        }
                        // show_teachers_controloer.controlHandler
                    );
                });
        }else{
            bot.bot.sendMessage(chatId, "کد وارد شده غلط می باشد");
            main_view.show_list(chatId);
        }
    });

};

async function show_one_teacher(chatId, teacher) {
    let pic_stream;
    const caption = "نام استاد : " + teacher.first_name + " " + teacher.last_name + "\n" + teacher.description + "\n" + "کد استاد : " + teacher.id;
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
        response = "فعلا استادی در گرایش شما وجود ندارد";
        await bot.bot.sendMessage(chatId, response);
    } else {
        let caption = "";
        response = "کد استاد مورد نظر خود را انتخاب کنید\n";

        for (const i in teachers) {
            await show_one_teacher(chatId, teachers[i]).catch(err=>{
                console.log("ERR WHILE SHOW TEACHER PIC");
            });
            // const teacher = teachers[i];
            // caption += "نام استاد : " + teacher.first_name + " " + teacher.last_name + "\n" + "کد استاد : " + teacher.id + "\n------\n";
        }
        // await bot.bot.sendMessage(chatId, caption);
        await bot.bot
            .sendMessage(chatId, response, {
                reply_markup: JSON.stringify({force_reply: true})
            })
            .then(sentMessage => {
                bot.bot.onReplyToMessage(
                    sentMessage.chat.id,
                    sentMessage.message_id,
                    this.whichWant
                );
            });
    }
};
