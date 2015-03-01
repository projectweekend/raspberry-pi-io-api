var express = require( "express" );
var router = express.Router();

var user = require( "../api/user/handlers" );
var device = require( "../api/device/handlers" );


router.post( "/register", user.register );
router.post( "/authenticate", user.authenticate );

router.get( "/user", user.getDetail );
router.delete( "/user", user.unRegister );

router.post( "/user/key", user.generateKey );

router.post( "/user/device", device.register );
router.get( "/user/device", device.list );


module.exports = router;
