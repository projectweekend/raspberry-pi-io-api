var async = require( "async" );
var moment = require( "moment" );
var errors = require( "api-utils" ).errors;

var User = require( "../user/models" ).User;
var Device = require( "./models" ).Device;

var createdResponse = require( "../utils/responses" ).createdResponse;
var listResponse = require( "../utils/responses" ).listResponse;
var detailResponse = require( "../utils/responses" ).detailResponse;
var deleteResponse = require( "../utils/responses" ).deleteResponse;
var updateResponse = require( "../utils/responses" ).updateResponse;


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

    var tasks = [ verifyUser, verifySubscription, registerDevice ];

    async.waterfall( tasks, createdResponse( res, next ) );

};


exports.list = function ( req, res, next ) {

    Device.listForUser( req.user, listResponse( res, next ) );

};


exports.detail = function ( req, res, next ) {

    Device.detailForUserAndId( req.user, req.params.deviceId, detailResponse( res, next ) );

};


exports.remove = function ( req, res, next ) {

    Device.removeForUserAndId( req.user, req.params.deviceId, deleteResponse( res, next ) );

};


exports.addPin = function ( req, res, next ) {

    req.checkBody( "pin", "Must be an integer" ).isInt();
    req.checkBody( "name", "Must be a string" ).isLength( 1 );
    req.checkBody( "mode", "Must be one of: 'IN', 'OUT'" ).isIn( [ "IN", "OUT" ] );
    req.checkBody( "initial", "Must be one of: 'HIGH', 'LOW'" ).optional().isIn( [ "HIGH", "LOW" ] );
    req.checkBody( "resistor", "Must be one of: 'PUD_UP', 'PUD_DOWN'" ).optional().isIn( [ "PUD_UP", "PUD_DOWN" ] );
    req.checkBody( "pinEvent", "Must be one of: 'RISING', 'FALLING', 'BOTH'" ).optional().isIn( [ "RISING", "FALLING", "BOTH" ] );
    req.checkBody( "bounce", "Must be an integer" ).optional().isInt();

    var validationErrors = req.validationErrors();

    if ( validationErrors ) {
        return res.status( 400 ).json( validationErrors );
    }

    Device.addPinConfigForUserAndId( req.user, req.params.deviceId, req.body, createdResponse( res, next ) );

};


exports.listPins = function ( req, res, next ) {

    Device.listPinConfigForUserAndId( req.user, req.params.deviceId, listResponse( res, next ) );

};


exports.detailPinConfig = function ( req, res, next ) {

};


exports.updatePinConfig = function ( req, res, next ) {

};


exports.deletePinConfig = function ( req, res, next ) {

};
