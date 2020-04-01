const admin_bot = require('../../util/admin_bot');
const fixNumber = require('../../util/persian_numbers');

const Pending = require('../../models/pendingAccept');
const Teacher = require('../../models/teacher');
const User = require('../../models/user');

const mainView = require('../../view/admin/main_view_admin');


exports.show_pending = (msg) => {
    const chatId = msg.chat.id;
    Pending.findAll().then(async pendings => {
        if(pendings.length === 0){
            admin_bot.sendMessage(chatId, "در خواستی وجود ندارد");
        }else{
            let response = "";
            for (const index in pendings) {
                const pending = pendings[index];
                const teacherId = pending.teacherId;
                const userId = pending.userId;
                const teacher = await Teacher.findOne({where: {id: teacherId}});
                const user = await User.findOne({where: {id: userId}});
                response += "کد درخواست : " + pending.id + "\n" +
                    "کد دانشجو : " + user.id + "\n" +
                    "نام دانشجو : " + user.name + "\n" +
                    "رشته دانشجو :‌ " + user.field + "\n" +
                    "نام استاد درخواستی : " + teacher.first_name + " " + teacher.last_name + "\n---------\n";

            }
            await admin_bot.sendMessage(chatId, response);
        }
        mainView.view(chatId);
    });

};

async function show_student(msg){
    const chatId = msg.chat.id;
    const userId = fixNumber(msg.text);
    const user =await User.findOne({where:{id:userId}});
    if(user){
        let response = "نام :‌ " + user.name + "\n" +
            "رشته :‌ " + user.field + "\n" +
            "گرایش : " + user.gerayesh + "\n" +
            "دانشگاه ‌:‌ " + user.uni + "\n" +
            "مقطع :‌ " + user.grade + "\n" +
            " رزومه : " + user.intresting + "\n" +
            " کد : " + user.id + "\n" +
            " شماره همراه : " + user.phone_number + "\n" +
            "-------------\n"+
            "در خواست های در لیست انتظار" + "\n";
        const pendings =await Pending.findAll({where:{userId:userId}});
        for(const index in pendings){
            const pending = pendings[index];
            response += "کد درخواست : " + pending.id + "\n";
        }
        const inline_keyboard = [
            [{
                text: "کمتر کردن محدودیت درخواست از استاد",
                callback_data: "appendLimitRequestTeacher" + "_" + userId,
            }],
            [{
                text: "کمتر کردن محدودیت درخواست زمان مشاوره",
                callback_data: "appendLimitRequestTimeSlot" + "_" + userId,
            }],
            [{
                text: "رد یا تایید کردن درخواست دانشجو",
                callback_data: "goToAcceptingPage" + "_" + chatId,
            }],
        ];
        const options = {
            reply_markup: JSON.stringify({
                inline_keyboard: inline_keyboard
            })
        };
        await admin_bot.sendMessage(chatId, response, options);
    }else{
        await admin_bot.sendMessage(chatId,"کد وارد شده درست نمی باشد!");
        mainView.view(chatId);
    }

}

exports.get_student_info_code = (msg) => {
    const chatId = msg.chat.id;
    admin_bot.sendMessage(chatId, "برای نمایش اطلاعات دانشجو کد دانشجو را وارد کنید!",
        {reply_markup: JSON.stringify({force_reply: true})}).then(sentMessage => {
        admin_bot.onReplyToMessage(
            sentMessage.chat.id,
            sentMessage.message_id,
            show_student
        );
    });

};

async function accepting_request(msg){
    const pendingId = fixNumber(msg.text);
    const chatId = msg.chat.id;
    const pending = await Pending.findOne({where:{id:pendingId}});
    if(pending){
        const user = await User.findOne({where :{id:pending.userId}});
        const teacher = await Teacher.findOne({where:{id:pending.teacherId}});
        const caption = "دانشجویی به نام " + user.name + " از استاد " +
            teacher.first_name + " " + teacher.last_name + " درخواست دارد" + "\n" +
            "آیا درخواست او را رد می کنید یا تایید ؟";
        const inline_keyboard = [
            [{
                text: "تایید",
                callback_data: "accepting" + "_" + teacher.id + "_" + user.id + "_" + "yes",
            }],
            [{
                text: "رد",
                callback_data: "accepting" + "_" + teacher.id + "_" +  user.id + "_" + "no",
            }],
            [{
                text: "رد به همراه توضیح",
                callback_data: "accepting" + "_" + teacher.id + "_" +  user.id + "_" + "noWithDes",
            }]
        ];
        const options = {
            reply_markup: JSON.stringify({
                inline_keyboard: inline_keyboard
            })
        };
        await admin_bot.sendMessage(chatId, caption, options);
    }else{
        await admin_bot.sendMessage(chatId,"کد وارد شده درست نمی باشد!");
        mainView.view(chatId);
    }
}


exports.accepting_request_get_id = (msg)=>{
    const chatId = msg.chat.id;
    admin_bot.sendMessage(chatId,"لطفا کد درخواست دانشجو را وارد کنید!",{reply_markup: JSON.stringify({force_reply: true})}).then(sentMessage => {
        admin_bot.onReplyToMessage(
            sentMessage.chat.id,
            sentMessage.message_id,
            accepting_request
        );
    });
};