var boardLength = 39;

// creating player class
class Player {
  constructor(name, picture, playerNumber) {
    this.name = name;
    this.cash = 1500;
    this.picture = picture;
    // this.prevCell = 0;
    this.curCell = 0;
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
      addToGameLog('You made it around the board! Collect $200!');
    }
    // update player current position
    return (newPositionAfterRoll % boardLength);
  }

  movePlayer() {
    // get the cell numbers
    var oldCellNum = this.curCell;
    var newCellNum = this.updatePosition();

    // get the innerHTML of the table inside the cell
    var pic = document.getElementById('cell'+m+'grid'+this.playerNumber).innerHTML;

    // move the innerHTML of the table inside the cell to the same table in the next cell
    var m = oldCellNum;

    var interval = setInterval(() => {
      // Re-enable the button
      if (m == newCellNum) {
        document.getElementById("throw").disabled = false;
      }
      // Move character one square at a time from old position to new position
      if (lap == false) {
        if ((m % boardLength) < newCellNum) {
            document.getElementById('cell'+m+'grid'+0).innerHTML = '';
            m = ((m+1) % boardLength);
            document.getElementById('cell'+m+'grid'+0).innerHTML = pic;
        } else {
            oldCellNum = newCellNum;
            clearInterval(int);
        }
      } else {
          if ((m % boardLength) < newCellNum) {
              document.getElementById('cell'+m+'grid'+0).innerHTML = '';
              m = ((m+1) % boardLength);
              document.getElementById('cell'+m+'grid'+0).innerHTML = pic;
              lap = false;
          } else if (m == boardLength-1) { 
              document.getElementById('cell'+m+'grid'+0).innerHTML = '';
              m = 0; 
              document.getElementById('cell'+m+'grid'+0).innerHTML = pic;
              lap = false;
          } else if (m < boardLength) {
              document.getElementById('cell'+m+'grid'+0).innerHTML = '';
              m = ((m+1) % boardLength);
              document.getElementById('cell'+m+'grid'+0).innerHTML = pic;
          } else {
              lap = false;
              oldCellNum = newCellNum;
              clearInterval(int);
          }
        }
      }, 500);
    
    // I think below code needs players' avatars as Image objects

    /* 
    // get the old cell and new cell objects
    var oldCell = document.getElementById('cell' + oldCellNum + 'grid' + this.playerNumber);
    var newCell = document.getElementById('cell' + newCellNum + 'grid' + this.playerNumber);

    // get the positions of the old and new cell
    var oldCellLeft = oldCell.getBoundingClientRect().left;
    var OldCellTop = oldCell.getBoundingClientRect().top;
    var newCellLeft = newCell.getBoundingClientRect().left;
    var newCellTop = newCell.getBoundingClientRect().top;
    */
    

    this.curCell = newCellNum;
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