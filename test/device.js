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
    getList: "/user/device"
};


var testData = {
    user: {
        email: "test@test.com",
        password: "123456"
    },
    device: {
        type: "rpiA"
    },
    pin: {
        valid: {
            pin: 18,
            name: "Red LED",
            mode: "OUT"
        },
        invalid: {
            pin: "not a number",
            name: "",
            mode: "not valid",
            initial: "not valid",
            resistor: "not valid",
            pinEvent: "not valid",
            bounce: "not a number"
        },
        notOnDevice: {
            pin: 1,
            name: "Red LED",
            mode: "OUT"
        }
    },
    token: "",
    deviceId: "",
    pinId: ""
};


describe( "Device testing...", function () {


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

        async.series( [ cleanupUsers, cleanupDevices, registerUser ], function ( err ) {

            if ( err ) {
                return done( err );
            }

            return done();

        } );

    } );


    describe( "Register a new device...", function () {

        it( "responds with 201 and a device", function ( done ) {

            api.post( routes.registerDevice )
                .set( "Content-Type", "application/json" )
                .set( "SYSTEM-API-KEY", "fakeapikey" )
                .set( "Authorization", "Bearer " + testData.token )
                .send( testData.device )
                .expect( 201 )
                .end( function ( err, res ) {

                    if ( err ) {
                        return done( err );
                    }

                    expect( res.body ).to.have.a.property( "_id" ).and.not.be.empty;
                    expect( res.body ).to.have.a.property( "userEmail", testData.user.email );
                    expect( res.body ).to.have.a.property( "type", testData.device.type );
                    expect( res.body ).to.have.a.property( "pinConfig" ).and.be.empty;

                    return done();

                } );

        } );

    } );


    describe( "Register a new device with invalid data...", function () {

        it( "responds with 400", function ( done ) {

            api.post( routes.registerDevice )
                .set( "Content-Type", "application/json" )
                .set( "SYSTEM-API-KEY", "fakeapikey" )
                .set( "Authorization", "Bearer " + testData.token )
                .send( {
                    type: "not valid"
                } )
                .expect( 400 )
                .end( function ( err, res ) {

                    if ( err ) {
                        return done( err );
                    }

                    expect( res.body ).to.be.an( "array" );
                    expect( res.body.length ).to.equal( 1 );

                    return done();

                } );

        } );

    } );


    describe( "List devices...", function () {

        it( "responds with 200 and devices", function ( done ) {

            api.get( routes.getList )
                .set( "Content-Type", "application/json" )
                .set( "SYSTEM-API-KEY", "fakeapikey" )
                .set( "Authorization", "Bearer " + testData.token )
                .expect( 200 )
                .end( function ( err, res ) {

                    if ( err ) {
                        return done( err );
                    }

                    expect( res.body ).to.be.an( "array" );
                    expect( res.body.length ).to.be.equal( 1 );
                    expect( res.body[ 0 ] ).to.have.a.property( "_id" ).and.not.be.empty;
                    expect( res.body[ 0 ] ).to.have.a.property( "userEmail", testData.user.email );
                    expect( res.body[ 0 ] ).to.have.a.property( "type", testData.device.type );
                    expect( res.body[ 0 ] ).to.have.a.property( "pinConfig" ).and.be.empty;

                    testData.deviceId = res.body[ 0 ]._id;

                    return done();

                } );

        } );

    } );


    describe( "Detail for a device...", function () {

        it( "responds with 200 and data", function ( done ) {

            api.get( routes.getList + "/" + testData.deviceId )
                .set( "Content-Type", "application/json" )
                .set( "SYSTEM-API-KEY", "fakeapikey" )
                .set( "Authorization", "Bearer " + testData.token )
                .expect( 200 )
                .end( function ( err, res ) {

                    if ( err ) {
                        return done( err );
                    }

                    expect( res.body ).to.have.a.property( "_id" ).and.not.be.empty;
                    expect( res.body ).to.have.a.property( "userEmail", testData.user.email );
                    expect( res.body ).to.have.a.property( "type", testData.device.type );
                    expect( res.body ).to.have.a.property( "pinConfig" ).and.be.empty;

                    return done();

                } );

        } );

    } );


    describe( "Detail for a device that doesn't exist...", function () {

        it( "responds with 404", function ( done ) {

            api.get( routes.getList + "/does-not-exist" )
                .set( "Content-Type", "application/json" )
                .set( "SYSTEM-API-KEY", "fakeapikey" )
                .set( "Authorization", "Bearer " + testData.token )
                .expect( 404 )
                .end( function ( err ) {

                    if ( err ) {
                        return done( err );
                    }

                    return done();

                } );

        } );

    } );


    describe( "Add a new pin config to device with valid data", function () {

        it( "responds with 201 and data", function ( done ) {

            api.post( "/user/device/" + testData.deviceId + "/pin" )
                .set( "Content-Type", "application/json" )
                .set( "SYSTEM-API-KEY", "fakeapikey" )
                .set( "Authorization", "Bearer " + testData.token )
                .send( testData.pin.valid )
                .expect( 201 )
                .end( function ( err, res ) {

                    if ( err ) {
                        return done( err );
                    }

                    expect( res.body ).to.have.a.property( "_id" ).and.not.be.empty;
                    expect( res.body ).to.have.a.property( "name", testData.pin.valid.name );
                    expect( res.body ).to.have.a.property( "mode", testData.pin.valid.mode );
                    expect( res.body ).to.have.a.property( "initial", "LOW" );

                    return done();

                } );

        } );

    } );


    describe( "Add a new pin config with a pin that doesn't exist on the device", function () {

        it( "responds with 409", function ( done ) {

            api.post( "/user/device/" + testData.deviceId + "/pin" )
                .set( "Content-Type", "application/json" )
                .set( "SYSTEM-API-KEY", "fakeapikey" )
                .set( "Authorization", "Bearer " + testData.token )
                .send( testData.pin.notOnDevice )
                .expect( 409 )
                .end( function ( err, res ) {

                    if ( err ) {
                        return done( err );
                    }

                    return done();

                } );

        } );

    } );


    describe( "Add a new pin config to device with invalid data", function () {

        it( "responds with 400", function ( done ) {

            api.post( "/user/device/" + testData.deviceId + "/pin" )
                .set( "Content-Type", "application/json" )
                .set( "SYSTEM-API-KEY", "fakeapikey" )
                .set( "Authorization", "Bearer " + testData.token )
                .send( testData.pin.invalid )
                .expect( 400 )
                .end( function ( err, res ) {

                    if ( err ) {
                        return done( err );
                    }

                    expect( res.body ).to.be.an( "array" );
                    expect( res.body.length ).to.equal( 7 );

                    return done();

                } );

        } );

    } );


    describe( "List pins for device...", function () {

        it( "responds with 200 and devices", function ( done ) {

            api.get( "/user/device/" + testData.deviceId + "/pin" )
                .set( "Content-Type", "application/json" )
                .set( "SYSTEM-API-KEY", "fakeapikey" )
                .set( "Authorization", "Bearer " + testData.token )
                .expect( 200 )
                .end( function ( err, res ) {

                    if ( err ) {
                        return done( err );
                    }

                    expect( res.body ).to.be.an( "array" );
                    expect( res.body.length ).to.be.equal( 1 );
                    expect( res.body[ 0 ] ).to.have.a.property( "_id" ).and.not.be.empty;
                    expect( res.body[ 0 ] ).to.have.a.property( "name", testData.pin.valid.name );
                    expect( res.body[ 0 ] ).to.have.a.property( "mode", testData.pin.valid.mode );
                    expect( res.body[ 0 ] ).to.have.a.property( "initial", "LOW" );

                    testData.pinId = res.body[ 0 ]._id;

                    return done();

                } );

        } );

    } );


    describe( "Detail for a pin...", function () {

        it( "responds with 200 and data", function ( done ) {

            api.get( routes.getList + "/" + testData.deviceId + "/pin/" + testData.pinId )
                .set( "Content-Type", "application/json" )
                .set( "SYSTEM-API-KEY", "fakeapikey" )
                .set( "Authorization", "Bearer " + testData.token )
                .expect( 200 )
                .end( function ( err, res ) {

                    if ( err ) {
                        return done( err );
                    }

                    expect( res.body ).to.have.a.property( "_id" ).and.not.be.empty;
                    expect( res.body ).to.have.a.property( "name", testData.pin.valid.name );
                    expect( res.body ).to.have.a.property( "mode", testData.pin.valid.mode );
                    expect( res.body ).to.have.a.property( "initial", "LOW" );

                    return done();

                } );

        } );

    } );


    describe( "Detail for a pin that doesn't exist...", function () {

        it( "responds with 404", function ( done ) {

            api.get( routes.getList + "/" + testData.deviceId + "/pin/not-a-pin" )
                .set( "Content-Type", "application/json" )
                .set( "SYSTEM-API-KEY", "fakeapikey" )
                .set( "Authorization", "Bearer " + testData.token )
                .expect( 404 )
                .end( function ( err ) {

                    if ( err ) {
                        return done( err );
                    }

                    return done();

                } );

        } );

    } );


    describe( "Detail for a pin on a device that doesn't exist...", function () {

        it( "responds with 404", function ( done ) {

            api.get( routes.getList + "/does-not-exist/pin/" + testData.pinId )
                .set( "Content-Type", "application/json" )
                .set( "SYSTEM-API-KEY", "fakeapikey" )
                .set( "Authorization", "Bearer " + testData.token )
                .expect( 404 )
                .end( function ( err ) {

                    if ( err ) {
                        return done( err );
                    }

                    return done();

                } );

        } );

    } );


    describe( "Remove a pin...", function () {

        it( "responds with 204", function ( done ) {

            api.delete( routes.getList + "/" + testData.deviceId + "/pin/" + testData.pinId )
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


    describe( "Remove a pin that doesn't exist...", function () {

        it( "responds with 404", function ( done ) {

            api.delete( routes.getList + "/" + testData.deviceId + "/pin/not-a-pin" )
                .set( "Content-Type", "application/json" )
                .set( "SYSTEM-API-KEY", "fakeapikey" )
                .set( "Authorization", "Bearer " + testData.token )
                .expect( 404 )
                .end( function ( err ) {

                    if ( err ) {
                        return done( err );
                    }

                    return done();

                } );

        } );

    } );


    describe( "Remove a device...", function () {

        it( "responds with 204", function ( done ) {

            api.delete( routes.getList + "/" + testData.deviceId )
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


    describe( "Remove a device that doesn't exist...", function () {

        it( "responds with 404", function ( done ) {

            api.delete( routes.getList + "/does-not-exist" )
                .set( "Content-Type", "application/json" )
                .set( "SYSTEM-API-KEY", "fakeapikey" )
                .set( "Authorization", "Bearer " + testData.token )
                .expect( 404 )
                .end( function ( err ) {

                    if ( err ) {
                        return done( err );
                    }

                    return done();

                } );

        } );

    } );


    describe( "Detail for a device that was deleted...", function () {

        it( "responds with 404", function ( done ) {

            api.get( routes.getList + "/" + testData.deviceId )
                .set( "Content-Type", "application/json" )
                .set( "SYSTEM-API-KEY", "fakeapikey" )
                .set( "Authorization", "Bearer " + testData.token )
                .expect( 404 )
                .end( function ( err ) {

                    if ( err ) {
                        return done( err );
                    }

                    return done();

                } );

        } );

    } );


    describe( "List pins on a device that was deleted...", function () {

        it( "responds with 404", function ( done ) {

            api.get( routes.getList + "/" + testData.deviceId + "/pin" )
                .set( "Content-Type", "application/json" )
                .set( "SYSTEM-API-KEY", "fakeapikey" )
                .set( "Authorization", "Bearer " + testData.token )
                .expect( 404 )
                .end( function ( err ) {

                    if ( err ) {
                        return done( err );
                    }

                    return done();

                } );

        } );

    } );


    describe( "Detail for a pin on a device that was deleted...", function () {

        it( "responds with 404", function ( done ) {

            api.get( routes.getList + "/" + testData.deviceId + "/pin/" + testData.pinId )
                .set( "Content-Type", "application/json" )
                .set( "SYSTEM-API-KEY", "fakeapikey" )
                .set( "Authorization", "Bearer " + testData.token )
                .expect( 404 )
                .end( function ( err ) {

                    if ( err ) {
                        return done( err );
                    }

                    return done();

                } );

        } );

    } );


    describe( "Remove a pin from a device that was deleted...", function () {

        it( "responds with 404", function ( done ) {

            api.delete( routes.getList + "/" + testData.deviceId + "/pin/" + testData.pinId )
                .set( "Content-Type", "application/json" )
                .set( "SYSTEM-API-KEY", "fakeapikey" )
                .set( "Authorization", "Bearer " + testData.token )
                .expect( 404 )
                .end( function ( err ) {

                    if ( err ) {
                        return done( err );
                    }

                    return done();

                } );

        } );

    } );


    describe( "Add a new pin to device that was deleted", function () {

        it( "responds with 404", function ( done ) {

            api.post( "/user/device/" + testData.deviceId + "/pin" )
                .set( "Content-Type", "application/json" )
                .set( "SYSTEM-API-KEY", "fakeapikey" )
                .set( "Authorization", "Bearer " + testData.token )
                .send( testData.pin.valid )
                .expect( 404 )
                .end( function ( err ) {

                    if ( err ) {
                        return done( err );
                    }

                    return done();

                } );

        } );

    } );

} );
