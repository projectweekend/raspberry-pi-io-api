var util = require( "util" );
var DeleteHandler = require( "express-classy" ).DeleteHandler;
var Device = require( "./models" ).Device;


module.exports = DeviceRemove;


function DeviceRemove () {

    DeleteHandler.call( this );

}

util.inherits( DeviceRemove, DeleteHandler );

DeviceRemove.prototype.action = function() {

    Device.removeForUserAndId( this.req.user, this.req.params.deviceId, this.nextOnResult( "done", true ) );

};
