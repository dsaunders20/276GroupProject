// adding messages to the game log
window.addToGameLog = function(message)
{
    $gameLog = $("#gameLog");
    $(document.createElement("div")).text(message).appendTo($gameLog);
    // ensure that scroll bar moves down automatically
    var Log = document.getElementById('gameLog');
    Log.scrollTop = Log.scrollHeight;
}

// DICE ROLLING

//preload the six dice images
var face1=new Image()
face1.src="images/f1.png"
var face2=new Image()
face2.src="images/f2.png"
var face3=new Image()
face3.src="images/f3.png"
var face4=new Image()
face4.src="images/f4.png"
var face5=new Image()
face5.src="images/f5.png"
var face6=new Image()
face6.src="images/f6.png"

var randomd0 = 0
var randomd1 = 1
var doubleCount = 0
var double = 0

// Animate the dice when user throws them
//var throw_obj = document.getElementById("throw");
//var dice = document.getElementsByClassName("dice");
//throw_obj.onclick = function(){
//    for(var i=0; i<dice.length; i++){
//        dice[i].classList.add('shake');
////        setTimeout(function() {
////            dice[i].classList.remove('shake')
////        }, 1800)    
//    } 
//}\

var stepsToMove;
var boardLength = 40;
var newCellNum;
var oldCellNum;
var counter;
var pic;
var lap = false;

$("#throw").click(function() {
    $(".dice").addClass('shake')
    setTimeout(function() {
        $(".dice").removeClass('shake')
    }, 1800)
    setTimeout(() => {
        // Calculate the new position with stepsToMove obtained from dice roll
        if (oldCellNum + stepsToMove >= boardLength) {
            lap = true;
            newCellNum = ((oldCellNum + stepsToMove) % boardLength);
        } else {
            newCellNum = oldCellNum + stepsToMove;
        }
    }, 1850);
    setTimeout(() => {

        // Hard coded the image.  Need to fix when have players class
        pic = document.getElementById('cell'+oldCellNum+'grid0').innerHTML;
        counter = oldCellNum;
        var int = setInterval(() => {
            // Re-enable the button
            if (counter == newCellNum) {
                document.getElementById("throw").disabled = false;
            }
            // Move character one square at a time from old position to new position
            if (lap == false) {
                if ((counter % boardLength) < newCellNum) {
                    document.getElementById('cell'+counter+'grid'+0).innerHTML = '';
                    counter = ((counter+1) % boardLength);
                    document.getElementById('cell'+counter+'grid'+0).innerHTML = pic;
                } else {
                    oldCellNum = newCellNum;
                    clearInterval(int);
                }
            } else {
                if ((counter % boardLength) < newCellNum) {
                    document.getElementById('cell'+counter+'grid'+0).innerHTML = '';
                    counter = ((counter+1) % boardLength);
                    document.getElementById('cell'+counter+'grid'+0).innerHTML = pic;
                    lap = false;
                } else if (counter == boardLength-1) { 
                    document.getElementById('cell'+counter+'grid'+0).innerHTML = '';
                    counter = 0; 
                    document.getElementById('cell'+counter+'grid'+0).innerHTML = pic;
                    lap = false;
                } else if (counter < boardLength) {
                    document.getElementById('cell'+counter+'grid'+0).innerHTML = '';
                    counter = ((counter+1) % boardLength);
                    document.getElementById('cell'+counter+'grid'+0).innerHTML = pic;
                } else {
                    lap = false;
                    oldCellNum = newCellNum;
                    clearInterval(int);
                }
            }
        }, 400);
    }, 2000);
})

// window.interval = function() {
//     var int = setInterval(() => {
//         if ((m % boardLength) <= newCellNum) {
//             addToGameLog('m is '+m);
//             addToGameLog('steps to move '+stepsToMove);
//             addToGameLog('new cell num is ' + newCellNum);
//             document.getElementById('cell'+counter+'grid'+0).innerHTML = '';
//             counter = ((counter+1) % boardLength);
//             document.getElementById('cell'+counter+'grid'+0).innerHTML = pic;
//         } else {
//             clearInterval(int);
//         }
//     }, 400);
// }


