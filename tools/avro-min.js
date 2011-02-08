var AVRO={};
(function(){for(var g={},d=0;d<64;d++)g["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(d)]=d;var i=function(c){var a=[],f=0,h=c.length;return{readByte:function(){if(a.length<=0){var e,b;for(e=0;f<h&&e<4;f++,e++){b=c.charAt(f);if(b=="="){a.pop();break}b=g[b];switch(e){case 0:a[0]=b<<2;break;case 1:a[0]|=b>>4&3;a[1]=(b&15)<<4;break;case 2:a[1]|=b>>2&15;a[2]=(b&3)<<6;break;case 3:a[2]|=b&63}}if(a.length<=0)return-1}return a.shift()}}};AVRO.decode=function(c){c=i(c);for(var a=
c.readByte();a>0;){print(String.fromCharCode(a));a=c.readByte()}println("")}})();
