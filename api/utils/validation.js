exports.isPinConfig = function ( value ) {

    if ( !Array.isArray( value ) ) {
        return false;
    }

    if ( value.filter( isInvalidPinConfigItem ).length > 0 ) {
        return false;
    }

    return true;

    // This identifies invalid items
    function isInvalidPinConfigItem ( item ) {

        if ( typeof item.pin !== "number" ) {
            return true;
        }

        if ( typeof item.name !== "string" ) {
            return true;
        }

        if ( typeof item.mode !== "string" ) {
            return true;
        }

        if ( [ "IN", "OUT" ].indexOf( item.mode ) === -1 ) {
            return true;
        }

        if ( typeof item.initial !== "undefined" ) {
            if ( [ "HIGH", "LOW" ].indexOf( item.initial ) === -1 ) {
                return true;
            }
        }

        if ( typeof item.resistor !== "undefined" ) {
            if ( [ "PUD_UP", "PUD_DOWN" ].indexOf( item.resistor ) === -1 ) {
                return true;
            }
        }

        if ( typeof item.pinEvent !== "undefined" ) {
            if ( [ "RISING", "FALLING", "BOTH" ].indexOf( item.pinEvent ) === -1 ) {
                return true;
            }
        }

        if ( typeof item.bounce !== "undefined" ) {
            if ( typeof item.bounce !== "number" ) {
                return true;
            }
        }

        return false;

    }

};
