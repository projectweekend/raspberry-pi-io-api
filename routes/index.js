var express = require( "express" );
var router = express.Router();

var user = require( "../api/user/handlers" );


router.get( "/ping", function ( req, res, next ) {

    res.json( {
        message: "pong"
    } );

} );

router.post( "/user", user.add );


module.exports = router;
