var imagearray = [

"/images/c1.png",  "/images/c2.png", "/images/c3.png",
"/images/c4.png","/images/c5.png","/images/c7.png",
"/images/c9.png","/images/c11.png",
"/images/c12.png","/images/c13.png","/images/c14.png","/images/c15.png"




];
//Global Variables
let players = [];
let boardLength = 40;
// making property a global variable so it can be used to buy/sell/trade
var property = [];
// global turn property
var turn = 0;
var totalTurn = 0;

const diceButton = document.getElementById('throw');
//diceButton.addEventListener('click', function(d){
//    if (log_in_players[getCurrentPlayer()].inJail) {
//        jailButton.disabled = true;
//    }
////     throwDice();
//})

var socket = io('http://localhost:8080/');

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
var double = false;

$("#throw").click(function () {
    $(".dice").addClass('shake')
    setTimeout(function () {
        $(".dice").removeClass('shake')
    }, 1800)
})
async function throwDice() {
    let current_player_num = getCurrentPlayer();
    let player = log_in_players[current_player_num - 1];
    
    console.log(getCurrentPlayerName(),getCurrentPlayer());
    // Disable the button so user can't keep pressing it
    document.getElementById("throw").disabled = true
    var double = await rollDice()
    if (double == 1) {
        doubleCount++
    }
    socket.emit('chat',"[" + player.name +"]" + ' rolled a ' + (randomd0 + randomd1) + '!');
    if ( player.inJail === false ){
        if ((double === true) && (doubleCount <= 2) && (player.curCell+randomd0+randomd1 != 10)) {
            socket.emit('chat','Doubles! Roll again!')
            diceButton.disabled=false;
            player.updatePosition(randomd0+randomd1);
            socket.emit('afterDiceRoll',getCurrentPlayerName(),(randomd0+randomd1))
            // player.updatePosition(8);
        }
        else if (doubleCount === 3) {
            socket.emit('chat','['+player.name+'] rolled doubles 3 times in a row, now sent to jail for 3 turns! ['+player.name+'] can pay $50 to get out.')
            doubleCount = 0;

            toJail(player);
        }
        else {
            doubleCount = 0
            diceButton.disabled = true;
            player.updatePosition(randomd0+randomd1);
            socket.emit('afterDiceRoll',getCurrentPlayerName(),(randomd0+randomd1))
            // player.updatePosition(8);
        }
    }
    else {      //  player rolls while in jail
        player.turnsInJail += 1;
        if ( player.turnsInJail < 3 && double === true ){   //  rolls doubles
            socket.emit('chat',"Doubles! ["+players.name+"] is free to go.");
            doubleCount = 0;
            unJail(player);
            diceButton.disabled = true;
            player.updatePosition(randomd0+randomd1);
            socket.emit('afterDiceRoll',getCurrentPlayerName(),(randomd0+randomd1))
        }
        else if ( player.turnsInJail < 3 && double === false ){ //  in jail less than 3 turns, no double
            socket.emit('chat',"Try again next turn!");
            diceButton.disabled = true;
        }
        else if ( player.turnsInJail >= 3 ){    //  in jail for 3 turns
            socket.emit('chat',player.name+" has now paid the $50 fine after 3 turns in jail and is free to go!");
            player.cash -= 50;
            updateCash(player);
            unJail(player);
            doubleCount = 0;
            diceButton.disabled = true;
            player.updatePosition(randomd0+randomd1);
            socket.emit('afterDiceRoll',getCurrentPlayerName(),(randomd0+randomd1))
        }
        else {
            socket.emit('chat',"Error in roll dice");
        }
    }
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


// ----------------------------------- JAIL FUNCTIONS ------------------------------------------

const jailButton = document.getElementById("leaveJail");
jailButton.addEventListener('click', function(b){
    var curPlayerNum = getCurrentPlayer();
    var curPlayer = players[curPlayerNum];

    socket.emit('chat',"["+curPlayer.name+"] paid $50 to get out of jail.");
    curPlayer.cash -= 50;
    updateCash(curPlayer);

    unJail(curPlayer);
})


//  Send player to jail and update attributes
function toJail(player) {
    //  Move avatar
    var character_img = document.createElement("img");
        character_img.src = "/images/" + player.picture + "character.png";
        character_img.setAttribute("height", "auto");
        character_img.setAttribute("width", "25%");
        character_img.setAttribute("padding-top", "10px");
    document.getElementById('cell'+ player.curCell + 'positionholder').innerHTML = '';  //  Maybe use some animations?
    document.getElementById('cell10positionholder').appendChild(character_img);         //  But not sure how to implement...

    //  Set jail attributes
    player.inJail = true;
    player.curCell = 10;
    player.turnsInJail = 0;
}

function unJail(player) {
    player.inJail = false;
    jailButton.disabled = true;
}

// ----------------------------------- JAIL FUNCTIONS ------------------------------------------


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
    property[4] = new Property("SFU Parking Ticket", "Pay $200", "#FFFFFF");
    property[5] = new Property("Coal Habour", "$200", "#FFFFFF", 200, 1, 8);
    property[6] = new Property("Granville Island", "$100", "#87CEEB", 100, 4, 6, 30, 90, 270, 400, 550);
    property[7] = new Property("Chance", "FOLLOW INSTRUCTIONS ON TOP CARD", "#FFFFFF");
    property[8] = new Property("GasTown", "$100", "#87CEEB", 100, 4, 6, 30, 90, 270, 400, 550);
    property[9] = new Property("Stanley Park", "$120", "#87CEEB", 120, 4, 8, 40, 100, 300, 450, 600);
    property[10] = new Property("Arrested", "Never overspeed in Vancouver", "#FFFFFF");
    property[11] = new Property("Simon Fraser University", "$140", "#FF0080", 140, 5, 10, 50, 150, 450, 625, 750);
    property[12] = new Property("White Rock", "$150", "#FFFFFF", 150, 2, 8);
    property[13] = new Property("Queen Elizabeth Park", "$140", "#FF0080", 140, 5, 10, 50, 150, 450, 625, 750);
    property[14] = new Property("Vancouver Aquarium", "$160", "#FF0080", 160, 5, 12, 60, 180, 500, 700, 900);
    property[15] = new Property("Metrotown", "$200", "#FFFFFF", 200, 1, 8);
    property[16] = new Property("Grouse Mountain", "$180", "#FFA500", 180, 6, 14, 70, 200, 550, 750, 950);
    property[17] = new Property("PlayLand", "$150", "#FFFFFF", 150, 2, 8);
    property[18] = new Property("Kitsilano Beach", "$180", "#FFA500", 180, 6, 14, 70, 200, 550, 750, 950);
    property[19] = new Property("English Bay", "$200", "#FFA500", 200, 6, 16, 80, 220, 600, 800, 1000);
    property[20] = new Property("Parking Lot", "", "#FFFFFF");
    property[21] = new Property("Capilano Bridge", "$220", "#FF0000", 220, 7, 18, 90, 250, 700, 875, 1050);
    property[22] = new Property("Chance", "FOLLOW INSTRUCTIONS ON TOP CARD", "#FFFFFF");
    property[23] = new Property("Burnaby Public Library", "$220", "#FF0000", 220, 7, 18, 90, 250, 700, 875, 1050);
    property[24] = new Property("Lynn Creek", "$240", "#FF0000", 240, 7, 20, 100, 300, 750, 925, 1100);
    property[25] = new Property("Deer Lake", "$200", "#FFFFFF", 200, 1, 8);
    property[26] = new Property("Chinatown", "$260", "#FFFF00", 260, 8, 22, 110, 330, 800, 975, 1150);
    property[27] = new Property("Steveston Wharf", "$260", "#FFFF00", 260, 8, 22, 110, 330, 800, 975, 1150);
    property[28] = new Property("Scotia Bank Theatre", "$150", "#FFFFFF", 150, 2, 8);
    property[29] = new Property("St. Paul's Hospital", "$280", "#FFFF00", 280, 8, 24, 120, 360, 850, 1025, 1200);
    property[30] = new Property("YVR Airport", "Travel to any destination you want in next turn.", "#FFFFFF");
    property[31] = new Property("Granvile St.", "$300", "#008000", 300, 9, 26, 130, 390, 900, 110, 1275);
    property[32] = new Property("Waterfront", "$300", "#008000", 300, 9, 26, 130, 390, 900, 110, 1275);
    property[33] = new Property("Rogers Arena", "$150", "#FFFFFF", 150, 2, 8);
    property[34] = new Property("BC Place", "$320", "#008000", 320, 9, 28, 150, 450, 1000, 1200, 1400);
    property[35] = new Property("Science World", "$200", "#FFFFFF", 200, 1, 8);
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

//resign
resignButton.addEventListener('click', function(e) {
    var confirmed = confirm("Are you sure you want to resign?");
    if (confirmed) {
        endGame();
    }
});

//Buy and Sell
const buyButton = document.getElementById('buyButton');
const sellButton = document.getElementById('sellButton'); //mortgage
buyButton.disabled = true;
sellButton.disabled = true;

buyButton.addEventListener('click', function (e) {
    var currentPlayerNum = getCurrentPlayer();
    var currentPlayer = log_in_players[currentPlayerNum - 1];
    //   console.log("current cell is: " + currentPlayer.curCell);
    var playerPosition = currentPlayer.curCell; // should return int
    var currentSquare = property[playerPosition]; //this will get the property
    //   console.log("squre name is: " + currentSquare.name);
    // already owned
    if (property[playerPosition].groupNumber < 1)
    {
        alert('Sorry this property is not for sale!');
        return;
    }
    else if (currentSquare.owner != 0) {
        alert("This property is already owned");
        return;
    }
    //make sure they have enough cash
    else if (currentPlayer.cash >= currentSquare.price && currentSquare.owner == 0) {
        var confirmed = confirm("Are you sure you want to buy this property?");
        if (confirmed) {
            currentPlayer.buyProperty(currentSquare);
        }
        return;
    }
    else {
        alert("You do not have the funds to buy the property"); //add to gamelog
        socket.emit('chat',"You do not have the funds to buy the property");
        return;
    }
});

sellButton.addEventListener('click', function (e) {
    var currentPlayerNum = getCurrentPlayer();
    var currentPlayer = log_in_players[currentPlayerNum - 1];
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
// end turn button functionality
const endTurn = document.getElementById('endTurnButton');
endTurn.addEventListener('click', function(e) {
    updateTurn();
    diceButton.disabled = false;
    if ( log_in_players[getCurrentPlayer()].inJail ){
        jailButton.disabled = false;
    }
    // let player = players[getCurrentPlayer()];
    // checkValidSquareBuy(property[player.curCell]);
    // checkValidSquareMortgage(property[player.curCell], player);
})
// ----------------------------------- PROPERTIES ------------------------------------------


// ----------------------------------- Player ------------------------------------------
class Player {
    constructor(name, picture, playerNumber, color) {
        this.name = name;
        this.cash = 1500;
        this.picture = picture;
        this.curCell = 0;
        this.estate_value = 0;
        this.properties = 0;
        this.playerNumber = playerNumber;
        this.color = color;
        this.inJail = false;
        this.turnsInJail = 0;
        this.JailCard = false;
        
        // what other attributes we need?
    }
    
    updatePosition(stepsToMove) {
        // console.log("player curcell is: " + this.curCell);
        // get current player location
       
        let currentPlayerPosition = this.curCell;

        // get newPosition after roll
        let newPositionAfterRoll = (currentPlayerPosition + stepsToMove);

        // used for checking if user is on a 'penalty square'
        let newPositionAfterRoll2 = (currentPlayerPosition + stepsToMove) % boardLength;
        //update cash if the player completes one lap around the board
        if (newPositionAfterRoll >= boardLength) { //makes full revolution
            this.cash += 200;
            updateCash(this);
            socket.emit('chat',this.name + ' made it around the board! Collect $200!');
        }
        //when landed on the chanceblock
        if (newPositionAfterRoll2 === 7 || newPositionAfterRoll2 === 22 || newPositionAfterRoll2 === 36){
            console.log("ChanceCard Begin");
            var Goback = false;
            var GoBackNum;
            
            var tmp = whenAtchanceCard();
            if (tmp ===1){ //collect 50
                this.cash +=50
                updateCash(this);
                socket.emit('chat',this.name + ' Collected $50');
            }
            else if (tmp ===2){ //Go to 'Go'
                newPositionAfterRoll+=(boardLength-newPositionAfterRoll);
                this.cash+=200;
                updateCash(this);
                socket.emit('chat',this.name + ' made it around the board! Collect $200!');
                
            }
            else if (tmp ===3){ // go 3 blocks backwards
           
                Goback=true;
                GoBackNum=3;
                socket.emit('chat',this.name + ' Going 3 Blocks Backwards, Landed On ' + property[newPositionAfterRoll].name)
            }
            else if (tmp ===4){ // pay $75
                this.cash-=75;
                updateCash(this);
                socket.emit('chat',this.name + ' Paied $75');

            }
            else if (tmp ===5){ // collect $100
                this.cash +=100;
                updateCash(this);
                socket.emit('chat',this.name = ' Collected $100');
                
            }
            // else if (tmp === 6){ //give 25 to each player
                
            // }
            else if (tmp ===7){ //pay $500
                this.cash -= 500;
                updateCash(this);
                socket.emit('chat',this.name + ' Lost $500');

                
            }
        
            else if (tmp ===9){ // Go to Jail
                newPositionAfterRoll +=(boardLength-newPositionAfterRoll)+10;
                this.cash+=200;
                updateCash(this);
                socket.emit('chat',this.name + ' is passing "Go" and Going To Jail, Gained $200');
            }
            // else if (tmp ===10){ //get out of Jail Card
            //      if(this.JailCard === true){

                //};

                
            // }
            else if (tmp === 11){ // gain 45
                this.cash +=45;
                updateCash(this);
                socket.emit('chat',this.name + ' Gained $45');
                
            }
            else if (tmp ===12){ // get 0
                socket.emit('chat',this.name + ' Gets NOTHING');
            }
            else if (tmp ===13){ // Lose 25
                this.cash -=25;
                updateCash(this);
                socket.emit('chat',this.name + ' Lost $25');
                
            }
            else if (tmp ===14){ //GO to Jail without passing 'GO'
             
              
                if(newPositionAfterRoll === 7){
                    Goback=false;
                    newPositionAfterRoll+=3;
                }
                else if(newPositionAfterRoll===22){
                    Goback=true;
                    GoBackNum=12;

                }
                else if(newPositionAfterRoll ===36){
                    Goback=true;
                    GoBackNum=26;
                }
              
                
            }
            else if (tmp === 15){ // pay 150;
                this.cash -=150;
                updateCash(this);
                socket.emit('chat',this.name + ' Paid $150');
                
            }
       

        
        }
        else if (newPositionAfterRoll2 === 30){
            console.log("im at the airport");
        }
        
        var m = this.curCell;
        
        let lap, if_calculate_lap, reset;
    
        if(m < boardLength && newPositionAfterRoll >= boardLength){
            lap = true
            if_calculate_lap = false
            reset = true
        }
        else{
            lap = false
            if_calculate_lap = true
            reset = false
        }
        var i =0;
        var character_img = document.createElement("img");
        character_img.setAttribute("id", "player_avastar_"+this.picture);
        character_img.src = "/images/" + this.picture + "character.png";
        character_img.setAttribute("height", "auto");
        character_img.setAttribute("width", "25%");
        character_img.setAttribute("padding-top", "10px");
        
        var interval = setInterval(() => {
            // Re-enable the button
            // ================================================================
            // ENABLE THE NEXT TWO LINES IF YOU WANT MULTIPLE ROLLS PER TURN
            // ===============================================================
            // if (m == (newPositionAfterRoll % boardLength)) {
            //     document.getElementById("throw").disabled = false;
            // }
    

                
            if(lap == false){
                    if((m % boardLength) < newPositionAfterRoll){
                        let position_holder = document.getElementById('cell'+ m + 'positionholder');
                        let current_player = document.getElementById("player_avastar_"+this.picture);
                        position_holder.removeChild(current_player);
                        m = ((m + 1) % boardLength);
                        document.getElementById('cell'+ m +'positionholder').appendChild(character_img);
                    }else{
                        m = newPositionAfterRoll;
                        this.curCell = newPositionAfterRoll;
                        i++;
                        clearInterval(interval);
                    }
            }else {
                if ( m < boardLength - 1 && if_calculate_lap == false) {
                        let position_holder = document.getElementById('cell'+ m + 'positionholder');
                        let current_player = document.getElementById("player_avastar_"+this.picture);
                        position_holder.removeChild(current_player);
                        m = ((m + 1) % boardLength);
                        document.getElementById('cell' + m + 'positionholder').appendChild(character_img);
                    
                }else if( m == boardLength - 1){
                        let position_holder = document.getElementById('cell'+ m + 'positionholder');
                        let current_player = document.getElementById("player_avastar_"+this.picture);
                        position_holder.removeChild(current_player);
                            if_calculate_lap = true;
                            if(reset == true){
                                m = 0;
                                reset = false;
                            }
                        document.getElementById('cell' + m + 'positionholder').appendChild(character_img);
                }else{
                        if( m < (newPositionAfterRoll % boardLength)){
                        let position_holder = document.getElementById('cell'+ m + 'positionholder');
                        let current_player = document.getElementById("player_avastar_"+this.picture);
                        position_holder.removeChild(current_player);
                            m = ((m + 1) % boardLength);
                            document.getElementById('cell' + m + 'positionholder').appendChild(character_img);
                        
                    }else if( m == boardLength - 1){
                        let position_holder = document.getElementById('cell'+ m + 'positionholder');
                        let current_player = document.getElementById("player_avastar_"+this.picture);
                        position_holder.removeChild(current_player);
                                if_calculate_lap = true;
                                if(reset == true){
                                    m = 0;
                                    reset = false;
                                }
                            document.getElementById('cell' + m + 'positionholder').appendChild(character_img);
                    }else{
                        if( m < (newPositionAfterRoll % boardLength)){
                                let position_holder = document.getElementById('cell'+ m + 'positionholder');
                                let current_player = document.getElementById("player_avastar_"+this.picture);
                                position_holder.removeChild(current_player);
                                m = ((m + 1) % boardLength);
                                document.getElementById('cell' + m + 'positionholder').appendChild(character_img);   

                        }else{
                            m = (newPositionAfterRoll % boardLength)
                            this.curCell = (newPositionAfterRoll % boardLength);
                            i++;
                            clearInterval(interval); 
                        }
                    }
                }
            

                
                
            }
                
                
                if(i== 1&& Goback===true){
                    console.log("GoBackNum is: " + GoBackNum);
                    console.log("m is: "+ m);
                    newPositionAfterRoll-=GoBackNum;
                    var intervalforBack = setInterval(()=>{
                        if(lap == false){
                                        if((m % boardLength) > newPositionAfterRoll){
                                            document.getElementById('cell'+ m + 'positionholder').innerHTML = '';
                                            m = ((m - 1) % boardLength);
                                            document.getElementById('cell'+ m +'positionholder').appendChild(character_img);
                                        }else{
                                            m = newPositionAfterRoll;
                                            this.curCell = newPositionAfterRoll;
                                            clearInterval(intervalforBack);
                                        }
                                    }
                                    
                                    if (newPositionAfterRoll2 === 4)
                                        {
                                            console.log("here");
                                            this.cash -= 200
                                            updateCash(this);
                                            socket.emit('chat',this.name + ' paid $200 for a Parking Ticket!');
                                        } 
                                        if (property[newPositionAfterRoll2].groupNumber == 0)
                                        {
                                            buyButton.disabled = true;
                                        }
                                        else {
                                            buyButton.disabled = false;
                                        }
                                        if (property[newPositionAfterRoll2].owner == this)
                                        {
                                            sellButton.disabled = false;
                                        }
                    }, 100);
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
        if (property[newPositionAfterRoll2].owner == this)
        {
            sellButton.disabled = false;
        }
        //checkValidSquareBuy(property[newPositionAfterRoll]);

        if (newPositionAfterRoll2 === 4)
        {
            this.cash -= 200
            updateCash(this);
            socket.emit('chat',this.name + ' paid $200 for a Parking Ticket!');
        } 
        if (newPositionAfterRoll2 === 38)
        {
            this.cash -= 100
            updateCash(this);
            socket.emit('chat',this.name + ' lost $100 gambling.. Unlucky!');
        }
        document.getElementById('sellButton').innerHTML = "Mortgage"; 
        if (property[newPositionAfterRoll2].owner != this) {
            sellButton.disabled = true; 
        }

        payRent(property[newPositionAfterRoll2], this);

//         // landing at the airport
//         if (newPositionAfterRoll2 === 30)
//         {
//             airport(this);
//         }

        //  If player lands on jail
        if ( this.inJail === false && newPositionAfterRoll2 === 10 ){
            //  Set player's jail attributes
            socket.emit('chat',this.name + ' is now in jail!  Unlucky!')
            this.inJail = true;
            this.turnsInJail = 0;
            // jailButton.disabled = false;
        }
            
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
            socket.emit('chat',this.name + " has bought " + square.name + " for $" + square.price + " (-)");
            //buyButton.disabled = true; 
            checkValidSquareMortgage(property[this.curCell], this);
            socket.emit('buy', this);
            let i = this.curCell; 
            let currentCellOwner = document.getElementById("cell" + i + "owner");
            currentCellOwner.style.display = "block"; 
            currentCellOwner.style.backgroundColor = this.color; 
			currentCellOwner.title = this.name;
            
        }
        else {
            alert("Unable to buy the property");
        }
    }
    // sell == mortgage - fix this for the next iteration
    // do we remove player color if we mortgage the property?
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
            socket.emit('chat',this.name + " has mortgaged " + square.name + " for $" + mortgageValue + " (+)");
        } else if (square.owner === this && square.mortgage === true) { 
            var confirmed = confirm("Are you sure you want to unmortgage this property?");
            if (confirmed) {
                var unmortgageValue = square.price * 0.60;
                this.cash -= unmortgageValue;
                updateCash(this);
                document.getElementById('sellButton').innerHTML = "Mortgage";
                socket.emit('chat',this.name + " has unmortgaged " + square.name + " for $" + unmortgageValue + " (-)");
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
    return current_server_turn_player_id;
}

function getCurrentPlayerName() {
    return current_server_turn_player;
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
    if (square.owner === player.name) {
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
    socket.emit('updateCash', player)

    return;
};
function updateEstateValue(player){
    player_estate_value = document.getElementById("player_estate_value_" + player.playerNumber);
    player_estate_value.innerHTML = player.estate_value;
}
function updateTurn()
{
    turn = (turn + 1) % log_in_players.length;
    totalTurn++;
    // if (totalTurn >= 5)
    // {
    //     endGame();
    // }
    socket.emit('updateTurn', turn)
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

function payRent(square, player) {
    //  TODO: calculate special railroad rent
    // also need to determine if the square has any houses on it
    rent = square.baserent; 
    if (square.owner != 0 && square.mortgage === false) {
        if (square.owner != player) {
            let player2 = square.owner; 
            player.cash -= rent; 
            player2.cash += rent; 
            socket.emit('chat',player.name + " payed $" + rent + " to " + player2.name);
            updateCash(player);
            updateCash(player2);
        }
    }
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
    var player2Cell = document.getElementById("player2properties");
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

// from stackOverflow: 
// https://stackoverflow.com/questions/1484506/random-color-generator
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function endGame()
{
    // get the player number of the winner
    var winner = getWinner() + 1;

    var board = document.getElementById('board');
    var chat = document.getElementById('chatBox');
    board.style.display = 'none';
    chat.style.display = 'none';
    var text = document.getElementById('endGame');
    text.innerHTML = 'GAME OVER <br> Player ' + winner + ' is the Winner';
    text.style.display = 'block';

    // let data;
    // $.ajax({
    //     url: "/update_winning_player"
    //     , context: this
    //     , async: false
    //     , success: function(result) {
    //         data = result;
    //     }
    // })

};
function getWinner(){
    var max = 0;
    for (var i = 0; i < log_in_players.length - 1; i++)
    {
        for (var j = i + 1; j < log_in_players.length; j++)
        {
            if ((log_in_players[j].cash + log_in_players[j].estate_value) > (log_in_players[i].cash + log_in_players[i].estate_value))
            {
                max = j;
            }
        }
    }
    return max;
}

window.onload = function () {
    document.getElementById('control').style.display = 'inline-block';
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
function whenAtchanceCard(){
   
    $('.card').toggleClass('flipped'); //flip to chancecard;
     
    console.log(imagearray);
   
    if (imagearray.length == 0){  
         var element=document.getElementById('cardImage');
    element.src="/images/end.jpg"
    sleep(3500).then(() => {
        // Do something after the sleep!
        $('.card').toggleClass('flipped');
    });

    }

   if(imagearray.length != 0){
    sleep(3500).then(() => {
        // Do something after the sleep!
        $('.card').toggleClass('flipped'); // flip it back;
    });
        var element=document.getElementById('cardImage');
        var x = Math.floor((Math.random() * imagearray.length));
        element.src=imagearray[x];
        if(imagearray[x] == "/images/c1.png"){
            //   //collect 50  
            console.log("It is c1");
            imagearray.splice(x, 1);
            return 1;
          
        }
        else   if(imagearray[x] == "/images/c2.png"){
            //   //collect 50  
            console.log("It is c2");
            imagearray.splice(x, 1);
            return 2;
          
        }
        else if(imagearray[x] == "/images/c3.png"){ 
            //go 3 blocks backwards
            console.log("Entering c3");
            imagearray.splice(x, 1);
            return 3
    
           


            
        }
        else if(imagearray[x] == "/images/c4.png"){
            console.log("It is c4");
            //pay 75

            imagearray.splice(x, 1);
            return 4;
        }
        else if(imagearray[x] == "/images/c5.png"){
            console.log("It is c5");
            //collec 100
            imagearray.splice(x, 1);
            return 5;
        }
        // else if(imagearray[x] == "/images/c6.png"){
        //     console.log("It is c6");
        //     //pay each player 25

        // }
        else if(imagearray[x] == "/images/c7.png"){
            console.log("It is c7");
            //pay 500
       
            imagearray.splice(x, 1);
            return 7;
        }
 
        else if(imagearray[x] == "/images/c9.png"){
            console.log("It is c9 and ");
            //go to jail
     
            imagearray.splice(x, 1);
            return 9;
        }
        // else if(imagearray[x] == "/images/c10.png"){
        //     console.log("It is c10");
        //     //get out of jail card, keep the card
        // }
        else if(imagearray[x] == "/images/c11.png"){
            console.log("It is c11");
            //get 45
            // player.cash +=40;
            // updateCash(player);
            // addToGameLog(player.name + ' Gained $45');
            imagearray.splice(x, 1);
            return 11;
        }
        else if(imagearray[x] == "/images/c12.png"){
            console.log("It is c12");
            //get 0
            // addToGameLog(player.name + ' Gained 0');
            imagearray.splice(x, 1);
            return 12;
        }
        else if(imagearray[x] == "/images/c13.png"){
            console.log("It is c13");
            //pay 25
     
            imagearray.splice(x, 1);
            return 13;
            
        }
        else if(imagearray[x] == "/images/c14.png"){
            console.log("It is c14");
            //GO to jail, do not pass GO, do not collect 200
            imagearray.splice(x, 1);
            return 14;
        }else if(imagearray[x] == "/images/c15.png"){
            console.log("It is c15");
            //pay 150
    
            imagearray.splice(x, 1);
            return 15;
            
        }
    

        
     
      
    } 



}


// ----------------------------------- Networking ------------------------------------------
var displayed_players = [];
var log_in_players = [];
var playerName;
var current_server_turn_player = "";
var current_server_turn_player_id = -1;
var player_color; 

function createPlayer(){
    // creating players
    for(let i = 0; i < log_in_players.length; i++){
        if(!displayed_players.includes(log_in_players[i].name)){
            player_color = getRandomColor(); 
            log_in_players[i].color = player_color; 
            player_num = i+1
            player_name = document.getElementById("player_name_" + player_num);
            player_name.innerHTML = log_in_players[i].name;
            log_in_players[i].playerNumber = i + 1;

            player_picture = document.getElementById("player_picture_" + player_num);
            var character_img2 = document.createElement("img");
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
    console.log("update"+name);
    let current_player;
    for(let i=0; i<log_in_players.length; i++){
        if(log_in_players[i].name == name){
            current_player = log_in_players[i];
        }
    }
    
    if(data.status != undefined){
        let player_status = document.getElementById("player_status_" + current_player.picture);
          player_status.style.fontWeight = 'bold';
          player_status.style.color = 'red';
          player_status.innerHTML=(data.status);
    }
    if(data.positionToMove != undefined){
        current_player.updatePosition(data.positionToMove);
    }
    if (current_player.curCell != property[current_player.curCell]) {
        document.getElementById('buyButton').disabled = true; 
    }
}

//send socket.id to server for identification
socket.on('connect', function(data) {
    socket.emit('getPlayerName',socket.id);
});

//tell client who I am
socket.on('set_player_name',function(data){
    playerName = data;
})

//display concurrent connected clients
socket.on('clientChange', function (clientNum) {
    document.querySelector("#clients").innerHTML = "Online players:" + clientNum;
});

socket.on('connected', function(data){
	var msg = data + " has connected!!";
	socket.emit('chat',msg);
});

socket.on('updateTurn', function(data){
    turn = data;
})

socket.on('updateCash', function(player)
{
    player_money = document.getElementById("player_money_" + player.playerNumber);
    player_money.innerHTML = player.cash;
})

socket.on('buy', function(player){
    updatePlayerPropertyOwned(player);
    let i = player.curCell; 
    property[i].owner = player; 
    let currentCellOwner = document.getElementById("cell" + i + "owner");
    currentCellOwner.style.display = "block"; 
    currentCellOwner.style.backgroundColor = player.color; 
    currentCellOwner.title = player.name;
})

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
});


// tell clients all the players logged in the server
socket.on('get_all_players',function(data){    
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

// add message to game log
socket.on('message',function(message){
	addToGameLog(message);
});


//disconnect from game
socket.on('dis', function(data){
	var msg = data + " has disconnected!!";
    addToGameLog(msg);
});

//update game status, for instance, who is playing
socket.on('updateState',function(data){
    document.querySelector("#turn_info").innerHTML = "Playing:" + data.playerName;
    current_server_turn_player = data.playerName;
    current_server_turn_player_id = data.id;
    console.log("turn:"+current_server_turn_player+" "+current_server_turn_player_id);
    if(data.playerName == playerName){
        document.getElementById("endTurnButton").disabled = false;
        document.getElementById("throw").disabled = false;
    }else{
        document.getElementById('endTurnButton').disabled = true;
        document.getElementById('throw').disabled = true;
    }
});


socket.on('gameStart',function(){
    //prepare the game board
    set_up_game_board();
    
    //take out ready button
    let ready_button = document.querySelector("#readyButton");
    ready_button.parentNode.removeChild(ready_button);
    
    //display board
    document.getElementById("board").style.display = "table";
    document.getElementById("turn_info").style.display = "initial";
    
    //close spots which are not filled
    for(let i=log_in_players.length+1;i<5;i++){
        let tmp= document.getElementById("player_holder"+i);
        tmp.innerHTML = "";
    }
    socket.emit('playerAfterReady',playerName);
    socket.emit('initializeGameAvastar');
});

//intialize avastars on the first square
socket.on('initializeClientAvastar',function(){
    for(let i = 0; i< log_in_players.length; i++){
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

//tell server to switch to another player when end turn button is clicked
function end_turn_click(){
    socket.emit('switchPlayer');
}

//grab data from server and update player on the game board accordingly
socket.on('update_player',function(data){
    updatePlayer(data.name,data.info);
});

//disable ready button after click
function ready_button_click(){
    document.querySelector("#readyButton").disabled = true;
    socket.emit('playerReady',playerName);
}

// ----------------------------------- Networking ------------------------------------------
// ========================chat Box functionality =======================
// var socket = io.connect('http://localhost:8080');

// $('form').submit(function(e){
//     e.preventDefault(); // prevents page reloading
//     socket.emit('chat_message', $('#txt').val());
//     $('#txt').val('');
//     return false;
// });
//     // append the chat text message
//     socket.on('chat_message', function(msg){
//         $('#messages').append($('<li>').html(msg));
//         var Log = document.getElementById('messageDisplay');
//         Log.scrollTop = Log.scrollHeight;
//     });
//     // append text if someone is online
//     socket.on('is_online', function(username) {
//         $('#messages').append($('<li>').html(username));
//     });
//     // NEED TO FIGURE OUT A WAY TO GET THE PLAYERS NAME FOR CHATTING
//     // var username = 'player';
//     // socket.emit('username', username);


