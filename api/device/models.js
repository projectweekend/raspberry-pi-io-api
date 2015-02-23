var mongoose = require( "mongoose" );


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
    pinConfig: [ PinConfigSchema ]
} );


DeviceSchema.statics.registerForUser = function ( user, done ) {

    var newDeviceData = {
        userEmail: user.email,
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


DeviceSchema.statics.canRegisterForUser = function ( user, done ) {

    this.count( { userEmail: user.email }, function ( err, count ) {

        /* istanbul ignore if */
        if ( err ) {
            return done( err );
        }

        return done( null, user.subscription.level > count );

    } );

};

DeviceSchema.index( { key: 1, userEmail: 1 }, { unique: true } );


exports.Device = mongoose.model( "Device", DeviceSchema );
