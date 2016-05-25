"use strict";
var options = {};
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


var currentSet = 0;
options[currentSet] = {};
var selectedOptionBox = document.querySelector("#selectedOption");
var answer = document.querySelector("#answer");
var answerImg = document.querySelector("#answerImg");

function clearBoard(){
  if(Object.keys(options[currentSet]).length > 3){
    for (var i = 0 ; i< Object.keys(options[currentSet]).length -3; i++){
      var optionHolder = document.querySelector("#space" + i);
      clearDiv(optionHolder);
      inputBar.style.display = "none";
    }
  }
}

function clearDiv(div){
  div.innerHTML = "";
  div.style.border = "0";
  div.style.backgroundColor = "";
}

function saveState(){
  localStorage[currentSet] = JSON.stringify(options[currentSet]);
}

function optionDivSetup(option){
  var removeButton = document.createElement("div");
  removeButton.innerHTML = "X";
  removeButton.style.fontSize = ".1rem";
  removeButton.style.width = ".15rem";
  removeButton.style.padding = "0";
  removeButton.style.textAlign = "center";
  removeButton.style.color = "red";
  removeButton.style.position = "absolute";
  removeButton.style.top = ".05rem";
  removeButton.style.right = ".01rem";
  removeButton.style.border = "1px solid black";
  removeButton.addEventListener("dblclick", function(){
    removeOption(this.parentNode.firstChild.innerHTML);
    saveState();

  });
  option.parentNode.className += (" " + option.innerHTML);
  option.parentNode.appendChild(removeButton);
  option.parentNode.style.border = "5px solid #aaaaaa";
  option.parentNode.style.backgroundColor = backgroundColorPicker(counter);
  counter++;
}
function removeOption(name){

  options[currentSet].activeWeightCounters.splice(options[currentSet].activeWeightCounters.indexOf(options[currentSet][name].weight[0]), options[currentSet][name].weight.length);
  var spaceDiv = document.querySelector("." + name);
  clearDiv(spaceDiv);
  delete options[currentSet][name];

}



selectedOptionBox.addEventListener("click", function(){
  if(Object.keys(options[currentSet]).length <= 4 ){
    answer.style.fontSize = ".5rem";
    answer.innerHTML = "I need at least 2 options to decide!";
  }else{

  randomNumber(options[currentSet].activeWeightCounters.length-1, function(data){
    var chosenOption;
    for(var key in options[currentSet]){
      if(key !== "activeWeightCounters" && key !== "weightCounter" && key !== "weightAmnt"){
        if(options[currentSet][key].weight.indexOf(options[currentSet].activeWeightCounters[data]) !== -1){
          chosenOption = key;
          if(options[currentSet][key].weight.length > 1){
            options[currentSet][key].weight.splice(options[currentSet][key].weight.indexOf(options[currentSet].activeWeightCounters[data]), 1);
            options[currentSet].activeWeightCounters.splice(data, 1);
          }
        }
    }
    }
    if(options[currentSet].weightAmnt === "1"){
      removeOption(chosenOption);
    }
    // answerImg.src = "http://media1.giphy.com/media/I2sZ6qckkhfLG/giphy.gif";
    answer.innerHTML = "";
    // answer.style.color = "white";
    // setTimeout(function(){answer.innerHTML = chosenOption;}, 2000);
    answer.innerHTML = chosenOption;
    // answer.style.animationName = "zoom";
    saveState();
  });
}
});
var submit = function(){
  if(submitOption.value !== ""){
    var option = document.createElement("div");
    option.innerHTML = submitOption.value;
    options[currentSet][submitOption.value] = {};
    options[currentSet][submitOption.value].weight = [];
    options[currentSet][submitOption.value].chosenCount = 0;
    for (var i = 0; i <options[currentSet].weightAmnt; i ++){
      options[currentSet][submitOption.value].weight[i] = options[currentSet].weightCounter;
      options[currentSet].activeWeightCounters.push(options[currentSet].weightCounter);
      options[currentSet].weightCounter++;
    }

    document.querySelector("#space" + String(Object.keys(options[currentSet]).length-4)).appendChild(option);
    optionDivSetup(option);
    submitOption.value = '';
    submitOption.focus();
    saveState();
  }
};

