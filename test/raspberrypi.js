var async = require( "async" );
var expect = require( "chai" ).expect;
var supertest = require( "supertest" );

var app = require( "../app" );
var User = require( "../api/user/models" ).User;
var Device = require( "../api/device/models" ).Device;

var api = supertest( app );


var routes = {
    registerUser: "/register",
    registerDevice: "/user/device",
    getList: "/user/device",
    generateKey: "/user/key",
    pinConfig: "/pin-config"
};


var testData = {
    user: {
        email: "test@test.com",
        password: "123456"
    },
    token: "",
    deviceId: "",
    userKey: ""
};


describe( "Testing pin config for Raspberry Pi", function () {

    before( function ( done ) {

        function cleanupUsers ( cb ) {

            User.remove( {}, function ( err ) {

                if ( err ) {
                    return cb( err );
                }

                return cb();

            } );

        }

        function cleanupDevices ( cb ) {

            Device.remove( {}, function ( err ) {

                if ( err ) {
                    return cb( err );
                }

                return cb();

            } );

        }

        function registerUser ( cb ) {

            api.post( routes.registerUser )
                .set( "Content-Type", "application/json" )
                .set( "SYSTEM-API-KEY", "fakeapikey" )
                .send( {
                    email: testData.user.email,
                    password: testData.user.password
                } )
                .expect( 201 )
                .end( function ( err, res ) {

                    if ( err ) {
                        return cb( err );
                    }

                    testData.token = res.body.token;

                    return cb();

                } );

        }

        function generateKey ( cb ) {

            api.post( routes.generateKey )
                .set( "Content-Type", "application/json" )
                .set( "SYSTEM-API-KEY", "fakeapikey" )
                .set( "Authorization", "Bearer " + testData.token )
                .expect( 201 )
                .end( function ( err, res ) {

                    if ( err ) {
                        return cb( err );
                    }

                    testData.userKey = res.body.key;

                    return cb();

                } );

        }

        function registerDevice ( cb ) {

            api.post( routes.registerDevice )
                .set( "Content-Type", "application/json" )
                .set( "SYSTEM-API-KEY", "fakeapikey" )
                .set( "Authorization", "Bearer " + testData.token )
                .expect( 201 )
                .end( function ( err, res ) {

                    if ( err ) {
                        return cb( err );
                    }

                    testData.deviceId = res.body._id;

                    return cb();

                } );

        }

        var tasks = [
            cleanupUsers,
            cleanupDevices,
            registerUser,
            generateKey,
            registerDevice
        ];

        async.series( tasks, function ( err ) {

            if ( err ) {
                return done( err );
            }

            return done();

        } );

    } );


    describe( "Get pin config...", function () {

        it( "responds with 200 and data", function ( done ) {

            api.get( routes.pinConfig )
                .set( "Content-Type", "application/json" )
                .set( "io-device-id", testData.deviceId )
                .set( "io-user-email", testData.user.email )
                .set( "io-user-key", testData.userKey )
                .expect( 200 )
                .end( function ( err, res ) {

                    if ( err ) {
                        return done( err );
                    }

                    expect( res.body ).to.have.a.property( "pinConfig" ).and.be.an( "array" );
                    expect( res.body.pinConfig.length ).equal( 0 );

                    return done();

                } );

        } );

    } );


    describe( "Get pin config with missing io-device-id header...", function () {

        it( "responds with 401", function ( done ) {

            api.get( routes.pinConfig )
                .set( "Content-Type", "application/json" )
                .set( "io-user-email", testData.user.email )
                .set( "io-user-key", testData.userKey )
                .expect( 401 )
                .end( function ( err ) {

                    if ( err ) {
                        return done( err );
                    }

                    return done();

                } );

        } );

    } );

    describe( "Get pin config with missing io-user-email header...", function () {

        it( "responds with 401", function ( done ) {

            api.get( routes.pinConfig )
                .set( "Content-Type", "application/json" )
                .set( "io-device-id", testData.deviceId )
                .set( "io-user-key", testData.userKey )
                .expect( 401 )
                .end( function ( err ) {

                    if ( err ) {
                        return done( err );
                    }

                    return done();

                } );

        } );

    } );


    describe( "Get pin config with missing io-user-key header...", function () {

        it( "responds with 401", function ( done ) {

            api.get( routes.pinConfig )
                .set( "Content-Type", "application/json" )
                .set( "io-device-id", testData.deviceId )
                .set( "io-user-email", testData.user.email )
                .expect( 401 )
                .end( function ( err ) {

                    if ( err ) {
                        return done( err );
                    }

                    return done();

                } );

        } );

    } );

    describe( "Get pin config with an email that doesn't exist...", function () {

        it( "responds with 403", function ( done ) {

            api.get( routes.pinConfig )
                .set( "Content-Type", "application/json" )
                .set( "io-device-id", testData.deviceId )
                .set( "io-user-email", "not@here.com" )
                .set( "io-user-key", testData.userKey )
                .expect( 403 )
                .end( function ( err ) {

                    if ( err ) {
                        return done( err );
                    }

                    return done();

                } );

        } );

    } );


    describe( "Get pin config with an invalid user key...", function () {

        it( "responds with 401", function ( done ) {

            api.get( routes.pinConfig )
                .set( "Content-Type", "application/json" )
                .set( "io-device-id", testData.deviceId )
                .set( "io-user-email", testData.user.email )
                .set( "io-user-key", "not valid" )
                .expect( 401 )
                .end( function ( err ) {

                    if ( err ) {
                        return done( err );
                    }

                    return done();

                } );

        } );

    } );


    describe( "Get pin config with an invalid device id...", function () {

        it( "responds with 403", function ( done ) {

            api.get( routes.pinConfig )
                .set( "Content-Type", "application/json" )
                .set( "io-device-id", "not valid" )
                .set( "io-user-email", testData.user.email )
                .set( "io-user-key", testData.userKey )
                .expect( 403 )
                .end( function ( err ) {

                    if ( err ) {
                        return done( err );
                    }

                    return done();

                } );

        } );

    } );

} );
