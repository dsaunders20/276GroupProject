var boardLength = 39;

// creating player class
class Player {
  constructor(name, picture) {
    this.name = name;
    this.cash = 1500;
    this.picture = picture;
    this.position = 0;
    // what other attributes we need?
  }

  movePlayer(stepsToMove = 0) {
    // get current player location
    let currentPlayerPosition = this.id.position;
    // get newPosition after roll
    let newPositionAfterRoll = currentPlayerPosition + stepsToMove; 
    //update cash if the player completes one lap around the board
    if (newPositionAfterRoll >= boardLength) { //makes full revolution
      this.cash += 200;
    }
    // update player current position
    this.id.position = newPositionAfterRoll;
  }
  
  // logic not complete
  buy(square) {
    if (this.id.position === square.id) {
      // check owner
      // if no owner buy the field
      square.owner = this;
      this.cash -= square.cost; //assuming there is a class called square with these properties
      // else if this is already owned by another player
      // continue
    }
  }
  // todo
  // trade
  // tax
  // jail

}

module.exports = PlayerControl;