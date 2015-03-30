var util = require( "util" );
var errors = require( "api-utils" ).errors;
var ReadHandler = require( "express-classy" ).ReadHandler;
var Device = require( "./models" ).Device;


module.exports = DeviceDetail;


function DeviceDetail ( req, res, next ) {

    ReadHandler.call( this, req, res, next );

}

util.inherits( DeviceDetail, ReadHandler );

DeviceDetail.prototype.read = function() {

    var _this = this;

    function onResult ( err, detail ) {

        if ( ( err && err.name === "CastError" ) || !detail ) {
            return _this.emit( "error", errors.resourceNotFound( "Not found" ) );
        }

        if ( err ) {
            return _this.emit( "error", err );
        }

        return _this.emit( "respond", detail );

    }

    Device.detailForUserAndId( _this.req.user, _this.req.params.deviceId, onResult );

};
