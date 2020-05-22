
exports.passwordValidator = (password) => {
    return new Promise ( (resolve, reject) => {
        if(password.length < 8){
            //console.log('err1');
            return reject({status : false, err : 'FieldError', info : 'Password field required minimum 8 character'});
        }else if(password.includes(" ")){
           // console.log('err2');
            return reject({status : false, err : 'FieldError', info : 'Password field not allowed the white space'});
        }else{
            //console.log('pass okay');
            return resolve({status : true, info : 'Healthy password'});
        }
    });
};
