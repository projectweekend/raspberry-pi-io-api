var util = require( "util" );
var Device = require( "./models" ).Device;
var ReadHandler = require( "express-classy" ).ReadHandler;
var errors = require( "api-utils" ).errors;


module.exports = PinList;


function PinList ( req, res, next ) {

    ReadHandler.call( this, req, res, next );

}

util.inherits( PinList, ReadHandler );

PinList.prototype.read = function() {

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

    Device.listPinConfigForUserAndId( _this.req.user, _this.req.params.deviceId, onResponse );

};
