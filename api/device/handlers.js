var async = require( "async" );
var moment = require( "moment" );
var errors = require( "api-utils" ).errors;

var User = require( "../user/models" ).User;
var Device = require( "./models" ).Device;


exports.register = function ( req, res, next ) {

    function verifyUser ( cb ) {

        User.detailById( req.user._id, function ( err, user ) {

            /* istanbul ignore if */
            if ( err ) {
                return cb( err );
            }

            if ( !user ) {
                return cb( errors.auth( "Requires authentication" ) );
            }

            return cb( null, user );

        } );

    }

    function verifySubscription ( user, cb ) {

        var now = moment();
        var subscriptionEnd = moment( user.subscription.end );

        if ( subscriptionEnd.isBefore( now ) ) {
            return cb( errors.notAuthorized( "Subscription expired" ) );
        }

        Device.canRegisterForUser( user, function ( err, canRegister ) {

            /* istanbul ignore if */
            if ( err ) {
                return cb( err );
            }

            if ( !canRegister ) {
                return cb( errors.notAuthorized( "Max devices registered" ) );
            }

            return cb( null, user );

        } );

    }

    function registerDevice ( user, cb ) {

        Device.registerForUser( user, cb );

    }

    async.waterfall( [ verifyUser, verifySubscription, registerDevice ], function ( err, device ) {

        /* istanbul ignore if */
        if ( err ) {
            return next( err );
        }

        return res.status( 201 ).json( device );

    } );

};
