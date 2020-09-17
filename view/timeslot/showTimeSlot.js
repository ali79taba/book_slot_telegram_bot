const Teacher = require('../../models/teacher');
const moment = require('jalali-moment');

module.exports = async (timeSlot, showTeacher = true)=>{
    moment.locale('fa');
    const teacher = await Teacher.findOne({where:{id:timeSlot.teacherId}});
    let response = "";
    if(timeSlot.isDate){
        const startTime = moment.unix(timeSlot.startDate).format('YYYY/MM/DD HH:mm');
        const endTime = moment.unix(timeSlot.endDate).format('YYYY/MM/DD HH:mm');
        response += "از : " + startTime + "\n" +
            "تا : " + endTime + "\n";
    }else{
        response += "زمان :‌ " + timeSlot.description + "\n";
    }
    response += "کد زمان : " + timeSlot.id + "\n";
    if(showTeacher){
        response += "نام استاد : " + teacher.first_name + " " + teacher.last_name + "\n" +
        "کد استاد :‌ " + timeSlot.teacherId + "\n";
    }
    response += "-------------\n"
    return response;
}