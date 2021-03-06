const updateTeacher = require("./controller/teacher/updateTeacher");

const {getUsersInObjectViaId} = require("./models/user/utils");

const bodyParser = require('body-parser');
const express = require('express');
const expressApp = express();
const Teacher = require("./models/teacher");
const pendingAccept = require('./models/pendingAccept');
const AcceptedRequest = require('./models/acceptedRequest');
const Rejected = require('./models/reject');
const User = require('./models/user');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const {acceptRequestById, rejectRequestById} = require('./models/pending/utils');
const {sendAcceptRequestMessageForUser, sendRejectRequestMessageToUser} = require('./controller/teacher/callback_query');
const Admin = require('./models/admin');
const TimeSlot = require('./models/timeSlot');
const sendPreviousStudent = require('./controller/user/sent_previes_student');

expressApp.use(cors({credentials: true, origin: process.env.FRONT_HOST || "http://localhost:8080"}));


const router = express.Router();

// const http = require('http');
const hostname = '0.0.0.0';
const port = 3000;
expressApp.use(cookieParser());
expressApp.use(bodyParser.urlencoded({extended: true}));
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.raw());
expressApp.use(router);

const SECRET_KEY = 'SJE@@WD!SF#@LKSDjo'

router.post('/login', async (req, res) => {
    // console.log(req.cookies);
    const username = req.body.username;
    const password = req.body.password;
    const teacher = await Teacher.findOne({where: {username: username, code: password}});
    const admin = await Admin.findOne({where: {username: username, code: password}});
    // // console.log(teacher)
    // // console.log(teacher.username, username, teacher.code === password);
    const token = jwt.sign({username}, SECRET_KEY)
    if ((teacher) && (teacher.username === username) && (teacher.code === password)) {
        teacher.token = token;
        await teacher.save();
        res.cookie('token', token, {
            maxAge: 900000,
            httpOnly: false,
            sameSite: "none",
            secure: process.env.NODE_ENV === 'prod'
        });
        res.status(200).send({
            token,
            teacher: {
                ...teacher.get(),
                userType: "teacher",
            }
        })
        return res;
    }
    // console.log("AAAUTH --- : ", admin);
    if (admin && admin.username === username && admin.code === password) {
        admin.token = token;
        await admin.save();
        res.cookie('token', token, {
            maxAge: 900000,
            httpOnly: false,
            sameSite: "none",
            secure: process.env.NODE_ENV === 'prod'
        });
        res.status(200).send({
            token,
            admin: {
                ...admin.get(),
                userType: "admin",
            }
        })
        return res;
    }
    res.status(401).send();
    return res;
})

async function auth(req, res, next) {
    // console.log("----------COOOKIE : ", req.headers, req.cookies);
    if (!req.cookies || !('token' in req.cookies))
        return res.status(401).send();
    const teacher = await Teacher.findOne({where: {token: req.cookies.token}});
    const admin = await Admin.findOne({where: {token: req.cookies.token}});
    // console.log("------------", teacher.get());
    if (teacher || admin) {
        // console.log("OKKK");
        return next();
    } else {
        return res.status(401).send();
    }
}

async function adminAuth(req, res, next) {
    if (!req.cookies || !('token' in req.cookies))
        return res.status(401).send();
    const admin = await Admin.findOne({where: {token: req.cookies.token}});
    // console.log("#####################ADMIN ", admin.get());
    if (admin)
        return next();
    return res.status(401).send();
}

router.get('/teachers/:id/requests', async (req, res) => {
    let pending = await pendingAccept.findAll({where: {teacherId: req.params.id}})
    let accepted = await AcceptedRequest.findAll({where: {teacherId: req.params.id}});
    let rejected = await Rejected.findAll({where: {teacherId: req.params.id}});
    pending = await getUsersInObjectViaId(pending);
    accepted = await getUsersInObjectViaId(accepted);
    rejected = await getUsersInObjectViaId(rejected);

    // console.log("PENDING : ", pending);
    // console.log("ACCEPTED :", accepted);

    res.status(200).send({
        pending,
        accepted,
        rejected,
    })
})

router.get('/teachers/:id', [adminAuth], async (req, res, next) => {
    // console.log("----------------QUERY : ", req.params.id);
    Teacher.findOne({where: {id: req.params.id}}).then(teacher => {
        // console.log(teacher.get());
        res.status(200).send(teacher.get());
    }).catch(error => {
        res.status(404).send("Error");
    })
})

router.put('/teachers/:id', [adminAuth], async (req, res, next) => {
    await updateTeacher(req.params.id, req.body);
    res.status(200).send({message: ""});
});

router.post('/teachers', [adminAuth], async (req, res) => {
    const teacherFromBody = req.body;
    await Teacher.create({
        email: teacherFromBody.email,
        first_name: teacherFromBody.first_name,
        last_name: teacherFromBody.last_name,
        code: teacherFromBody.code,
        description: teacherFromBody.description,
        contact: teacherFromBody.contact,
        field: teacherFromBody.field,
        gerayesh: teacherFromBody.gerayesh,
        image_link: teacherFromBody.image_link,
        username: teacherFromBody.username,
    })
    res.status(200).send({message: ""});

});

