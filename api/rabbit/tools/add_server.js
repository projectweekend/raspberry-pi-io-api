#!/usr/bin/env node

var databaseUtils = require( "api-utils" ).database;
var db = databaseUtils.mongooseConnection();


var Server = require( "../models" ).Server;
var args = process.argv.slice( 2 );


function main () {

    if ( args.length !== 2 ) {
        console.log( "Two arguments required:" );
        console.log( "1.) Server name (routing_key)" );
        console.log( "2.) Server host" );
        process.exit( 1 );
    }

    var newServer = {
        name: args[ 0 ],
        host: args[ 1 ]
    };

    Server.create( newServer, function ( err ) {

        if ( err ) {
            console.log( err );
            process.exit( 1 );
        }

        console.log( "Server added..." );
        console.log( "Name: " + args[ 0 ] );
        console.log( "Host: " + args[ 1 ] );
        process.exit( 0 );

    } );

}


if ( require.main === module ) {

    main();

}
