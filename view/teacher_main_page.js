const teacher_bot = require('../util/teacher_bot');

exports.showMain = (chatId) => {
    const response = "/pending_students" + " لسیت افرادی که در انتظار تایید شما هستند" + "\n" +
        "/show_student_info" + " اطلاعات جزئی فرد " + "\n" +
        "/accepting_students" + " تایید یا رد کردن دانشجو های در لیست انتظار " + "\n" +
        "/add_slot" + " اضافه کردن بازه برای مشاوره" + "\n" +
        "/show_slots" + " نشان دادن زمان های مشاوره شما " + "\n" +
        "/delete_slot" + " حذف بازه زمانی مورد نظر ";

    teacher_bot.sendMessage(chatId, response);
};