const admin_bot = require('../../util/admin_bot');

exports.view = (chatId)=>{
    const response ="/show_teachers_excel دریافت آخرین نسخه از دیتای اساتید" + "\n" +
        "/edit_teachers_excel آپلود آخرین نسخه از دیتای اساتید" + "\n" +
        "/pending_list لیست افراد در لیست انتظار" + "\n" +
        "/show_student_info اطلاعات بیشتر از دانشجو" + "\n" +
        "/accepting_request قبول یا رد کرند درخواست های دانشجویان" + "\n";
    admin_bot.sendMessage(chatId, response);
};
