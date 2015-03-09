var mongoose = require( "mongoose" );

var errors = require( "api-utils" ).errors;


var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var ServerSchema = Schema ( {
    id: ObjectId,
    name: String,
    userCount: {
        type: Number,
        default: 0
    }
} );


ServerSchema.statics.getAvailable = function ( done ) {

    var query = {
        userCount: {
            $lt: 100
        }
    };

    this.findOne( query, function ( err, server ) {

        /* istanbul ignore if */
        if ( err ) {
            return done( err );
        }

        if ( !server ) {
            return done( errors.system( "No Rabbit servers available" ) );
        }

        return done( null, server );

    } );

};


ServerSchema.methods.addUser = function ( done ) {

    this.userCount += 1;
    this.save( done );

};


exports.Server = mongoose.model( "Server", ServerSchema );
