var util = require( "util" );
var authUtils = require( "api-utils" ).authentication;
var ReadHandler = require( "express-classy" ).ReadHandler;
var User = require( "./models" ).User;


module.exports = Authenticate;


function Authenticate () {
    ReadHandler.call( this );
}

util.inherits( Authenticate, ReadHandler );

Authenticate.prototype.validate = function() {

    this.req.checkBody( "email", "Not a valid email address" ).isEmail();
    this.req.checkBody( "password", "Password is required" ).isLength( 1 );

    var validationErrors = this.req.validationErrors();

    if ( validationErrors ) {
        return this.emit( "invalid", validationErrors );
    }

    var user = {
        email: this.req.body.email,
        password: this.req.body.password
    };

    return this.emit( "read", user );

};

Authenticate.prototype.action = function( user ) {

    var _this = this;

    User.authenticate( user, function ( err, existingUser ) {

        if ( err ) {
            return _this.emit( "error", err );
        }

        var response = {
            token: authUtils.generateJWT( existingUser, [ "_id", "email" ] )
        };

        _this.emit( "done", response );

    } );

};

Authenticate.prototype.handle = function( req, res, next ) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.emit( "validate" );
};
