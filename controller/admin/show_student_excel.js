const fixNumber = require("../../util/persian_numbers");
const admin_bot = require('../../util/admin_bot');

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

module.exports.createLastVersionExcel = async () => {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(path.join(root_path, 'data', 'student_empty_template.xlsx'));
    const worksheet = workbook.getWorksheet(1);
    const users = await User.findAll();
    for(const index in users){
        const user = users[index];
        const row = worksheet.getRow(index * 2 + 3);
        const next_row = worksheet.getRow(index * 2 + 4);
        row.getCell(teacher_column.ID_COLUMN).value = user.id;
        row.getCell(teacher_column.FIRST_NAME_COLUMN).value = teacher.first_name;
        row.getCell(teacher_column.LAST_NAME_COLUMN).value = teacher.last_name;
        row.getCell(teacher_column.FIELD_COLUMN).value = teacher.field;
        row.getCell(teacher_column.GERAYESG_COLUMN).value = teacher.gerayesh;
        const timeSlots=  await TimeSlot.findAll({where:{teacherId:teacher.id}});
        for(const timeSlot_index in timeSlots){
            const timeSlot = timeSlots[timeSlot_index];
            const col_number = teacher_column.START_SLOT_TIME_COLUMN + +timeSlot_index;
            timeSlot.col = col_number;
            row.getCell(col_number).value = timeSlot.description;
            if(timeSlot.userId){
                next_row.getCell(col_number).value = '*';
            }
            timeSlot.save();
        }
    }

    await workbook.xlsx.writeFile(path.join(root_path, 'data', 'lastVersion.xlsx')).then(() => {
    }).catch(err => {
        console.log(err);
    })
};


exports.sendLastModify =(msg, match) => {
    const chatId = msg.chat.id;
    updateExcel.createLastVersionExcel().then(async ()=>{
        await admin_bot.sendDocument(
            chatId,
            path.join(root_path, 'data', 'lastVersion_student.xlsx'),
            {contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        await mainView.view(chatId);
    });
};