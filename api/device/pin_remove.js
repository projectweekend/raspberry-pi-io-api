var util = require( "util" );
var Device = require( "./models" ).Device;
var DeleteHandler = require( "express-classy" ).DeleteHandler;
var errors = require( "api-utils" ).errors;


module.exports = PinRemove;


function PinRemove ( req, res, next ) {

    DeleteHandler.call( this, req, res, next );

}

util.inherits( PinRemove, DeleteHandler );

PinRemove.prototype.del = function() {

    var _this = this;

    function onResponse ( err, data ) {

        if ( ( err && err.name === "CastError" ) || !data ) {
            return _this.emit( "error", errors.resourceNotFound( "Not found" ) );
        }

        /* istanbul ignore if */
        if ( err ) {
            return _this.emit( "error", err );
        }

        return _this.emit( "respond", data );

    }

    Device.removePinConfigForUserAndId( _this.req.user, _this.req.params.deviceId, _this.req.params.pinId, onResponse );

};
