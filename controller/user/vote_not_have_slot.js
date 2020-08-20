const {bot} = require('../../util/bot');
const Vote = require('../../models/vote');

module.exports.giveVote = async (chatId, id_vote) =>{
    let text = "";
    switch (id_vote) {
        case 1:
            text = "دستم خورد";
            break;
        case 2:
            text = "فقط میخواستم عملکرد بات رو ببینم";
            break;
        case 3:
            text = "وقت مشترکی با استاد پیدا نکردم";
            break;
        case 4:
            text = "دقیقا نمی دونستم چی باید به استاد بگم";
            break;
        case 5:
            text = "روند ربات واضح نبود، فکر میکردم با استاد قرار ملاقات ست کردم";
            break;
    }
    if(text) {
        console.log(chatId);
        let vote = await Vote.findOne({where:{chatId: chatId}});
        console.log(vote);
        if(vote){
            vote.text = text;
            vote.save();
        }else{
            await Vote.create({chatId: chatId, text: text});
        }
    }
    bot.sendMessage(chatId, "نظر شما ثبت شد.").then().catch();
}