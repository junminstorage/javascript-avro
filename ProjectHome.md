# Javascript library for Avro #

http://avro.apache.org/

It is still in development phase and doesn't have any release yet. Please come back and check again for releases or subscribe to the project feeds for updates.

http://code.google.com/p/javascript-avro/feeds


## Developer ##
To start with, checkout the source

https://code.google.com/p/javascript-avro/source/checkout

and run "ant" in trunk.

## Limitations ##
  * Due to JS limitation, some functions is not fully supported
    1. Floating point precision cannot be strictly followed.
    1. long value will lose precision when larger than 52 bits.
    1. Four bytes UTF-8 characters in code point U+010000 to U+10FFFF are decoded as UTF-16BE surrogate pair. In JS, however, it doesn't know about surrogate, hence the pair will has string length of two instead of one.