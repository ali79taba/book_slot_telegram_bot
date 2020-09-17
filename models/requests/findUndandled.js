const pending = require('../pendingAccept');
const Teacher = require('../teacher');
const {Op} = require("sequelize");

async function findUnhandled() {
    const teachers = await Teacher.findAll({
        where: {
            [Op.or]: [
                {dontSendRequestNotificationBot: null},
                {dontSendRequestNotificationBot: false}
            ]
        }
    })
    const pendingRequests = await pending.findAll({
        where: {
            [Op.or]: [
                ...teachers.map((teacher)=>{
                    return {
                        teacherId: teacher.id
                    }
                })
            ]
        }
    })
    const now = new Date();
    return (pendingRequests.filter(pendingRequest => {
        const requestTime = new Date(pendingRequest.createdAt);
        const diff = now.getTime() - requestTime.getTime();
        return diff >=  24 * 60 * 60 * 1000;
    }))
}

module.exports = findUnhandled;