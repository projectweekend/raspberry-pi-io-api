var util = require( "util" );
var ReadHandler = require( "express-classy" ).ReadHandler;
var User = require( "./models" ).User;


module.exports = GetDetail;


function GetDetail () {
    ReadHandler.call( this );
}

util.inherits( GetDetail, ReadHandler );

GetDetail.prototype.action = function() {

    User.detailById( this.req.user._id, this.nextOnResult( "done" ) );

};
