var async = require( "async" );
var errors = require( "api-utils" ).errors;

var User = require( "../user/models" ).User;
var Device = require( "../device/models" ).Device;

var listResponse = require( "../utils/responses" ).listResponse;


exports.pinConfig = function ( req, res, next ) {

    var deviceId = req.headers[ "io-device-id" ];
    var userEmail = req.headers[ "io-user-email" ];
    var userKey = req.headers[ "io-user-key" ];

    if ( !deviceId || !userEmail || !userKey ) {
        return next( errors.auth( "Missing required headers" ) );
    }

    function verifyUser ( done ) {

        User.verifySubscriptionByUserEmail( userEmail, done );

    }

    function verifyUserKey ( user, done ) {

        user.isKeyValid( userKey, function ( err ) {

            if ( err ) {
                return done( err );
            }

            return done( null, user );

        } );

    }

    function verifyDevice ( user, done ) {

        Device.verifyForUserAndId( user, deviceId, function ( err, device ) {

            if ( err ) {
                return done( err );
            }

            return done( null, user, device );

        } );

    }

    function prepareResponse ( user, device, done ) {

        var response = {
            rabbitURL: user.subscription.rabbitURL,
            pinConfig: device.pinConfig
        };

        return done( null, response );
    }

    var tasks = [ verifyUser, verifyUserKey, verifyDevice, prepareResponse ];

    async.waterfall( tasks, listResponse( res, next ) );

};
