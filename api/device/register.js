var util = require( "util" );
var CreateHandler = require( "express-classy" ).CreateHandler;

var User = require( "../user/models" ).User;
var Device = require( "./models" ).Device;

var validPins = require( "./config.json" ).validPins;


module.exports = Register;


function Register () {

    CreateHandler.call( this );

}

util.inherits( Register, CreateHandler );

Register.prototype.validate = function() {

    this.req.checkBody( "type", "Not a valid device type" ).isIn( Object.keys( validPins ) );

    var validationErrors = this.req.validationErrors();

    if ( validationErrors ) {
        return this.emit( "invalid", validationErrors );
    }

    User.detailById( this.req.user._id, this.nextOnResult( "create" ) );

};

Register.prototype.action = function( user ) {

    Device.registerForUser( user, this.req.body.type, this.nextOnResult( "done" ) );

};
