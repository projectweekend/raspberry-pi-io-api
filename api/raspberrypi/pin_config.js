var util = require( "util" );
var errors = require( "api-utils" ).errors;
var User = require( "../user/models" ).User;
var Device = require( "../device/models" ).Device;
var ReadHandler = require( "express-classy" ).ReadHandler;

var rabbitURL = process.env.RABBIT_URL;


module.exports = PinConfig;


function PinConfig () {

    ReadHandler.call( this );

    this.on( "verify.user.email", this.verifyUser );
    this.on( "verify.user.key", this.verifyUserKey );
    this.on( "verify.user.device", this.verifyUserDevice );

}

util.inherits( PinConfig, ReadHandler );

PinConfig.prototype.validate = function() {

    var deviceId = this.req.headers[ "io-device-id" ];
    var userEmail = this.req.headers[ "io-user-email" ];
    var userKey = this.req.headers[ "io-user-key" ];

    if ( !deviceId || !userEmail || !userKey ) {
        return this.emit( "error", errors.auth( "Missing required headers" ) );
    }

    return this.emit( "verify.user.email", userEmail );

};

PinConfig.prototype.verifyUser = function( userEmail ) {

    User.verifyUserByEmail( userEmail, this.onListCreate( "verify.user.key" ) );

};

PinConfig.prototype.verifyUserKey = function( user ) {

    var _this = this;

    function onResult ( err ) {

        if ( err ) {
            return _this.emit( "error", err );
        }

        return _this.emit( "verify.user.device", user );

    }

    user.isKeyValid( _this.req.headers[ "io-user-key" ], onResult );

};

PinConfig.prototype.verifyUserDevice = function( user ) {

    var _this = this;

    function onResult ( err, device ) {

        if ( err ) {
            return _this.emit( "error", err );
        }

        var data = {
            rabbitURL: rabbitURL,
            pinConfig: device.pinConfig
        };

        return _this.emit( "done", data );

    }

    Device.verifyForUserAndId( user, this.req.headers[ "io-device-id" ], onResult );

};

PinConfig.prototype.handle = function( req, res, next ) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.emit( "validate" );
};
