var imagearray = [

"/images/c1.png",  
"/images/c4.png","/images/c5.png","/images/c7.png",
"/images/c9.png","/images/c11.png",
"/images/c12.png","/images/c13.png","/images/c14.png","/images/c15.png"

// "/images/c9.png", "/images/c10.png",



];
//Global Variables
let players = [];
let boardLength = 40;
// making property a global variable so it can be used to buy/sell/trade
var property = [];
// global turn property
var turn = 0;

// ----------------------------------- DICE ROLLING ------------------------------------------
//preload the six dice images
var face1 = new Image()
face1.src = "images/f1.png"
var face2 = new Image()
face2.src = "images/f2.png"
var face3 = new Image()
face3.src = "images/f3.png"
var face4 = new Image()
face4.src = "images/f4.png"
var face5 = new Image()
face5.src = "images/f5.png"
var face6 = new Image()
face6.src = "images/f6.png"
var randomd0 = 0
var randomd1 = 1
var doubleCount = 0
var double = 0

$("#throw").click(function () {
    $(".dice").addClass('shake')
    setTimeout(function () {
        $(".dice").removeClass('shake')
    }, 1800)
})
async function throwDice() {
    let current_player_num = getCurrentPlayer();
    let player = players[current_player_num];
    
    // Disable the button so user can't keep pressing it
    document.getElementById("throw").disabled = true
    var double = await rollDice()
    addToGameLog("[" + player.name +"]" + ' rolled a ' + (randomd0 + randomd1) + '!');
    if ((double == 1) && (doubleCount < 2)) {
        doubleCount++
        addToGameLog('Doubles! Roll again!')
    }
    else {
        doubleCount = 0
    }
    if (doubleCount == 3) {
        addToGameLog(player.name + ' rolled doubles 3 times!  You are sent to jail!')
    }
    // Re-enable the button
    //document.getElementById("throw").disabled = false
    player.updatePosition(randomd0+randomd1);
}

// Roll the dice with visual representation and return whether we rolled a double
function rollDice() {
    var num = 0
        // Display dice rolling and return whether we rolled doubles
    var roll = setInterval(function () {
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
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(randomd0 == randomd1);
        }, 1650)
    })
}
// Display the corresponding die face for randomly generated values
function updateDice() {
    document.getElementById("d0").src = eval("face" + randomd0 + ".src")
    document.getElementById("d1").src = eval("face" + randomd1 + ".src")
}

// ----------------------------------- DICE ROLLING ------------------------------------------


// ----------------------------------- Properties ------------------------------------------
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
    }
    else if (groupNumber === 5 || groupNumber === 6) {
        this.houseprice = 100;
    }
    else if (groupNumber === 7 || groupNumber === 8) {
        this.houseprice = 150;
    }
    else if (groupNumber === 9 || groupNumber === 10) {
        this.houseprice = 200;
    }
    else {
        this.houseprice = 0;
    }
}

