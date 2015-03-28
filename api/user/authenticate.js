var util = require( "util" );
var authUtils = require( "api-utils" ).authentication;
var ReadHandler = require( "express-classy" ).ReadHandler;
var User = require( "./models" ).User;


module.exports = Authenticate;


function Authenticate ( req, res, next ) {
    ReadHandler.call( this, req, res, next );
}

util.inherits( Authenticate, ReadHandler );

Authenticate.prototype.preRead = function() {

    this.req.checkBody( "email", "Not a valid email address" ).isEmail();
    this.req.checkBody( "password", "Password is required" ).isLength( 1 );

    var validationErrors = this.req.validationErrors();

    if ( validationErrors ) {
        return this.emit( "error.validation", validationErrors );
    }

    var user = {
        email: this.req.body.email,
        password: this.req.body.password
    };

    return this.emit( "read", user );

};

Authenticate.prototype.read = function( user ) {

    var _this = this;

    User.authenticate( user, function ( err, existingUser ) {

        if ( err ) {
            return _this.emit( "error", err );
        }

        var response = {
            token: authUtils.generateJWT( existingUser, [ "_id", "email" ] )
        };

        _this.emit( "respond", response, 200 );

    } );

};

Authenticate.prototype.handle = function() {
    this.preRead();
};