router.get('/banner', [auth], async (req, res, next) => {
    const teacherListSize = await Teacher.findAndCountAll({limit: 0});
    let imageLinks = [], loopCnt = 0;
    while(imageLinks.length < 5 && loopCnt < 40){
        const teacherId = Math.ceil(Math.random() * teacherListSize.count);
        console.log(teacherId);
        const teacherFind = await Teacher.findOne({where:{id : teacherId}});
        if(teacherFind && teacherFind.image_link && !(teacherFind.image_link in imageLinks)){
            imageLinks.push(teacherFind.image_link);
        }
        loopCnt++;
    }
    if(imageLinks.length === 5)
        res.status(200).send({imageLinks});
    else
        res.status(404).send();
});

router.get('/user', [auth], async (req, res, next) => {
    const teacher = await Teacher.findOne({where: {token: req.cookies.token}, raw: true});
    const admin = await Admin.findOne({where: {token: req.cookies.token}, raw: true});
    if (teacher) {
        res.status(200).send({
            user: {
                ...teacher,
                userType: "teacher",
            }
        })
    } else if (admin) {
        res.status(200).send({
            user: {
                ...admin,
                userType: "admin",
            }
        })
    }
    res.status(404).send();
})

router.get('/teachers', [adminAuth], async (req, res) => {
    Teacher.findAll().then(teachers => {
        res.status(200).send(JSON.parse(JSON.stringify(teachers)))
    }).catch(err => {
        res.status(404).send("Error");
    });
});

router.put( '/profile', [auth], async (req, res) => {
    const teacher = await Teacher.findOne({where: {token: req.cookies.token}});
    await updateTeacher(teacher.id, req.body);
    res.status(200).send({ message: ""});
})

router.post('/accept/:id', [auth], async (req, res) => {
    const pendRequest = await pendingAccept.findOne({where: {id: req.params.id}});
    await acceptRequestById(req.params.id);
    sendAcceptRequestMessageForUser(pendRequest.teacherId, pendRequest.userId).then();
    res.status(200).send({message: ""});
});

router.post('/reject/:id', [auth], async (req, res) => {
    const pendRequest = await pendingAccept.findOne({where: {id: req.params.id}});
    await rejectRequestById(req.params.id);
    sendRejectRequestMessageToUser(pendRequest.teacherId, pendRequest.userId).then();
    res.status(200).send({message: ""});
});

router.get('/student/:id', [auth], async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (user) {
        res.status(200).send({
            ...user.get()
        })
    } else {
        res.status(404).send({
            message: "not found"
        })
    }

});

router.post('/timeslot/:teacherId', [auth], async (req, res) => {
    // console.log("WE ARE IN TIME SLOT _________________________")
    // console.log(req.params.teacherId);
    const timeSlotFromBody = req.body;
    await TimeSlot.create({
        ...timeSlotFromBody,
        teacherId: req.params.teacherId
    })
    res.status(200).send({message: ""});

})

router.get('/timeslot/:teacherId', [auth], async (req, res) => {
    const timeSlots = await TimeSlot.findAll({where: {teacherId: req.params.teacherId}, raw: true});
    res.status(200).send({
        timeSlots: timeSlots
    });
})


expressApp.listen(port, hostname, () => {
    console.log("Server is listening");
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


bot.on('message', async (msg) => {
    await functionHandler.checkRoot(msg);
    await functionHandler.doRequests(msg);
});
// bot.onText(/\/start/, register.createUser);
// bot.onText(/\/show_teachers/, Show_teachers.showTeachers);
// bot.onText(/\/book_time/, bookingTime.showAccepted);
// bot.onText(/\/show_slots/, bookingTime.showSlots);
// bot.onText(/\/delete_slot/, bookingTime.SelectSlotForDelete);
// bot.onText(/\/show_requests/, studentShowRequest.request_info);
bot.on('callback_query', (msg) => {
    userCallbackHandler(msg).then();
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
admin_bot.onText(/\/show_student_excel/, (msg) => {
    admin_auth.auth(msg, admin_show_student.sendLastModify);
});
admin_bot.onText(/\/edit_teachers_excel/, (msg) => {
    admin_auth.auth(msg, admin_edit_teacher.editTeacherExcel);
});
admin_bot.onText(/\/pending_list/, (msg) => {
    admin_auth.auth(msg, admin_request_handler.show_pending);
});
admin_bot.onText(/\/show_student_info/, (msg) => {
    admin_auth.auth(msg, admin_request_handler.get_student_info_code);
});
admin_bot.onText(/\/accepting_request/, (msg) => {
    admin_auth.auth(msg, admin_request_handler.accepting_request_get_id);
});
admin_bot.onText(/\/persons_status/, (msg) => {
    admin_auth.auth(msg, getStatus);
});
admin_bot.onText(/\/persons_have_slot/, (msg) => {
    admin_auth.auth(msg, personHaveSlot.getStatus);
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
// sendPreviousStudent().then();


