// creating player class
function Player(name, cash, pic, id) {
  this.name = name;
  this.cash = cash; // amount of cash available
  this.id = id;   //unique id
  this.pic = pic; //profile pic
  this.currentPosition = ; //current position (id/number) in board
}

// todo
// movePlayer -> logic implementation started, but needs to be integrated with the rest of the code
// buy property
// trade with players

// usage -> player1.movePlayer() ??
function movePlayer() {
  // number of steps to move (dice roll number)
  let stepsToMove = ; 

  // get current player location
  let currentPlayerPosition = this.currentPosition;  //get current position

  // get the new position 
  // use current board number/id + roll number 
  let newPositionAfterRoll = getNewPositionAfterRoll(currentPlayerPosition, stepsToMove);
  
  // update the current player location from old position, need to update pictures on board as well
  currentPlayerPosition = newPositionAfterRoll;
}

function getNewPositionAfterRoll(currentPlayerPosition, diceRoll) {
  let newPosition = currentPlayerPosition + diceRoll; 
  return newPosition;
}
