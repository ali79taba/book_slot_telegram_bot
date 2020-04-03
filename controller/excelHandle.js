const fixNumber = require("../util/persian_numbers");
const admin_bot = require('../util/admin_bot');
const {bot} = require('../util/bot');

const Teacher = require("../models/teacher");
const TimeSlot = require('../models/timeSlot');
const User = require('../models/user');

const fs = require('fs');
const Stream = require('stream');
const https = require('https');
const path = require('path');
const root_path = require('../util/path');
const Excel = require('exceljs');
const password_generator = require('generate-password');

const teacher_column = require('../util/teacher_excel_col_number');

function getCellValue(row, colNumber) {
    if (row.values.length < colNumber) {
        return null;
    }
    console.log("colNumber : ", colNumber);
    let cellValue = row.getCell(colNumber).value;
    if (!cellValue) {
        return null;
    }
    if (cellValue.hasOwnProperty('richText')) {
        cellValue = cellValue.richText[1].text;
    }
    return cellValue;
}

async function removeRemoved(row, teacherId) {
    const timeSlots = await TimeSlot.findAll({where: {teacherId: teacherId}});
    timeSlots.forEach((timeSlot) => {
        const value = getCellValue(row, timeSlot.col);
        if (value !== timeSlot.description) {
            User.findOne({where: {id: timeSlot.userId}}).then(user => {
                if (user) {
                    bot.sendMessage(user.chatId, "یکی از بازه های انتخابی شما حذف شده و استاد دیگر در آن زمان نمی تواند مشاوره بدهد لطفا دوباره بازه زمانی خود را انتخاب کنید.").then();
                }
            });
            timeSlot.destroy().then(
                console.log("######## destorying slot : ", value)
            );
        }
    });
}

async function updateTimeSlot(firstRow, secondRow, teacherId, colNumber) {
    console.log(teacherId);
    const timeSlots = await TimeSlot.findAll({where: {teacherId: teacherId}});
    await removeRemoved(firstRow, teacherId);
    firstRow.eachCell(async (cell, colNumber) => {
        if (colNumber >= teacher_column.START_SLOT_TIME_COLUMN) {
            let cellValue = cell.value;
            if (cellValue.hasOwnProperty('richText')) {
                cellValue = cellValue.richText[1].text;
            }
            console.log("I am in TimeSlots");
            console.log(cellValue);
            const slot = await TimeSlot.findOne({where: {teacherId: teacherId, col: colNumber}});
            if (!slot && cellValue && (cellValue !== "")) {
                console.log(teacherId);
                console.log(colNumber);
                TimeSlot.create({teacherId: teacherId, description: cellValue, col: colNumber});
            }
        }
    })
}

async function updateFields(row, secondRow, colNumber) {
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
                    updateTimeSlot(row, secondRow, teacher.id, colNumber);
                });
            console.log("Find users for this gerayesh : ", gerayesh);
            User.findAll({where: {gerayesh: gerayesh}}).then(users => {
                users.forEach(user => {
                    console.log("users that have gerayesh : ", user.id);
                    bot.sendMessage(user.chatId, "در گرایش شما استادی اضافه شده است برای مشاهده استاد ها دستور /show_teachers را وارد کنید.");
                });
            })
        }
    }

}


exports.updateRow = (firstRow, secondRow, colNumber) => {
    updateFields(firstRow, secondRow, colNumber).catch(err => {
        console.log("in update row");
        console.log(err);
    });
};

exports.createUpdatedExcel = () => {

};