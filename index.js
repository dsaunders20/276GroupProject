const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const app = express()

const { Pool } = require('pg');
const pool = new Pool({

  connectionString: process.env.DATABASE_URL

});

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))

// when a user registers for the first time
app.post('/signup', function(req, res){
  //console.log(req.body);
  var username = req.body.username;
  var password = req.body.password;

  // need to check if the username already exists in the database, reject 

  var query = "INSERT INTO users (username, password) VALUES ($1, $2)";

  pool.query(query, [username, password], (error, result) => {
      if (error) {throw error}
      //console.log(result);
  }); 
  res.redirect('/');
});

// user trying to login
app.post('/login', function(req, res, next){
  console.log(req.body.username);
  var req_username = req.body.username;
  var req_password = req.body.password;

  var query1 = "SELECT username from users";

  pool.query(query1, (error, result) => {
    var found = false;
    for( var i = 0; i < result.rows.length; i++) {
      if (result.rows[i].username === req_username) 
      {
          found = true;
          break;
      }
    }
    if (found === false)
    {
    res.redirect('/failedLogin');
    }
    if (found === true)
    {
      // need to include a query here to find the username and match the passwords
      // the query2 below may help
      res.redirect('/');
    }
  });
});

  // var query2 = "SELECT * from users where username = ($1)";

  // pool.query(query, [req_username], (error, result) => {
  //   //console.log(result);
  //   if (error){
  //     res.redirect('/');
  //   }
  //     if (result.rows[0].username == req_username && result.rows[0].password == req_password)
  //     {
  //       res.redirect('/');
  //     }
  //     else
  //     {
  //     res.redirect('/failedLogin')
  //     }
  // }); 
  //res.redirect('/');
//});

app.get('/failedLogin', (req, res) => res.render('pages/failedLogin'))



app.use(function(error, req, res, next) {
    // Any request to this server will get here, and will send an HTTP
    // response with the error message 'woops'
    res.json({ message: error.message });
  });

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
