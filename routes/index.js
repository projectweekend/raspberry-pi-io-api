var express = require( "express" );
var router = express.Router();
var user = require( "../api/user" );
var device = require( "../api/device" );
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

router.post( "/user/device", function ( req, res, next ) {
    var register = new device.Register( req, res, next );
    register.handle();
} );

router.get( "/user/device", function ( req, res, next ) {
    var deviceList = new device.DeviceList( req, res, next );
    deviceList.handle();
} );

router.get( "/user/device/:deviceId", function ( req, res, next ) {
    var deviceDetail = new device.DeviceDetail( req, res, next );
    deviceDetail.handle();
} );

router.delete( "/user/device/:deviceId", function ( req, res, next ) {
    var deviceRemove = new device.DeviceRemove( req, res, next );
    deviceRemove.handle();
} );

router.post( "/user/device/:deviceId/pin", function ( req, res, next ) {
    var addPin = new device.AddPin( req, res, next );
    addPin.handle();
} );

router.get( "/user/device/:deviceId/pin", function ( req, res, next ) {
    var pinList = new device.PinList( req, res, next );
    pinList.handle();
} );

router.get( "/user/device/:deviceId/pin/:pinId", function ( req, res, next ) {
    var pinDetail = new device.PinDetail( req, res, next );
    pinDetail.handle();
} );

router.delete( "/user/device/:deviceId/pin/:pinId", function ( req, res, next ) {
    var pinRemove = new device.PinRemove( req, res, next );
    pinRemove.handle();
} );


module.exports = router;
