var app = require( "../app" );
var expect = require( "chai" ).expect;
var supertest = require( "supertest" );


var api = supertest( app );


describe( "Register a new user with valid data", function () {

    var email = "test@test.com";
    var password = "SuperSecret";

    it( "responds with 201 and data", function ( done ) {

        api.post( "/user" )
            .set( "Content-Type", "application/json" )
            .send( {
                email: email,
                password: password
            } )
            .expect( 201 )
            .end( function ( err, res ) {

                if ( err ) {
                    return done( err );
                }

                expect( res.body ).to.have.a.property( "token" );

                done();

            } );

    } );

} );
