var app = require( "../app" );
var expect = require( "chai" ).expect;
var supertest = require( "supertest" );


var api = supertest( app );


var validEmail = "test@test.com";
var validPassword = "SuperSecret";

var invalidEmail = "not an email";
var invalidPassword = "short";

var invalidEmailMessage = "Not a valid email address";


describe( "Register a new user with valid data", function () {

    it( "responds with 201 and data", function ( done ) {

        api.post( "/register" )
            .set( "Content-Type", "application/json" )
            .send( {
                email: validEmail,
                password: validPassword
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


describe( "Register a new user with invalid email", function () {

    it( "responds with 400 and a message", function ( done ) {

        api.post( "/register" )
            .set( "Content-Type", "application/json" )
            .send( {
                email: invalidEmail,
                password: validPassword
            } )
            .expect( 400 )
            .end( function ( err, res ) {

                if ( err ) {
                    return done( err );
                }

                expect( res.body ).to.be.an( "array" ).with.length.equal( 1 );
                expect( res.body[ 0 ] ).to.have.a.property( "msg", invalidEmailMessage );

                done();

            } );

    } );

} );
