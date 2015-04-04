var util = require( "util" );
var Device = require( "./models" ).Device;
var ReadHandler = require( "express-classy" ).ReadHandler;


module.exports = PinList;


function PinList () {

    ReadHandler.call( this );

}

util.inherits( PinList, ReadHandler );

PinList.prototype.action = function() {

    Device.listPinConfigForUserAndId( this.req.user, this.req.params.deviceId, this.nextOnResult( "done", true ) );

};
