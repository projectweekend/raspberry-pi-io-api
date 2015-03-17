var sinon = require( "sinon" );
var amqp = require( "./amqp" );


exports.mockRabbitClient = function ( done ) {

    var fakeClient = function ( rabbitUrl ) {

    };

    fakeClient.prototype.send = function( routingKey, message ) {

    };

    sinon.stub( amqp, "RabbitClient" ).yields( null, fakeClient );

    return done();

};


exports.restoreRabbitClient = function ( done ) {

    amqp.RabbitClient.restore();

    return done();

};
