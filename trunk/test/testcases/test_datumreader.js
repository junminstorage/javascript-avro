(function() {
    
    var Java = new JavaImporter(java.lang,
                                java.io,
                                java.math,
                                java.util,
                                org.apache.commons.codec.binary,
                                org.apache.avro,
                                org.apache.avro.io,
                                org.apache.avro.generic,
                                org.apache.avro.util);

    var encodedBase64 = "";
    var schema = {
                    type : "record",
                    name : "Person",
                    fields : [
                        {name : "name", type : "string"},
                        {name : "age", type : "int"},
                        {name : "tags", type : {type : "array", items : "string"}},
                        {name : "attrs", type : ["null", {type : "map", values : "string"}]},
                        {name : "occupation", type : ["null", {type : "enum", name : "Occupation", symbols : ["ENGINEER", "OTHER"]}]}
                    ]                        
                 };

    testCases(test,
    
        function setUp() {
            var byteOut = new Java.ByteArrayOutputStream();
            var encoder = new Java.BinaryEncoder(byteOut);            
            var recordSchema = Java.Schema.parse(JSON.stringify(schema));
            var writer = new Java.GenericDatumWriter(recordSchema);
            
            var record = new Java.GenericData.Record(recordSchema);
            record.put("name", "Hello");
            record.put("age", Java.Integer.valueOf("10"));
            
            var tags = new Java.GenericData.Array(2, recordSchema.getField("tags").schema());
            tags.add("Tag1");
            tags.add("Tag2");
            
            record.put("tags", tags);
            
            var attrs = new Java.HashMap();
            attrs.put("attr1", "value1");
            attrs.put("attr2", "value2");
            
            record.put("attrs", attrs);
            
//            record.put("occupation", new Java.GenericData.EnumSymbol("OTHER"));
            
            writer.write(record, encoder);

            encoder.flush();
            byteOut.close();

            encodedBase64 = Java.Base64.encodeBase64String(byteOut.toByteArray());
        },

        function testReader() {
            var decoder = AVRO.Base64BinaryDecoder();            
            var reader = AVRO.DatumReader(schema, decoder);
            
            decoder.feed(encodedBase64);
                        
            var record = reader.read();
            println(JSON.stringify(record));
        }
    );
}());