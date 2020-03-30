const variable = require('../../util/callback_handler_variable');
const {setGrade} = require('../../controller/register');

module.exports = (msg)=>{
    console.log(msg.data);
    const data = msg.data;
    const arguments = data.split('_');
    const chatId = msg.message.chat.id;
    if(arguments[0] === variable.GRADE){
        arguments.splice(0,1);
        console.log(arguments[0]);
        setGrade(chatId, arguments[0]);
    }
};