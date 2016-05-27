"use strict";
var options = {};
var optionCount = 0;
var newSpaceCounter = 0;
var newColor = "#aaaaaa";
var loadColor = "#aaaaaa";
var deleteColor = "#aaaaaa";
var yesNoColor = "#aaaaaa";
var borderColor = "#efefef";
var ajax = function(URL, method) {
    var XHR = new XMLHttpRequest();
    XHR.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                method(this.responseText);
            }
        }
    };
    XHR.open("GET", URL);
    XHR.send();
};

var randomNumber = function(max, method) {
    var XHR = new XMLHttpRequest();
    XHR.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
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

function clearBoard() {
    newSpaceCounter = 0;
    while (document.querySelector(".lowerMainBod")) {
        document.querySelector(".lowerMainBod").parentNode.removeChild(document.querySelector(".lowerMainBod"));
    }
    selectedOptionBox.addEventListener("click", getAnswer);
    answer.innerHTML = "CLICK ME TO DECIDE!";
    answerImg.src = "";
    answerImg.style.position = "absolute";
    answerImg.style.display = "none";
    answer.style.color = "black";
    answer.parentNode.style.backgroundColor = "white";
    answer.parentNode.style.paddingBottom = "calc(100% + 10px)";
    answer.style.top = "";
    answer.style.position = "absolute";
    yesNoQuestion.innerHTML = "";
    newColor = "#aaaaaa";
    loadColor = "#aaaaaa";
    deleteColor = "#aaaaaa";
    yesNoColor = "#aaaaaa";
    loadButton.style.backgroundColor = loadColor;
    newSetButton.style.backgroundColor = newColor;
    deleteButton.style.backgroundColor = deleteColor;
    yesNoButton.style.backgroundColor = yesNoColor;
    borderColor = "#efefef";
    selectedOptionBox.style.borderColor = borderColor;
    for (var j = 0; j < document.getElementsByClassName("optionSpace").length; j++) {
        document.querySelector("#space" + j).style.borderColor = borderColor;
    }
    for (var i = 0; i < 8; i++) {
        document.querySelector("#space" + i).style.backgroundColor = borderColor;
    }
    document.querySelector(".mainBod").style.backgroundColor = borderColor;
    while (document.querySelector(".lowerMainBod")) {
        document.querySelector(".lowerMainBod").parentNode.removeChild(document.querySelector(".lowerMainBod"));
    }
    for (var r = 0; r < 13; r++) {
        document.querySelector("#T" + r).style.color = "black";
    }

    for (var p = 0; p < document.getElementsByClassName("title").length; p++) {
        document.getElementsByClassName("title")[p].style.backgroundColor = "white";
    }
    if (Object.keys(options[currentSet]).length > 3) {
        for (var i = 0; i < optionCount; i++) {
            var optionHolder = document.querySelector("#space" + i);
            clearDiv(optionHolder);
            inputBar.style.display = "none";
        }
    }
}


function clearDiv(div) {
    if (div) {
        div.innerHTML = "";
        div.style.backgroundColor = borderColor;
    }
}

function saveState() {
    localStorage[currentSet] = JSON.stringify(options[currentSet]);
}

function optionDivSetup(option) {
    var removeButton = document.createElement("div");
    removeButton.innerHTML = "X";
    removeButton.style.cursor = "pointer";
    removeButton.style.color = "black";
    removeButton.style.fontSize = ".2rem";
    removeButton.style.width = ".15rem";
    removeButton.style.padding = "0";
    removeButton.style.textAlign = "center";
    removeButton.style.position = "absolute";
    removeButton.style.top = ".01rem";
    removeButton.style.right = ".04rem";
    removeButton.style.display = "none";
    removeButton.addEventListener("click", function() {
        removeOption(this.parentNode.firstChild.innerHTML);
        saveState();

    });
    option.parentNode.addEventListener("mouseover", function() {
        removeButton.style.display = "block";
    });
    option.parentNode.addEventListener("mouseout", function() {
        removeButton.style.display = "none";
    });
    option.parentNode.className += (" " + option.innerHTML);
    option.parentNode.appendChild(removeButton);
    option.parentNode.style.backgroundColor = backgroundColorPicker(counter);
    counter++;
    var chosenCounter = document.createElement("div");
    chosenCounter.innerHTML = "Hits: " + options[currentSet][option.innerHTML].chosenCount;
    chosenCounter.style.color = "black";
    chosenCounter.style.bottom = ".2rem";
    chosenCounter.style.fontSize = ".1rem";
    option.parentNode.appendChild(chosenCounter);
    var weightPercent = document.createElement("div");
    weightPercent.innerHTML = "Weight: " + String(((options[currentSet][option.innerHTML].weight.length) / options[currentSet].weightAmnt) * 100) + "%";
    weightPercent.style.color = "black";
    weightPercent.style.bottom = ".1rem";
    weightPercent.style.fontSize = ".1rem";
    option.parentNode.appendChild(weightPercent);

    while (optionCount >= 8 + newSpaceCounter) {
        var bodyContainer = document.querySelector(".container-fluid");
        var newMain = document.createElement("div");
        newMain.className = "row lowerMainBod";
        bodyContainer.appendChild(newMain);
        for (var i = 0; i < 6; i++) {
            var newColumn = document.createElement("div");
            newColumn.className = "col-xs-2";
            newMain.appendChild(newColumn);
            var newRow = document.createElement("div");
            newRow.className = "row";
            newColumn.appendChild(newRow);
            var newSpace = document.createElement("div");
            newSpaceCounter++;
            newSpace.className = "col-xs-12 optionSpace";
            newSpace.setAttribute("id", "space" + (newSpaceCounter + 7));
            newRow.appendChild(newSpace);
        }
    }
}

function refreshTiles() {
    for (var i = 0; i < optionCount; i++) {
        var containingDiv = document.querySelector("#space" + i);
        if (containingDiv.hasChildNodes()) {
            var optionName = containingDiv.childNodes[0];
            var counter = containingDiv.childNodes[2];
            var weightCounter = containingDiv.childNodes[3];
            counter.innerHTML = "Hits: " + options[currentSet][optionName.innerHTML].chosenCount;
            counter.style.color = "black";
            weightCounter.innerHTML = "Weight: " + String(((options[currentSet][optionName.innerHTML].weight.length) / options[currentSet].weightAmnt) * 100) + "%";
            weightCounter.style.color = "black";
        }
    }
}

function removeOption(name) {

    options[currentSet].activeWeightCounters.splice(options[currentSet].activeWeightCounters.indexOf(options[currentSet][name].weight[0]), options[currentSet][name].weight.length);
    var newName = "";
    for(var i = 0; i <name.length; i++){
      if(name[i] === " "){
        newName+= ".";
      }else{
        newName += name[i];
      }
    }
    var spaceDiv = document.querySelector("." + newName);
    clearDiv(spaceDiv);
    delete options[currentSet][name];
    optionCount = Object.keys(options[currentSet]).length - 3;

}



selectedOptionBox.addEventListener("click", getAnswer);

function getAnswer() {
    if (Object.keys(options[currentSet]).length <= 4) {
        answer.style.fontSize = ".5rem";
        answer.innerHTML = "I need at least 2 options to decide!";
    } else {
        // var data = Math.floor(Math.random() * options[currentSet].activeWeightCounters.length);
        randomNumber(options[currentSet].activeWeightCounters.length - 1, function(data) {
            var chosenOption;
            for (var key in options[currentSet]) {
                if (key !== "activeWeightCounters" && key !== "weightCounter" && key !== "weightAmnt") {
                    if (options[currentSet][key].weight.indexOf(options[currentSet].activeWeightCounters[data]) !== -1) {
                        chosenOption = key;
                        if (options[currentSet][key].weight.length > 1) {
                            options[currentSet][key].weight.splice(options[currentSet][key].weight.indexOf(options[currentSet].activeWeightCounters[data]), 1);
                            options[currentSet].activeWeightCounters.splice(data, 1);

                        }
                    }
                }
            }

            var audio = new Audio('ZeldaTreasure.mp3');
            audio.play();
            var counter = 0;
            var partyTime = setInterval(function() {
                var tabColorArray = ["#3dc7fc", "#55ed92", "#ff7f7f", "#ffff3d"];
                newColor = tabColorArray.splice(Math.floor(Math.random() * 4), 1);
                loadColor = tabColorArray.splice(Math.floor(Math.random() * 3), 1);
                deleteColor = tabColorArray.splice(Math.floor(Math.random() * 2), 1);
                yesNoColor = tabColorArray[0];
                loadButton.style.backgroundColor = loadColor;
                newSetButton.style.backgroundColor = newColor;
                deleteButton.style.backgroundColor = deleteColor;
                yesNoButton.style.backgroundColor = yesNoColor;
                borderColor = String("rgb(" + (Math.floor(Math.random() * 255)) + "," + (Math.floor(Math.random() * 255)) + "," + (Math.floor(Math.random() * 255)) + ")");
                document.querySelector(".mainBod").style.backgroundColor = borderColor;
                selectedOptionBox.style.backgroundColor = borderColor;
                selectedOptionBox.style.borderColor = borderColor;
                if (document.querySelector(".lowerMainBod")) {
                    for (var b = 0; b < document.getElementsByClassName("lowerMainBod").length; b++) {
                        document.getElementsByClassName("lowerMainBod")[b].style.backgroundColor = borderColor;
                    }

                }
                for (var i = 0; i < 8; i++) {
                    document.querySelector("#space" + i).style.backgroundColor = borderColor;
                }
                // for(var k = 0; k< Object.keys(options[currentSet]).length-3; k++){
                //   document.querySelector("#space" + k).style.backgroundColor = String("rgb(" + (Math.floor(Math.random()*255)) + "," +(Math.floor(Math.random()*255)) + "," + (Math.floor(Math.random()*255)) + ")");
                // }

                for (var j = 0; j < document.getElementsByClassName("optionSpace").length; j++) {
                    document.querySelector("#space" + j).style.borderColor = borderColor;
                    if (document.querySelector("#space" + j).hasChildNodes()) {
                        document.querySelector("#space" + j).style.backgroundColor = String("rgb(" + (Math.floor(Math.random() * 255)) + "," + (Math.floor(Math.random() * 255)) + "," + (Math.floor(Math.random() * 255)) + ")");
                    }
                }
                counter++;

                for (var r = 0; r < 13; r++) {
                    document.querySelector("#T" + r).style.color = String("rgb(" + (Math.floor(Math.random() * 255)) + "," + (Math.floor(Math.random() * 255)) + "," + (Math.floor(Math.random() * 255)) + ")");
                }

                for (var p = 0; p < document.getElementsByClassName("title").length; p++) {
                    document.getElementsByClassName("title")[p].style.backgroundColor = borderColor;
                }
                if (counter === 45) {
                    clearInterval(partyTime);
                }
            }, 100);


            answerImg.style.display = "block";
            answerImg.src = "http://media1.giphy.com/media/I2sZ6qckkhfLG/giphy.gif";
            options[currentSet][chosenOption].chosenCount++;
            answer.innerHTML = "";
            answer.style.color = "white";
            selectedOptionBox.style.backgroundColor = "#efefef";
            setTimeout(function() {
                answer.style.animationName = "leapForth";
                answer.innerHTML = chosenOption;
                answer.style.top = ".75rem";
            }, 5000);
            setTimeout(function() {
                answer.style.animationName = "";
                if (options[currentSet].weightAmnt === "1") {
                    removeOption(chosenOption);
                }
                saveState();
                refreshTiles();

            }, 10000);
        });
    }
}
var submit = function() {
    if (submitOption.value !== "") {
        var option = document.createElement("div");
        option.innerHTML = submitOption.value;
        options[currentSet][submitOption.value] = {};
        optionCount = Object.keys(options[currentSet]).length - 3;
        options[currentSet][submitOption.value].weight = [];
        options[currentSet][submitOption.value].chosenCount = 0;
        for (var i = 0; i < options[currentSet].weightAmnt; i++) {
            options[currentSet][submitOption.value].weight[i] = options[currentSet].weightCounter;
            options[currentSet].activeWeightCounters.push(options[currentSet].weightCounter);
            options[currentSet].weightCounter++;
        }
        for (var j = 0; j < optionCount; j++) {
            var space = document.querySelector("#space" + j);
            if (!space.hasChildNodes()) {
                space.appendChild(option);
                break;
            }
        }
        optionDivSetup(option);
        submitOption.value = '';
        submitOption.focus();
        saveState();
    }
};

var submitButton = document.querySelector("#submitButton");
var submitOption = document.querySelector("#submitOption");

submitButton.addEventListener("click", submit);
submitOption.addEventListener("keyup", function() {
    if (event.which === 13) {
        submit();

    }
});

var newSetButton = document.querySelector("#save");
var newBar = document.querySelector("#newBar");

newSetButton.addEventListener("click", function() {
    loadBar.style.display = "none";
    deleteBar.style.display = "none";
    loadButton.style.borderBottom = "1px solid black";
    inputBar.style.display = "none";
    deleteButton.style.borderBottom = "1px solid black";
    yesNoBar.style.display = "none";
    yesNoButton.style.borderBottom = "1px solid black";

    if (newBar.style.display === "block") {
        newBar.style.display = "none";
        newSetButton.style.borderBottom = "1px solid black";
        if (currentSet !== 0) {
            inputBar.style.display = "block";
            submitOption.focus();;
        }
    } else {
        newBar.style.display = "block";
        newBar.style.backgroundColor = newColor;
        newSetButton.style.borderBottom = "1px solid " + newColor;
        newSetInput.focus();

    }
});

var saveButton = document.querySelector("#saveButton");
var newSetInput = document.querySelector("#newSetInput");
var setNameDiv = document.querySelector("#setName");
var inputBar = document.querySelector("#inputBar");


saveButton.addEventListener("click", saveSet);
newSetInput.addEventListener("keyup", function() {
    if (event.which === 13) {
        saveSet();
    }
});

function saveSet() {
    if (newSetInput.value === "") {
        alert("please enter a name");
    } else {
        clearBoard();
        currentSet = newSetInput.value;
        newSetInput.value = "";
        options[currentSet] = {};
        setNameDiv.innerHTML = currentSet;
        newBar.style.display = "none";
        newSetButton.style.borderBottom = "1px solid black";
        inputBar.style.display = "block";
        submitOption.focus();
        selectedOptionBox.style.display = "block";

        for (var i = 0; i < 6; i++) {
            var radio = document.querySelector("#radio" + i);
            if (radio.checked) {
                options[currentSet].weightAmnt = radio.value;
            }
        }
        options[currentSet].activeWeightCounters = [];
        options[currentSet].weightCounter = 0;
    }
}

var loadButton = document.querySelector("#load");
var loadBar = document.querySelector("#loadBar");


loadButton.addEventListener("click", function() {
    newBar.style.display = "none";
    deleteBar.style.display = "none";
    inputBar.style.display = "none";
    newSetButton.style.borderBottom = "1px solid black";
    deleteButton.style.borderBottom = "1px solid black";
    yesNoBar.style.display = "none";
    yesNoButton.style.borderBottom = "1px solid black";
    if (loadBar.style.display === "block") {
        loadBar.style.display = "none";
        if (currentSet !== 0) {
            inputBar.style.display = "block";
            submitOption.focus();

        }
        loadButton.style.borderBottom = "1px solid black";

    } else {
        loadBar.style.display = "block";
        loadBar.style.backgroundColor = loadColor;
        loadButton.style.borderBottom = "1px solid " + loadColor;
    }
    if (loadBar.childNodes.length > 1) {
        var barLength = loadBar.childNodes.length - 1;
        for (var i = 0; i < barLength; i++) {
            loadBar.removeChild(loadBar.childNodes[1]);
        }
    }

    for (var key in localStorage) {
        var savedSet = document.createElement("div");
        savedSet.innerHTML = key;
        savedSet.style.display = "inline-block";
        savedSet.style.margin = "0 .2rem";
        savedSet.className += " button";
        savedSet.addEventListener("click", function() {
            clearBoard();
            currentSet = event.target.innerHTML;
            options[currentSet] = JSON.parse(localStorage[currentSet]);
            optionCount = Object.keys(options[currentSet]).length - 3;
            var counter = 0;
            for (var item in options[currentSet]) {
                if (item !== "activeWeightCounters" && item !== "weightCounter" && item !== "weightAmnt") {
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
            submitOption.focus();
            selectedOptionBox.style.display = "block";

        });
        loadBar.appendChild(savedSet);
    }



});

var deleteButton = document.querySelector("#delete");
var deleteBar = document.querySelector("#deleteList");

var deleteBarLoaded = false;
deleteButton.addEventListener("click", function() {
    loadBar.style.display = "none";
    newBar.style.display = "none";
    inputBar.style.display = "none";
    loadButton.style.borderBottom = "1px solid black";
    newSetButton.style.borderBottom = "1px solid black";
    yesNoBar.style.display = "none";
    yesNoButton.style.borderBottom = "1px solid black";
    if (deleteBar.style.display === "block") {
        deleteBar.style.display = "none";
        deleteButton.style.borderBottom = "1px solid black";
        if (currentSet !== 0) {
            inputBar.style.display = "block";
            submitOption.focus();
        }
    } else {
        deleteBar.style.display = "block";
        deleteBar.style.backgroundColor = deleteColor;
        deleteButton.style.borderBottom = "1px solid " + deleteColor;
    }
    if (deleteBar.childNodes.length > 1) {
        var barLength = deleteBar.childNodes.length - 1;
        for (var i = 0; i < barLength; i++) {
            deleteBar.removeChild(deleteBar.childNodes[1]);
        }
    }

        for (var key in localStorage) {
            var deleteSet = document.createElement("div");
            deleteSet.className += " button";
            deleteSet.innerHTML = key;
            deleteSet.style.display = "inline-block";
            deleteSet.style.margin = "0 .2rem";
            deleteSet.addEventListener("click", function(event) {
                localStorage.removeItem(event.target.innerHTML);
                deleteBar.removeChild(event.target);
            });
            deleteBar.appendChild(deleteSet);
            deleteBarLoaded = true;
        }

});

var yesNoButton = document.querySelector("#yesNoButton");
var yesNoBar = document.querySelector("#yesNoBar");
yesNoButton.addEventListener("click", function() {
    loadBar.style.display = "none";
    deleteBar.style.display = "none";
    newBar.style.display = "none";
    inputBar.style.display = "none";
    loadButton.style.borderBottom = "1px solid black";
    deleteButton.style.borderBottom = "1px solid black";
    newSetButton.style.borderBottom = "1px solid black";

    if (yesNoBar.style.display === "block") {
        yesNoBar.style.display = "none";
        yesNoButton.style.borderBottom = "1px solid black";
        if (currentSet !== 0) {
            inputBar.style.display = "block";
            submitOption.focus();
        }
    } else {
        yesNoBar.style.display = "block";
        yesNoBar.style.backgroundColor = yesNoColor;
        yesNoButton.style.borderBottom = "1px solid " + yesNoColor;
        yesNoQuestionInput.focus();

    }
});
var yesNoQuestion = document.querySelector("#yesNoQuestion");
var getAnswerButton = document.querySelector("#getAnswer");
var yesNoQuestionInput = document.querySelector("#yesNoQuestionInput");
getAnswerButton.addEventListener("click", submitYesNo);
yesNoQuestionInput.addEventListener("keyup", function() {
    if (event.which === 13) {
        submitYesNo();
    }
});

function submitYesNo() {
    clearBoard();
    var counter = 0;
    var partyTime = setInterval(function() {
        var tabColorArray = ["#3dc7fc", "#55ed92", "#ff7f7f", "#ffff3d"];
        newColor = tabColorArray.splice(Math.floor(Math.random() * 4), 1);
        loadColor = tabColorArray.splice(Math.floor(Math.random() * 3), 1);
        deleteColor = tabColorArray.splice(Math.floor(Math.random() * 2), 1);
        yesNoColor = tabColorArray[0];
        loadButton.style.backgroundColor = loadColor;
        newSetButton.style.backgroundColor = newColor;
        deleteButton.style.backgroundColor = deleteColor;
        yesNoButton.style.backgroundColor = yesNoColor;
        borderColor = String("rgb(" + (Math.floor(Math.random() * 255)) + "," + (Math.floor(Math.random() * 255)) + "," + (Math.floor(Math.random() * 255)) + ")");
        document.querySelector(".mainBod").style.backgroundColor = borderColor;
        selectedOptionBox.style.backgroundColor = borderColor;
        selectedOptionBox.style.borderColor = borderColor;
        for (var i = 0; i < 8; i++) {
            document.querySelector("#space" + i).style.backgroundColor = borderColor;
        }
        if (document.querySelector(".lowerMainBod")) {
            document.querySelector(".lowerMainBod").style.backgroundColor = borderColor;
        }
        for (var j = 0; j < document.getElementsByClassName("optionSpace").length; j++) {
            document.querySelector("#space" + j).style.borderColor = borderColor;
        }
        for (var r = 0; r < 13; r++) {
            document.querySelector("#T" + r).style.color = String("rgb(" + (Math.floor(Math.random() * 255)) + "," + (Math.floor(Math.random() * 255)) + "," + (Math.floor(Math.random() * 255)) + ")");
        }

        for (var p = 0; p < document.getElementsByClassName("title").length; p++) {
            document.getElementsByClassName("title")[p].style.backgroundColor = borderColor;
        }
        counter++;
        if (counter === 35) {
            clearInterval(partyTime);
        }
    }, 100);
    selectedOptionBox.removeEventListener("click", getAnswer);
    yesNoQuestion.innerHTML = yesNoQuestionInput.value;
    yesNoQuestionInput.value = "";
    answer.innerHTML = "";
    answer.style.color = "white";

    answerImg.src = "";
    answer.style.position = "relative";
    yesNoBar.style.display = "none";
    yesNoButton.style.borderColor = "black";
    selectedOptionBox.style.display = "block";
    selectedOptionBox.style.backgroundColor = "#efefef";
    var music = new Audio('Price1.mp3');
    music.play();
    ajax("http://yesno.wtf//api", function(data) {
        setTimeout(function() {
            answerImg.style.display = "block";
            answerImg.src = JSON.parse(data).image;
            answerImg.style.position = "relative";
            answer.parentNode.style.padding = "0";
            setTimeout(function() {
                answer.innerHTML = JSON.parse(data).answer.toUpperCase();
                if (answer.innerHTML === "NO") {
                    var audio = new Audio('NoSound.mp3');
                    audio.play();
                } else if (answer.innerHTML === "YES") {
                    var music = new Audio('YesSound.mp3');
                    music.play();
                }
            }, 1500);

        }, 4000);
    });
}

var counter = 1;

function backgroundColorPicker(counter) {
    var picker = counter % 7;
    var color = "";
    switch (picker) {

        case 1:
            color = "#9F9F9F";
            break;

        case 2:
            color = "#939393";
            break;

        case 3:
            color = "#808080";
            break;

        case 4:
            color = "#6D6D6D";
            break;

        case 5:
            color = "#616161";
            break;

        case 6:
            color = "#4C4C4C";
            break;

        case 0:
            color = "#424242";
            break;


    }
    return color;
}
