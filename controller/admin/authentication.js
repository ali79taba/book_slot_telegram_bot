const Admin = require('../../models/admin');
const admin_bot = require('../../util/admin_bot');
const mainView = require('../../view/admin/main_view_admin');

const PASSWORD = "QAWSED";

function checkPass(msg){
    const chatId = msg.chat.id;
    const data = msg.text;
    if(data === PASSWORD){
        Admin.create({chatId:chatId});
        admin_bot.sendMessage(chatId, "شما با موفقیت وارد بات شدید");
        try{
            mainView.view(chatId);
        }catch(err){
            console.log(err);
        }
    }else{
        admin_bot.sendMessage(chatId, "لطفا دوباره امتحان کنید، رمز غلط است." + "\n /start \n")
    }
}

exports.start = (msg)=>{
    const chatId = msg.chat.id;
    admin_bot.sendMessage(chatId, "لطفا رمز را وارد کنید", {reply_markup: JSON.stringify({force_reply: true})})
        .then(sentMessage => {
            admin_bot.onReplyToMessage(
                sentMessage.chat.id,
                sentMessage.message_id,
                checkPass
            );
        });
};

exports.auth = (msg, callback)=>{
    const chatId = msg.chat.id;
    Admin.findOne({where:{chatId:chatId}}).then(admin=>{
        if(admin){
            callback(msg);
        }else{
            admin_bot.sendMessage(chatId, "لطفا /start را زده و رمز را وارد کنید");
        }
    })
};