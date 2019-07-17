const express = require('express')
var cors = require('cors')
const path = require('path')
const PORT = process.env.PORT || 5000

const app = express()

const { Pool } = require('pg');

// //// use this for testing
// var pool = new Pool({
//   host: 'localhost',
//   database: 'postgres'
// });

// use this block for heroku app
const pool = new Pool({
 connectionString: process.env.DATABASE_URL
});

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
       var results = { 'results': (result.rows[0].username) ? result.rows : [] };
       res.render('pages/adminPage', results);
     }
     if (userType === 'user')
     {
       res.render('pages/gamePage',{player});
       //res.render('pages/openingPage');
     }
        //res.render('pages/gamePage',{player});
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


// handles errors
app.use(function(error, req, res, next) {

    res.json({ message: error.message });
  });

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

module.exports = app;
