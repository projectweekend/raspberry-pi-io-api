var Device = require( "./models" ).Device;

var detailResponse = require( "../utils/responses" ).detailResponse;
var deleteResponse = require( "../utils/responses" ).deleteResponse;
var nestedCreateResponse = require( "../utils/responses" ).nestedCreateResponse;


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

    Device.addPinConfigForUserAndId( req.user, req.params.deviceId, req.body, nestedCreateResponse( res, next ) );

};


exports.listPins = function ( req, res, next ) {

    Device.listPinConfigForUserAndId( req.user, req.params.deviceId, detailResponse( res, next ) );

};


exports.detailPin = function ( req, res, next ) {

    Device.detailPinConfigForUserAndId( req.user, req.params.deviceId, req.params.pinId, detailResponse( res, next ) );

};


exports.removePin = function ( req, res, next ) {

    Device.removePinConfigForUserAndId( req.user, req.params.deviceId, req.params.pinId, deleteResponse( res, next ) );

};
