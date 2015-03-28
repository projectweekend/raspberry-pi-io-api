var util = require( "util" );
var DeleteHandler = require( "express-classy" ).DeleteHandler;
var User = require( "./models" ).User;


module.exports = UnRegister;


function UnRegister ( req, res, next ) {
    DeleteHandler.call( this, req, res, next );
}

util.inherits( UnRegister, DeleteHandler );

UnRegister.prototype.del = function() {

    var _this = this;

    User.unRegister( _this.req.user, function ( err ) {

        if ( err ) {
            return _this.emit( "error", err );
        }

        return _this.emit( "respond", {}, 204 );

    } );

};
