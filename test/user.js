var expect = require( "chai" ).expect;
var supertest = require( "supertest" );

var app = require( "../app" );
var models = require( "../api/user/models" );

var api = supertest( app );


var testData = {
    valid: {
        email: "test@test.com",
        password: "SuperSecret"
    },
    invalid: {
        email: "not an email",
        password: "short",
    },
    messages: {
        invalidEmail: "Not a valid email address"
    }
};


describe( "Register a new user...", function () {


    before( function ( done ) {

        models.User.remove( {}, function ( err ) {

            if ( err ) {
                return done( err );
            }

            return done();

        } );

    } );


    describe( "with valid data", function () {

        it( "responds with 201 and data", function ( done ) {

            api.post( "/register" )
                .set( "Content-Type", "application/json" )
                .send( {
                    email: testData.valid.email,
                    password: testData.valid.password
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


    describe( "with invalid email", function () {

        it( "responds with 400 and a message", function ( done ) {

            api.post( "/register" )
                .set( "Content-Type", "application/json" )
                .send( {
                    email: testData.invalid.email,
                    password: testData.valid.password
                } )
                .expect( 400 )
                .end( function ( err, res ) {

                    if ( err ) {
                        return done( err );
                    }

                    expect( res.body ).to.be.an( "array" );
                    expect( res.body.length ).equal( 1 );
                    expect( res.body[ 0 ] ).to.have.a.property( "msg", testData.messages.invalidEmail );

                    done();

                } );

        } );

    } );


} );
