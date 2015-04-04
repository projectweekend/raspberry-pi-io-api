var util = require( "util" );
var _ = require( "lodash" );
var Device = require( "./models" ).Device;
var CreateHandler = require( "express-classy" ).CreateHandler;


module.exports = AddPin;


function AddPin () {

    CreateHandler.call( this );

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
        return this.emit( "invalid", validationErrors );
    }

    var pin = _.pick( this.req.body, [ "pin", "name", "mode", "initial", "resistor", "pinEvent", "bounce" ] );

    return this.emit( "create", pin );

};

AddPin.prototype.action = function( pin ) {

    Device.addPinConfigForUserAndId( this.req.user, this.req.params.deviceId, pin, this.onDetailUpdateDelete( "done" ) );

};
