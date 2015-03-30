var express = require( "express" );
var router = express.Router();
var user = require( "../api/user" );
var device = require( "../api/device/handlers" );
var raspberrypi = require( "../api/raspberrypi" );


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

router.delete( "/user", function ( req, res, next ) {
    var unRegister = new user.UnRegister( req, res, next );
    unRegister.handle();
} );

router.post( "/user/key", function ( req, res, next ) {
    var generateKey = new user.GenerateKey( req, res, next );
    generateKey.handle();
} );

router.get( "/pin-config", function ( req, res, next ) {
    var pinConfig = new raspberrypi.PinConfig( req, res, next );
    pinConfig.handle();
} );


router.post( "/user/device", device.register );
router.get( "/user/device", device.list );
router.get( "/user/device/:deviceId", device.detail );
router.delete( "/user/device/:deviceId", device.remove );

router.post( "/user/device/:deviceId/pin", device.addPin );
router.get( "/user/device/:deviceId/pin", device.listPins );
router.get( "/user/device/:deviceId/pin/:pinId", device.detailPin );
router.delete( "/user/device/:deviceId/pin/:pinId", device.removePin );



module.exports = router;
