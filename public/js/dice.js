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
//}

$("#throw").click(function() {
    $(".dice").addClass('shake')
    setTimeout(function() {
        $(".dice").removeClass('shake')
    }, 1800)
})

async function throwDice() {
    // Disable the button so user can't keep pressing it
    document.getElementById("throw").disabled = true

    var double = await rollDice()

    if ((double == 1) && (doubleCount < 2)) {
        doubleCount++
        alert('Doubles!  Roll again!')
    } else {
        doubleCount = 0
    }

    if (doubleCount == 3)
        alert('You rolled doubles 3 times!  To jail you go!')

    // Re-enable the button
    document.getElementById("throw").disabled = false
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
