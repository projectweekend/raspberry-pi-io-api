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


UserSchema.statics.add = function ( newUserData, done ) {

    newUserData.password = bcrypt.hashSync( newUserData.password, 8 );

    this.create( newUserData, function ( err, newUser ) {

        if ( err && err.code === 11000 ) {
            return done( errors.conflict( "Email address already in use" ) );
        }

        if ( err ) {
            return done( err );
        }

        return done( null, newUser );

    } );

};


UserSchema.statics.authenticate = function ( user, done ) {

    var _this = this;

    function findExistingUser ( cb ) {

        _this.findOne( { email: user.email }, function ( err, existingUser ) {

            if ( err ) {
                return cb( err );
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
                return cb( err );
            }

            if ( !result ) {
                return cb( errors.auth( "Invalid credentials" ) );
            }

            return cb( null, existingUser );

        } );

    }

    async.waterfall( [ findExistingUser, checkPassword ], function ( err, existingUser ) {

        if ( err ) {
            return done( err );
        }

        return done( null, existingUser);

    } );

};


exports.User = mongoose.model( "User", UserSchema );
