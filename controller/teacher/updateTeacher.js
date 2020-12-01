const Teacher = require("../../models/teacher");

module.exports = async function updateTeacher(teacherId, teacherData){
    const teacher = await Teacher.findOne({where: {id: teacherId}})
    // console.log(teacherData);
    teacher.first_name = teacherData.first_name;
    teacher.last_name = teacherData.last_name;
    teacher.description = teacherData.description;
    teacher.contact = teacherData.contact;
    teacher.code = teacherData.code;
    teacher.username = teacherData.username;
    teacher.dontSendRequestNotificationBot = teacherData.dontSendRequestNotificationBot;
    teacher.email = teacherData.email;
    // teacher.image_link = teacherData.image_link;
    teacher.gerayesh = teacherData.gerayesh;
    teacher.field = teacherData.field;
    await teacher.save()
}