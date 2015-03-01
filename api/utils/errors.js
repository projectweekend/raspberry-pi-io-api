exports.resourceNotFound = function ()
{
    var err = new Error( "Not Found" );
    err.status = 404;

    return err;
};


exports.invalidCredentials = function ()
{
    var err = new Error( "Invalid credentials" );
    err.status = 401;

    return err;
};
