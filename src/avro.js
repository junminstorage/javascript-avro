var AVRO = {};

(function(NS) {

    var strictMode = false;
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
    
    NS.setStrictMode = function(strict) {
        strictMode = strict;
    };

    // Create a Avro binary decoder where the binary data is base64 encoded
    NS.Base64BinaryDecoder = function() {
        var reader = Base64ByteReader();
        var checkedReadByte = function() {
            var b = reader.readByte();
            if (b == -1) {
                throw "Insufficient input byte for decode."
            }
            return b;
        };
        var toPaddedHex = function(n) {
            var hex = "";
            var b;
            var i;
            for (i = 0; i < 32; i += 8) {
                b = ((n >>> (i)) & 0x0ff).toString(16);
                hex = (b.length == 1 ? "0" + b : b) + hex;
            }

            return hex;
        };
        // Read 32 bits little-endian value
        var read32 = function() {
            var b;
            var v = 0;
            var i;
            for (i = 0; i < 32; i += 8) {
                b = checkedReadByte();
                v |= (b << i);
            }
            return v;
        };
        // Private method for reading count for array and map
        var readCount = function(decoder) {
            var count = decoder.readLong();
            if (count < 0) {
                decoder.readLong();
                count = -count;
            }
            return count;
        };
        var decodeUtf8 = function(bytes) {
            var len = bytes.length;
            var result = "";
            var code;
            for (i = 0; i < len; i++) {
                if (bytes[i] <= 0x7f) {
                    result += String.fromCharCode(bytes[i]);
                } else {
                    // Mutlibytes
                    if (bytes[i] >= 0xc0 && bytes[i] < 0xe0) {              // 2 bytes
                        code = ((bytes[i++] & 0x1f) << 6) |
                                (bytes[i] & 0x3f);
                    } else if (bytes[i] >= 0xe0 && bytes[i] < 0xf0) {       // 3 bytes
                        code = ((bytes[i++] & 0x0f) << 12) |
                               ((bytes[i++] & 0x3f) << 6)  |
                                (bytes[i] & 0x3f);
                    } else {
                        // JS cannot represent 4 bytes UTF8, as JS use UCS2 (2 btyes)
                        // Simply skip the character
                        i += 3;
                        continue;
                    }
                    result += String.fromCharCode(code);
                }
            }
            return result;
        };

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
                var i;
                var b = checkedReadByte();
                var n = b & 0x7f;

                for (i = 7; i <= 28 && b > 0x7f; i += 7) {
                    b = checkedReadByte();
                    n |= (b & 0x7f) << i;
                }

                if (b > 0x7f) {
                    throw "Invalid int encoding.";
                }

                return (n >>> 1) ^ -(n & 1);
            },

            readLong : function() {
                var i;
                var b = checkedReadByte();
                var sign = ((b & 0x01) == 0) ? 1 : -1;
                var n = b & 0x7f;
                var low;

                for (i = 7; i <= 28 && b > 0x7f; i += 7) {
                    b = checkedReadByte();
                    n |= (b & 0x7f) << i;
                }

                // Encoded value is within 32 bit range
                if (i <= 28 || b <= 0x0f) {
                    return (n >>> 1) ^ -(n & 1);
                }

                // More than 32 bits
                low = n >>> 1;
                n = (b >> 4) & 0x07;
                for (i = 3; i < 32 && b > 0x7f; i += 7) {
                    b = checkedReadByte();
                    n |= (b & 0x7f) << i;
                }
                
                if (b > 0x7f) {
                    throw "Invalid long encoding";
                }

                low |= (n & 0x01) << 31;
                n >>>= 1;
                
                if (strictMode) {
                    return [low, n];
                }

                /*
                 *  Long with value > 52 bits cannot be resolved precisely due to
                 *  JS use double floating point as the only number representation.
                 */
                // Two's complement'
                if (sign > 0) {
                    return ("0x" + toPaddedHex(n) + toPaddedHex(low)) * 1;
                } else {
                    return ("0x" + toPaddedHex(n) + toPaddedHex(low)) * -1 - 1;
                }
            },

            readFloat : function() {
                var value = read32();

                if (strictMode) {    // In strictMode, return the 32 bit float
                    return value;
                }
                
                if ((value & 0x7fffffff) == 0) {
                    return 0;
                }
                if ((value ^ 0x7fc00000) == 0) {
                    return Number.NaN;
                }
                if ((value ^ 0x7f800000) == 0) {
                    return Number.POSITIVE_INFINITY;
                }
                if ((value ^ 0xff800000) == 0) {
                    return Number.NEGATIVE_INFINITY;
                }
                
                // Not able to get the floating point back precisely due to
                // noise introduced in JS floating arithmetic
                var sign = ((value >> 31) << 1) + 1;
                var expo = (value & 0x7f800000) >> 23;
                var mant = value & 0x007fffff;

                expo ? ( expo -= 127, mant |= 0x00800000 ) : expo = -126;
                return sign * mant * Math.pow(2, expo - 23);
            },
            readDouble : function() {
                var low = read32();
                var high = read32();
                
                if (strictMode) {
                    return [low, high];
                }
                
                if (low == 0) {
                    if ((high ^ 0x7ff00000) == 0) {
                        return Number.POSITIVE_INFINITY;
                    }
                    if ((high ^ 0xfff00000) == 0) {
                        return Number.NEGATIVE_INFINITY;
                    }
                    if ((high & 0x7fffffff) == 0) {
                        return 0;
                    }
                }
                
                var sign = ((high >> 31) << 1) + 1;
                var expo = (high & 0x7ff00000) >> 20;
                var mant = (low + (high & 0x000fffff) * Math.pow(2, 32)) * Math.pow(2, -52);
                
                expo ? (expo -= 1023, mant++): expo = -1022;
                return sign * mant * Math.pow(2, expo);
            },
            readBytes : function() {
                var len = this.readLong();
                var res = [];
                while (len > 0) {
                    res.push(checkedReadByte());
                    len--;
                }
                return res;
            },
            readString : function() {
                return decodeUtf8(this.readBytes());
            },
            readFixed : function(result) {
                var len = result.length;
                var i;
                for (i = 0; i < len; i++) {
                    result[i] = checkedReadByte();
                }
            },
            readEnum : function() {
                return this.readInt();
            },
            readIndex : function() {
                return this.readInt();
            },
            readArrayStart : function() {
                return readCount(this);
            },
            arrayNext : function() {
                return readCount(this);
            },
            readMapStart : function() {
                return readCount(this);
            },
            mapNext : function() {
                return readCount(this);
            }
        }
    };


    // Create a reader that decode according to the provided schema
    NS.DatumReader = function(schema, decoder) {
        return {
            read : function() {
                
            }
        };
    };
})(AVRO);