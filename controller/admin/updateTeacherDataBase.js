const fixNumber = require("../../util/persian_numbers");
const admin_bot = require('../../util/admin_bot');

const Teacher = require("../../models/teacher");
const TimeSlot = require('../../models/timeSlot');
const excelHandle = require('../excelHandle');

const fs = require('fs');
const Stream = require('stream');
const https = require('https');

const path = require('path');
const root_path = require('../../util/path');
const Excel = require('exceljs');


module.exports.updateDataBase = (filePath) => {
    let workbook = new Excel.Workbook();
    workbook.xlsx.readFile(filePath).then(() => {
        let worksheet = workbook.getWorksheet(1);
        const colNumber = worksheet.columnCount;
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 2 && rowNumber % 2 === 1) {
                excelHandle.updateRow(row, worksheet.getRow(rowNumber+1), colNumber);
            }
        });
        workbook.xlsx.writeFile(path.join(root_path, 'data', 'updatadeDataBase.xlsx')).then(() => {
        }).catch(err=>{
            console.log(err);
        })
    });
};