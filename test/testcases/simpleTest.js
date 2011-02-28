var anObject;

testCases(test,
	
	function setUp() {
		anObject = {
			defaultFunction : function () {
			},
			defaultProperty : 1,
			defaultString : "stanley and terence"
		};
	},

	function testDefaultPropertyIs1() {
		assert.that(anObject.defaultProperty, eq(1));
	},

	function testDefaultPropertyIsSimilarToString1() {
		assert.that(anObject.defaultProperty, similar("1"));
	},

	function testDefaultStringIsStanleyAndTerence() {
		assert.that(anObject.defaultString, eq("stanley and terence"));
	},

	function testDefaultStringMatchesAnd() {
		assert.that(anObject.defaultString, matches(/and/));
	},

	function testCheckIsNull() {
		assert.that(null, isNull());
	},

	function testCheckIsTrue() {
		assert.that(true, isTrue());
	},

	function testCheckIsFalse() {
		assert.that(false, isFalse());
	},

	function testDefaultPropertyIsNot2() {
		assert.that(anObject.defaultProperty, not(eq(2)));
	},

	function testDefaultPropertyIsNotSimilarToStringString2() {
		assert.that(anObject.defaultProperty, not(similar("2")));
	},

	function testDefaultStringIsNotSomethingElse() {
		assert.that(anObject.defaultString, not(eq("something else")));
	},

	function testDefaultStringDoesnNotMatchElse() {
		assert.that(anObject.defaultString, not(matches(/else/)));
	},

	function testCheckIsNotNull() {
		assert.that(".", not(isNull()));
	},

	function testCheckIsNotTrue() {
		assert.that(false, not(isTrue()));
	},

	function testCheckIsNotFalse() {
		assert.that(true, not(isFalse()));
	},

	function testCheckShouldThrowException() {
		shouldThrowException(
			function () {
				throw "an error";
			},
			"Should have thrown an exception or something");
	},

	function testCheckDefaultFunctionIsCalled() {
		anObject.defaultFunction = function (aString) {
			assert.that(aString, eq("a string"));
		};
		assert.mustCall(anObject, "defaultFunction");
		anObject.defaultFunction("a string");	
	},

	function testCheckCollectionContaining() {
		assert.that([1, 2, 3], isCollectionContaining(2, 3));
	},

	function testCheckCollectionContainingArray() {
		assert.that([1, 2, 3], isCollectionContaining([2, 3]));
	},

	function testCheckCollectionContainingInOrder() {
		assert.that([1, 3, 2], containsInOrder(1, 3, 2));
	},

	function testCheckCollectionDoesNotContainInOrder() {
		assert.that([1, 3, 2], not(containsInOrder(1, 2, 3)));
	},

	function testCheckCollectionContainingOnly() {
		assert.that([1, 3, 2], isCollectionContainingOnly([1, 2, 3]));
	},

	function testCheckFloatComparison() {
		assert.that(1.009, eqFloat(1.0));
	},

	function testCheckNotFloatComparison() {
		assert.that(1.011, not(eqFloat(1.0)));
	},

	function testChecckFloatComparisonWithAccuracy() {
		assert.that(1.0, eqFloat(1.0, 1.0));
	},

	when(
		function () {
			anObject.defaultProperty = 2;
		},

		function testDefaultpropertyShouldNowEqualTo2() {
			assert.that(anObject.defaultProperty, eq(2));
		},

		function testDefaultStringShouldStayTheSame() {
			assert.that(anObject.defaultString, eq("stanley and terence"));
		},

		when(
			function () {
				anObject.defaultString = "this has changed";
			},
		
			function testDefaultPropertyShouldStillEqualto2() {
				assert.that(anObject.defaultProperty, eq(2));
			},

			function testStringShouldNowBeDifferent() {
				assert.that(anObject.defaultString, eq("this has changed"));
			}		
		)
	),

	function defaultPropertyShouldStillBe1() {
				assert.that(anObject.defaultProperty, eq(1));
			},

	function tearDown() {
				anObject = null;
			}
);
