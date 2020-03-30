const fixNumber = require("../../util/persian_numbers");
const admin_bot = require('../../util/admin_bot');
const user_column = require('../../util/user_excel_col_number');

const Teacher = require("../../models/teacher");
const User = require('../../models/user');
const TimeSlot = require('../../models/timeSlot');

const fs = require('fs');
const Stream = require('stream');
const https = require('https');

const path = require('path');
const root_path = require('../../util/path');
const Excel = require('exceljs');
const mainView = require('../../view/admin/main_view_admin');

async function createLastVersionExcel () {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(path.join(root_path, 'data', 'student_empty_template.xlsx'));
    const worksheet = workbook.getWorksheet(1);
    const users = await User.findAll();
    for(const index in users){
        const user = users[index];
        const row = worksheet.getRow(index * 2 + 3);
        const next_row = worksheet.getRow(index * 2 + 4);
        row.getCell(user_column.NAME_COLUMN).value = user.name;
        row.getCell(user_column.GRADE_COLUMN).value = user.grade;
        row.getCell(user_column.FIELD_COLUMN).value = user.field;
        row.getCell(user_column.GERAYESG_COLUMN).value = user.gerayesh;
        row.getCell(user_column.UNI_COLUMN).value = user.uni;
        row.getCell(user_column.DESCRIPTION_COLUMN).value = user.intresting;
        row.getCell(user_column.PHONE_NUMBER_COLUMN).value = user.phone_number;
        const timeSlots=  await TimeSlot.findAll({where:{userId:user.id}});
        for(const timeSlot_index in timeSlots){
            const timeSlot = timeSlots[timeSlot_index];
            const col_number = user_column.START_SLOT_TIME_COLUMN + +timeSlot_index;
            timeSlot.col = col_number;
            next_row.getCell(col_number).value = timeSlot.description;
            const teacher = await Teacher.findOne({where:{id:timeSlot.teacherId}});
            row.getCell(col_number).value = teacher.first_name + " " + teacher.last_name;
            timeSlot.save();
        }
    }

    await workbook.xlsx.writeFile(path.join(root_path, 'data', 'lastVersion_student.xlsx')).then(() => {
    }).catch(err => {
        console.log(err);
    })
}


exports.sendLastModify = (msg) => {
    const chatId = msg.chat.id;
    createLastVersionExcel().then(async ()=>{
        await admin_bot.sendDocument(
            chatId,
            path.join(root_path, 'data', 'lastVersion_student.xlsx'),
            {contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        await mainView.view(chatId);
    });
};