const Pending = require('../pendingAccept');
const Accepted = require('../acceptedRequest');

exports.acceptRequestById = async function (id){
    const request = await Pending.findOne({where: {id}});
    const value = request.get();
    await request.destroy();
    await Accepted.create({teacherId: value.teacherId, userId: value.userId});
}