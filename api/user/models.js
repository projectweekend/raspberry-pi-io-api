var async = require( "async" );
var bcrypt = require( "bcrypt" );
var mongoose = require( "mongoose" );
var moment = require( "moment" );
var uuid = require( "node-uuid" );

var errors = require( "api-utils" ).errors;
var authUtils = require( "api-utils" ).authentication;


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
    password: String,
    key: String,
    subscription: {
        end: Date,
        level: Number
    }
} );


UserSchema.statics.register = function ( newUserData, done ) {

    newUserData.password = bcrypt.hashSync( newUserData.password, 8 );
    newUserData.subscription = {
        end: moment().add( 14, "days" ).toDate(),
        level: 1
    };

    this.create( newUserData, function ( err, newUser ) {

        if ( err && err.code === 11000 ) {
            return done( errors.conflict( "Email address already in use" ) );
        }

        /* istanbul ignore if */
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

            /* istanbul ignore if */
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

            /* istanbul ignore if */
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


UserSchema.statics.unRegister = function ( user, done ) {

    this.findOneAndRemove( { email: user.email }, function ( err ) {

        /* istanbul ignore if */
        if ( err ) {
            return done( err );
        }

        return done( null );

    } );

};


exports.User = mongoose.model( "User", UserSchema );