// set up the board game
function set_up_game_board() {

    //initialize properties on the board
    property[0] = new Property("GO", "COLLECT $200 TRAVEL SUBSIDY AS YOU PASS.", "#FFFFFF");
    property[1] = new Property("Pacific Center", "$60", "#8B4513", 60, 3, 2, 10, 30, 90, 160, 250);
    property[2] = new Property("Davie St.", "$60", "#8B4513", 60, 3, 2, 10, 30, 90, 160, 250);
    property[3] = new Property("Top Of Vancouver Restaurant", "$80", "#8B4513", 80, 3, 4, 20, 60, 180, 320, 450);
    property[4] = new Property("Parking Ticket", "Pay $200", "#FFFFFF");
    property[5] = new Property("Coal Habour", "$200", "#FFFFFF", 200, 1);
    property[6] = new Property("Granville Island", "$100", "#87CEEB", 100, 4, 6, 30, 90, 270, 400, 550);
    property[7] = new Property("Chance", "FOLLOW INSTRUCTIONS ON TOP CARD", "#FFFFFF");
    property[8] = new Property("GasTown", "$100", "#87CEEB", 100, 4, 6, 30, 90, 270, 400, 550);
    property[9] = new Property("Stanley Park", "$120", "#87CEEB", 120, 4, 8, 40, 100, 300, 450, 600);
    property[10] = new Property("Arrested", "Never overspeed in Vancouver", "#FFFFFF");
    property[11] = new Property("Simon Fraser University", "$140", "#FF0080", 140, 5, 10, 50, 150, 450, 625, 750);
    property[12] = new Property("White Rock", "$150", "#FFFFFF", 150, 2);
    property[13] = new Property("Queen Elizabeth Park", "$140", "#FF0080", 140, 5, 10, 50, 150, 450, 625, 750);
    property[14] = new Property("Vancouver Aquarium", "$160", "#FF0080", 160, 5, 12, 60, 180, 500, 700, 900);
    property[15] = new Property("Metrotown", "$200", "#FFFFFF", 200, 1);
    property[16] = new Property("Grouse Mountain", "$180", "#FFA500", 180, 6, 14, 70, 200, 550, 750, 950);
    property[17] = new Property("PlayLand", "$150", "#FFFFFF", 150, 2);
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
    property[28] = new Property("Scotia Bank Theatre", "$150", "#FFFFFF", 150, 2);
    property[29] = new Property("St. Paul's Hospital", "$280", "#FFFF00", 280, 8, 24, 120, 360, 850, 1025, 1200);
    property[30] = new Property("YVR Airport", "Travel to any destination you want in next turn.", "#FFFFFF");
    property[31] = new Property("Granvile St.", "$300", "#008000", 300, 9, 26, 130, 390, 900, 110, 1275);
    property[32] = new Property("Waterfront", "$300", "#008000", 300, 9, 26, 130, 390, 900, 110, 1275);
    property[33] = new Property("Rogers Arena", "$150", "#FFFFFF", 150, 2);
    property[34] = new Property("BC Place", "$320", "#008000", 320, 9, 28, 150, 450, 1000, 1200, 1400);
    property[35] = new Property("Science World", "$200", "#FFFFFF", 200, 1);
    property[36] = new Property("Chance", "FOLLOW INSTRUCTIONS ON TOP CARD", "#FFFFFF");
    property[37] = new Property("Robson Street", "$350", "#0000FF", 350, 10, 35, 175, 500, 1100, 1300, 1500);
    property[38] = new Property("Parq Casino Gambling", "Pay $100", "#FFFFFF");
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

    // Create enlarge card
    var drag, dragX, dragY, dragObj, dragTop, dragLeft;
    var cells = document.getElementsByClassName("cell-position-holder");
    for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener("mouseover", function () {
            $("#" + this.enlargeId).show();
        }, false);
        cells[i].addEventListener("mouseout", function () {
            $("#" + this.enlargeId).hide();
        }, false);
        cells[i].addEventListener("mousemove", function (e) {
            var element = document.getElementById(this.enlargeId);
            if (e.clientY + 20 > window.innerHeight - 204) {
                element.style.top = (window.innerHeight - 204) + "px";
            }
            else {
                element.style.top = (e.clientY + 20) + "px";
            }
            element.style.left = (e.clientX + 10) + "px";
        }, false);
    }

}

//Buy and Sell
const buyButton = document.getElementById('buyButton');
const sellButton = document.getElementById('sellButton'); //mortgage
buyButton.disabled = true;
sellButton.disabled = true;

buyButton.addEventListener('click', function (e) {
    var currentPlayerNum = getCurrentPlayer();
    var currentPlayer = players[currentPlayerNum];
    //   console.log("current cell is: " + currentPlayer.curCell);
    var playerPosition = currentPlayer.curCell; // should return int
    // this is hard coded currently, change 2 to playerPosition
    var currentSquare = property[playerPosition]; //this will get the property
    //   console.log("squre name is: " + currentSquare.name);
    // already owned
    if (currentSquare.owner != 0) {
        alert("This property is already owned");
    }
    //make sure they have enough cash
    if (currentPlayer.cash >= currentSquare.price && currentSquare.owner == 0) {
        var confirmed = confirm("Are you sure you want to buy this property?");
        if (confirmed) {
            currentPlayer.buyProperty(currentSquare);
        }
    }
    else {
        alert("You do not have the funds to buy the property"); //add to gamelog
        addToGameLog("You do not have the funds to buy the property");
    }
});

