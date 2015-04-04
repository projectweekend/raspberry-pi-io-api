var util = require( "util" );
var ReadHandler = require( "express-classy" ).ReadHandler;
var Device = require( "./models" ).Device;


module.exports = DeviceDetail;


function DeviceDetail () {

    ReadHandler.call( this );

}

util.inherits( DeviceDetail, ReadHandler );

DeviceDetail.prototype.action = function() {

    Device.detailForUserAndId( this.req.user, this.req.params.deviceId, this.nextOnResult( "done", true ) );

};
