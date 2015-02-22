var async = require( "async" );
var authUtils = require( "api-utils" ).authentication;
var User = require( "./models" ).User;


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

    User.register( user, function ( err, newUser ) {

        if ( err ) {
            return next( err );
        }

        return res.status( 201 ).json( {
            token: authUtils.generateJWT( newUser, [ "_id", "email" ] )
        } );

    } );

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


exports.unRegister = function ( req, res, next ) {

    User.unRegister( req.user, function ( err ) {

        /* istanbul ignore if */
        if ( err ) {
            return next( err );
        }

        return res.status( 204 ).json();

    } );

};
