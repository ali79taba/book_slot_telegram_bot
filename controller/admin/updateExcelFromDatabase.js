const fixNumber = require("../../util/persian_numbers");
const admin_bot = require('../../util/admin_bot');
const root_path = require('../../util/path');
const teacher_column = require('../../util/teacher_excel_col_number');

const Teacher = require("../../models/teacher");
const TimeSlot = require('../../models/timeSlot');
const excelHandle = require('../excelHandle');

const fs = require('fs');
const Stream = require('stream');
const https = require('https');
const path = require('path');
const Excel = require('exceljs');

module.exports.createLastVersionExcel = async () => {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(path.join(root_path, 'data', 'empty_teacher_template.xlsx'));
    const worksheet = workbook.getWorksheet(1);
    const teachers = await Teacher.findAll();
    for(const index in teachers){
        const teacher = teachers[index];
        const row = worksheet.getRow(index * 2 + 3);
        const next_row = worksheet.getRow(index * 2 + 4);
        row.getCell(teacher_column.ID_COLUMN).value = teacher.id;
        row.getCell(teacher_column.FIRST_NAME_COLUMN).value = teacher.first_name;
        row.getCell(teacher_column.LAST_NAME_COLUMN).value = teacher.last_name;
        row.getCell(teacher_column.FIELD_COLUMN).value = teacher.field;
        row.getCell(teacher_column.GERAYESG_COLUMN).value = teacher.gerayesh;
        row.getCell(teacher_column.CODE_COLUMN).value = teacher.code;
        row.getCell(teacher_column.CONTACT_COLUMN).value = teacher.contact;
        row.getCell(teacher_column.PIC_LINK_COLUMN).value = teacher.image_link;
        row.getCell(teacher_column.DESCRIPTION_COLUMN).value = teacher.description;
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