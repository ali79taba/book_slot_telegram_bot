// const xlsxFile = require('read-excel-file/node');

//     console.log(rows);
// });

// const XLSX = require('xlsx');
//
// const wb2 = xlsx.readFile(__dirname + 'interveiw.xlsx');
// const sheetName = wb2;
//
// let wb = XLSX.utils.book_new();
//
// wb.Props = {
//     Title: "SheetJS Tutorial",
//     Subject: "Test",
//     Author: "Red Stapler",
//     CreatedDate: new Date(2017,12,19)
// };
//
// wb.SheetNames.push("Test Sheet");
//
// let ws_data = [['hello' , 'world']];  //a row with 2 columns
//
// let ws = XLSX.utils.aoa_to_sheet(ws_data);
//
// let wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
//
// function s2ab(s) {
//     let buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
//     let view = new Uint8Array(buf);  //create uint8array as viewer
//     for (let i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
//     return buf;
// }

// Require library
// var xl = require('excel4node');
//
//
//
// // Create a new instance of a Workbook class
// var wb = new xl.Workbook();
//
// // Add Worksheets to the workbook
// var ws = wb.addWorksheet('Sheet 1');
// var ws2 = wb.addWorksheet('Sheet 2');
//
// // Create a reusable style
// var style = wb.createStyle({
//     font: {
//         color: '#FF0800',
//         size: 12,
//     },
//     numberFormat: '$#,##0.00; ($#,##0.00); -',
// });
//
// // Set value of cell A1 to 100 as a number type styled with paramaters of style
// ws.cell(1, 1)
//     .number(100)
//     .style(style);
//
// // Set value of cell B1 to 200 as a number type styled with paramaters of style
// ws.cell(1, 2)
//     .number(200)
//     .style(style);
//
// // Set value of cell C1 to a formula styled with paramaters of style
// ws.cell(1, 3)
//     .formula('A1 + B1')
//     .style(style);
//
// // Set value of cell A2 to 'string' styled with paramaters of style
// ws.cell(2, 1)
//     .string('string')
//     .style(style);
//
// // Set value of cell A3 to true as a boolean type styled with paramaters of style but with an adjustment to the font size.
// ws.cell(3, 1)
//     .bool(true)
//     .style(style)
//     .style({font: {size: 14}});
//
// wb.write(__dirname + 'Excel.xlsx');


// const Excel = require('exceljs');
//
// let workbook = new Excel.Workbook();
//
// workbook.xlsx.readFile(__dirname + '/test.xlsx').then(()=>{
//     // workbook.sheets
//     console.log("OK");
//     let worksheet = workbook.getWorksheet(1);
//     let row = worksheet.getRow(3);
//     // console.log(worksheet);
//     // console.log(row.values);
//     // console.log(row.getCell(2).value);
//     let cell = row.getCell(2);
//     cell.value = 23;
//     workbook.xlsx.writeFile(__dirname + '/interview2.xlsx').then(()=>{
//     });
// });

