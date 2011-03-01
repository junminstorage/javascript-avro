var Asserts = {

    assertEquals : function(expected, actual) {
        if (expected !== actual) {
            throw "Expected '" + expected + "', got '" + actual + "'";
        }
    },

    assertDeltaEquals : function(expected, actual, delta) {
        if (Math.abs(expected - actual) > delta) {
            throw "Expected '" + expected + "', got '" + actual + "' for delta '" + delta + "'";
        }
    },
    
    assertTrue : function(value) {
        if (value !== true) {
            throw "Expected 'true";
        }
    },
    
    assertFalse : function(value) {
        if (value !== false) {
            throw "Expected 'true";
        }
    },
    
    assertNaN : function(value) {
        if (!isNaN(value)) {
            throw "Value '" + value + "' is not NaN";
        }
    }
};