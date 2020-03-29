// const User_Teacher = sequelize.define('User_Teacher', {
//     id: {
//         type: Sequelize.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: false
//     }
// });

// User.belongsToMany(Teacher, { through: User_Teacher });
// Teacher.belongsToMany(User, { through: User_Teacher });

// Teacher.create({ name: "سعید" , field: 1})

// .then(teacher => {
//     User.create({ chatId: 12312, name: "کریم" }).then(user => {
//         const po = {
//             teacherId: teacher.id,
//             userId: user.id
//         }
//         TeacherUser.create(po, {}, { returning: true });
//     })
// });

// const stream = fs.createReadStream(path.join(root_path, 'data', 'test.xlsx'));
// const Excel = require('exceljs');
// let workbook = new Excel.Workbook();
// workbook.xlsx.readFile(path.join(root_path, 'data', 'test.xlsx')).then(() => {
//     const stream = Stream.stream;
//     workbook.xlsx.write(stream).then(() => {
//             admin_bot.sendDocument(chatId, stream).then();
//         }
//     );
//
// });
