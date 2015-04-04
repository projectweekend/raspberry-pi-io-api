var express = require( "express" );
var router = express.Router();
var user = require( "../api/user" );
var device = require( "../api/device" );
var raspberrypi = require( "../api/raspberrypi" );


var userRegister = new user.Register();
router.post( "/register", function ( req, res, next ) {
    userRegister.handle( req, res, next );
} );

var userAuthenticate = new user.Authenticate();
router.post( "/authenticate", function ( req, res, next ) {
    userAuthenticate.handle( req, res, next );
} );

var userDetail = new user.GetDetail();
router.get( "/user", function ( req, res, next ) {
    userDetail.handle( req, res, next );
} );

var userUnRegister = new user.UnRegister();
router.delete( "/user", function ( req, res, next ) {
    userUnRegister.handle( req, res, next );
} );

var generateKey = new user.GenerateKey();
router.post( "/user/key", function ( req, res, next ) {
    generateKey.handle( req, res, next );
} );

// router.get( "/pin-config", function ( req, res, next ) {
//     var pinConfig = new raspberrypi.PinConfig( req, res, next );
//     pinConfig.handle();
// } );

var deviceRegister = new device.Register();
router.post( "/user/device", function ( req, res, next ) {
    deviceRegister.handle( req, res, next );
} );

var deviceList = new device.DeviceList();
router.get( "/user/device", function ( req, res, next ) {
    deviceList.handle( req, res, next );
} );

var deviceDetail = new device.DeviceDetail();
router.get( "/user/device/:deviceId", function ( req, res, next ) {
    deviceDetail.handle( req, res, next );
} );

var deviceRemove = new device.DeviceRemove();
router.delete( "/user/device/:deviceId", function ( req, res, next ) {
    deviceRemove.handle( req, res, next );
} );

var addPin = new device.AddPin();
router.post( "/user/device/:deviceId/pin", function ( req, res, next ) {
    addPin.handle( req, res, next );
} );

var pinList = new device.PinList();
router.get( "/user/device/:deviceId/pin", function ( req, res, next ) {
    pinList.handle( req, res, next );
} );

var pinDetail = new device.PinDetail();
router.get( "/user/device/:deviceId/pin/:pinId", function ( req, res, next ) {
    pinDetail.handle( req, res, next );
} );

var pinRemove = new device.PinRemove();
router.delete( "/user/device/:deviceId/pin/:pinId", function ( req, res, next ) {
    pinRemove.handle( req, res, next );
} );


module.exports = router;
