var util = require( "util" );
var CreateHandler = require( "express-classy" ).CreateHandler;

var User = require( "../user/models" ).User;
var Device = require( "./models" ).Device;


module.exports = Register;


function Register () {

    CreateHandler.call( this );

}

util.inherits( Register, CreateHandler );

Register.prototype.before = function() {

    User.detailById( this.req.user._id, this.nextOnResult( "create" ) );

};

Register.prototype.action = function( user ) {

    Device.registerForUser( user, this.nextOnResult( "done" ) );

};

Register.prototype.handle = function( req, res, next ) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.emit( "before" );
};
