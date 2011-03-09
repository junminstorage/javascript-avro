(function() {
    
    var Java = new JavaImporter(java.lang,
                                java.io,
                                java.math,
                                org.apache.avro.io,
                                org.apache.commons.codec.binary);

    var encodedBase64 = "";

    testCases(test,
    
        function setUp() {
            var byteOut = new Java.ByteArrayOutputStream();
            var encoder = new Java.BinaryEncoder(byteOut);

            encoder.writeDouble(1.4);

            encoder.flush();
            byteOut.close();

            encodedBase64 = Java.Base64.encodeBase64String(byteOut.toByteArray());
        },

        function testReader() {
            var decoder = AVRO.Base64BinaryDecoder();            
            var reader = AVRO.DatumReader("double", decoder);
            
            decoder.feed(encodedBase64);
            
            println(reader.read());
        }
    );
}());