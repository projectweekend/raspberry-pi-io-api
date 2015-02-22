var expect = require( "chai" ).expect;
var supertest = require( "supertest" );

var app = require( "../app" );
var models = require( "../api/user/models" );

var api = supertest( app );


var routes = {
    register: "/register",
    unRegister: "/user",
    authenticate: "/authenticate"
};


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
        invalidEmail: "Not a valid email address",
        invalidPassword: "Password must be at least 6 characters",
        emailInUse: "Email address already in use",
        invalidCredentials: "Invalid credentials",
        passwordRequired: "Password is required"
    },
    token: ""
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

            api.post( routes.register )
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

                    testData.token = res.body.token;

                    return done();

                } );

        } );

    } );

    describe( "with invalid email", function () {

        it( "responds with 400 and a message", function ( done ) {

            api.post( routes.register )
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

                    return done();

                } );

        } );

    } );

    describe( "with invalid password", function () {

        it( "responds with 400 and a message", function ( done ) {

            api.post( routes.register )
                .set( "Content-Type", "application/json" )
                .send( {
                    email: testData.valid.email,
                    password: testData.invalid.password
                } )
                .expect( 400 )
                .end( function ( err, res ) {

                    if ( err ) {
                        return done( err );
                    }

                    expect( res.body ).to.be.an( "array" );
                    expect( res.body.length ).equal( 1 );
                    expect( res.body[ 0 ] ).to.have.a.property( "msg", testData.messages.invalidPassword );

                    return done();

                } );

        } );

    } );

    describe( "with an email already in use", function () {

        it( "responds with 409 and a message", function ( done ) {

            api.post( routes.register )
                .set( "Content-Type", "application/json" )
                .send( {
                    email: testData.valid.email,
                    password: testData.valid.password
                } )
                .expect( 409 )
                .end( function ( err, res ) {

                    if ( err ) {
                        return done( err );
                    }

                    expect( res.body ).to.have.a.property( "message", testData.messages.emailInUse );

                    return done();

                } );

        } );

    } );

} );


describe( "Authenticate a user...", function () {

    describe( "with valid credentials", function () {

        it( "responds with 200 and a token", function ( done ) {

            api.post( routes.authenticate )
                .set( "Content-Type", "application/json" )
                .send( {
                    email: testData.valid.email,
                    password: testData.valid.password
                } )
                .expect( 200 )
                .end( function ( err, res ) {

                    if ( err ) {
                        return done( err );
                    }

                    expect( res.body ).to.have.a.property( "token" );

                    return done();

                } );

        } );

    } );

    describe( "with an email that is not registered", function () {

        it( "responds with 401 and a message", function ( done ) {

            api.post( routes.authenticate )
                .set( "Content-Type", "application/json" )
                .send( {
                    email: "not@registered.com",
                    password: testData.valid.password
                } )
                .expect( 401 )
                .end( function ( err, res ) {

                    if ( err ) {
                        return done( err );
                    }

                    expect( res.body ).to.have.a.property( "message", testData.messages.invalidCredentials );

                    return done();

                } );

        } );

    } );

    describe( "with a bad password", function () {

        it( "responds with 401 and a message", function ( done ) {

            api.post( routes.authenticate )
                .set( "Content-Type", "application/json" )
                .send( {
                    email: testData.valid.email,
                    password: "badpassword"
                } )
                .expect( 401 )
                .end( function ( err, res ) {

                    if ( err ) {
                        return done( err );
                    }

                    expect( res.body ).to.have.a.property( "message", testData.messages.invalidCredentials );

                    return done();

                } );

        } );

    } );

    describe( "with an invalid email", function () {

        it( "responds with 400 and a message", function ( done ) {

            api.post( routes.authenticate )
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

                    return done();

                } );

        } );

    } );

    describe( "with no password", function () {

        it( "responds with 400 and a message", function ( done ) {

            api.post( routes.authenticate )
                .set( "Content-Type", "application/json" )
                .send( {
                    email: testData.valid.email,
                    password: ""
                } )
                .expect( 400 )
                .end( function ( err, res ) {

                    if ( err ) {
                        return done( err );
                    }

                    expect( res.body ).to.be.an( "array" );
                    expect( res.body.length ).equal( 1 );
                    expect( res.body[ 0 ] ).to.have.a.property( "msg", testData.messages.passwordRequired );

                    return done();

                } );

        } );

    } );

} );


describe( "Unregister a user...", function () {

    it( "responds with 204", function ( done ) {

        api.del( routes.unRegister )
            .set( "Content-Type", "application/json" )
            .set( "Authorization", "Bearer " + testData.token )
            .expect( 204 )
            .end( function ( err ) {

                if ( err ) {
                    return done( err );
                }

                return done();

            } );

    } );

} );
