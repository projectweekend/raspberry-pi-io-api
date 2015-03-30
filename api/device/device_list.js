var util = require( "util" );
var ReadHandler = require( "express-classy" ).ReadHandler;
var Device = require( "./models" ).Device;


module.exports = DeviceList;


function DeviceList ( req, res, next ) {

    ReadHandler.call( this, req, res, next );

}

util.inherits( DeviceList, ReadHandler );

DeviceList.prototype.read = function() {

    var _this = this;

    function onResult ( err, devices ) {

        /* istanbul ignore if */
        if ( err ) {
            return _this.emit( "error", err );
        }

        return _this.emit( "respond", devices );

    }

    Device.listForUser( _this.req.user, onResult );

};
