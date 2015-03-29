var util = require( "util" );
var ReadHandler = require( "express-classy" ).ReadHandler;
var User = require( "./models" ).User;


module.exports = GetDetail;


function GetDetail ( req, res, next ) {
    ReadHandler.call( this, req, res, next );
}

util.inherits( GetDetail, ReadHandler );

GetDetail.prototype.read = function() {

    var _this = this;

    function onDetail ( err, detail ) {

        if ( err ) {
            return _this.emit( "error", err );
        }

        return _this.emit( "respond", detail );

    }

    User.detailById( this.req.user._id, onDetail );
};
