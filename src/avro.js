var AVRO = {};

(function() {

    var base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var decodeLookup = {};

    for (var i = 0; i < 64; i++) {
        decodeLookup[base64Chars.charAt(i)] = i;
    }

    var Base64ByteReader = function(source) {
        var buffer = [];
        var srcIdx = 0;
        var len = source.length;

        // Private method of Base64ByteReader
        var fillBuffer = function() {
            // decode 3 bytes using 4 bytes from source
            var i;
            var enc;
            var code;

            for (i = 0; srcIdx < len && i < 4; srcIdx++, i++) {
                enc = source.charAt(srcIdx);
                if (enc == '=') {
                    buffer.pop();
                    break;
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
        var reader = Base64ByteReader(data);
    }
})();