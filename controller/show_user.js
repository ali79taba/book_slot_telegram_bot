const Teacher = require('../models/teacher');
const Pending = require('../models/pendingAccept');
const teacher_bot = require('../util/teacher_bot');
const fixNumber = require('../util/persian_numbers');
const User = require('../models/user');
const Field = require('../models/field');

const mainView = require('../view/teacher_main_page');

exports.showStudent = (msg) => {
    Teacher.findOne({where: {chatId: msg.chat.id}}).then(teacher => {
        if (teacher) {
            User.findOne({where: {id: fixNumber(msg.text)}}).then(student => {
                if(student){
                    let response = `نام :‌ ${student.name}` + '\n' +
                        `رشته :‌ ` + student.field + '\n' +
                        `گرایش :‌ ${student.gerayesh}` +
                        "دانشگاه : " + student.uni + "\n" +
                        "مقطع تحصیلی :‌ " + student.grade + "\n" +
                        "توضیحات بیشتری از فرد : " + "\n" + student.intresting;
                    teacher_bot.sendMessage(msg.chat.id, response);
                    mainView.showMain(msg.chat.id);
                }
            })

        }
    });
};

exports.getStudentId = (msg, match) => {
    const chatId = msg.chat.id;
    teacher_bot.sendMessage(chatId, 'لطفا کد دانشجو مورد نظر را وارد کنید', {reply_markup: JSON.stringify({force_reply: true})})
        .then(sentMessage => {
            teacher_bot.onReplyToMessage(
                sentMessage.chat.id,
                sentMessage.message_id,
                this.showStudent
            );
        });
};

