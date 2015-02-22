var User = require( "./models" ).User;


exports.add = function ( req, res, next ) {

    req.checkBody( "email" ).isEmail();
    req.checkBody( "password" ).isEmail().isLength( 6 );

    var validationErrors = req.validationErrors();

    if ( validationErrors ) {
        return res.status( 400 ).json( validationErrors );
    }

    var user = {
        email: req.body.email,
        password: req.body.password
    };

    User.add( user, function ( err, newUser ) {

        if ( err ) {
            return next( err );
        }

        return res.status( 201 ).json( newUser );

    } );

};
