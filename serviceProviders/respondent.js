exports.errorResponse = (res, code, error, msg ) => {
    res.statusCode = code;
    res.json({
        success :   false,
        error   :   error,
        message :   msg
    })
};


exports.dataResponse = (res, code, data, msg ) => {
    res.statusCode = code;
    res.json({
        success :   true,
        data    :   [data],
        message :   msg
    })
};
