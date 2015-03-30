var util = require( "util" );
var errors = require( "api-utils" ).errors;
var DeleteHandler = require( "express-classy" ).DeleteHandler;
var Device = require( "./models" ).Device;


module.exports = DeviceRemove;


function DeviceRemove ( req, res, next ) {

    DeleteHandler.call( this, req, res, next );

}

util.inherits( DeviceRemove, DeleteHandler );

DeviceRemove.prototype.del = function() {

    var _this = this;

    function onResult ( err, data ) {

        if ( ( err && err.name === "CastError" ) || !data ) {
            return _this.emit( "error", errors.resourceNotFound( "Not found" ) );
        }

        /* istanbul ignore if */
        if ( err ) {
            return _this.emit( "error", err );
        }

        return _this.emit( "respond", {} );

    }

    Device.removeForUserAndId( _this.req.user, _this.req.params.deviceId, onResult );

};
