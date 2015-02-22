exports.system = function ( message ) {

    return {
        error: new Error( message ),
        code: 500
    };

};


exports.auth = function ( message ) {

    return {
        error: new Error( message ),
        code: 401
    };

};


exports.conflict = function ( message ) {

    return {
        error: new Error( message ),
        code: 409
    };

};
