(function() {
    
    var Java = new JavaImporter(java.lang,
                                java.io, 
                                java.math, 
                                org.apache.avro.io, 
                                org.apache.commons.codec.binary);

    testCases(test,

        function setUp() {
        },

        function testEncoder() {
            var encoder = AVRO.Base64BinaryEncoder();
        }
    );
}());