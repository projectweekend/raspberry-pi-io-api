var util = require( "util" );
var authUtils = require( "api-utils" ).authentication;
var CreateHandler = require( "express-classy" ).CreateHandler;
var ReadHandler = require( "express-classy" ).ReadHandler;
var User = require( "./models" ).User;


exports.Register = Register;
exports.Authenticate = Authenticate;
exports.GetDetail = GetDetail;


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

        return _this.emit( "post.create", newUser );

    }

    User.register( user, onRegister );

};
Register.prototype.postCreate = function( newUser ) {

    var routingKey = newUser.subscription.serverName;
    var message = {
        user_key: newUser._id
    };

    this.req.app.locals.rabbitClient.send( routingKey, message );

    var response = {
        token: authUtils.generateJWT( newUser, [ "_id", "email" ] )
    };

    this.emit( "respond", response, 201 );

};


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


function GetDetail ( req, res, next ) {
    ReadHandler.call( this, req, res, next );
}
util.inherits( GetDetail, ReadHandler );
GetDetail.prototype.read = function() {

    var _this = this;

    function onDetail ( err, detail ) {

        if ( err ) {
            return _this.emit( "error", err );
        }

        return _this.emit( "respond", detail, 200 );

    }

    User.detailById( this.req.user._id, onDetail );
};


exports.unRegister = function ( req, res, next ) {

    User.unRegister( req.user, function ( err ) {

        if ( err ) {
            return next( err );
        }

        return res.status( 204 ).json();

    } );

};


exports.generateKey = function ( req, res, next ) {

    User.generateKeyById( req.user._id, function ( err, key ) {

        if ( err ) {
            return next( err );
        }

        return res.status( 201 ).json( {
            key: key
        } );

    } );

};
