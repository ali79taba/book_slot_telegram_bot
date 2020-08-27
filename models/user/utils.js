const User = require('../user');

async function getUsersInObjectViaId(users){
    let usersInDeep = [];
    console.log(users);
    for (const key in users) {
        console.log(")))))))))))");
        if(users.hasOwnProperty(key)){
            const userId = users[key].userId;
            const user = await User.findOne({where:{id: userId}});
            console.log(Boolean(user));
            if(user){
                usersInDeep.push({
                    ...users[key].get(),
                    user : user.get(),
                })
            }
        }
    }
    console.log("________________",usersInDeep.length);
    return usersInDeep;
}

module.exports = { getUsersInObjectViaId }