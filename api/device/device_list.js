var util = require( "util" );
var ReadHandler = require( "express-classy" ).ReadHandler;
var Device = require( "./models" ).Device;


module.exports = DeviceList;


function DeviceList () {

    ReadHandler.call( this );

}

util.inherits( DeviceList, ReadHandler );

DeviceList.prototype.action = function() {

    Device.listForUser( this.req.user, this.nextOnResult( "done" ) );

};
