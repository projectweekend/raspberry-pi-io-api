var async = require( "async" );
var bcrypt = require( "bcrypt" );
var mongoose = require( "mongoose" );
var errors = require( "api-utils" ).errors;


var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var UserSchema = Schema ( {
    id: ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: String
} );


UserSchema.statics.add = function ( newUser, done ) {

    newUser.password = bcrypt.hashSync( newUser.password, 8 );

    this.create( newUser, function ( err, doc ) {

        if ( err && err.code === 11000 ) {
            return done( errors.conflict( "Email address already in use" ) );
        }

        if ( err ) {
            return done( errors.system( "Database error occurred" ) );
        }

        delete doc.password;

        return done( null, doc );

    } );

};


UserSchema.statics.authenticate = function ( user, done ) {

    var _this = this;

    function findExistingUser ( cb ) {

        _this.findOne( { email: user.email }, function ( err, existingUser ) {

            if ( err ) {
                return cb( errors.system( "Database error occurred" ) );
            }

            if ( !existingUser ) {
                return cb( errors.auth( "Invalid credentials" ) );
            }

            return cb( null, existingUser );

        } );

    }

    function checkPassword ( existingUser, cb ) {

        bcrypt.compare( user.password, existingUser.password, function ( err, result ) {

            if ( err ) {
                return cb( errors.system( "System error occurred" ) );
            }

            if ( !result ) {
                return cb( errors.auth( "Invalid credentials" ) );
            }

            delete existingUser.password;

            return cb( null, existingUser );

        } );

    }

    async.waterfall( [ findExistingUser, checkPassword ], function ( err, existingUser ) {

        if ( err ) {
            return done( err );
        }

        return existingUser;

    } );

};


exports.User = mongoose.model( "User", UserSchema );
