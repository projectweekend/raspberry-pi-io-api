var util = require( "util" );
var DeleteHandler = require( "express-classy" ).DeleteHandler;
var User = require( "./models" ).User;


module.exports = UnRegister;


function UnRegister () {
    DeleteHandler.call( this );
}

util.inherits( UnRegister, DeleteHandler );

UnRegister.prototype.action = function() {

    User.unRegister( this.req.user, this.onListCreate( "done" ) );

};