sellButton.addEventListener('click', function (e) {
    var currentPlayerNum = getCurrentPlayer();
    var currentPlayer = players[currentPlayerNum];
    var playerPosition = currentPlayer.curCell;
    console.log("player position is: " + playerPosition);
    // this is hard coded currently, change 2 to playerPosition
    var currentSquare = property[playerPosition];
    //   console.log("squre name is: " + currentSquare.name);
    if (currentSquare.owner != currentPlayer) {
        alert("This property is not owned by you");
    }
    currentPlayer.sellProperty(currentSquare);
    //make sure they have enough cash
    console.log("player cash after selling: " + currentPlayer.cash);
});
// ----------------------------------- PROPERTIES ------------------------------------------


// ----------------------------------- Player ------------------------------------------
class Player {
    constructor(name, picture, playerNumber) {
        this.name = name;
        this.cash = 1500;
        this.picture = picture;
        this.curCell = 0;
        this.estate_value = 0;
        this.properties = 0;
        this.playerNumber = playerNumber;
        // what other attributes we need?
    }
    updatePosition(stepsToMove) {
        console.log("player curcell is: " + this.curCell);
        // get current player location
        let currentPlayerPosition = this.curCell;

        // get newPosition after roll
        let newPositionAfterRoll = (currentPlayerPosition + stepsToMove);

        // used for checking if user is on a 'penalty square'
        let newPositionAfterRoll2 = (currentPlayerPosition + stepsToMove) % boardLength;
        

        //update cash if the player completes one lap around the board
        if (newPositionAfterRoll >= boardLength) { //makes full revolution
            this.cash += 200;
            // var playerMoney = parseInt(document.getElementById('player_money_'+getCurrentPlayer()).innerHTML);
            // playerMoney += 200;
            // document.getElementById('player_money_'+getCurrentPlayer()).innerHTML = playerMoney;
            updateCash(this);
            addToGameLog(this.name + ' made it around the board! Collect $200!');
        }
        
        
        var m = this.curCell;
        
        let lap, if_calculate_lap, reset;
    
        if(m < boardLength && newPositionAfterRoll > boardLength){
            lap = true
            if_calculate_lap = false
            reset = true
        }else{
            lap = false
            if_calculate_lap = true
            reset = false
        }
        
        var character_img = document.createElement("img");
                character_img.src = "/images/" + this.picture + "character.png";
                character_img.setAttribute("height", "auto");
                character_img.setAttribute("width", "25%");
                character_img.setAttribute("padding-top", "10px");
        
        var interval = setInterval(() => {
                // Re-enable the button
                if (m == (newPositionAfterRoll % boardLength)) {
                    document.getElementById("throw").disabled = false;
                }
        
                 
                if(lap == false){
                        if((m % boardLength) < newPositionAfterRoll){
                            document.getElementById('cell'+ m + 'positionholder').innerHTML = '';
                            m = ((m + 1) % boardLength);
                            document.getElementById('cell'+ m +'positionholder').appendChild(character_img);
                        }else{
                            m = newPositionAfterRoll;
                            this.curCell = newPositionAfterRoll;
                            clearInterval(interval);
                        }
                }else {
                    if ( m < boardLength - 1 && if_calculate_lap == false) {
                            document.getElementById('cell' + m + 'positionholder').innerHTML = '';
                            m = ((m + 1) % boardLength);
                            document.getElementById('cell' + m + 'positionholder').appendChild(character_img);
                        
                    }else if( m == boardLength - 1){
                            document.getElementById('cell' + m + 'positionholder').innerHTML = '';
                                if_calculate_lap = true;
                                if(reset == true){
                                    m = 0;
                                    reset = false;
                                }
                            document.getElementById('cell' + m + 'positionholder').appendChild(character_img);
                    }else{
                          if( m < (newPositionAfterRoll % boardLength)){
                                document.getElementById('cell' + m + 'positionholder').innerHTML = '';
                                m = ((m + 1) % boardLength);
                                document.getElementById('cell' + m + 'positionholder').appendChild(character_img);   

                          }else{
                            m = (newPositionAfterRoll % boardLength)
                            this.curCell = (newPositionAfterRoll % boardLength);
                            clearInterval(interval); 
                         }
                    }
                }



            }, 100); 
            // enable or disable the buy button depending on the property
            if (property[newPositionAfterRoll2].groupNumber == 0)
            {
                buyButton.disabled = true;
            }
            else {
                buyButton.disabled = false;
            }
            //checkValidSquareBuy(property[newPositionAfterRoll]);

            if (newPositionAfterRoll2 === 4)
            {
                this.cash -= 200
                updateCash(this);
                addToGameLog(this.name + ' paid $200 for a Parking Ticket!');
            } 
            if (newPositionAfterRoll2 === 38)
            {
                this.cash -= 100
                updateCash(this);
                addToGameLog(this.name + ' lost $100 gambling.. Unlucky!');
            }
            if (newPositionAfterRoll2 === 7 || newPositionAfterRoll2 === 22 || newPositionAfterRoll2 === 36){
                console.log("At the chanceCard");
                console.log("newPositionAfterRoll2: " + newPositionAfterRoll2);
                 whenAtchanceCard(this, newPositionAfterRoll2);
                

            }
    //         // landing at the airport
    //         if (newPositionAfterRoll2 === 30)
    //         {
    //             airport(this);
    //         }
    // console.log("this is this.curcell: "+ this.curCell);
    }

