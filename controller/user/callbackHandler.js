const variable = require('../../util/callback_handler_variable');
const register = require('../../controller/register');
const LastRequest =require('../../models/last_request');
const voteNotHaveSlot =  require('./vote_not_have_slot');
const functionHandler = require('../../controller/user/function_handler');


module.exports = async (msg)=>{
    const data = msg.data;
    const arguments = data.split('_');
    const chatId = msg.message.chat.id;
    if(arguments[0] === variable.GRADE){
        arguments.splice(0,1);
        console.log(arguments[0]);
        register.setGrade(chatId, arguments[0]);
    }else if(arguments[0] === 'start'){
        console.log("in call back start");
        let msg = {chat : {id : chatId}};
        register.createUser(msg);
    }else if(arguments[0] === 'voteNotHaveSlot'){
        voteNotHaveSlot.giveVote(chatId, Number(arguments[1]));
    }else if(functionHandler.commands.includes(data)){
        msg.text = data;
        msg.chat = {
            id: msg.message.chat.id
        }
        await functionHandler.checkRoot(msg).catch(e=>{console.log(e)});
        await functionHandler.doRequests(msg);
    }
};