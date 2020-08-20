const admin_bot = require('../../util/admin_bot');

exports.view = (chatId)=>{
    const response ="/show_teachers_excel دریافت آخرین نسخه از دیتای اساتید" + "\n" +
        "/edit_teachers_excel آپلود آخرین نسخه از دیتای اساتید" + "\n" +
        "/pending_list لیست افراد در لیست انتظار" + "\n" +
        "/show_student_info اطلاعات بیشتر از دانشجو" + "\n" +
        "/accepting_request قبول یا رد کردند درخواست های دانشجویان" + "\n" +
        "/show_student_excel دریافت اخرین نسخه از دیتای دانشجویان" + "\n" +
        "/persons_status نشان دادن افرادی که درخواست آن ها رد یا تایید شده ولی هنوز زمانی برای مشاوره انتخاب نکرده اند" + "\n" +
        "/persons_have_slot نشان دادن افرادی که بازه زمانی برای مشاوره انتخاب کرده اند";
    admin_bot.sendMessage(chatId, response);
};
