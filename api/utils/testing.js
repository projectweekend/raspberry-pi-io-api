var sinon = require( "sinon" );
var RabbitClient = require( "./amqp" ).RabbitClient;


exports.mockRabbitClient = function ( done ) {

    sinon.stub( RabbitClient.prototype, "send" ).returns( 0 );

    return done();

};


exports.restoreRabbitClient = function ( done ) {

    RabbitClient.prototype.send.restore();

    return done();

};
