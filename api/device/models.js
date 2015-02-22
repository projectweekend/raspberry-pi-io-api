var mongoose = require( "mongoose" );


var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var GPIOConfigSchema = Schema( {
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
    key: {
        type: String,
        required: true,
        trim: true
    },
    rabbitURL: {
        type: String,
        required: true,
        trim: true
    },
    userEmail: {
        type: String,
        required: true,
        trim: true
    },
    gpioConfig: [ GPIOConfigSchema ]
} );

DeviceSchema.index( { key: 1, userEmail: 1 }, { unique: true } );


exports.Device = mongoose.model( "Device", DeviceSchema );
