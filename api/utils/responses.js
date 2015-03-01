var errors = require( "./errors" );


function baseListCreateResponse ( successStatus, res, next ) {

    return function ( err, data ) {

        /* istanbul ignore if */
        if ( err ) {
            return next( err );
        }

        return res.status( successStatus ).json( data );

    };

}


function baseDetailUpdateDeleteResponse ( successStatus, res, next ) {

    return function ( err, data ) {

        if ( ( err && err.name === "CastError" ) || !data ) {
            return next( errors.resourceNotFound() );
        }

        /* istanbul ignore if */
        if ( err ) {
            return next( err );
        }

        return res.status( successStatus ).json( data );

    };

}


exports.createdResponse = function ( res, next ) {

    return baseListCreateResponse( 201, res, next );

};


exports.listResponse = function ( res, next ) {

    return baseListCreateResponse( 200, res, next );

};


exports.detailResponse = function ( res, next )
{
    return baseDetailUpdateDeleteResponse( 200, res, next );
};


exports.updateResponse = function ( res, next )
{
    return baseDetailUpdateDeleteResponse( 200, res, next );
};


exports.deleteResponse = function ( res, next )
{
    return baseDetailUpdateDeleteResponse( 204, res, next );
};
