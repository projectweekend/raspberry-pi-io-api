var async = require( "async" );
var bcrypt = require( "bcrypt" );
var mongoose = require( "mongoose" );
var uuid = require( "node-uuid" );
var errors = require( "api-utils" ).errors;

var rabbitURL = process.env.RABBIT_URL;


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
    key: String
} );


UserSchema.statics.register = function ( newUserData, done ) {

    newUserData.password = bcrypt.hashSync( newUserData.password, 8 );

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


UserSchema.statics.detailById = function ( id, done ) {

    var fields = "_id email";

    this.findById( id, fields, function ( err, existingUser ) {

        /* istanbul ignore if */
        if ( err ) {
            return done( err );
        }

        if ( !existingUser ) {
            return done( errors.auth( "Requires authentication" ) );
        }

        return done( null, existingUser );

    } );

};


UserSchema.statics.unRegister = function ( user, done ) {

    this.findOneAndRemove( { email: user.email }, function ( err, existingUser ) {

        /* istanbul ignore if */
        if ( err ) {
            return done( err );
        }

        if ( !existingUser ) {
            return done( errors.auth( "Requires authentication" ) );
        }

        return done( null );

    } );

};


UserSchema.statics.generateKeyById = function ( id, done ) {

    this.findById( id, function ( err, user ) {

        /* istanbul ignore if */
        if ( err ) {
            return done( err );
        }

        if ( !user ) {
            return done( errors.auth( "Requires authentication" ) );
        }

        return user.generateKey( done );

    } );

};


UserSchema.statics.verifyUserByEmail = function ( email, done ) {

    this.findOne( { email: email }, function ( err, user ) {

        /* istanbul ignore if */
        if ( err ) {
            return done( err );
        }

        if ( !user ) {
            return done( errors.notAuthorized( "Not authorized" ) );
        }

        return done( null, user );

    } );

};


UserSchema.methods.isKeyValid = function ( key, done ) {

    bcrypt.compare( key, this.key, function ( err, result ) {

        /* istanbul ignore if */
        if ( err ) {
            return done( err );
        }

        if ( !result ) {
            return done( errors.auth( "Invalid user key" ) );
        }

        return done( null );

    } );

};


UserSchema.methods.generateKey = function ( done ) {

    var key = uuid.v1();

    this.key = bcrypt.hashSync( key, 8 );
    this.save( function ( err ) {

        /* istanbul ignore if */
        if ( err ) {
            return done( err );
        }

        return done( null, key );

    } );

};


exports.User = mongoose.model( "User", UserSchema );
