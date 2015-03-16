var async = require( "async" );
var amqp = require( "amqplib/callback_api" );


var RabbitClient = function ( rabbitUrl ) {

    this._rabbitUrl = rabbitUrl;
    this._exchange = "rmq_utils";

    var _this = this;

    function connectToRabbit ( done ) {

        amqp.connect( _this._rabbitUrl, function ( err, conn ) {

            if ( err ) {
                return done( err );
            }

            _this._connection = conn;

            return done( null );

        } );

    }

    function createChannel ( done ) {

        _this._connection.createChannel( function ( err, ch ) {

            if ( err ) {
                return done( err );
            }

            _this._channel = ch;

            return done( null );

        } );

    }

    function assertExchange ( done ) {

        _this._channel.assertExchange( _this._exchange, "direct", null, function ( err ) {

            if ( err ) {
                return done( err );
            }

            return done( null );

        } );

    }

    function allDone ( err ) {

        if ( err ) {
            console.error( err );
            process.exit( 1 );
        }

    }

    var tasks = [
        connectToRabbit,
        createChannel,
        assertExchange
    ];

    async.series( tasks, allDone );

};

RabbitClient.prototype.send  = function( routingKey, message ) {

    var buffer = new Buffer( JSON.stringify( message ) );

    this._channel.publish( this._exchange, routingKey, buffer );

};


exports.RabbitClient = RabbitClient;
