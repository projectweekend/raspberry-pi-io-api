var Device = require( "./models" ).Device;

var detailResponse = require( "../utils/responses" ).detailResponse;
var deleteResponse = require( "../utils/responses" ).deleteResponse;


exports.detailPin = function ( req, res, next ) {

    Device.detailPinConfigForUserAndId( req.user, req.params.deviceId, req.params.pinId, detailResponse( res, next ) );

};


exports.removePin = function ( req, res, next ) {

    Device.removePinConfigForUserAndId( req.user, req.params.deviceId, req.params.pinId, deleteResponse( res, next ) );

};
