var util = require( "util" );
var CreateHandler = require( "express-classy" ).CreateHandler;
var User = require( "./models" ).User;


module.exports = GenerateKey;


function GenerateKey ( req, res, next ) {
    CreateHandler.call( this, req, res, next );
}

util.inherits( GenerateKey, CreateHandler );

GenerateKey.prototype.create = function() {

    var _this = this;

    User.generateKeyById( _this.req.user._id, function ( err, key ) {

        if ( err ) {
            return _this.emit( "error", err );
        }

        var data = {
            key: key
        };

        return _this.emit( "respond", data );

    } );

};

GenerateKey.prototype.handle = function() {

    this.create();

};
