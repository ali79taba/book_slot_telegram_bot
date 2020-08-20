const http = require('http');
const hostname = '0.0.0.0';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World! NodeJS \n');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});




const {bot} = require("./util/bot");

const teacher_bot = require('./util/teacher_bot');
const admin_bot = require('./util/admin_bot');
const keys = require("./util/keys");

const sequelize = require("./util/database");
const Sequelize = require('sequelize');

const register = require("./controller/register");
const userCallbackHandler = require('./controller/user/callbackHandler');
const studentShowRequest = require('./controller/user/requests');
const functionHandler = require('./controller/user/function_handler');
const sendOmraniha = require('./controller/user/sendOmranMassage');
const sendToEmpties = require('./controller/user/sent_to_empy_teacher');

const Show_teachers = require("./controller/show_teachers");
const teacherControllerRegister = require('./controller/teacher_register');
const pendingHandle = require('./controller/pending_handle');
const show_students = require('./controller/show_user');
const bookingTime = require('./controller/bookingTime');
const addTimeSlot = require('./controller/teacher_add_slot');
const {teacherCallbackQueryHandler} = require("./controller/teacher/callback_query");

const admin_edit_teacher = require('./controller/edit_teachers');
const admin_show_student = require('./controller/admin/show_student_excel');
const admin_auth = require('./controller/admin/authentication');
const admin_request_handler = require('./controller/admin/requests');
const {AdminCallbackQueryHandler} = require('./controller/admin/callback_query_handle');
const {getStatus} = require('./controller/admin/persons_status');
const personHaveSlot = require('./controller/admin/persons_have_slot');
const fixDataTeacher = require('./controller/teacher/fix_teacher_data');


bot.on('message', async (msg)=>{
    await functionHandler.checkRoot(msg);
    await functionHandler.doRequests(msg);
});
// bot.onText(/\/start/, register.createUser);
// bot.onText(/\/show_teachers/, Show_teachers.showTeachers);
// bot.onText(/\/book_time/, bookingTime.showAccepted);
// bot.onText(/\/show_slots/, bookingTime.showSlots);
// bot.onText(/\/delete_slot/, bookingTime.SelectSlotForDelete);
// bot.onText(/\/show_requests/, studentShowRequest.request_info);
bot.on('callback_query', (msg)=>{
    userCallbackHandler(msg);
});


teacher_bot.onText(/\/start/, teacherControllerRegister.teacherRegister);
teacher_bot.onText(/\/pending_students/, pendingHandle.pendingHandle);
teacher_bot.onText(/\/show_student_info/, show_students.getStudentId);
teacher_bot.onText(/\/accepting_students/, pendingHandle.acceptingGetCode);
teacher_bot.onText(/\/add_slot/, addTimeSlot.enterYourSlot);
teacher_bot.onText(/\/show_slots/, addTimeSlot.showSlots);
teacher_bot.onText(/\/delete_slot/, addTimeSlot.enterCodeSlot);
teacher_bot.on('callback_query', (msg) => {
    teacherCallbackQueryHandler(msg);
});



admin_bot.onText(/\/start/, admin_auth.start);
admin_bot.onText(/\/show_teachers_excel/, (msg) => {
    admin_auth.auth(msg, admin_edit_teacher.sendLastModify);
});
admin_bot.onText(/\/show_student_excel/, (msg) =>{
    admin_auth.auth(msg, admin_show_student.sendLastModify);
});
admin_bot.onText(/\/edit_teachers_excel/, (msg) => {
    admin_auth.auth(msg, admin_edit_teacher.editTeacherExcel);
});
admin_bot.onText(/\/pending_list/, (msg)=>{
    admin_auth.auth(msg, admin_request_handler.show_pending);
});
admin_bot.onText(/\/show_student_info/, (msg)=>{
   admin_auth.auth(msg, admin_request_handler.get_student_info_code);
});
admin_bot.onText(/\/accepting_request/, (msg)=>{
    admin_auth.auth(msg, admin_request_handler.accepting_request_get_id);
});
admin_bot.onText(/\/persons_status/, (msg)=>{
   admin_auth.auth(msg, getStatus);
});
admin_bot.onText(/\/persons_have_slot/, (msg)=>{
    admin_auth.auth(msg,personHaveSlot.getStatus);
})
admin_bot.on('callback_query', (msg) => {
    AdminCallbackQueryHandler(msg);
});


sequelize
    .sync()
    .then(result => {
    })
    .catch(err => {
    });

// fixDataTeacher.fix();
// sendToEmpties.sendEmptyTeacher();
// sendToEmpties.sendEmptyTimeSlot();
// sendToEmpties.sendForCompleteInfo();

