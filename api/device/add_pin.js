var util = require( "util" );
var _ = require( "lodash" );
var Device = require( "./models" ).Device;
var CreateHandler = require( "express-classy" ).CreateHandler;
var errors = require( "api-utils" ).errors;


module.exports = AddPin;


function AddPin ( req, res, next ) {

    CreateHandler.call( this, req, res, next );

}

util.inherits( AddPin, CreateHandler );

AddPin.prototype.validate = function() {

    this.req.checkBody( "pin", "Must be an integer" ).isInt();
    this.req.checkBody( "name", "Must be a string" ).isLength( 1 );
    this.req.checkBody( "mode", "Must be one of: 'IN', 'OUT'" ).isIn( [ "IN", "OUT" ] );
    this.req.checkBody( "initial", "Must be one of: 'HIGH', 'LOW'" ).optional().isIn( [ "HIGH", "LOW" ] );
    this.req.checkBody( "resistor", "Must be one of: 'PUD_UP', 'PUD_DOWN'" ).optional().isIn( [ "PUD_UP", "PUD_DOWN" ] );
    this.req.checkBody( "pinEvent", "Must be one of: 'RISING', 'FALLING', 'BOTH'" ).optional().isIn( [ "RISING", "FALLING", "BOTH" ] );
    this.req.checkBody( "bounce", "Must be an integer" ).optional().isInt();

    var validationErrors = this.req.validationErrors();

    if ( validationErrors ) {
        return this.emit( "error.validation", validationErrors );
    }

    var pin = _.pick( this.req.body, [ "pin", "name", "mode", "initial", "resistor", "pinEvent", "bounce" ] );

    return this.emit( "create", pin );

};

AddPin.prototype.create = function( pin ) {

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

    Device.addPinConfigForUserAndId( _this.req.user, _this.req.params.deviceId, pin, onResponse );

};
