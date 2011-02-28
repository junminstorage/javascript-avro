eval(loadFile("build/avro-min.js"));

importPackage(java.lang);
importPackage(java.io);
importPackage(java.math);
importPackage(org.apache.avro.io);
//importClass(org.apache.commons.codec.binary.Base64);

var decoder;

testCases(test,

	function setUp() {
		decoder = AVRO.Base64BinaryDecoder();
	},

	function testDecoder() {
		var generateInputData = function () {
			//var byteOut = new ByteArrayOutputStream();
			//var encoder = new BinaryEncoder(byteOut);

			//encoder.writeDouble(Double.POSITIVE_INFINITY);

			//return Base64.encoderBase64String(byteOut.toByteArray());
		};

		//var inputData = generateInputData();
		//print("[INFO] input_data=" + inputData);
		//decoder.feed(inputData);
	},

	function testHelloWorld() {
		print("Hello World");
	},

	function tearDown() {
		decoder = null;
	}
);
