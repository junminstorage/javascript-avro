var decoder = AVRO.Base64BinaryDecoder();

decoder.feed("AACAfwAAgP8AAMB/AACAPwAAUEABABRj9Mscr6Uq/P///w/9////Dw==");

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