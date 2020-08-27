const Pending = require('../pendingAccept');
const Accepted = require('../acceptedRequest');
const Rejected = require('../reject');

exports.acceptRequestById = async function (id){
    const request = await Pending.findOne({where: {id}});
    const value = request.get();
    await request.destroy();
    await Accepted.create({teacherId: value.teacherId, userId: value.userId});
}

exports.rejectRequestById = async function (id){
    const request = await Pending.findOne({where: {id}});
    const value = request.get();
    await request.destroy();
    Rejected.create({teacherId: value.teacherId, userId: value.userId});
}