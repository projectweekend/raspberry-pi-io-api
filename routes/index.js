var express = require( "express" );
var router = express.Router();

var user = require( "../api/user/handlers" );


router.post( "/register", user.register );
router.post( "/authenticate", user.authenticate );

router.get( "/user", user.getDetail );
router.delete( "/user", user.unRegister );
router.post( "/user/key", user.generateKey );


module.exports = router;
