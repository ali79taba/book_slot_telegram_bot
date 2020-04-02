const fixNumber = require("../util/persian_numbers");
const admin_bot = require('../util/admin_bot');

const Teacher = require("../models/teacher");
const TimeSlot = require('../models/timeSlot');

const fs = require('fs');
const Stream = require('stream');
const https = require('https');
const path = require('path');
const root_path = require('../util/path');
const Excel = require('exceljs');
const password_generator = require('generate-password');

const teacher_column = require('../util/teacher_excel_col_number');

async function updateTimeSlot(firstRow, secondRow, teacherId) {
    console.log(teacherId);
    firstRow.eachCell(async (cell, colNumber) => {
        if (colNumber >= teacher_column.START_SLOT_TIME_COLUMN) {
            let cellValue = cell.value;
            if(cellValue.hasOwnProperty('richText')){
                cellValue = cellValue.richText[1].text;
            }
            console.log("I am in TimeSlots");
            console.log(cellValue);
            const slot = await TimeSlot.findOne({where: {teacherId: teacherId, col: colNumber}});
            if (slot && slot.description !== cellValue) {
                slot.destroy({where: {teacherId: teacherId, col: colNumber}});
                if (cellValue && (cellValue !== "")) {
                    console.log(teacherId);
                    console.log(colNumber);
                    TimeSlot.create({teacherId: teacherId, description: cellValue, col: colNumber});
                }
            } else if (!slot && cellValue && (cellValue !== "")) {
                console.log(teacherId);
                console.log(colNumber);
                TimeSlot.create({teacherId: teacherId, description: cellValue, col: colNumber});
            }
        }
    })
}

async function updateFields(row, secondRow) {
    const teacherId = fixNumber(row.getCell(teacher_column.ID_COLUMN).value);
    const first_name = row.getCell(teacher_column.FIRST_NAME_COLUMN).value;
    const last_name = row.getCell(teacher_column.LAST_NAME_COLUMN).value;
    const field = row.getCell(teacher_column.FIELD_COLUMN).value;
    const gerayesh = row.getCell(teacher_column.GERAYESG_COLUMN).value;
    let code = fixNumber(row.getCell(teacher_column.CODE_COLUMN).value);
    const contact = row.getCell(teacher_column.CONTACT_COLUMN).value;
    let image_link = row.getCell(teacher_column.PIC_LINK_COLUMN).value;
    if (image_link && image_link.hasOwnProperty('text')) {
        image_link = image_link.text;
    }
    const description = row.getCell(teacher_column.DESCRIPTION_COLUMN).value;
    // console.log("---------");
    // console.log(image_link);
    // console.log(contact);
    // console.log(description);
    // console.log(teacherId);
    // console.log(last_name);
    // console.log(field);
    // console.log(first_name);
    // console.log(code);
    // console.log(gerayesh);
    // console.log("------------");
    if (teacherId && teacherId !== "") {
        if (!first_name || first_name === "") {
            Teacher.destroy({where: {id: teacherId}});
            TimeSlot.destroy({where: {teacherId: teacherId}});
        } else {
            const teacher = await Teacher.findOne({where: {id: teacherId}});
            teacher.first_name = first_name;
            teacher.last_name = last_name;
            teacher.field = field;
            teacher.gerayesh = gerayesh;
            teacher.code = code;
            teacher.contact = contact;
            if (image_link) {
                teacher.image_link = image_link;
            }
            if (description) {
                teacher.description = description;
            }
            teacher.save();
            updateTimeSlot(row, secondRow, teacherId);

        }
    } else {
        if (first_name && first_name !== "") {
            code = password_generator.generate({
                length: 10,
                numbers: true
            });
            Teacher
                .create({
                    first_name: first_name,
                    last_name: last_name,
                    field: field,
                    gerayesh: gerayesh,
                    code: code,
                    contact: contact,
                    image_link: image_link,
                    description: description
                })
                .then(teacher => {
                    updateTimeSlot(row, secondRow, teacher.id);
                })
        }
    }

}


exports.updateRow = (firstRow, secondRow) => {
    updateFields(firstRow, secondRow);
};

exports.createUpdatedExcel = () => {

};