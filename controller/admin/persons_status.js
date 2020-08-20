const User = require('../../models/user');
const Teacher = require('../../models/teacher');
const Accepting = require('../../models/acceptedRequest');
const Rejected = require('../../models/reject');
const TimeSlot = require('../../models/timeSlot');
const Vote = require('../../models/vote');

const admin_bot = require('../../util/admin_bot');

const mainView = require('../../view/admin/main_view_admin');

const fs = require('fs');

exports.getStatus = async (msg) => {
    const chatId = msg.chat.id;
    const users = await User.findAll();
    let response = "افرادی که درخواست داده اند ولی بازه زمانی را برای مشاوره انتخاب نکردند " + "\n\n";
    for (let index in users) {
        const user = users[index];
        const timeSlots = await TimeSlot.findAll({where: {userId: user.id}});
        console.log("number of your slots : " + timeSlots.length);
        console.log(timeSlots.length === 0 );
        if (timeSlots.length === 0 && user.name && user.phone_number) {
            const accepted = await Accepting.findAll({where: {userId: user.id}});
            const rejected = await Rejected.findAll({where: {userId: user.id}});
            console.log("number of your accepted or rejected request : " + accepted.length + rejected.length);
            if (accepted.length + rejected.length > 0) {
                response += "نام دانشجو : " + user.name + "\n" + "رشته : " + user.field + "\n" + "گرایش : " + user.gerayesh + "\n" +
                    "شماره تماس : " + user.phone_number + "\n" + "اطلاعات تکمیلی : " + user.intresting + "\n" +
                    "کد دانشجو : " + user.id + "\n\n";
                if (accepted.length > 0) {
                    response += "در خواست های تایید شده : " + "\n\n";
                    for (let acceptedIndex in accepted) {
                        const acceptedInstace = accepted[acceptedIndex];
                        const teacher = await Teacher.findOne({where: {id: acceptedInstace.teacherId}});
                        if(teacher){
                            response += "کد درخواست : " + acceptedInstace.id + "\n" + "نام استاد : "
                                + teacher.first_name + " " + teacher.last_name + "\n\n";
                        }
                    }
                    response += "\n";
                }
                if (rejected.length > 0) {
                    response += "در خواست های رد شده" + "\n\n";
                    for (let rejectedIndex in rejected) {
                        const rejectedInstace = rejected[rejectedIndex];
                        const teacher = await Teacher.findOne({where: {id: rejectedInstace.teacherId}});
                        if(teacher){
                            response +=  "کد درخواست : " + rejectedInstace.id + "\n" + "نام استاد : "
                                + teacher.first_name + " " + teacher.last_name + "\n\n";
                            if (rejectedInstace.description) {
                                response += "دلیل رد شدن : " + rejectedInstace.description + "\n";
                            }
                            response += "\n";
                        }

                    }
                }
                const vote =await Vote.findOne({where:{chatId:user.chatId}});
                if(vote){
                    response += "دلیل انتخاب نکردن اسلات :" + "\n";
                    response += vote.text + "\n";
                }
                response += "---------------\n";

            }
        }
    }
    fs.writeFile("status.text", response, async(err)=>{
       if(!err){
           await admin_bot.sendDocument(
               chatId,
               "status.text",
               {contentType: 'text/html'});
           await mainView.view(chatId);
       }else{
           console.log(err);
       }
    });
    // console.log(response);
    // admin_bot.sendMessage(chatId, response).then();
};
