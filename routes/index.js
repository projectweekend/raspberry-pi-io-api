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
router.get( "/user/device/:deviceId", device.detail );
router.delete( "/user/device/:deviceId", device.remove );

router.post( "/user/device/:deviceId/pin", device.addPin );


module.exports = router;
