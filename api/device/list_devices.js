var util = require( "util" );
var ReadHandler = require( "express-classy" ).ReadHandler;
var Device = require( "./models" ).Device;


module.exports = ListDevices;


function ListDevices ( req, res, next ) {

    ReadHandler.call( this, req, res, next );

}

util.inherits( ListDevices, ReadHandler );

ListDevices.prototype.read = function() {

    var _this = this;

    function onResult ( err, devices ) {

        if ( err ) {
            return _this.emit( "error", err );
        }

        return _this.emit( "respond", devices );

    }

    Device.listForUser( _this.req.user, onResult );

};