var submitButton = document.querySelector("#submitButton");
var submitOption = document.querySelector("#submitOption");

submitButton.addEventListener("click", submit);
submitOption.addEventListener("keyup", function(){
  if(event.which === 13){
    submit();

  }
});

var newSetButton = document.querySelector("#save");
var newBar = document.querySelector("#newBar");

newSetButton.addEventListener("click", function(){
  loadBar.style.display = "none";
  deleteBar.style.display = "none";
  loadButton.style.borderBottom = "1px solid black";
  inputBar.style.display = "none";
  deleteButton.style.borderBottom = "1px solid black";
  yesNoBar.style.display = "none";
  yesNoButton.style.borderBottom = "1px solid black";

  if(newBar.style.display === "block"){
    newBar.style.display = "none";
    newSetButton.style.borderBottom = "1px solid black";
    if(currentSet !== 0){
      inputBar.style.display = "block";
      submitOption.focus();;
    }
  }else{
    newBar.style.display = "block";
    newSetButton.style.borderBottom = "1px solid #55ed92";
    newSetInput.focus();

  }
});

var saveButton = document.querySelector("#saveButton");
var newSetInput =document.querySelector("#newSetInput");
var setNameDiv = document.querySelector("#setName");
var inputBar = document.querySelector("#inputBar");


saveButton.addEventListener("click", saveSet);
newSetInput.addEventListener("keyup", function(){
  if(event.which === 13){
    saveSet();
  }
});

function saveSet(){
  if(newSetInput.value === ""){
    alert("please enter a name");
  }else{
    clearBoard();
  currentSet = newSetInput.value;
  options[currentSet] = {};
  setNameDiv.innerHTML = currentSet;
  newBar.style.display = "none";
  newSetButton.style.borderBottom = "1px solid black";
  inputBar.style.display = "block";
  submitOption.focus();
  selectedOptionBox.style.display = "block";

  for (var i = 0; i < 6; i++){
    var radio = document.querySelector("#radio" + i);
    if (radio.checked){
      options[currentSet].weightAmnt = radio.value;
    }
  }
  options[currentSet].activeWeightCounters = [];
  options[currentSet].weightCounter = 0;
}
};

var loadButton = document.querySelector("#load");
var loadBar = document.querySelector("#loadBar");
var loadLoaded = false;

loadButton.addEventListener("click", function(){
  newBar.style.display = "none";
  deleteBar.style.display = "none";
  inputBar.style.display = "none";
  newSetButton.style.borderBottom = "1px solid black";
  deleteButton.style.borderBottom = "1px solid black";
  yesNoBar.style.display = "none";
  yesNoButton.style.borderBottom = "1px solid black";
  if(loadBar.style.display === "block"){
    loadBar.style.display = "none";
    if(currentSet !== 0){
  inputBar.style.display = "block";
  submitOption.focus();

}
    loadButton.style.borderBottom = "1px solid black";
  }else{
    loadBar.style.display = "block";
    loadButton.style.borderBottom = "1px solid #3dc7fc";
  }
  if(loadLoaded === false){
    for(var key in localStorage){
      var savedSet = document.createElement("div");
      savedSet.innerHTML = key;
      savedSet.style.display = "inline-block";
      savedSet.style.margin = "0 .2rem";
      savedSet.addEventListener("click", function(){
        clearBoard();
        currentSet = event.target.innerHTML;
        options[currentSet] = JSON.parse(localStorage[event.target.innerHTML]);
        var counter = 0;
        for(var item in options[currentSet]){
          if(item !== "activeWeightCounters" && item !== "weightCounter" && item !== "weightAmnt"){
          var option = document.createElement("div");
          option.innerHTML = item;
          document.querySelector("#space" + counter).appendChild(option);
          optionDivSetup(option);
          setNameDiv.innerHTML = currentSet;
          counter++;
        }
        }
        loadBar.style.display = "none";
        loadButton.style.borderBottom = "1px solid black";
        inputBar.style.display = "block";
        submitOption.focus();;
        selectedOptionBox.style.display = "block";

      });
      loadBar.appendChild(savedSet);
    }
    loadLoaded = true;
  }

});

