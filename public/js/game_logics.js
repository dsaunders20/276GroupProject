//Global Variables
let players = [];
let boardLength = 40;
// making property a global variable so it can be used to buy/sell/trade
var property = [];

var socket = io('http://localhost:5000/');

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
    let player = players[current_player_num - 1];
    
    // Disable the button so user can't keep pressing it
    document.getElementById("throw").disabled = true
    var double = await rollDice()
    addToGameLog("[" + player.name +"]" + ' rolled a ' + (randomd0 + randomd1) + '!');
    if ((double == 1) && (doubleCount < 2)) {
        doubleCount++
        addToGameLog('Doubles!  Roll again!')
    }
    else {
        doubleCount = 0
    }
    if (doubleCount == 3) {
        addToGameLog(player.name + ' rolled doubles 3 times!  You are sent to jail!')
    }
    // Re-enable the button
    //document.getElementById("throw").disabled = false
    player.updatePosition(randomd0 + randomd1);
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
    // var property = [];
    //initialize properties on the board
    property[0] = new Property("Start", "COLLECT $200 TRAVEL SUBSIDY AS YOU PASS.", "#FFFFFF");
    property[1] = new Property("Pacific Center", "$60", "#8B4513", 60, 3, 2, 10, 30, 90, 160, 250);
    property[2] = new Property("Daive St.", "$60", "#8B4513", 60, 3, 2, 10, 30, 90, 160, 250);
    property[3] = new Property("Top Of Vancouver Restaurant", "$80", "#8B4513", 80, 3, 4, 20, 60, 180, 320, 450);
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
    var currentPlayer = players[currentPlayerNum-1];
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
    var currentPlayer = players[currentPlayerNum-1];
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
        // get current player location
        let currentPlayerPosition = this.curCell;
        // get newPosition after roll
        let newPositionAfterRoll = (currentPlayerPosition + stepsToMove);
        //update cash if the player completes one lap around the board
        if (newPositionAfterRoll >= boardLength) { //makes full revolution
            this.cash += 200;
            // var playerMoney = parseInt(document.getElementById('player_money_'+getCurrentPlayer()).innerHTML);
            // playerMoney += 200;
            // document.getElementById('player_money_'+getCurrentPlayer()).innerHTML = playerMoney;
            updateCash(this);
            addToGameLog(this.name + ' made it around the board! Collect $200!');
        }
        checkValidSquareBuy(property[newPositionAfterRoll]);
        
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



            }, 500); 
    }
    

    buyProperty(square) {
        // console.log("player cash before purchase is: " + this.cash);
        if (square.owner === 0) {
            // update the square owner square to this player
            square.owner = this;
            // subtract the cash from player
            this.cash -= square.price;
            this.properties++;
            // else if this is already owned by another player
            // continue
            // console.log("player cash after purchase is: " + this.cash);
            // updating innerHTML
            // document.getElementById('player_money_1').innerHTML -= square.price;
            updateCash(this);
            updatePlayerPropertyOwned(this);
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
            // var playerMoney = parseInt(document.getElementById('player_money_1').innerHTML);
            // playerMoney += mortgageValue;
            // document.getElementById('player_money_1').innerHTML = playerMoney;
            updateCash(this);
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

function getCurrentPlayer() {
    let current_player_num = 1
    return current_player_num; // how to do this?
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

function updatePlayerPropertyOwned(player) {
    player_properties = document.getElementById("player_property_" + player.playerNumber);
    player_properties.innerHTML = player.properties;
    return;
};

window.onload = function () {

//    let ajax_data;
    
    
    
    // retrieve current weather and display
    //getWeather();
    
    //retrieve players info
    //    $.ajax({
    //        url: "/fetch_players_info"
    //        , context: this
    //        , async: false
    //        , success: function (result) {
    //            ajax_data = result;
    //
    //        }
    //    });
    //    
    //    ajax_data.forEach(function(element){
    //        let player = new Player(element.username, element.picture, player_num);
    //        players.push(player);
    //        player_num ++;
    //    });
    
    
//    set_up_game_board();
//    document.getElementById("throw").disabled = false

}

function flip() {
    $('.card').toggleClass('flipped');
}


var imagearray = ["/images/c1.png", "/images/c2.png","/images/c3.png", "/images/c4.png", 
                 "/images/c5.png", "/images/c6.png", "/images/c7.png", "/images/c8.png" , 
                 "/images/c9.png", "/images/c10.png", "/images/c11.png", "/images/c12.png", 
                 "/images/c13.png", "/images/c14.png", "/images/c15.png", "/images/c16.png", 
                 "/images/c17.png", "/images/c18.png", "/images/c19.png", "/images/c20.png", "/images/c21.png"];

function changeImage()
{
if(imagearray.length != 0){
    var element=document.getElementById('cardImage');
    var x = Math.floor((Math.random() * imagearray.length));
    console.log(x);




      element.src=imagearray[x];
    imagearray.splice(x, 1);  
        console.log(imagearray);
}
    else{
         var element=document.getElementById('cardImage');
        element.src="/images/end.jpg"
    }
}


// ----------------------------------- Networking ------------------------------------------
var displayed_players = [];
var log_in_players = [];
var playerName;

function createPlayer(){
    // creating players
    for(let i = 0; i < log_in_players.length; i++){
        if(!displayed_players.includes(log_in_players[i].name)){
            player_num = i+1
            player_name = document.getElementById("player_name_" + player_num);
            player_name.innerHTML = log_in_players[i].name;


            player_picture = document.getElementById("player_picture_" + player_num);
//            var character_img = document.createElement("img");
            var character_img2 = document.createElement("img");
//            character_img.src = "/images/" + (log_in_players[i].picture) + "character.png";
            character_img2.src = "/images/" + (log_in_players[i].picture) + "character.png";
            character_img2.setAttribute("width","120px");
            character_img2.setAttribute("height","160px");
            player_picture.appendChild(character_img2);


            player_money = document.getElementById("player_money_" + player_num);
            player_money.innerHTML = log_in_players[i].cash;

            player_properties = document.getElementById("player_property_" + player_num);
            player_properties.innerHTML = log_in_players[i].properties;

            player_estate_value = document.getElementById("player_estate_value_" + player_num);
            player_estate_value.innerHTML = log_in_players[i].estate_value;

            document.getElementById("player_" + player_num).style.display="inline-table";
            document.getElementById("player_holder" +player_num).style.display="none";
            
            displayed_players.push(log_in_players[i].name);
        }
    }     
}

function updatePlayer(name,data){
    let current_player;
    for(let i=0; i<log_in_players.length; i++){
        if(log_in_players[i].name == name){
            current_player = log_in_players[i];
        }
    }
    let player_status = document.getElementById("player_status_" + current_player.picture);
      player_status.style.fontWeight = 'bold';
      player_status.style.color = 'red';
      player_status.innerHTML=(data.status); 
}


socket.on('connect', function(data) {
    socket.emit('getPlayerName',socket.id);
});

socket.on('set_player_name',function(data){
    playerName = data;
})

socket.on('clientChange', function (clientNum) {
    document.querySelector("#clients").innerHTML = "Online players:" + clientNum;
});

socket.on('connected', function(data){
	var msg = data + " has connected!!";
	socket.emit('chat',msg);
});

socket.on('update_log_in_player',function(data){
    var if_new_player = true;
    var player_num;
    
    socket.emit('getAllPlayers');
    
    for(let i = 0; i < log_in_players.length; i++){
        if(log_in_players[i].name == data.playerName){
            if_new_player = false;
            break;
        }
    }
    
    if(if_new_player){
        let new_player = new Player(data.playerName, data.picture, player_num)
        log_in_players.push(new_player);        
    }
//    
//    console.log(displayed_players,log_in_players);
    
});

socket.on('get_all_players',function(data){
//    console.log("test:");
//    console.log(data.length,log_in_players);
    
    for(let i=data.length-1 ; i>=0; i--){
        var if_find = false;
        for(let j=0; j<log_in_players.length; j++){  
            if(data[i].playerName != log_in_players[j].name){
                continue;
            }else{
                if_find = true;
                break;
            }
            
        }
        if(!if_find){
            let new_player = new Player(data[i].playerName, data[i].picture, data[i].picture);
            log_in_players.unshift(new_player);
        }
             

    }
    
    createPlayer();
});

socket.on('message',function(message){
	addToGameLog(message);
});

socket.on('dis', function(data){
//    console.log(data);
	var msg = data + " has disconnected!!";
    addToGameLog(msg);
});

socket.on('updateState',function(data){
    document.querySelector("#turn_info").innerHTML = "Playing:" + data.playerName;
    if(data.playerName == playerName){
        document.getElementById("endTurnButton").disabled = false;
        document.getElementById("throw").disabled = false;
    }else{
        document.getElementById('endTurnButton').disabled = true;
        document.getElementById('throw').disabled = true;
    }
});


socket.on('gameStart',function(){

    set_up_game_board();
    let ready_button = document.querySelector("#readyButton");
    ready_button.parentNode.removeChild(ready_button);
    document.getElementById("board").style.display = "table";
    document.getElementById("turn_info").style.display = "initial";
    
    for(let i=log_in_players.length+1;i<5;i++){
        let tmp= document.getElementById("player_holder"+i);
        tmp.innerHTML = "";
    }
    socket.emit('playerAfterReady',playerName);
    socket.emit('intializeGameAvastar');
});

socket.on('updateAvastar',function(){
//    var this_player;
    
    
    for(let i = 0; i< log_in_players.length; i++){
//        if(log_in_players[i].name == playerName){
//            this_player = log_in_players[i];
//        }
            var character_img = document.createElement("img");
            character_img.src = "/images/" + (log_in_players[i].picture) + "character.png";
            // add character image to first square on the board
            character_img.setAttribute("height", "auto");
            character_img.setAttribute("width", "25%");
            character_img.setAttribute("id", "player_avastar_"+log_in_players[i].picture);
            character_img.setAttribute("padding-top", "10px");
            document.getElementById('cell0positionholder').appendChild(character_img);
    }
    
    

});

function end_turn_click(){
    socket.emit('switchPlayer');
}

socket.on('update_player',function(data){
    updatePlayer(data.name,data.info);
});

function ready_button_click(){
    document.querySelector("#readyButton").disabled = true;
    socket.emit('playerReady',playerName);
}

// ----------------------------------- Networking ------------------------------------------