    buyProperty(square) {
        // console.log("player cash before purchase is: " + this.cash);
        if (square.owner === 0) {
            // update the square owner square to this player
            square.owner = this;
            // subtract the cash from player
            this.cash -= square.price;
            this.properties++;
            this.estate_value += square.price;
            // else if this is already owned by another player
            // continue
            // console.log("player cash after purchase is: " + this.cash);
            // updating innerHTML
            // document.getElementById('player_money_1').innerHTML -= square.price;
            updateCash(this);
            updatePlayerPropertyOwned(this);
            updateEstateValue(this);
            addToGameLog(this.name + " has bought " + square.name + " for $" + square.price + " (-)");
            buyButton.disabled = true; 
            checkValidSquareMortgage(property[this.curCell], this);
        }
        else {
            alert("Unable to buy the property");
        }
    }
    // sell == mortgage - fix this for the next iteration
    sellProperty(square) {
        //check if this player owns the square
        if (square.owner === this && square.mortgage === false) {
            // update the owner to null/no one
            // square.owner = 0; -- dont want to update the owner since its mortgage
            // add half the cash to player
            let mortgageValue = square.price * 0.50;
            this.cash += mortgageValue;
            this.estate_value -= square.price;
            // reset the houses and hotels to 0??
            square.house = 0;
            square.hotel = 0;
            // var playerMoney = parseInt(document.getElementById('player_money_1').innerHTML);
            // playerMoney += mortgageValue;
            // document.getElementById('player_money_1').innerHTML = playerMoney;
            updateCash(this);
            updateEstateValue(this);
            square.mortgage = true;
            document.getElementById('sellButton').innerHTML = "Unmortgage"; 
            addToGameLog(this.name + " has mortgaged " + square.name + " for $" + mortgageValue + " (+)");
        } else if (square.owner === this && square.mortgage === true) { 
            var confirmed = confirm("Are you sure you want to unmortgage this property?");
            if (confirmed) {
                var unmortgageValue = square.price * 0.60;
                this.cash -= unmortgageValue;
                updateCash(this);
                document.getElementById('sellButton').innerHTML = "Mortgage";
                addToGameLog(this.name + " has unmortgaged " + square.name + " for $" + unmortgageValue + " (-)");
            }
        }
        else {
            alert("Unable to mortgage the property");
        }
    }
    
    getPlayerPosition() {
        return this.curCell;
    }
   
}




// async function sendToJail(player){
  
//     let result = await player.updatePosition(3);

//     return result;


// }

function getCurrentPlayer() {
    return turn;
}

// to allow for buy/mortage
function checkValidSquareBuy(square) {
    if (square.price != 0) {
        buyButton.disabled = false; 
    } else if (square.owner != 0) {
        buyButton.disabled = true; 
    }
    else {
        buyButton.disabled = true; 
    }
}

