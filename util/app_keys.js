if(process.env.ENV === "prod"){
    exports.DATABASE_NAME = process.env.DATABASE_NAME;
    exports.DATABASE_USER = process.env.DATABASE_USER;
    exports.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
    exports.DATABASE_HOST = process.env.DATABASE_HOST;
    exports.DATABASE_PORT = process.env.DATABASE_PORT;

    exports.BOT_TOKEN = process.env.BOT_TOKEN;
    exports.TEACHER_BOT_TOKEN = process.env.TEACHER_BOT_TOKEN;
    exports.ADMIN_BOT_TOKEN = process.env.ADMIN_BOT_TOKEN;
}else{
    module.exports = require('./develop_keys');
}