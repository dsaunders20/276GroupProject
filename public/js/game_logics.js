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

function set_up_game_board(){
    var property = [];
    
    //initialize properties on the board
    property[0] = new Property("Start", "COLLECT $200 TRAVEL SUBSIDY AS YOU PASS.", "#FFFFFF");
    property[1] = new Property("Pacific Center", "$60", "#8B4513", 60, 3, 2, 10, 30, 90, 160, 250);
    property[2] = new Property("Daive St.", "$80", "#8B4513",60, 3, 2, 10, 30, 90, 160, 250);
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
    property[27] = new Property("Steveston Fisherman’s Wharf", "$260", "#FFFF00", 260, 8, 22, 110, 330, 800, 975, 1150);
    property[28] = new Property("Scotia Bank Theatre", "$150", "#FFFFFF", 150, 2);
    property[29] = new Property("St. Paul's Hospital", "$280", "#FFFF00", 280, 8, 24, 120, 360, 850, 1025, 1200);
    property[30] = new Property("YVR Airport", "Travel to any destination you want in next turn.", "#FFFFFF");
    property[31] = new Property("Granvile St.", "$300", "#008000", 300, 9, 26, 130, 390, 900, 110, 1275);
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
    }
    
    // add character image to first square on the board
    var img = '<img style="width: 25%; height: auto; padding-top: 10px;" src="/images/1character.png">';
    document.getElementById('cell0positionholder').innerHTML = img;

    
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
}


window.onload = function() {
    set_up_game_board()
}