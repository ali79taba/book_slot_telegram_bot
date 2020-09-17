const findUnhandled = require('../../models/requests/findUndandled');
const {createPendingsMassage} = require('../../controller/admin/requests');
const admin = require('../../models/admin');
const admin_bot = require('../../util/admin_bot');

async function sendUnhandledRequests(){
    const pendingRequests = await findUnhandled();
    let response = "درخواست های تایید نشده توسط استاد : \n";
    response += await createPendingsMassage(pendingRequests);
    const admins = await admin.findAll();
    admins.forEach(admin=>{
        if(admin.chatId){
            admin_bot.sendMessage(admin.chatId, response);
        }
    })
}

module.exports = sendUnhandledRequests;