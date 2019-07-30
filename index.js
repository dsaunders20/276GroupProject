const express = require('express')
var http = require('http');
const app = express();
var cors = require('cors')
const path = require('path')
const PORT = process.env.PORT || 5000;   


const { Pool } = require('pg');

//networking libraries
var http = require('http');
var server = http.createServer(app).listen(PORT);
var io = require('socket.io')(server);
console.log('Server hosted at port:' + PORT);
var browserSession = require('browser-session-store')

// // use this for testing
  var pool = new Pool({
    host: 'localhost',
    database: 'postgres'
  });

//for Michael
//const pool = new Pool({
//  user: 'postgres',
//  password: 'root',
//  host: 'localhost',
//  database: 'postgres'
//});
// use this block for heroku app

//const pool = new Pool({
//connectionString: process.env.DATABASE_URL
//});


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/', cors());
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => res.render('pages/login'))
app.get('/login', (req, res) => res.render('pages/login'))
app.get('/signup', (req, res) => res.render('pages/signup'))

// when a user registers for the first time
app.post('/signup', function(req, res){
  //console.log(req.body);
  var req_username = req.body.username;
  var req_password = req.body.password;

  // need to check if the username already exists in the database, reject 
  var query1 = "SELECT username from users";

  pool.query(query1, (error, result) => {
    if (error) {throw error}
    var found = false;
    
    if(result != null){
        for( var i = 0; i < result.rows.length; i++) {
          if (result.rows[i].username === req_username) 
          {
              // username is taken
              found = true;
              break;
          }
        }
    }
    if (found === true)
    {
      res.render('pages/failedSignUp')
    }
    if (found === false)
    {
      var query = "INSERT INTO users (username, password,type) VALUES ($1, $2,'user')";

      pool.query(query, [req_username, req_password], (error, result) => {
          if (error) {throw error}
          //console.log(result);
          res.render('pages/successfulSignup');
      }); 
    }
  })
});

// user trying to login
app.post('/login', function(req, res, next){
  //console.log(req.body.username);
  var req_username = req.body.username;
  var req_password = req.body.password;

var query1 = "SELECT username, password, type from users";
  // var query1 = "SELECT username, password from users";
  var player;
  pool.query(query1, (error, result) => {
    if (error) {throw error}
    var found = false;
    for( var i = 0; i < result.rows.length; i++) {
      if (result.rows[i].username === req_username && result.rows[i].password === req_password) 
      {
          // valid account is found
          found = true;
          player = result.rows[i];
         var userType = result.rows[i].type;
          break;
      }
    }
    // account was not found
    if (found === false)
    {
    res.redirect('/failedLogin');
    }
    // determine whether account is user or admin
    if (found === true)
    {
     if (userType === 'admin')
     {
       browserSession.put('user', req_username);
       var results = { 'results': (result.rows[0].username) ? result.rows : [] };
       res.render('pages/adminPage', results);
     }
     if (userType === 'user')
     {
       browserSession.put('user', req_username);
       res.render('pages/gamePage',{player});
       
     }
    }
  });
});


app.get('/failedLogin', (req, res) => res.render('pages/failedLogin'))

app.get('/fetch_players_info',function(req,res,next){
    let query = "SELECT * FROM users WHERE TYPE ='user' ";
    pool.query(query,(error, result)=>{
        if(error) {throw error}  
        let results = [];
        for( i = 0; i< result.rows.length; i++){
            var obj = {};
            obj.username = result.rows[i].username
            //player's avatar, will change later
            obj.picture = i + 1
            results.push(obj)
        }
        //json_obj = JSON.stringify(results);
        res.send(results)
    });

});



// app.get('/update_winning_player', function(req, res, next){
//   let query = 'update users set wins
// })


// handles errors
app.use(function(error, req, res, next) {

    res.json({ message: error.message });
  });

/////////////////////////////////////////////////
var player_list = {};
var player_ready_list= [];
var log_in_players = [];
var clients = 0;
var current_player_id = 1;
//0 => game does not start; 1=> game has started; -1 => game has ended;
var game_status = 0;
var server_round_num = 1;
var game_end_after_round = 10;
var if_game_start = false;


function switchPlayer(current_player_id, player_list){
    if(current_player_id < Object.keys(player_list).length){
                current_player_id += 1;
    }else{
                server_round_num += 1;
                current_player_id = 1;
                
    }
    return current_player_id;
}

