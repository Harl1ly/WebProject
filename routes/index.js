var express = require('express');
var router = express.Router();
var calendar = require('./calendar');

//Google API
const fs = require('fs');
const readline = require('readline');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('148368185397-82fl13lgha9mbjvp1c13j4b0no94fv0t.apps.googleusercontent.com');

//Nodemailer set up
var nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'edgar.cormier89@ethereal.email',
        pass: 'Xp6c9NP1hYgHVwea4p'
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Send email when event is created (CreateEvent.html)
router.post('/email', function(req,res,next) {
  //console.log("in email");
  req.pool.getConnection(function(err,connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT email FROM users WHERE username = ? ";
    connection.query(query, req.session.user_id, function(err,rows,fields) {
      connection.release();//release connection
      if(err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      var mail2send = rows[0].email;
      console.log(mail2send);
      let info = transporter.sendMail ({
        from: 'CattyPlanner@ethereal.email',
        to: mail2send,
        subject: "NEW EVENT from CattyPlanner",
        text: "You just create an event!",
      });
      console.log("send successfully");
    });
    res.end();
  });
});

//Check if user is logged in (Most html file)
router.get('/islogin', function(req, res, next) { 
  if (req.session.user_id) {
    res.send("true");
  }else {
    res.send("false");
  }
});

//Sign up new user (Sign_up.html)
router.post('/adduser', function(req,res) {
  var first = req.body.firstname;
  var last = req.body.lastname;
  var user = req.body.username;
  var email = req.body.email;
  var pass = req.body.password;
  const obj = [user, first, last, email, pass];

  req.pool.getConnection(function(err,connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "INSERT INTO users (username, first_name,last_name, email, password) VALUES (?, ?, ?, ?, ?);";
    connection.query(query, obj, function(err,rows,fields) {
      connection.release();//release connection
      if(err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      req.session.user_id = rows.username;
      console.log(req.session.user_id);
      res.end();
    });
  });
});

//User log in (log_in.html)
router.post('/log', function(req, res) {
  console.log(req.body.id_token);
  //Log in via Gmail
  let gmail = null;
  if('id_token' in req.body) {
    async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: req.body.id_token,
      audience: '148368185397-82fl13lgha9mbjvp1c13j4b0no94fv0t.apps.googleusercontent.com',
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    console.log(userid);
    gmail = payload['email'];
  }
    verify().then(function(){
      req.pool.getConnection(function(err,connection) {
        if (err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        //Check if user exits in our system
        var query = "SELECT username, first_name, last_name, email, contact_number FROM users WHERE email = ? ";
        connection.query(query, gmail, function(err,rows,fields) {
          connection.release();
          if(err) {
            console.log(err);
            res.sendStatus(500);
            return;
          }
          if(rows.length > 0) {
            console.log('google login success');
            req.session.user_id = rows[0].username;
            console.log(req.session.user_id);
            res.sendStatus(200);
            return;
          }else {
            console.log("bad login: wrong account or not yet an account");
              res.sendStatus(401);
          }
        });
      });
    }).catch(function(){
      res.sendStatus(403);
    }); 
  }

  //Log in using username and password
  if (req.body.ulog) {
    var ulog = req.body.ulog;
    var plog = req.body.plog;

    req.pool.getConnection(function(err,connection) {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      var query = "SELECT password FROM users WHERE username = ? ";
      connection.query(query, ulog, function(err,rows,fields) {
        connection.release();
        if(err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }
        if (rows[0].password === plog) {
          console.log("log in successful");
          //store username and you can call req.session in other functions
          req.session.user_id = ulog;
          console.log(req.session.user_id);
          res.redirect('Account.html');
          return;
        }else {
          console.log(rows[0]);
          console.log("password incorrect");
          res.sendStatus(401);
        }
        res.end();
      });
    });
  }
});

//Create new event (CreateEvent.html)
var e_id;
router.post('/addevent', function(req,res) {
  let num = req.body.strnum;
  let name = req.body.strn;
  let city = req.body.city;
  let postc = req.body.postc;
  let adr = [num, name, city, postc];

  let en = req.body.ename;
  let type = req.body.stype;
  console.log(type);
  let date = req.body.date;
  let time = req.body.time;
  let event = [en, type, date, time];

  req.pool.getConnection(function(err,connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var address_query = "INSERT INTO address (street_number, street_name, city, post_code) VALUES (?, ?, ?, ?);";
    connection.query(address_query, adr, function(err,rows,fields) {
      if(err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
        var event_query = "INSERT INTO event_details (event_name, event_type, date, time, address_id) VALUES (?, ?, ?, ?, LAST_INSERT_ID());";
          connection.query(event_query, event, function(err,rows,fields) {
            if(err) {
              console.log(err);
              res.sendStatus(500);
              return;
            }
              var link_query = "SELECT event_id FROM event_details WHERE event_name = ? ORDER BY event_id DESC;";
                connection.query(link_query, en, function(err,rows,fields) {
                if(err) {
                  console.log(err);
                  res.sendStatus(500);
                  return;
                }else {
                  e_id = rows[0].event_id;
                }
                  var event_user = [e_id,req.session.user_id];
                  var link_query = "INSERT INTO event (event_id, username) VALUES (?, ?);";
                    connection.query(link_query, event_user, function(err,rows,fields) {
                    connection.release();
                    if(err) {
                      console.log(err);
                      res.sendStatus(500);
                      return;
                    }
                  res.end();
                });
              });
          });
       });
    });
});

//Generate a link for others to view event without account (event.html)
router.post('/glink', function(req,res,next) {
    if(!e_id) {
      alert("Please create your event!");
      return;
    }else {
    res.json(e_id);
  }
});

//Load page using the link (CreateEvent.html)
router.post('/event', function(req, res, next) {
  console.log(req.body.event_id);
  req.pool.getConnection(function(err,connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
  var link_query = "SELECT event_name, event_type, date, time FROM event_details WHERE event_id = ?";
  connection.query(link_query, req.body.event_id, function(err,rows1,fields) {
  if(err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }else {
    var row1 = rows1;
    var user_query = "SELECT first_name, last_name FROM users INNER JOIN event ON users.username = event.username INNER JOIN event_details ON event_details.event_id = event.event_id WHERE event_details.event_id = ?";
    connection.query(user_query, req.body.event_id, function(err,rows2,fields) {
      if(err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }else {
        var row2 = rows2;
        var evad_query = "SELECT street_number, street_name, city, post_code FROM address INNER JOIN event_details ON event_details.address_id = address.address_id WHERE event_details.event_id = ?";
        connection.query(evad_query, req.body.event_id, function(err,rows,fields) {
        connection.release();
        if(err) {
          console.log(err);
          res.sendStatus(500);
          return;
        }else {
          var rows2send = {'q1':row1, 'q2':rows2, 'q3':rows};
          res.json(rows2send);
        }
        });
      }
    });
  }
  });
});
});

//Add to google calendar (CreateEvent.html)
router.post('/addCal', function(req, res, next) { 
  let num = req.body.strnum;
  let name = req.body.strn;
  let city = req.body.city;
  let postc = req.body.postc;
  let adr = num + ' ' + name + ', ' + city + ', ' + postc;
  let en = req.body.ename;
  let type = req.body.stype;
  let date = req.body.date;
  const dateArray = date.split("");
  let newdate = dateArray[0] + dateArray[1] + dateArray[2] + dateArray[3] + dateArray[4] + dateArray[8] + dateArray[9] + dateArray[7] + dateArray[5] + dateArray[6];
  let time = req.body.time;
  var testEvent = {
    'summary': en,
    'location': adr,
    'description': type,
    'start': {
      'dateTime': newdate+'T'+time+':00'+'+09:30',
      'timeZone': 'Australia/Adelaide',
    },
    'end': {
      'dateTime': newdate+'T'+time+':00'+'+09:30',
      'timeZone': 'Australia/Adelaide',
    },
    'attendees': [],
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10},
      ],
    },
  };
  calendar.callApi(null, calendar.listEvents).then(u => {
  //check event: console.log(u);
  });
  calendar.callApi(testEvent, calendar.createEvent);
  console.log("add successfully!");
  res.end();
});

