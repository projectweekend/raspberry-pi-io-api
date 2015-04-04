var util = require( "util" );
var ReadHandler = require( "express-classy" ).ReadHandler;
var User = require( "./models" ).User;


module.exports = GetDetail;


function GetDetail () {
    ReadHandler.call( this );
}

util.inherits( GetDetail, ReadHandler );

GetDetail.prototype.action = function() {

    var _this = this;

    function onDetail ( err, detail ) {

        if ( err ) {
            return _this.emit( "error", err );
        }

        return _this.emit( "done", detail );

    }

    User.detailById( this.req.user._id, onDetail );
};
