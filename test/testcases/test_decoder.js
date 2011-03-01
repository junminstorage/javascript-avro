importPackage(java.lang);
importPackage(java.io);
importPackage(java.math);
importPackage(org.apache.avro.io);
importClass(org.apache.commons.codec.binary.Base64);

(function() {
    
    var generateTest = function() {
        var byteOut = new ByteArrayOutputStream();
        var encoder = new BinaryEncoder(byteOut);
        
        encoder.writeDouble(Double.POSITIVE_INFINITY);
        encoder.writeDouble(Double.NEGATIVE_INFINITY);
        encoder.writeDouble(Double.NaN);
        encoder.writeDouble(Double.MAX_VALUE);
        encoder.writeDouble(Double.MIN_VALUE);
        encoder.writeDouble(Double.MIN_NORMAL);
        encoder.writeDouble(Double.valueOf("0.0").doubleValue());
        encoder.writeDouble(Double.valueOf("-0.0").doubleValue());
        encoder.writeDouble(Double.valueOf("6547.3333333").doubleValue());
        encoder.writeDouble(Double.valueOf("-0.000452").doubleValue());
        
        encoder.writeFloat(Float.POSITIVE_INFINITY);
        encoder.writeFloat(Float.NEGATIVE_INFINITY);
        encoder.writeFloat(Float.NaN);
        encoder.writeFloat(Float.MAX_VALUE);
        encoder.writeFloat(Float.MIN_VALUE);
        encoder.writeFloat(Float.MIN_NORMAL);
        encoder.writeFloat(Float.valueOf("0.0").floatValue());
        encoder.writeFloat(Float.valueOf("-0.0").floatValue());
        encoder.writeFloat(Float.valueOf("1.0").floatValue());
        encoder.writeFloat(Float.valueOf("0.25").floatValue());
        encoder.writeFloat(Float.valueOf("-12.662").floatValue());
        
        encoder.writeBoolean(true);
        encoder.writeBoolean(false);

        encoder.writeInt(10);
        encoder.writeInt(-50);
        encoder.writeInt(234234);
        encoder.writeInt(-346456);
        encoder.writeInt(Integer.MAX_VALUE - 1);
        encoder.writeInt(Integer.MIN_VALUE + 1);

        encoder.writeLong(1);
        encoder.writeLong(-2);
        encoder.writeLong(BigInteger.valueOf(Integer.MAX_VALUE).add(BigInteger.valueOf(1)).longValue());
        encoder.writeLong(BigInteger.valueOf(Integer.MIN_VALUE).subtract(BigInteger.valueOf(1)).longValue());
        encoder.writeLong(BigInteger.valueOf(Long.MAX_VALUE).divide(BigInteger.valueOf(4096)).longValue());
        encoder.writeLong(BigInteger.valueOf(Long.MIN_VALUE).divide(BigInteger.valueOf(4096)).longValue());
        encoder.writeLong(BigInteger.valueOf(Long.MAX_VALUE).longValue());
        encoder.writeLong(BigInteger.valueOf(Long.MIN_VALUE).longValue());

        encoder.writeBytes((new java.lang.String("Hello World!")).getBytes("ASCII"));
        encoder.writeString("¢€");

        encoder.flush();
        byteOut.close();
        
        return Base64.encodeBase64String(byteOut.toByteArray());
    };


    // Varify the decoder
    var decoder = AVRO.Base64BinaryDecoder();
    
    decoder.feed(generateTest());
    
    Asserts.assertEquals(Number.POSITIVE_INFINITY, decoder.readDouble());
    Asserts.assertEquals(Number.NEGATIVE_INFINITY, decoder.readDouble());
    Asserts.assertNaN(decoder.readDouble());
    Asserts.assertEquals(Number.MAX_VALUE, decoder.readDouble());
    Asserts.assertEquals(Number.MIN_VALUE, decoder.readDouble());    
    Asserts.assertDeltaEquals(Double.MIN_NORMAL, decoder.readDouble(), 1e-200);
    Asserts.assertDeltaEquals(0, decoder.readDouble(), 1e-200);
    Asserts.assertDeltaEquals(0, decoder.readDouble(), 1e-200);
    Asserts.assertDeltaEquals(6547.3333333, decoder.readDouble(), 1e-200);
    Asserts.assertDeltaEquals(-0.000452, decoder.readDouble(), 1e-200);
    
    Asserts.assertEquals(Number.POSITIVE_INFINITY, decoder.readFloat());
    Asserts.assertEquals(Number.NEGATIVE_INFINITY, decoder.readFloat());
    Asserts.assertNaN(decoder.readFloat());
    Asserts.assertDeltaEquals(Float.MAX_VALUE, decoder.readFloat(), 1e-200);
    Asserts.assertDeltaEquals(Float.MIN_VALUE, decoder.readFloat(), 1e-200);
    Asserts.assertDeltaEquals(Float.MIN_NORMAL, decoder.readFloat(), 1e-200);
    Asserts.assertDeltaEquals(0, decoder.readFloat(), 1e-200);
    Asserts.assertDeltaEquals(0, decoder.readFloat(), 1e-200);
    Asserts.assertDeltaEquals(1, decoder.readFloat(), 1e-200);
    Asserts.assertDeltaEquals(0.25, decoder.readFloat(), 1e-200);
    Asserts.assertDeltaEquals(-12.662, decoder.readFloat().toPrecision(5), 1e-200);

    Asserts.assertTrue(decoder.readBoolean());
    Asserts.assertFalse(decoder.readBoolean());    

    Asserts.assertEquals(10, decoder.readInt());
    Asserts.assertEquals(-50, decoder.readInt());
    Asserts.assertEquals(234234, decoder.readInt());
    Asserts.assertEquals(-346456, decoder.readInt());
    Asserts.assertEquals(2147483646, decoder.readInt());
    Asserts.assertEquals(-2147483647, decoder.readInt());

    Asserts.assertEquals(1, decoder.readLong());
    Asserts.assertEquals(-2, decoder.readLong());
    Asserts.assertEquals(2147483648, decoder.readLong());
    Asserts.assertEquals(-2147483649, decoder.readLong());
    Asserts.assertEquals(2251799813685247, decoder.readLong());
    Asserts.assertEquals(-2251799813685248, decoder.readLong());
    // The max and min long get rounded off
    Asserts.assertEquals(9223372036854776000, decoder.readLong());
    Asserts.assertEquals(-9223372036854776000, decoder.readLong());

    var bytes = decoder.readBytes();
    var str = "";
    for (var i = 0; i < bytes.length; i++) {
        str += String.fromCharCode(bytes[i]);
    }
    Asserts.assertEquals("Hello World!", str);

    Asserts.assertEquals("¢€", decoder.readString());

})();