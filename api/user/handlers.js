var async = require( "async" );
var authUtils = require( "api-utils" ).authentication;
var User = require( "./models" ).User;


var accountCreateQueue = process.env.BASE_CREATE_QUEUE;
if ( !accountCreateQueue ) {
    console.log( "BASE_CREATE_QUEUE environment variable is required." );
    process.exit( 1 );
}


exports.register = function ( req, res, next ) {

    req.checkBody( "email", "Not a valid email address" ).isEmail();
    req.checkBody( "password", "Password must be at least 6 characters" ).isLength( 6 );

    var validationErrors = req.validationErrors();

    if ( validationErrors ) {
        return res.status( 400 ).json( validationErrors );
    }

    var user = {
        email: req.body.email,
        password: req.body.password
    };

    function registerUser ( done ) {

        User.register( user, function ( err, newUser ) {

            if ( err ) {
                return done( err );
            }

            return done( null, newUser );

        } );

    }

    function sendRabbitMessage ( newUser, done ) {

        // var queue = accountCreateQueue + "." + newUser.subscription.serverName;
        // var message = {
        //     user_key: newUser._id
        // };
        // messageBroker.publish( queue, message );
        return done( null, newUser );
    }

    function sendResponse ( err, newUser ) {

        if ( err ) {
            return next( err );
        }

        return res.status( 201 ).json( {
            token: authUtils.generateJWT( newUser, [ "_id", "email" ] )
        } );

    }

    async.waterfall( [ registerUser, sendRabbitMessage ], sendResponse );

};


exports.authenticate = function ( req, res, next ) {

    req.checkBody( "email", "Not a valid email address" ).isEmail();
    req.checkBody( "password", "Password is required" ).isLength( 1 );

    var validationErrors = req.validationErrors();

    if ( validationErrors ) {
        return res.status( 400 ).json( validationErrors );
    }

    var user = {
        email: req.body.email,
        password: req.body.password
    };

    User.authenticate( user, function ( err, existingUser ) {

        if ( err ) {
            return next( err );
        }

        return res.status( 200 ).json( {
            token: authUtils.generateJWT( existingUser, [ "_id", "email" ] )
        } );

    } );

};


exports.getDetail = function ( req, res, next ) {

    User.detailById( req.user._id, function ( err, detail ) {

        if ( err ) {
            return next( err );
        }

        return res.status( 200 ).json( detail );

    } );

};


exports.unRegister = function ( req, res, next ) {

    User.unRegister( req.user, function ( err ) {

        if ( err ) {
            return next( err );
        }

        return res.status( 204 ).json();

    } );

};


exports.generateKey = function ( req, res, next ) {

    User.generateKeyById( req.user._id, function ( err, key ) {

        if ( err ) {
            return next( err );
        }

        return res.status( 201 ).json( {
            key: key
        } );

    } );

};
