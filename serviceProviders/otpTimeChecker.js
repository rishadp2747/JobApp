var express = require('express');

exports.timeChecker = function(pastTime) {
    //past time and date
    let year = pastTime.getUTCFullYear();
    let month =  pastTime.getUTCMonth();
    let date =  pastTime.getUTCDate();
    let hour =  pastTime.getUTCHours();
    let min =  pastTime.getUTCMinutes();
    let sec =  pastTime.getUTCSeconds();
   
    //current time and date
    let today = new Date();
    let t_year = today.getUTCFullYear();
    let t_month = today.getUTCMonth();
    let t_date = today.getUTCDate();
    let t_hr = today.getUTCHours();
    let t_min = today.getUTCMinutes();
    let t_sec = today.getUTCSeconds();
    //console.log(date+'/'+month+'/'+year);
    //console.log(hour+':'+min+':'+sec);

    //console.log(t_date+'/'+t_month+'/'+t_year);
    //console.log(t_hr+':'+t_min+':'+t_sec);

    let hr_diff = t_hr - hour;
    let min_diff = t_min - min;
    let sec_diff = t_sec - sec;

    console.log(hr_diff + ':' + min_diff + ':' + sec_diff);

    var err = "TimeOut please resend OTP";

    return new Promise((resolve,reject) => {
        if(year === t_year && month === t_month && date === t_date){
            if(hr_diff == 0 && min_diff <= 59 && sec_diff <= 59){
                resolve();
                
            }else{
                reject(err);   
            } 
        }else{
            reject(err);
        }
    });
        


}