window.throwDice = async function() {
    // Disable the button so user can't keep pressing it
    document.getElementById("throw").disabled = true

    var double = await rollDice()
    
    var rollTotal = randomd0+randomd1;
    if (rollTotal == 8 || rollTotal == 11)
    {
        addToGameLog('You rolled an ' + (randomd0+randomd1) + '!');
    }
    else addToGameLog('You rolled a ' + (randomd0+randomd1) + '!');
    
    if ((double == 1) && (doubleCount < 2)) {
        doubleCount++
        addToGameLog('Doubles!  Roll again!')
    } else {
        doubleCount = 0
    }

    if (doubleCount == 3)
    {
        addToGameLog('You rolled doubles 3 times!  To jail you go!')
    }
    // Re-enable the button
    // document.getElementById("throw").disabled = false
    stepsToMove = (randomd0+randomd1);
}

// Roll the dice with visual representation and return whether we rolled a double
function rollDice() {
    var num = 0
    // Display dice rolling and return whether we rolled doubles
    var roll = setInterval(function() {
        if (num == 15) {
            clearInterval(roll)
        }
        // Create a random integer between 0 and 5
        randomd0 = Math.floor(Math.random() * 6) + 1
        randomd1 = Math.floor(Math.random() * 6) + 1

        // Display result
        updateDice()
        
        num++
    }, 100)

    // Return whether we rolled a double
    return new Promise (function(resolve, reject) {
        setTimeout(function() {
            resolve(randomd0 == randomd1);
        }, 1650)
    })
}

// Display the corresponding die face for randomly generated values
function updateDice() {
    document.getElementById("d0").src=eval("face"+randomd0+".src")
    document.getElementById("d1").src=eval("face"+randomd1+".src")
}



function Property(name, pricetext, color, price, groupNumber, baserent, level1, level2, level3, level4) {
	this.name = name;
	this.color = color;
	this.owner = 0;
	this.mortgage = false;
	this.house = 0;
	this.hotel = 0;
	this.groupNumber = groupNumber || 0;
    this.pricetext = pricetext;
	this.price = (price || 0);
	this.baserent = (baserent || 0);
	this.level1 = (level1 || 0);
	this.level2 = (level2 || 0);
	this.level3 = (level3 || 0);
	this.level4 = (level4 || 0);
	this.landcount = 0;

	if (groupNumber === 3 || groupNumber === 4) {
		this.houseprice = 50;
	} else if (groupNumber === 5 || groupNumber === 6) {
		this.houseprice = 100;
	} else if (groupNumber === 7 || groupNumber === 8) {
		this.houseprice = 150;
	} else if (groupNumber === 9 || groupNumber === 10) {
		this.houseprice = 200;
	} else {
		this.houseprice = 0;
	}
}