function checkValidSquareMortgage(square, player) {
    if (square.owner === player) {
        sellButton.disabled = false; 
    } else {
        sellButton.disabled = true;
    }
}

// adding messages to the game log
function addToGameLog(message) {
    $gameLog = $("#gameLog");
    $(document.createElement("div")).text(message).appendTo($gameLog);
    // ensure that scroll bar moves down automatically
    var Log = document.getElementById('gameLog');
    Log.scrollTop = Log.scrollHeight;
}
function updateCash(player){
    player_money = document.getElementById("player_money_" + player.playerNumber);
    player_money.innerHTML = player.cash;
    return;
};
function updateEstateValue(player){
    player_estate_value = document.getElementById("player_estate_value_" + player.playerNumber);
    player_estate_value.innerHTML = player.estate_value;
}
function updateTurn()
{
    turn = (turn + 1) % players.length;
}

function sendTo(position, player)
{
    player.updatePosition(position);
}

function updatePlayerPropertyOwned(player) {
    player_properties = document.getElementById("player_property_" + player.playerNumber);
    player_properties.innerHTML = player.properties;
    return;
};

// properties that each player currently owns
var player1Owns = [];
var player2Owns = [];

function displayOwnedProperties(){
 
    var player1Cell = document.getElementById("player1Properties");
    for (var i = 0; i < 40; i++)
    {
        if (property[i].owner.playerNumber == 1){
            if (player1Owns.indexOf(property[i].name) == -1){
                var text = property[i].name;
                player1Owns.push(text);
                var node = document.createElement("LI");                 // Create a <li> node
                var textnode = document.createTextNode(text);           // Create a text node
                node.appendChild(textnode);                              // Append the text to <li>
                player1Cell.appendChild(node);
            }
            else{
                continue
            }
        }
    }
    var player2Cell = document.getElementById("player2Properties");
    for (var i = 0; i < 40; i++)
    {
        if (property[i].owner.playerNumber == 2){
            if (player2Owns.indexOf(property[i].name) == -1){
                var text = property[i].name;
                player2Owns.push(text);
                var node = document.createElement("LI");                 // Create a <li> node
                var textnode = document.createTextNode(text);           // Create a text node
                node.appendChild(textnode);                              // Append the text to <li>
                player2Cell.appendChild(node);
            }
            else{
                continue
            }
        }
    }

    

   var x = document.getElementById("propertyList");
   if (x.style.display === "none"){
       x.style.display = "block";
   }
   else{
       x.style.display = "none";
   }

}

// function airport(player){

//     var location = window.prompt("enter the number of spaces you would like to advance: ");
//     player.updatePosition(location);
// }