var deleteButton = document.querySelector("#delete");
var deleteBar = document.querySelector("#deleteList");

var deleteBarLoaded = false;
deleteButton.addEventListener("click", function(){
  loadBar.style.display = "none";
  newBar.style.display = "none";
  inputBar.style.display = "none";
  loadButton.style.borderBottom = "1px solid black";
  newSetButton.style.borderBottom = "1px solid black";
  yesNoBar.style.display = "none";
  yesNoButton.style.borderBottom = "1px solid black";
  if(deleteBar.style.display === "block"){
    deleteBar.style.display = "none";
    deleteButton.style.borderBottom = "1px solid black";
    if(currentSet !== 0){
  inputBar.style.display = "block";
  submitOption.focus();;
}
  }else{
    deleteBar.style.display = "block";
    deleteButton.style.borderBottom = "1px solid #ff7f7f";
  }
  if(deleteBarLoaded === false){
    for(var key in localStorage){
      var deleteSet = document.createElement("div");
      deleteSet.innerHTML = key;
      deleteSet.style.display = "inline-block";
      deleteSet.style.margin = "0 .2rem";
      deleteSet.addEventListener("click", function(event){
        localStorage.removeItem(event.target.innerHTML);
        deleteBar.removeChild(event.target);
      });
      deleteBar.appendChild(deleteSet);
      deleteBarLoaded = true;
    }
  }
});

var yesNoButton = document.querySelector("#yesNoButton");
var yesNoBar = document.querySelector("#yesNoBar");
yesNoButton.addEventListener("click", function(){
  loadBar.style.display = "none";
  deleteBar.style.display = "none";
  newBar.style.display = "none";
  inputBar.style.display = "none";
  loadButton.style.borderBottom = "1px solid black";
  deleteButton.style.borderBottom = "1px solid black";
  newSetButton.style.borderBottom = "1px solid black";

  if(yesNoBar.style.display === "block"){
    yesNoBar.style.display = "none";
    yesNoButton.style.borderBottom = "1px solid black";
    if(currentSet !== 0){
      inputBar.style.display = "block";
      submitOption.focus();;
    }
  }else{
    yesNoBar.style.display = "block";
    yesNoButton.style.borderBottom = "1px solid #ffff3d";
    yesNoQuestionInput.focus();

  }
});
var yesNoQuestion = document.querySelector("#yesNoQuestion");
var getAnswerButton = document.querySelector("#getAnswer");
var yesNoQuestionInput = document.querySelector("#yesNoQuestionInput");
getAnswerButton.addEventListener("click", submitYesNo);
yesNoQuestionInput.addEventListener("keyup", function(){
  if(event.which === 13){
    submitYesNo();
  }
});
function submitYesNo(){
  clearBoard();
  yesNoQuestion.innerHTML = yesNoQuestionInput.value;
  answer.innerHTML ="";
  answerImg.src = "";
  yesNoBar.style.display = "none";
  selectedOptionBox.style.display = "block";
  ajax("http://yesno.wtf//api", function(data){
    answerImg.src = JSON.parse(data).image;
    answerImg.style.position = "relative";
    answer.parentNode.style.padding = "0";
    setTimeout(function(){answer.innerHTML = JSON.parse(data).answer;}, 1500);

  });
};


var clearSetButton = document.querySelector("#clearSetButton");
clearSetButton.addEventListener("dblclick", clearBoard);
var counter = 1;
function backgroundColorPicker(counter){
  var picker = counter % 8;
  var color = "";
  console.log("picker" + picker);
  console.log("counter" + counter);
  switch(picker){
    case 1:
    color = "#ffa530";
    break;

    case 2:
    color = "#bb41fc";
    break;

    case 3:
    color = "#8ffced";
    break;

    case 4:
    color = "#f77be2";
    break;

    case 5:
    color = "#ff7f7f";
    break;

    case 6:
    color = "#3dc7fc";
    break;

    case 7:
    color = "#55ed92";
    break;

    case 0:
    color = "#ffff3d";
    break;


  }
  return color;
}
