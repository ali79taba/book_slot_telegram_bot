const TimeSlot = require("../../models/timeSlot");


exports.fix = async ()=>{
    const timeSlots = await TimeSlot.findAll()
    timeSlots.forEach(timeSlot=>{
        timeSlot.description = timeSlot.description.replace(/\s+/g,' ').trim();
        timeSlot.save();
    })
    console.log("teacher data fixed");
}