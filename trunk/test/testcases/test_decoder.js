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
        encoder.writeDouble(Double.valueOf("6547.23456").doubleValue());
        encoder.writeDouble(Double.valueOf("0.000452").doubleValue());
        
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
        encoder.writeLong(BigInteger.valueOf(Integer.MAX_VALUE).multiply(BigInteger.valueOf(Integer.MAX_VALUE)).longValue());
        encoder.writeLong(BigInteger.valueOf(Integer.MIN_VALUE).multiply(BigInteger.valueOf(Integer.MAX_VALUE)).longValue());

        encoder.writeBytes((new java.lang.String("Hello World!")).getBytes("ASCII"));
        encoder.writeString("¢€");

        encoder.flush();
        byteOut.close();
        
        return Base64.encodeBase64String(byteOut.toByteArray());
    };


    // Varify the decoder
    var decoder = AVRO.Base64BinaryDecoder();
    
    decoder.feed(generateTest());
    
    println(decoder.readDouble());
    println(decoder.readDouble());
    println(decoder.readDouble());
    println(decoder.readDouble());
    println(decoder.readDouble());
    println(decoder.readDouble());
    println(decoder.readDouble());
    println(decoder.readDouble());
    println(decoder.readDouble());
    println(decoder.readDouble());
    
    println(decoder.readFloat());
    println(decoder.readFloat());
    println(decoder.readFloat());
    println(decoder.readFloat());
    println(decoder.readFloat());
    println(decoder.readFloat());
    println(decoder.readFloat());
    println(decoder.readFloat());
    println(decoder.readFloat());
    println(decoder.readFloat());
    println(decoder.readFloat());

    println(decoder.readBoolean());
    println(decoder.readBoolean());

    println(decoder.readInt());
    println(decoder.readInt());
    println(decoder.readInt());
    println(decoder.readInt());
    println(decoder.readInt());
    println(decoder.readInt());

    println(decoder.readLong());
    println(decoder.readLong());
    println(decoder.readLong());
    println(decoder.readLong());
    println(decoder.readLong());
    println(decoder.readLong());
    println(decoder.readLong());
    println(decoder.readLong());

    var bytes = decoder.readBytes();
    for (var i = 0; i < bytes.length; i++) {
        print(String.fromCharCode(bytes[i]));
    }
    println("");

    println(decoder.readString());

})();