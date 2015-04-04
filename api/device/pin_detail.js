var util = require( "util" );
var Device = require( "./models" ).Device;
var ReadHandler = require( "express-classy" ).ReadHandler;


module.exports = PinDetail;


function PinDetail () {

    ReadHandler.call( this );

}

util.inherits( PinDetail, ReadHandler );

PinDetail.prototype.action = function() {

    Device.detailPinConfigForUserAndId( this.req.user, this.req.params.deviceId, this.req.params.pinId, this.nextOnResult( "done", true ) );

};