//To get user profile
router.post('/getuser', function(req, res) {
  req.pool.getConnection(function(err,connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT username, first_name, last_name, email, contact_number FROM users WHERE username = ? ";
    connection.query(query, req.session.user_id, function(err,rows,fields) {
      connection.release();
      if(err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      console.log(rows);
      res.json(rows);
    });
  });
});

//Show event list for user (myEvent.html)
router.post('/u_show_event', function(req, res, next){
  req.pool.getConnection(function(err,connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    var e_query = "SELECT event_details.event_type, event_details.event_name, event_details.date, event_details.time, address.street_number, address.street_name, address.city, address.post_code FROM event_details INNER JOIN address ON address.address_id = event_details.address_id INNER JOIN event ON event_details.event_id = event.event_id INNER JOIN users ON event.username = users.username WHERE users.username = ?;";
    connection.query(e_query, req.session.user_id, function(err,rows,fields) {
      connection.release();
      if(err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

//Show specific event selected (myEvent.html)
router.post('/search_event', function(req, res, next){
  var es = req.body.es;
  req.pool.getConnection(function(err,connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT event_type, event_name, date, time FROM event_details INNER JOIN event ON event_details.event_id = event.event_id INNER JOIN users ON event.username = users.username WHERE event_name = ?;";
    connection.query(query, es, function(err,rows,fields) {
      connection.release();
      if(err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      console.log(rows);
      res.json(rows);
    });
  });
});

//Update user profile details (Account.html)
router.post('/edituser', function(req, res) {
  let firstE = req.body.firstnameE;
  let lastE = req.body.lastnameE;
  let userE = req.body.usernameE;
  let emailE = req.body.emailE;
  let mobE = req.body.mobileE;
  const objE = [firstE, lastE, emailE, mobE, userE];

  req.pool.getConnection(function(err,connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "UPDATE users SET first_name = ?, last_name = ?, email = ?, contact_number = ? WHERE username = ? ";
    connection.query(query, objE, function(err,rows,fields) {
      connection.release();
      if(err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      res.end();
    });
  });
});

//Update event details (myEvent.html)
router.post('/editevent', function(req, res) {

  let e1 = req.body.e1;
  let e2 = req.body.e2;
  const obje = [e1,e2,e2];
  req.pool.getConnection(function(err,connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "UPDATE event_details SET event_type = ?, event_name = ? WHERE event_name = ? ";
    connection.query(query, obje, function(err,rows,fields) {
      connection.release();
      if(err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      res.end();
    });
  });

  //Send an email to inform user about event update after they finish editing
  req.pool.getConnection(function(err,connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT email FROM users WHERE username = ? ";
    connection.query(query, req.session.user_id, function(err,rows,fields) {
      connection.release();
      if(err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      var mail2send = rows[0].email;
      console.log(mail2send);
      let info = transporter.sendMail ({
      from: 'CattyPlanner@ethereal.email',
      to: mail2send,
      subject: "UPDATED EVENT from CattyPlanner",
      text: "Your event details has been updated, please check!",
      });
     console.log("mail send successfully");
    });
    res.end();
  });
});

//Log out (Account.html)
router.post('/logout', function(req, res) {
    delete req.session.user_id;
    res.end();
});


/* MANAGER */

/*
router.post('/show_accout_details', function(req, res, next){
  req.pool.getConnection(function(err,connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    var query = "SELECT username, first_name, last_name, email, contact_number FROM users WHERE username = ? ";
    connection.query(query, req.session.user_id, function(err,rows,fields) {
      connection.release();
      if(err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      console.log(rows);
      res.json(rows);
    });
  });
});
*/

//Add system admin if keyword matched (admin_sign_up.html)
router.post('/add_manager', function(req, res, next){
  var m_name = req.body.m_name;
  var m_pass = req.body.m_pass;
  var m_key = req.body.m_key;
  const m = [m_name, m_pass];

  if(m_key != "nekopunch") {
    res.sendStatus(403);
    return;
  }

  req.pool.getConnection(function(err,connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    var query = "INSERT INTO manager (managername, password) VALUES (?, ?);";
    connection.query(query, m, function(err, rows, fields){
      connection.release();
      if(err){
        console.log(err);
        res.sendStatus(500);
        return;
      }
      req.session.m_id = rows.managername;
      res.send();
    });
  });
});

//Admin login (manager_log_in.html)
router.post('/manager_log', function(req, res) {
  var name = req.body.name;
  var pass = req.body.pass;

  req.pool.getConnection(function(err,connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    var query = "SELECT password FROM manager WHERE managername = ? ";
    connection.query(query, name, function(err,rows,fields) {
      connection.release();
      if(err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      if (rows[0].password === pass) {
        console.log("log in successful");
        req.session.manager_id = name;
        console.log(req.session.manager_id);
        res.redirect('project.html');
        return;
      }else {
        console.log(rows[0]);
        console.log("password incorrect");
        res.sendStatus(401);
      }
      res.end();
    });
  });
});

//Show all user profiles (manager_user_profile.html)
router.post('/manager_show_details', function(req, res, next){
  req.pool.getConnection(function(err,connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    var query = "SELECT username, first_name, last_name, email, contact_number FROM users;";
    connection.query(query, function(err,rows,fields) {
      connection.release();
      if(err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      res.json(rows);
    });
  });
});

//Show event list of selected user (manager_user_profile.html)
router.post('/m_show_event', function(req, res, next){
  var username = req.body.u_name;
  req.pool.getConnection(function(err,connection) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    var query = "SELECT event_details.event_type, event_details.event_name, event_details.date, event_details.time, address.street_number, address.street_name, address.city, address.post_code FROM event_details INNER JOIN address ON address.address_id = event_details.address_id INNER JOIN event ON event_details.event_id = event.event_id INNER JOIN users ON event.username = users.username WHERE users.username = ?;";
    connection.query(query, username, function(err,rows,fields) {
      connection.release();
      if(err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }
      console.log(rows);
      res.json(rows);
    });
  });
});

//Check if admin is logged in (Most html file)
router.get('/m_islogin', function(req, res, next) { 
  if (req.session.manager_id) {
    res.send("true");
  }else {
    res.send("false");
  }
});

//Log out a admin (manager_user_profile.html)
router.get('/m_logout', function(req, res, next) {
  delete req.session.manager_id;
  res.end();
})

module.exports = router;
