function createDailyInterval(func){

    const twelveAM = (new Date()).setUTCHours(24);
    const now = new Date();
    setTimeout(()=>{
        func();
        setInterval(func,24 * 60 * 60 * 1000);
    },twelveAM.getTime() - now.getTime());
}

module.exports = createDailyInterval;