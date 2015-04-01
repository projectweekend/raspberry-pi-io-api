var Device = require( "./models" ).Device;

var deleteResponse = require( "../utils/responses" ).deleteResponse;


exports.removePin = function ( req, res, next ) {

    Device.removePinConfigForUserAndId( req.user, req.params.deviceId, req.params.pinId, deleteResponse( res, next ) );

};
