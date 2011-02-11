var AVRO = {};

(function() {

    var base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var decodeLookup = {};

    for (var i = 0; i < 64; i++) {
        decodeLookup[base64Chars.charAt(i)] = i;
    }

    var Base64ByteWriter = function() {
        var buffer = [];
        var output = "";

        var encodeBuffer = function() {
            var i;
            var code;

            for (i = 0; i < buffer.length; i++) {
                switch (i) {
                    case 0:
                        output += base64Chars.charAt((buffer[0] >> 2) & 0x3F);
                        code = (buffer[0] & 0x03) << 4;
                    break;
                    case 1:
                        output += base64Chars.charAt(code | ((buffer[1] & 0xF0) >> 4));
                        code = (buffer[1] & 0x0F) << 2;
                    break;
                    case 2:
                        output += base64Chars.charAt(code | ((buffer[2] & 0xC0) >> 6));
                        output += base64Chars.charAt(buffer[2] & 0x3F);
                    break;
                }
            }
            if (buffer.length != 3) {
                output += base64Chars.charAt(code);
                for (i = 3; i > buffer.length; i--) {
                    output += "=";
                }
            }

            buffer = [];
        };

        return {
            writeByte : function(b) {
                buffer.push(b);
                if (buffer.length == 3) {
                    encodeBuffer();
                }
            },

            getEncoded : function(last) {
                if (last && buffer.length != 0) {
                    encodeBuffer();
                }
                var res = output;
                output = "";
                return res;
            }
        };
    };

    var Base64ByteReader = function() {
        var buffer = [];
        var srcIdx = 0;
        var source = "";

        // Private method of Base64ByteReader
        var fillBuffer = function() {
            // decode 3 bytes using 4 bytes from source
            var i;
            var enc;
            var code;
            var len = source.length;

            for (i = 0; srcIdx < len && i < 4; srcIdx++, i++) {
                enc = source.charAt(srcIdx);
                if (enc == '=') {
                    buffer.pop();
                    break;
                }
                // Skip any unknown character
                if (!decodeLookup.hasOwnProperty(enc)) {
                    i--;
                    continue;
                }
                
                code = decodeLookup[enc];

                switch (i) {
                    case 0:
                        buffer[0] = code << 2;
                    break;
                    case 1:
                        buffer[0] = buffer[0] | (code >> 4 & 0x03);
                        buffer[1] = (code & 0x0F) << 4;
                    break;
                    case 2:
                        buffer[1] = buffer[1] | (code >> 2 & 0x0F);
                        buffer[2] = (code & 0x03) << 6;
                    break;
                    case 3:
                        buffer[2] = buffer[2] | (code & 0x003F);
                    break;
                }
            }
        };

        // Public interface supported by Base64ByteReader
        return {

            // Feed in base64 encode string
            update : function(base64Str) {
                source += base64Str;
            },

            // Return the next byte as integer
            readByte : function() {
                if (buffer.length <= 0) {
                    fillBuffer();
                    if (buffer.length <= 0) {
                        return -1;
                    }
                }

                return buffer.shift();
            }
        };
    };

    // Create a Avro binary decoder where the binary data is base64 encoded
    AVRO.Base64BinaryDecoder = function() {
        var reader = Base64ByteReader();
        var checkedReadByte = function() {
            var b = reader.readByte();
            if (b == -1) {
                throw "Insufficient input byte for decode."
            }
            return b;
        }

        return {
            feed : function(base64Str) {
                reader.update(base64Str);
            },
            readNull : function() {
                // Do nothing
            },
            readBoolean : function() {
                return checkedReadByte() == 1 ? true : false;
            },
            readInt : function() {
                var n;
                var i;
                var b = checkedReadByte();
                n = b & 0x7f;

                for (i = 1; i <= 4 && b > 0x7f; i++) {
                    b = checkedReadByte();
                    n ^= (b & 0x7f) << (7 * i);
                }

                if (b > 0x7f) {
                    throw "Invalid int encoding.";
                }

                return (n >>> 1) ^ -(n & 1);
            },
            readLong : function() {
                // TB implement
            },
            readFloat : function() {
                var b;
                var value = 0;
                var i;
                for (i = 0; i < 4; i++) {
                    b = checkedReadByte();
                    value += b * Math.pow(2, i << 3);
                }

                if (value == 0x7fc00000) {
                    return Number.NaN;
                }
                if (value == 0x7f800000) {
                    return Number.POSITIVE_INFINITY;
                }
                if (value == 0xff800000) {
                    return Number.NEGATIVE_INFINITY;
                }

                // Not able to get the floating point back precisely due to
                // noise introduced in JS floating arithmetic
                var sign = ((value >> 31) << 1) + 1;
                var expo = ((value & 0x7f800000) >> 23) & 0xff;
                var mant = value & 0x007fffff;

                expo ? ( expo -= 127, mant |= 0x00800000 ) : expo = -126;
                return sign * mant * Math.pow(2, expo - 23);
            },
            readDouble : function() {
                // TB implement
            },
            readBytes : function() {

            },
            readString : function() {
                
            },
            readFixed : function(size) {

            },
            readEnum : function() {

            },
            readIndex : function() {

            },
            readArrayStart : function() {

            },
            arrayNext : function() {

            },
            readMapStart : function() {

            },
            mapNext : function() {
                
            }
        }
    };


    // Create a reader that decode according to the provided schema
    AVRO.DatumReader = function(schema) {
        return {
            read : function() {
                
            }
        };
    };
})();