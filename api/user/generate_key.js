var util = require( "util" );
var CreateHandler = require( "express-classy" ).CreateHandler;
var User = require( "./models" ).User;


module.exports = GenerateKey;


function GenerateKey () {
    CreateHandler.call( this );
}

util.inherits( GenerateKey, CreateHandler );

GenerateKey.prototype.action = function() {

    User.generateKeyById( this.req.user._id, this.onGenerateKey() );

};

GenerateKey.prototype.handle = function( req, res, next ) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.emit( "create" );
};

GenerateKey.prototype.onGenerateKey = function() {

    var _this = this;

    return function ( err, key ) {

        if ( err ) {
            return _this.emit( "error", err );
        }

        var data = {
            key: key
        };

        return _this.emit( "done", data );

    };

};
