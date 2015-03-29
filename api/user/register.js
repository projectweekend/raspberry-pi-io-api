var util = require( "util" );
var authUtils = require( "api-utils" ).authentication;
var CreateHandler = require( "express-classy" ).CreateHandler;
var User = require( "./models" ).User;


module.exports = Register;


function Register ( req, res, next ) {
    CreateHandler.call( this, req, res, next );
}

util.inherits( Register, CreateHandler );

Register.prototype.validate = function() {

    this.req.checkBody( "email", "Not a valid email address" ).isEmail();
    this.req.checkBody( "password", "Password must be at least 6 characters" ).isLength( 6 );

    var validationErrors = this.req.validationErrors();

    if ( validationErrors ) {
        return this.emit( "error.validation", validationErrors );
    }

    var user = {
        email: this.req.body.email,
        password: this.req.body.password
    };

    return this.emit( "create", user );

};

Register.prototype.create = function( user ) {

    var _this = this;

    function onRegister ( err, newUser ) {

        if ( err ) {
            return _this.next( err );
        }

        var response = {
            token: authUtils.generateJWT( newUser, [ "_id", "email" ] )
        };

        return _this.emit( "respond", response );

    }

    User.register( user, onRegister );

};
