var decoder = AVRO.Base64BinaryDecoder();

decoder.feed("AACAfwAAgP8AAMB/AACAPwAAUEABABRj9Mscr6Uq/P///w/9////DwID/v///////wf/////////" + 
             "B4KAgIDg////f//////v////fxhIZWxsbyBXb3JsZCEKwqLigqw=");


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

var bytes = decoder.readBytes();
for (var i = 0; i < bytes.length; i++) {
    print(String.fromCharCode(bytes[i]));
}
println("");

java.lang.System.out.println(decoder.readString());