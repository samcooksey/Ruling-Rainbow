"use strict";
var options = {}; //object to hold all of the user options.
options.pizzaHut = 0;
options.tacoBell = 1;
options.ramenMaster = 2;
options.bigAls = 3;
options.puebloViejo = 4;
options.illegalPetes = 5;


var ajax = function(URL, method){
  var XHR = new XMLHttpRequest();
  XHR.onreadystatechange = function(){
    if(this.readyState === 4){
      if(this.status === 200){
        method(this.responseText);
      }
    }
  };
  XHR.open("GET", URL);
  XHR.send();
};

var randomNumber = function(max, method){
  var XHR = new XMLHttpRequest();
  XHR.onreadystatechange = function(){
    if(this.readyState === 4){
      if(this.status === 200){
        method(Number(this.responseText));
      }
    }
  };
  XHR.open("GET", "https://www.random.org/integers/?num=1&min=0&max=" + String(max) + "&col=1&base=10&format=plain&rnd=new");
  XHR.send();
};
randomNumber(5, function(data){
  for (var key in options){
    if (options[key] === data){
      console.log(key);
    }
  }
});

//
// List of functions:
//
// randomNumber(max, method) = takes in a maximum number and then decides what to do with it
// ajax(URL, Method) = take in an api URL and then decides what to do with it
