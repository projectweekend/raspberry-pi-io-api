var app = require( "../app" );
var expect = require( "chai" ).expect;
var supertest = require( "supertest" );


var api = supertest( app );


describe( "Make a ping request", function ()
{
    it( "responds with 200 and a message", function ( done )
    {
        api.get( "/ping" )
            .set( "Content-Type", "application/json" )
            .expect( 200 )
            .end( function ( err, res )
            {
                if ( err )
                {
                    return done( err );
                }
                expect( res.body ).to.have.a.property( "message", "pong" );
                done();
            } );
    } );
} );
