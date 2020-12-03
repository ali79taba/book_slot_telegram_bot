const LastRequest = require('../../models/last_request');
const register = require('../register');
const view = require('../../view/register');
const teacherView = require('../../view/show_teachers');
const Show_teachers = require("../show_teachers");
const bookingTime = require('../bookingTime');
const studentShowRequest = require('./requests');


exports.commands = [
    '/show_requests',
    '/delete_slot',
    '/show_slots',
    '/book_time',
    '/show_teachers',
    '/start',
]


exports.updateState = async (chatId, state) => {
    const lastRequest = await LastRequest.findOne({where: {chatId: chatId}})
    if (lastRequest) {
        lastRequest.state = state;
        lastRequest.save();
    } else {
        LastRequest.create({chatId: chatId, state: state});
    }
};

exports.checkRoot =async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    let last = await LastRequest.findOne({where:{chatId:chatId}});
    if(!last){
        last = await LastRequest.create({chatId: chatId, state: "1"});
    }

    if(text ===  '/show_requests'){
        last.state = "show_requests";
    }

    if(text ===  '/delete_slot'){
        last.state = "delete_slot";
    }

    if(text ===  '/show_slots'){
        last.state = 'show_slots';
    }

    if(text ===  '/book_time'){
        last.state = 'book_time';
    }

    if(text === '/show_teachers'){
        last.state = 'show_teachers'
    }

    if(text === '/start'){
        last.state = "start";
    }
    await last.save();
};

exports.doRequests = async (msg) => {
    const last = await LastRequest.findOne({where: {chatId: msg.chat.id}});
    if(!last){
        return;
    }

    const state = last.state;
    console.log(state);
    switch (state) {
        case 'start':
            register.createUser(msg);
            break;
        case 'get_name':
            register.setUserName(msg);
            break;
        case 'get_phone_number':
            register.setPhoneNumber(msg);
            break;
        case 'set_another_field':
            register.setField(msg.chat.id, msg.text);
            break;
        case 'get_uni':
            register.setUni(msg).then();
            break;
        case 'setIntresting':
            register.setIntresting(msg);
            break;
        case 'show_teachers':
            Show_teachers.showTeachers(msg);
            break;
        case 'get_teacher_code':
            teacherView.whichWant(msg);
            break;
        case 'book_time':
            bookingTime.showAccepted(msg);
            break;
        case  'get_teacher_code_for_booking':
            bookingTime.SelectSlot(msg);
            break;
        case 'get_teacher_id_for_get_slot':
            bookingTime.bookSlot(msg);
            break;
        case 'show_slots':
            bookingTime.showSlots(msg);
            break;
        case 'delete_slot':
            bookingTime.SelectSlotForDelete(msg);
            break;
        case 'get_slotId_for_delete':
            bookingTime.deleteSlot(msg);
            break
        case 'show_requests':
            studentShowRequest.request_info(msg);
            break

    }
};