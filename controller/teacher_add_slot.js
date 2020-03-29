const Pending = require('../models/pendingAccept');
const Teacher = require('../models/teacher');
const User = require('../models/user');
const Accepted = require('../models/acceptedRequest');
const TimeSlot = require('../models/timeSlot');

const teacher_bot = require('../util/teacher_bot');
const fixNumber = require('../util/persian_numbers');

const maiView = require('../view/teacher_main_page');

exports.addTimeSlot = (teacher, msg) => {
    TimeSlot.create({teacherId: teacher.id, description: msg.text, col:100});
    teacher_bot.sendMessage(msg.chat.id, 'بازه شما با موفقیت ذخیره شد.');
    maiView.showMain(msg.chat.id);
};

exports.enterYourSlot = (msg, match) => {
    const chatId = msg.chat.id;
    Teacher.findOne({where: {chatId: chatId}})
        .then(teacher => {
            if (teacher) {
                teacher_bot.sendMessage(chatId, 'لطفا بازه زمانی مورد نظر خود را وارد کنید', {reply_markup: JSON.stringify({force_reply: true})})
                    .then(sentMessage => {
                            teacher_bot.onReplyToMessage(
                                sentMessage.chat.id,
                                sentMessage.message_id,
                                (new_massage) => {
                                    this.addTimeSlot(teacher, new_massage);
                                }
                            );
                        }
                    );
            }
        })
};

exports.showSlots = (msg, match) => {
    const chatId = msg.chat.id;
    Teacher.findOne({where: {chatId: chatId}})
        .then(teacher => {
            if (teacher) {
                TimeSlot.findAll({where: {teacherId: teacher.id}}).then(slots => {
                    let response = "بازه های زمانی شما" + "\n";
                    for (let index in slots) {
                        let slot = slots[index];
                        response += `کد بازه : ` + slot.id + "\n" + slot.description + "\n-----------\n";
                    }
                    teacher_bot.sendMessage(chatId, response);
                    maiView.showMain(chatId);
                })
            }
        });
};

exports.deleteSlot = (msg, teacherId)=>{
    const chatId = msg.chat.id;
    const slotId = +fixNumber(msg.text);
    TimeSlot.destroy({where:{teacherId:teacherId, id:slotId}});
    teacher_bot.sendMessage(chatId, "بازه انتخاب شده حذف شد")
    maiView.showMain(chatId);
};

exports.enterCodeSlot = (msg, match) => {
    const chatId = msg.chat.id;
    Teacher.findOne({where: {chatId: chatId}})
        .then(teacher => {
            if (teacher) {
                teacher_bot.sendMessage(chatId, "برای حذف بازه زمانی مورد نظر کد بازه را وارد کنید", {reply_markup: JSON.stringify({force_reply: true})})
                    .then(sentMessage => {
                            teacher_bot.onReplyToMessage(
                                sentMessage.chat.id,
                                sentMessage.message_id,
                                (new_massage) => {
                                    this.deleteSlot(new_massage, teacher.id)
                                }
                            );
                        }
                    );
            }
        });
};
