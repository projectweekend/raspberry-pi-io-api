var express = require( "express" );
var router = express.Router();
var user = require( "../api/user/handlers" );
var device = require( "../api/device/handlers" );
var raspberrypi = require( "../api/raspberrypi/handlers" );


router.post( "/register", function ( req, res, next ) {
    var register = new user.Register( req, res, next );
    register.handle();
} );
router.post( "/authenticate", function ( req, res, next ) {
    var authenticate = new user.Authenticate( req, res, next );
    authenticate.handle();
} );


router.get( "/user", function ( req, res, next ) {
    var getDetail = new user.GetDetail( req, res, next );
    getDetail.handle();
} );
router.delete( "/user", user.unRegister );

router.post( "/user/key", user.generateKey );

router.post( "/user/device", device.register );
router.get( "/user/device", device.list );
router.get( "/user/device/:deviceId", device.detail );
router.delete( "/user/device/:deviceId", device.remove );

router.post( "/user/device/:deviceId/pin", device.addPin );
router.get( "/user/device/:deviceId/pin", device.listPins );
router.get( "/user/device/:deviceId/pin/:pinId", device.detailPin );
router.delete( "/user/device/:deviceId/pin/:pinId", device.removePin );

router.get( "/pin-config", raspberrypi.pinConfig );


module.exports = router;