io.on('connection', function(socket){
    var playerName;
    var if_new_player = true;

    if(if_game_start == false){
        clients += 1;

        socket.emit('clientChange',clients);
        socket.broadcast.emit('clientChange',clients);


        browserSession.get('user', function(err, value){
           playerName = JSON.stringify(value);
           let temp = clients;

           socket.emit('connected',playerName);
           socket.broadcast.emit('connected',playerName);


           if(player_list[playerName] == undefined){
               player_list[playerName] = socket.id;
            }

            for(i=0; i< log_in_players.length; i++){
                if(log_in_players[i].playerName == playerName){
                    if_new_player = false;
                    break;
                }
            }
                let temp_obj = {};
                temp_obj.playerName = playerName;
                temp_obj.picture = clients; 
                log_in_players.push(temp_obj);

            socket.emit('update_log_in_player',temp_obj);
            socket.broadcast.emit('update_log_in_player',temp_obj);

        });
    }
    
    socket.on('throwDice', function(d0,d1){;
        socket.broadcast.emit('diceThrown', d0,d1);
    })

    socket.on('makeRandNum', function() {
      let img_array = [1,4,5,7,11,12,13,15];
      var r = img_array[Math.floor((Math.random() * img_array.length))-1];
      socket.emit('getRandNum', {r:r,player_id:current_player_id});
      socket.broadcast.emit('getRandNum', {r:r,player_id:current_player_id});
    })
    
    socket.on('getAllPlayers',function(){
       console.log(log_in_players);
       socket.emit('get_all_players',log_in_players);
       socket.broadcast.emit('get_all_players',log_in_players);
    });

    socket.on('getPlayerName',function(socket_id){
        let tmp_player_name = Object.keys(player_list).find(key => player_list[key] === socket_id);
        socket.emit('set_player_name',tmp_player_name);
    })


    socket.on('chat', function(message){
       socket.emit('message', message);
//       socket.broadcast.emit('message', message); 
    });
    
    socket.on('chat_broadcast', function(message){
//       socket.emit('message', message);
       socket.broadcast.emit('message', message); 
    });
    
    if(if_game_start == false){
        socket.on('disconnect', function () {
            if(if_game_start == false){
                clients--;
                delete player_list[playerName];

                //update the user states.
                socket.emit('dis', playerName);
                socket.broadcast.emit('dis', playerName);
                socket.broadcast.emit('clientChange', clients);
            }
        });
    }
    
        socket.on('initializeGameAvastar',function(){
            socket.emit('initializeClientAvastar');
//            socket.broadcast.emit('updateAvastar');        
        });
    
    
    if(player_list){
        socket.emit('updateState', {
            player: player_list[Object.keys(player_list)[current_player_id - 1]],
            playerName: Object.keys(player_list)[current_player_id - 1],
            status: 1,
            id:current_player_id,
        });
        socket.broadcast.emit('updateState', {
            player: player_list[Object.keys(player_list)[current_player_id - 1]],
            playerName: Object.keys(player_list)[current_player_id- 1],
            status: 1,
            id:current_player_id,
        });
    }
    
    //switch turn and tells client who is playing
    socket.on('switchPlayer', function(){
        if(game_status == 1){
            current_player_id = switchPlayer(current_player_id,player_list);
            if(server_round_num > game_end_after_round){
                game_status = -1;
                socket.emit('gameOver');
                socket.broadcast.emit('gameOver')
            }
            
            socket.emit('updateState', {
                player: player_list[Object.keys(player_list)[current_player_id - 1]],
                playerName: Object.keys(player_list)[current_player_id - 1],
                status: 1,
                roundNum:server_round_num,
                id:current_player_id,
            });
            socket.broadcast.emit('updateState', {
                player: player_list[Object.keys(player_list)[current_player_id - 1]],
                playerName: Object.keys(player_list)[current_player_id - 1], 
                status: 1,
                roundNum:server_round_num,
                id:current_player_id,
            });
        }
    });
        
        

//    socket.on('updateTurn', function(turn){
//      socket.broadcast.emit('updateTurn', turn);
//    });
    
    socket.on('updateCash', function(player){
      socket.broadcast.emit('updateCash', player)
    });

    socket.on('updateEstateValue', function(player)
    {
      socket.broadcast.emit('updateEstateValue', player)
    })

    socket.on('updateProperties', function(player){
      socket.broadcast.emit('updateProperties', player)
    })

    socket.on('buy', function(player){
      socket.broadcast.emit('buy', player)
    });

    socket.on('sell', function(player){
      socket.broadcast.emit('sell', player)
    });

    socket.on('unsell', function(player){
      socket.broadcast.emit('unsell', player)
    });

    //check if all logged in players are ready
    socket.on('playerReady',function(name){
        let if_ready = false;
        for(let i = 0; i<player_ready_list.length;i++){
            if(player_ready_list[i] == name){
                if_ready = true;
                break;
            }
        }
        if(!if_ready){
            player_ready_list.push(name);
        }
        
        let data = {};
        data.name = name;
        data.info ={};
        data.info.status = "Ready!";
        socket.emit('update_player',data);
        socket.broadcast.emit('update_player',data);
        
        //start a new game if all log_in_players are in 'ready' status
        if(player_ready_list.length == log_in_players.length && player_ready_list.length >= 2){
            socket.emit('gameStart');
            socket.broadcast.emit('gameStart');
            if_game_start = true;
            game_status = 1;
        }
    });
    
    //update clients when they click 'Ready' button
    socket.on('playerAfterReady',function(name){
            let data2 = {};
            data2.name = name;
            data2.info ={};
            data2.info.status = "Playing";
            socket.emit('update_player',data2);
            socket.broadcast.emit('update_player',data2); 
    });

    //update clients after a certain client rolls the dice
    socket.on('afterDiceRoll',function(name,move){
        let data = {};
        console.log(name);
        data.name = name;
        data.info = {};
        data.info.positionToMove = move;
        socket.broadcast.emit('update_player',data); 
    });

// ==============NETWORKING FOR CHAT BOX===================
// inspired by https://itnext.io/build-a-group-chat-app-in-30-lines-using-node-js-15bfe7a2417b
    socket.on('username', function(username) {
      socket.username = username;
      io.emit('is_online', '<i>' + socket.username + ' joined the chat..</i>');
  });

    socket.on('disconnect', function(username) {
    io.emit('is_online', '<i>' + socket.username + ' left the chat..</i>');
  });
    socket.on('chat_message', function(message) {
    io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
  });
});

/////////////////////////////////////////////////

module.exports = app;
