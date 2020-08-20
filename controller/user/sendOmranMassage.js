const User = require('../../models/user');

const {bot} = require('../../util/bot');

const sleep = require('sleep');

exports.send =async ()=>{
    const users =await User.findAll({where:{field:"مهندسی عمران"}});
    const response = "متاسفانه در روند ثبت نام شما در رشته عمران، مشکلی پیش آمده بود.\n" +
        "اکنون مشکل انتخاب رشته و گرایش شما رفع شد و میتوانید با دستور  /start اطلاعات خود را تکمیل کنید!\n" +
        "پس از تکمیل ثبت مشخصات میتوانید رزومه اساتید گرایش خود را مشاهده کنید و از آنها وقت مشاوره بگیرید";
    for(let index in users){
        const user = users[index];
        console.log(user.chatId);
        await bot.sendMessage(user.chatId,response);
        await sleep.msleep(500);
    }
};