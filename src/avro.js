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


    AVRO.decode = function(data, schema) {
    }

    AVRO.encode = function(data, schema) {
    }
})();