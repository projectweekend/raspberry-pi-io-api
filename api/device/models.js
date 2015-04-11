var format = require( "util" ).format;
var async = require( "async" );
var mongoose = require( "mongoose" );
var errors = require( "api-utils" ).errors;
var validPins = require( "./config.json" ).validPins;


var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var PinConfigSchema = Schema( {
    pin: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        trim: true
    },
    mode: {
        type: String,
        required: true
    },
    initial: {
        type: String,
        default: "LOW"
    },
    resistor: String,
    pinEvent: String,
    bounce: Number
} );


var DeviceSchema = Schema ( {
    id: ObjectId,
    userEmail: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    pinConfig: [ PinConfigSchema ]
} );


DeviceSchema.statics.registerForUser = function ( user, type, done ) {

    var newDeviceData = {
        userEmail: user.email,
        type: type,
        pinConfig: []
    };

    this.create( newDeviceData, function ( err, newDevice ) {

        /* istanbul ignore if */
        if ( err ) {
            return done( err );
        }

        return done( null, newDevice );

    } );

};


DeviceSchema.statics.verifyForUserAndId = function ( user, deviceId, done ) {

    var query = {
        userEmail: user.email,
        _id: deviceId
    };


    this.findOne( query, function ( err, device ) {

        if ( ( err && err.name === "CastError" ) || !device ) {
            return done( errors.notAuthorized( "Device not valid" ) );
        }

        /* istanbul ignore if */
        if ( err ) {
            return done( err );
        }

        return done( null, device );

    } );

};


DeviceSchema.statics.listForUser = function ( user, done ) {

    this.find( { userEmail: user.email }, done );

};


DeviceSchema.statics.detailForUserAndId = function ( user, deviceId, done ) {

    this.findOne( {
        userEmail: user.email,
        _id: deviceId
    }, done );

};


DeviceSchema.statics.removeForUserAndId = function ( user, deviceId, done ) {

    this.findOneAndRemove( {
        userEmail: user.email,
        _id: deviceId
    }, done );

};


DeviceSchema.statics.addPinConfigForUserAndId = function ( user, deviceId, pinConfigItem, done ) {

    var _this = this;

    function findDevice ( cb ) {

        var query = {
            userEmail: user.email,
            _id: deviceId
        };

        _this.findOne( query, function ( err, device ) {

            /* istanbul ignore if */
            if ( err ) {
                return cb( err );
            }

            if ( !device ) {
                return cb( null, null );
            }

            return cb( null, device );

        } );

    }

    function validatePinOnDevice ( device, cb ) {

        if ( !device ) {
            return cb( null, null );
        }

        var pinsOnDevice = validPins[ device.type ];

        if ( pinsOnDevice.indexOf( pinConfigItem.pin ) === -1 ) {
            var message = "Pin %d is not available on device type %s";
            message = format( message, pinConfigItem.pin, device.type );
            return cb( errors.conflict( message ) );
        }

        return cb( null, device );

    }

    function addPinToDevice ( device, cb ) {

        if ( !device ) {
            return cb( null, null );
        }

        var pin = device.pinConfig.create( pinConfigItem );

        device.pinConfig.push( pin );

        device.save( function ( err ) {

            /* istanbul ignore if */
            if ( err ) {
                return cb( err );
            }

            return cb( null, pin );

        } );

    }

    async.waterfall( [ findDevice, validatePinOnDevice, addPinToDevice ], done );

};


DeviceSchema.statics.listPinConfigForUserAndId = function ( user, deviceId, done ) {

    this.detailForUserAndId( user, deviceId, function ( err, device ) {

        /* istanbul ignore if */
        if ( err ) {
            return done( err );
        }

        if ( !device ) {
            return done();
        }

        return done( null, device.pinConfig );

    } );

};


DeviceSchema.statics.detailPinConfigForUserAndId = function ( user, deviceId, pinId, done ) {

    this.detailForUserAndId( user, deviceId, function ( err, device ) {

        /* istanbul ignore if */
        if ( err ) {
            return done( err );
        }

        if ( !device ) {
            return done();
        }

        var pin = device.pinConfig.id( pinId );

        if ( !pin ) {
            return done();
        }

        return done( null, pin );

    } );

};


DeviceSchema.statics.removePinConfigForUserAndId = function ( user, deviceId, pinId, done ) {

    var _this = this;

    function findDevice ( cb ) {

        _this.detailForUserAndId( user, deviceId, function ( err, device ) {

            /* istanbul ignore if */
            if ( err ) {
                return cb( err );
            }

            if ( !device ) {
                return cb( null, null );
            }

            return cb( null, device );

        } );

    }

    function removePinFromDevice ( device, cb ) {

        if ( !device ) {
            return cb( null, null );
        }

        var pin = device.pinConfig.id( pinId );

        if ( !pin ) {
            return cb( null, null );
        }

        pin.remove();

        device.save( function ( err ) {

            /* istanbul ignore if */
            if ( err ) {
                return cb( err );
            }

            return  cb( null, pin );

        } );

    }

    async.waterfall( [ findDevice, removePinFromDevice ], done );

};


DeviceSchema.index( { userEmail: 1 } );


exports.Device = mongoose.model( "Device", DeviceSchema );
