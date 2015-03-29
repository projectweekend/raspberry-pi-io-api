var expect = require( "chai" ).expect;
var supertest = require( "supertest" );

var app = require( "../app" );
var User = require( "../api/user/models" ).User;
var Server = require( "../api/rabbit/models" ).Server;
var mockRabbitClient = require( "../api/utils/testing" ).mockRabbitClient;
var restoreRabbitClient = require( "../api/utils/testing" ).restoreRabbitClient;

var api = supertest( app );


var routes = {
    register: "/register",
    getDetail: "/user",
    unRegister: "/user",
    authenticate: "/authenticate",
    generateKey: "/user/key"
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
        passwordRequired: "Password is required",
        requiresAuthentication: "Requires authentication"
    },
    token: ""
};


describe( "Register a new user...", function () {

    before( mockRabbitClient );
    after( restoreRabbitClient );

    before( function ( done ) {

        User.remove( {}, function ( err ) {

            if ( err ) {
                return done( err );
            }

            return done();

        } );

    } );

    before( function ( done ) {

        Server.remove( {}, function ( err ) {

            if ( err ) {
                return done( err );
            }

            return done();

        } );

    } );

    before( function ( done ) {

        Server.create( { name: "test_server" }, function ( err ) {

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
                .set( "SYSTEM-API-KEY", "fakeapikey" )
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
                .set( "SYSTEM-API-KEY", "fakeapikey" )
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
                .set( "SYSTEM-API-KEY", "fakeapikey" )
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
                .set( "SYSTEM-API-KEY", "fakeapikey" )
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
                .set( "SYSTEM-API-KEY", "fakeapikey" )
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
                .set( "SYSTEM-API-KEY", "fakeapikey" )
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
                .set( "SYSTEM-API-KEY", "fakeapikey" )
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
                .set( "SYSTEM-API-KEY", "fakeapikey" )
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
                .set( "SYSTEM-API-KEY", "fakeapikey" )
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


describe( "Generate an access key...", function () {

    it( "responds with 201 and a key", function ( done ) {

        api.post( routes.generateKey )
            .set( "Content-Type", "application/json" )
            .set( "SYSTEM-API-KEY", "fakeapikey" )
            .set( "Authorization", "Bearer " + testData.token )
            .expect( 201 )
            .end( function ( err, res ) {

                if ( err ) {
                    return done( err );
                }

                expect( res.body ).to.have.a.property( "key" ).and.not.be.empty;

                return done();

            } );

    } );

} );


describe( "Get user detail...", function () {

    it( "responds with 200 and data", function ( done ) {

        api.get( routes.getDetail )
            .set( "Content-Type", "application/json" )
            .set( "SYSTEM-API-KEY", "fakeapikey" )
            .set( "Authorization", "Bearer " + testData.token )
            .expect( 200 )
            .end( function ( err, res ) {

                if ( err ) {
                    return done( err );
                }

                expect( res.body ).to.have.a.property( "email", testData.valid.email );

                return done();

            } );

    } );

} );


describe( "Unregister a user...", function () {

    it( "responds with 204", function ( done ) {

        api.del( routes.unRegister )
            .set( "Content-Type", "application/json" )
            .set( "SYSTEM-API-KEY", "fakeapikey" )
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


describe( "Unregister a user with an old token...", function () {

    it( "responds with 401", function ( done ) {

        api.del( routes.unRegister )
            .set( "Content-Type", "application/json" )
            .set( "SYSTEM-API-KEY", "fakeapikey" )
            .set( "Authorization", "Bearer " + testData.token )
            .expect( 401 )
            .end( function ( err, res ) {

                if ( err ) {
                    return done( err );
                }

                expect( res.body ).to.have.a.property( "message", testData.messages.requiresAuthentication );

                return done();

            } );

    } );

} );


describe( "Generate an access key with an old token...", function () {

    it( "responds with 401 and a message", function ( done ) {

        api.post( routes.generateKey )
            .set( "Content-Type", "application/json" )
            .set( "SYSTEM-API-KEY", "fakeapikey" )
            .set( "Authorization", "Bearer " + testData.token )
            .expect( 401 )
            .end( function ( err, res ) {

                if ( err ) {
                    return done( err );
                }

                expect( res.body ).to.have.a.property( "message", testData.messages.requiresAuthentication );

                return done();

            } );

    } );

} );


describe( "Get user detail with an old token...", function () {

    it( "responds with 401 and a message", function ( done ) {

        api.get( routes.getDetail )
            .set( "Content-Type", "application/json" )
            .set( "SYSTEM-API-KEY", "fakeapikey" )
            .set( "Authorization", "Bearer " + testData.token )
            .expect( 401 )
            .end( function ( err, res ) {

                if ( err ) {
                    return done( err );
                }

                expect( res.body ).to.have.a.property( "message", testData.messages.requiresAuthentication );

                return done();

            } );

    } );

} );