// set up the board game
function set_up_game_board(){
    var property = [];
    
    //initialize properties on the board
    property[0] = new Property("Start", "COLLECT $200 TRAVEL SUBSIDY AS YOU PASS.", "#FFFFFF");
    property[1] = new Property("Pacific Center", "$60", "#8B4513", 60, 3, 2, 10, 30, 90, 160, 250);
    property[2] = new Property("Davie St.", "$80", "#8B4513",60, 3, 2, 10, 30, 90, 160, 250);
    property[3] = new Property("Top Of Vancouver Restaurant", "$60", "#8B4513", 60, 3, 4, 20, 60, 180, 320, 450);
    property[4] = new Property("Car Ticket", "Pay $200", "#FFFFFF");
    property[5] = new Property("Coal Habour", "$200", "#FFFFFF", 200, 1);
    property[6] = new Property("Granville Island", "$100", "#87CEEB", 100, 4, 6, 30, 90, 270, 400, 550);
    property[7] = new Property("Vancouver Art Gallery", "FOLLOW INSTRUCTIONS ON TOP CARD", "#FFFFFF");
    property[8] = new Property("GasTown", "$100", "#87CEEB", 100, 4, 6, 30, 90, 270, 400, 550);
    property[9] = new Property("Stanley Park", "$120", "#87CEEB", 120, 4, 8, 40, 100, 300, 450, 600);
    property[10] = new Property("Arrested", "Never overspeed in Vancouver", "#FFFFFF");
    property[11] = new Property("Simon Fraser University", "$140", "#FF0080", 140, 5, 10, 50, 150, 450, 625, 750);
    property[12] = new Property("White Rock", "$150", "#FFFFFF", 150, 2);
    property[13] = new Property("Queen Elizabeth Park", "$140", "#FF0080", 140, 5, 10, 50, 150, 450, 625, 750);
    property[14] = new Property("Vancouver Aquarium", "$160", "#FF0080", 160, 5, 12, 60, 180, 500, 700, 900);
    property[15] = new Property("Metrotown", "$200", "#FFFFFF", 200, 1);
    property[16] = new Property("Grouse Mountain", "$180", "#FFA500", 180, 6, 14, 70, 200, 550, 750, 950);
    property[17] = new Property("Play Land", "FOLLOW INSTRUCTIONS ON TOP CARD", "#FFFFFF");
    property[18] = new Property("Kitsilano Beach", "$180", "#FFA500", 180, 6, 14, 70, 200, 550, 750, 950);
    property[19] = new Property("English Bay", "$200", "#FFA500", 200, 6, 16, 80, 220, 600, 800, 1000);
    property[20] = new Property("Parking Lot", "", "#FFFFFF");
    property[21] = new Property("Capilano Bridge", "$220", "#FF0000", 220, 7, 18, 90, 250, 700, 875, 1050);
    property[22] = new Property("Chance", "FOLLOW INSTRUCTIONS ON TOP CARD", "#FFFFFF");
    property[23] = new Property("Burnaby Public Library", "$220", "#FF0000", 220, 7, 18, 90, 250, 700, 875, 1050);
    property[24] = new Property("Lynn Creek", "$240", "#FF0000", 240, 7, 20, 100, 300, 750, 925, 1100);
    property[25] = new Property("Deer Lake", "$200", "#FFFFFF", 200, 1);
    property[26] = new Property("Chinatown", "$260", "#FFFF00", 260, 8, 22, 110, 330, 800, 975, 1150);
    property[27] = new Property("Steveston Wharf", "$260", "#FFFF00", 260, 8, 22, 110, 330, 800, 975, 1150);
    property[28] = new Property("ScotiaBank Theatre", "$150", "#FFFFFF", 150, 2);
    property[29] = new Property("St. Paul's Hospital", "$280", "#FFFF00", 280, 8, 24, 120, 360, 850, 1025, 1200);
    property[30] = new Property("YVR Airport", "Travel to any destination you want in next turn.", "#FFFFFF");
    property[31] = new Property("Granville St.", "$300", "#008000", 300, 9, 26, 130, 390, 900, 110, 1275);
    property[32] = new Property("Waterfront", "$300", "#008000", 300, 9, 26, 130, 390, 900, 110, 1275);
    property[33] = new Property("Rogers Arena", "FOLLOW INSTRUCTIONS ON TOP CARD", "#FFFFFF");
    property[34] = new Property("BC Place", "$320", "#008000", 320, 9, 28, 150, 450, 1000, 1200, 1400);
    property[35] = new Property("Science World", "$200", "#FFFFFF", 200, 1);
    property[36] = new Property("Chance", "FOLLOW INSTRUCTIONS ON TOP CARD", "#FFFFFF");
    property[37] = new Property("Robson Street", "$350", "#0000FF", 350, 10, 35, 175, 500, 1100, 1300, 1500);
    property[38] = new Property("Parq Casino", "Pay $100", "#FFFFFF");
    property[39] = new Property("Canada Place", "$400", "#0000FF", 400, 10, 50, 200, 600, 1400, 1700, 2000);
    
    //apply property on the game board 
    var board_text = document.body.appendChild(document.createElement("div"));

	board_text.id = "enlarge-wrap";

	var HTML = "";
	for (var i = 0; i < 40; i++) {
		HTML += "<div id='enlarge" + i + "' class='enlarge'>";
		HTML += "<div id='enlarge" + i + "color' class='enlarge-color'></div><br /><div id='enlarge" + i + "name' class='enlarge-name'></div>";
		HTML += "<br /><div id='enlarge" + i + "price' class='enlarge-price'></div>";
		HTML += "<br /><div id='enlarge" + i + "token' class='enlarge-token'></div></div>";
	}

	board_text.innerHTML = HTML;

	var currentCell;
	var currentCellAnchor;
	var currentCellPositionHolder;
	var currentCellName;
	var currentCellOwner;

	for (var i = 0; i < 40; i++) {
		s = property[i];

		currentCell = document.getElementById("cell" + i);

		currentCellAnchor = currentCell.appendChild(document.createElement("div"));
		currentCellAnchor.id = "cell" + i + "anchor";
		currentCellAnchor.className = "cell-anchor";

		currentCellPositionHolder = currentCellAnchor.appendChild(document.createElement("div"));
		currentCellPositionHolder.id = "cell" + i + "positionholder";
		currentCellPositionHolder.className = "cell-position-holder";
        currentCellPositionHolder.enlargeId = "enlarge" + i;
        
        var cellNumGrid0 = 'cell' + i + 'grid0';
        var cellNumGrid1 = 'cell' + i + 'grid1';
        var cellNumGrid2 = 'cell' + i + 'grid2';
        var cellNumGrid3 = 'cell' + i + 'grid3';
        var cellNumGrid4 = 'cell' + i + 'grid4';
        var cellNumGrid5 = 'cell' + i + 'grid5';

        document.getElementById('cell' + i + 'positionholder').innerHTML = 
        '<table class="grid"><tr class="grid-row"><td class ="grid-col" id='+cellNumGrid0+
        '></td><td class ="grid-col" id='+cellNumGrid1+'></td><td class ="grid-col" id='+cellNumGrid2+
        '></td></tr><tr class="grid-row"><td class ="grid-col" id='+cellNumGrid3+
        '></td><td class ="grid-col" id='+cellNumGrid4+'></td><td class ="grid-col" id='+cellNumGrid5+
        '></td></tr></table>';

		currentCellName = currentCellAnchor.appendChild(document.createElement("div"));
		currentCellName.id = "cell" + i + "name";
		currentCellName.className = "cell-name";
		currentCellName.textContent = s.name;

		if (property[i].groupNumber) {
			currentCellOwner = currentCellAnchor.appendChild(document.createElement("div"));
			currentCellOwner.id = "cell" + i + "owner";
			currentCellOwner.className = "cell-owner";
		}

		document.getElementById("enlarge" + i + "color").style.backgroundColor = s.color;
		document.getElementById("enlarge" + i + "name").textContent = s.name;
        document.getElementById("enlarge" + i + "price").textContent = s.pricetext;
        //document.getElementById("enlarge" + i + "token").innerHTML = '<img style="width: 120px; height: 50px; position: relative; top: -20px; z-index: -5;"src="' + searchTerm + '"' + ">";
    }
    
    // add character image to P0 of first square on the board
    var img = '<img style="max-width: 100%; height: auto" src="/images/1character.png">';
    document.getElementById('cell0grid0').innerHTML = img;
    
    /* Need to remove this hard coding when we have players class done
    and can keep track of positioning on game board */
    oldCellNum = 0;
    
    // Create enlarge card
	var drag, dragX, dragY, dragObj, dragTop, dragLeft;
    var cells = document.getElementsByClassName("cell-position-holder");
    
    for (var i=0; i < cells.length;i++){
        cells[i].addEventListener("mouseover", function(){
            $("#" + this.enlargeId).show();
        },false);
        cells[i].addEventListener("mouseout", function() {
            $("#" + this.enlargeId).hide();
        },false);
        cells[i].addEventListener("mousemove", function(e) {

            var element = document.getElementById(this.enlargeId);

            if (e.clientY + 20 > window.innerHeight - 204) {
                element.style.top = (window.innerHeight - 204) + "px";
            } else {
                element.style.top = (e.clientY + 20) + "px";
            }

            element.style.left = (e.clientX + 10) + "px";
        },false);
    }
        
//	$(".cell-position-holder, #jail").on("mouseover", function(){
//		$("#" + this.enlargeId).show();
//
//	}).on("mouseout", function() {
//		$("#" + this.enlargeId).hide();
//
//	}).on("mousemove", function(e) {
//		var element = document.getElementById(this.enlargeId);
//
//		if (e.clientY + 20 > window.innerHeight - 204) {
//			element.style.top = (window.innerHeight - 204) + "px";
//		} else {
//			element.style.top = (e.clientY + 20) + "px";
//		}
//
//		element.style.left = (e.clientX + 10) + "px";
//	});
    getWeather();
}


window.onload = function() {
    set_up_game_board()
    addToGameLog('Welcome to Monopoly Vancouver! Throw the dice to begin.');
}