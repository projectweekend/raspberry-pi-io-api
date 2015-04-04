var util = require( "util" );
var errors = require( "api-utils" ).errors;
var CreateHandler = require( "express-classy" ).CreateHandler;

var User = require( "../user/models" ).User;
var Device = require( "./models" ).Device;


module.exports = Register;


function Register () {

    CreateHandler.call( this );

}

util.inherits( Register, CreateHandler );

Register.prototype.before = function() {

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

Register.prototype.action = function( user ) {

    Device.registerForUser( user, this.onListCreate( "done" ) );

};

Register.prototype.handle = function( req, res, next ) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.emit( "before" );
};
