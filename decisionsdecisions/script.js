"use strict";
var options = {}; //object to hold all of the user options.
// options.pizzaHut = 0;
// options.tacoBell = 1;
// options.ramenMaster = 2;
// options.bigAls = 3;
// options.puebloViejo = 4;
// options.illegalPetes = 5;


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
// randomNumber(5, function(data){
//   for (var key in options){
//     if (options[key] === data){
//       console.log(key);
//     }
//   }
// });

var submitButton = document.querySelector("#submitOption");
var optionName = document.querySelector("#optionName");
var optionList = document.querySelector("#optionList");
var chooseButton = document.querySelector("#choose");
var resultHolder = document.querySelector("#result");
var saveButton = document.querySelector("#save");
var loadButton = document.querySelector("#load");
var result = document.createElement("div");

var weightCounter = 0;
var activeWeightCounters = [];



chooseButton.addEventListener("click", function(){
  randomNumber(activeWeightCounters.length-1, function(data){
    var chosenOption;
    for(var key in options){
      if(options[key].weight.indexOf(activeWeightCounters[data]) !== -1){
        chosenOption = key;
        if(options[key].weight.length > 1){
          options[key].weight.splice(options[key].weight.indexOf(activeWeightCounters[data]), 1);
          activeWeightCounters.splice(data, 1);
        }
      }
    }

    result.innerHTML = chosenOption;
    resultHolder.appendChild(result);
  });
});
var submit = function(){
  var option = document.createElement("div");
  option.innerHTML = optionName.value;
  options[optionName.value] = {};
  options[optionName.value].weight = [];
  for (var i = 0; i <10; i ++){
    options[optionName.value].weight[i] = weightCounter;
    activeWeightCounters.push(weightCounter);
    weightCounter++;
  }
  optionList.appendChild(option);
  optionName.value = '';
  optionName.focus();
};
submitButton.addEventListener("click", submit);
optionName.addEventListener("keyup", function(){
  if(event.which === 13){
    submit();

  }
});

saveButton.addEventListener("click", function(){
  localStorage.options = JSON.stringify(options);
  localStorage.activeWeightCounters = JSON.stringify(activeWeightCounters);
  localStorage.weightCounter = JSON.stringify(weightCounter);
});
loadButton.addEventListener("click", function(){
  activeWeightCounters = JSON.parse(localStorage.activeWeightCounters);
  weightCounter = JSON.parse(localStorage.weightCounter);
  options = JSON.parse(localStorage.options);
  console.log(options);
  for (var key in options){
    var option = document.createElement("div");
    option.innerHTML = key;
    optionList.appendChild(option);
  }
});

//
// List of functions:
//
// randomNumber(max, method) = takes in a maximum number and then decides what to do with it
// ajax(URL, Method) = take in an api URL and then decides what to do with it
