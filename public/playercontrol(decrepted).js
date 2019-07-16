// // need to migrate everything to game_logics eventually
// var boardLength = 39;

// const buyButton = document.getElementById('buyButton');
// const sellButton = document.getElementById('sellButton');

// buyButton.addEventListener('click', function(e){
//   //buy funcion
//   // console.log('button was clicked');
//   // how to get this property 
//   var playerPosition = getPlayerPosition();
//   var square = property[playerPosition];
//   if (property.owner != 0) {
//     alert("This property is already owned"); //add this to gamelog
//   }
//   if (Player.cash >= property.price) {
//     var confirmed = confirm("Are you sure you want to buy this property?");
//     if (confirmed) {
//       //attempt to buy the property
//       Player.buyProperty();
//     }
//   } else {
//     alert("You do not have the funds to buy the property"); //add to gamelog
//     addToGameLog("You do not have the funds to buy the property");
//   }
  
  
// });

// sellButton.addEventListener('click', function(e){
//   //sell funcion
// });

// // creating player class
// class Player {
//   constructor(name, picture) {
//     this.name = name;
//     this.cash = 1500;
//     this.picture = picture;
//     this.position = 0;
//     // what other attributes we need?
//   }

//   movePlayer(stepsToMove = 0) {
//     // get current player location
//     let currentPlayerPosition = this.id.position;
//     // get newPosition after roll
//     let newPositionAfterRoll = currentPlayerPosition + stepsToMove; 
//     //update cash if the player completes one lap around the board
//     if (newPositionAfterRoll >= boardLength) { //makes full revolution
//       this.cash += 200;
//     }
//     // update player current position
//     this.id.position = newPositionAfterRoll;
//   }
  
  // logic not complete
  // buyProperty(property) {
  //   // double check, the if statement should be redundent
  //   if (property.owner === 0) {
  //     // update the square owner property to this player, is this doable in js?
  //     property.owner = this;
  //     // subtract the cash from player
  //     this.cash -= property.price; 
  //     // else if this is already owned by another player
  //     // continue
  //   } else {
  //     alert("Unable to buy the property");
  //   }
//   }

  // sellProperty(property) {
  //   //check if this player owns the property
  //   if (property.owner === this) {
  //     // update the owner to null/no one
  //     property.owner = 0; 
  //     // add half the cash to player
  //     this.cash += (property.price)*0.50; 
  //     // else if this is already owned by another player
  //     // continue
  //   } else {
  //     alert("Unable to sell the property");
  //   }
  // }

//   getPlayerPosition() {
//     return this.position;
//   }

//   // todo
//   // trade
//   // tax
//   // jail

// }

// // module.exports = PlayerControl;