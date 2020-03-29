const bot = require("../util/bot");
const fixNumber = require("../util/persian_numbers");

const User = require("../models/user");
const Teacher = require("../models/teacher");
const Pending = require("../models/pendingAccept");
const TimeSlot = require('../models/timeSlot');

const show_teachers_view = require("../view/show_teachers");
const view = require("../view/register");
const main_veiw = require('../view/student_main_page');

exports.showTeachers = (msg, match) => {
    const chatId = msg.chat.id;
    User.findOne({where: {chatId: chatId}})
        .then(user => {
            var gereyesh = user.gerayesh;
            Teacher.findAll({where: {gerayesh: gereyesh}}).then(teachers => {
                show_teachers_view.show_teachers(chatId, teachers)
            });
        })
        .catch(err => {
            console.log(err);
        });
};

function showTeacherSlots(chatId, teacherId) {
    let response = "";
    TimeSlot.findAll({where: {teacherId: teacherId, userId: null}}).then(slots => {
        if (slots.length === 0) {
            bot.bot.sendMessage(chatId, "فعلا استاد زمان خالی ندارد");
        } else {
            for (const id in slots) {
                const slot = slots[id];
                response += "کد بازه‌ : " + slot.id + "\n" + slot.description + "\n-----------\n";
            }
            bot.bot.sendMessage(chatId, response);

        }
    })
}

exports.controlHandler = (msg, teacherId) => {
    console.log("IN CONTROLLER HAndELR *********")
    const chatId = msg.chat.id;
    // answers = ["در خواست مشاوره از استاد"],
    // ["زمان های خالی استاد"];
    if (fixNumber(msg.text) === "1") {
        User.findOne({where: {chatId: chatId}})
            .then(user => {
                Pending.create({teacherId: teacherId, userId: user.id})
            })
            .catch(err => {
                console.log(err);
            });
        bot.bot.sendMessage(chatId, "در خواست شما با موفق انجام شد");
        main_veiw.show_list(chatId);
    } else if (fixNumber(msg.text) === "2") {
        showTeacherSlots(chatId, teacherId);
        main_veiw.show_list(chatId);
    }
};
