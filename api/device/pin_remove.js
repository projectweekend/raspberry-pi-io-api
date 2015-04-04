var util = require( "util" );
var Device = require( "./models" ).Device;
var DeleteHandler = require( "express-classy" ).DeleteHandler;


module.exports = PinRemove;


function PinRemove () {

    DeleteHandler.call( this );

}

util.inherits( PinRemove, DeleteHandler );

PinRemove.prototype.action = function() {

    Device.removePinConfigForUserAndId( this.req.user, this.req.params.deviceId, this.req.params.pinId, this.nextOnResult( "done", true ) );

};
