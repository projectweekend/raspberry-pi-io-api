var express = require( "express" );
var router = express.Router();

var user = require( "../api/user/handlers" );


router.post( "/register", user.register );
router.post( "/authenticate", user.authenticate );


module.exports = router;
