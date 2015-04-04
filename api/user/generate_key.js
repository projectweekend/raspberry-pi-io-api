var util = require( "util" );
var CreateHandler = require( "express-classy" ).CreateHandler;
var User = require( "./models" ).User;


module.exports = GenerateKey;


function GenerateKey () {
    CreateHandler.call( this );
}

util.inherits( GenerateKey, CreateHandler );

GenerateKey.prototype.action = function() {

    var _this = this;

    User.generateKeyById( _this.req.user._id, function ( err, key ) {

        if ( err ) {
            return _this.emit( "error", err );
        }

        var data = {
            key: key
        };

        return _this.emit( "done", data );

    } );

};

GenerateKey.prototype.handle = function( req, res, next ) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.emit( "create" );
};