window.onload = function () {

    let ajax_data;
    let player_num = 1;
    
    set_up_game_board()
    
    //retrieve players info
    $.ajax({
        url: "/fetch_players_info"
        , context: this
        , async: false
        , success: function (result) {
            ajax_data = result;

        }
    });
    
    ajax_data.forEach(function(element){
        let player = new Player(element.username, element.picture, player_num);
        players.push(player);
        player_num ++;
    });
    
    // creating players
    for(let i = 0; i < players.length; i++){
        player_num = i+1
        player_name = document.getElementById("player_name_" + player_num);
        player_name.innerHTML = players[i].playerNumber;
        
        
        player_picture = document.getElementById("player_picture_" + player_num);
        var character_img = document.createElement("img");
        var character_img2 = document.createElement("img");
        character_img.src = "/images/" + (players[i].picture) + "character.png";
        character_img2.src = "/images/" + (players[i].picture) + "character.png";
        character_img2.setAttribute("width","120px");
        character_img2.setAttribute("height","160px");
        player_picture.appendChild(character_img2);
        
        // add character image to first square on the board
        character_img.setAttribute("height", "auto");
        character_img.setAttribute("width", "25%");
        character_img.setAttribute("padding-top", "10px");
        document.getElementById('cell0positionholder').appendChild(character_img);
        
        
        player_money = document.getElementById("player_money_" + player_num);
        player_money.innerHTML = players[i].cash;
        
        player_properties = document.getElementById("player_property_" + player_num);
        player_properties.innerHTML = players[i].properties;
        
        player_estate_value = document.getElementById("player_estate_value_" + player_num);
        player_estate_value.innerHTML = players[i].estate_value;
        
        document.getElementById("player_" + player_num).style.display="inline-table";
        document.getElementById("player_holder" +player_num).style.display="none";
    } 
    
    document.getElementById("throw").disabled = false

}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
async function whenAtchanceCard(player, currentCell){
   
    $('.card').toggleClass('flipped');

    if(imagearray.length != 0){
        var element=document.getElementById('cardImage');
        var x = Math.floor((Math.random() * imagearray.length));
        // console.log("x is: " +x);   
        element.src=imagearray[x];
        if(imagearray[x] == "/images/c1.png"){
              //collect 50  and works
            console.log("It is c1");
            player.cash +=50;
            updateCash(player);
            addToGameLog(player.name + ' Collected $50');
          
        }
        // else if(imagearray[x] == "/images/c2.png"){
        //     console.log("It is c2");
           
        //     //Go to 'GO'
        //     //Collect 200
        // }
        // else if(imagearray[x] == "/images/c3.png"){ // problem with this
        //     console.log("Entering c3");
        //     let result = await player.updatePosition(currentCell + 3);
        
        //     return result;
        //     console.log("player.curcell is :" +player.curCell);
            
      
        //     //Test: 3 positions forward
           


            
        //     //GO back 3 spaces
        // }
        else if(imagearray[x] == "/images/c4.png"){
            console.log("It is c4");
            //pay 75
            player.cash -=75;
            updateCash(player);
            addToGameLog(player.name + ' Lost $75');
        }
        else if(imagearray[x] == "/images/c5.png"){
            console.log("It is c5");
            //collec 100
            player.cash +=100;
            updateCash(player);
            addToGameLog(player.name + ' Collcted $100');
        }
        // else if(imagearray[x] == "/images/c6.png"){
        //     console.log("It is c6");
        //     //pay each player 25

        // }
        else if(imagearray[x] == "/images/c7.png"){
            console.log("It is c7");
            //pay 500
            player.cash -=500;
            updateCash(player);
            addToGameLog(player.name + ' lost $50');
        }
        // else if(imagearray[x] == "/images/c8.png"){
        //     console.log("It is c8");
        //     //pay 2600
        //     player.cash +=50;
        //     updateCash(player);
        //     addToGameLog(player.name + ' lost $50');
        // }
        // else if(imagearray[x] == "/images/c9.png"){
        //     console.log("It is c9");
        //     //go to jail
        //     sendToJail(player);
        // }
        // else if(imagearray[x] == "/images/c10.png"){
        //     console.log("It is c10");
        //     //get out of jail card, keep the card
        // }
        else if(imagearray[x] == "/images/c11.png"){
            console.log("It is c11");
            //get 45
            player.cash +=40;
            updateCash(player);
            addToGameLog(player.name + ' Gained $45');
        }
        else if(imagearray[x] == "/images/c12.png"){
            console.log("It is c12");
            //get 0
            addToGameLog(player.name + ' Gained 0');
        }
        else if(imagearray[x] == "/images/c13.png"){
            console.log("It is c13");
            //pay 25
            player.cash -=25;
            updateCash(player);
            addToGameLog(player.name + ' Gained $25');
            
        }
        else if(imagearray[x] == "/images/c14.png"){
            console.log("It is c14");
            //GO to jail, do not pass GO, do not collect 200
        }else if(imagearray[x] == "/images/c15.png"){
            console.log("It is c15");
            //pay 150
            player.cash +=150;
            updateCash(player);
            addToGameLog(player.name + ' Gained $150');
        }
    

        
        imagearray.splice(x, 1);  
        console.log(imagearray);
        sleep(3500).then(() => {
            // Do something after the sleep!
            $('.card').toggleClass('flipped');
        });
      
    } 


    else{
        var element=document.getElementById('cardImage');
        element.src="/images/end.jpg"
        sleep(4000).then(() => {
            // Do something after the sleep!
            $('.card').toggleClass('flipped');
        });
    }

}

