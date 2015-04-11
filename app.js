var express = require( "express" );
var expressValidator = require( "express-validator" );
var jwt = require( "express-jwt" );
var logger = require( "morgan" );
var bodyParser = require( "body-parser" );
var databaseUtils = require( "api-utils" ).database;
var authUtils = require( "api-utils" ).authentication;
var routes = require( "./routes/index" );


if ( !process.env.RABBIT_URL ) {
    console.log( "RABBIT_URL environment variable not defined" );
    process.exit( 1 );
}

var db = databaseUtils.mongooseConnection( "DB_PORT" );
var app = express();

app.use( logger( "dev" ) );
app.use( bodyParser.json() );
app.use( expressValidator() );
app.use( bodyParser.urlencoded( { extended: false} ) );
app.use( authUtils.systemAPIKey( [ "/pin-config" ] ) );

var authNotRequired = [ "/register", "/authenticate", "/pin-config" ];
app.use( jwt( { secret: process.env.JWT_SECRET } ).unless( { path: authNotRequired } ) );

app.use( "/", routes );

// catch 404 and forward to error handler
app.use( function ( req, res, next ) {

    var err = new Error( "Not Found" );
    err.status = 404;
    next( err );

} );

// error handlers

// development error handler
// will print stacktrace
if ( app.get( "env" ) === "development" ) {

    app.use( function ( err, req, res, next ) {

        return res.status( err.status || 500 ).json( {
            message: err.message,
            error: err
        } );

    } );

}

// production error handler
// no stacktraces leaked to user
app.use( function ( err, req, res, next ) {

    res.status( err.status || 500 ).json( {
        message: err.message,
        error: {}
    } );

} );


module.exports = app;
