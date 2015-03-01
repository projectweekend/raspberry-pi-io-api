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
    token: "",
    deviceId: ""
};


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
            .set( "Authorization", "Bearer " + testData.token )
            .expect( 201 )
            .end( function ( err, res ) {

                if ( err ) {
                    return done( err );
                }

                expect( res.body ).to.have.a.property( "_id" ).and.not.be.empty;
                expect( res.body ).to.have.a.property( "userEmail", testData.user.email );
                expect( res.body ).to.have.a.property( "pinConfig" ).and.be.empty;

                return done();

            } );

    } );

} );


describe( "List devices...", function () {

    it( "responds with 200 and devices", function ( done ) {

        api.get( routes.getList )
            .set( "Content-Type", "application/json" )
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
                expect( res.body[ 0 ] ).to.have.a.property( "pinConfig" ).and.be.empty;

                testData.deviceId = res.body[ 0 ]._id;

                return done();

            } );

    } );

} );


describe( "Detail for a device", function () {

    it( "responds with 200 and data", function ( done ) {

        api.get( routes.getList + "/" + testData.deviceId )
            .set( "Content-Type", "application/json" )
            .set( "Authorization", "Bearer " + testData.token )
            .expect( 200 )
            .end( function ( err, res ) {

                if ( err ) {
                    return done( err );
                }

                expect( res.body ).to.have.a.property( "_id" ).and.not.be.empty;
                expect( res.body ).to.have.a.property( "userEmail", testData.user.email );
                expect( res.body ).to.have.a.property( "pinConfig" ).and.be.empty;

                return done();

            } );

    } );

} );


describe( "Detail for a device that doesn't exist", function () {

    it( "responds with 404", function ( done ) {

        api.get( routes.getList + "/does-not-exist" )
            .set( "Content-Type", "application/json" )
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
