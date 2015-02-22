var express = require( "express" );
var router = express.Router();

var user = require( "../api/user/handlers" );


router.post( "/register", user.add );


module.exports = router;
