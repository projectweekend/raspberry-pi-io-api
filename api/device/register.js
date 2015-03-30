var util = require( "util" );
var errors = require( "api-utils" ).errors;
var CreateHandler = require( "express-classy" ).CreateHandler;

var User = require( "../user/models" ).User;
var Device = require( "./models" ).Device;


module.exports = Register;


function Register ( req, res, next ) {

    CreateHandler.call( this, req, res, next );

}

util.inherits( Register, CreateHandler );

Register.prototype.preCreate = function() {

    var _this = this;

    function onResult ( err, user ) {

        /* istanbul ignore if */
        if ( err ) {
            return _this.emit( "error", err );
        }

        if ( !user ) {
            return _this.emit( "error", errors.auth( "Requires authentication" ) );
        }

        return _this.emit( "create", user );

    }

    User.detailById( _this.req.user._id, onResult );

};

Register.prototype.create = function( user ) {

    var _this = this;

    function onResult ( err, device ) {

        if ( err ) {
            return _this.emit( "error", err );
        }

        return _this.emit( "respond", device );

    }

    Device.registerForUser( user, onResult );

};

Register.prototype.handle = function() {
    this.preCreate();
};
