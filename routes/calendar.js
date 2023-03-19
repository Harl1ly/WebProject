//THIS FILE INCLUDES GOOGLE API LINKED TO CALENDAR

const fs = require('fs');
const readline = require('readline');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('148368185397-82fl13lgha9mbjvp1c13j4b0no94fv0t.apps.googleusercontent.com');
const {google} = require('googleapis');
const credentials = require('./credentials.json');

const SCOPES = 'https://www.googleapis.com/auth/calendar';
//const GOOGLE_PROJECT_NUMBER = "wdc-project-352012";
//const GOOGLE_CALENDAR_ID = "lgpo67ckd6mjt67oojnecoa8uc@group.calendar.google.com";
const TOKEN_PATH = 'token.json';

module.exports = {
	callApi (data, callback) {
		if (!callback) {
			return "error!";
		}
		return authorize(credentials, data, callback);

	},

	createEvent(auth, data) {
		const calendar = google.calendar({version: 'v3', auth});
		calendar.events.insert({
  		auth: auth,
  		calendarId: 'primary',
  		resource: data,
		}, function(err, event) {
  		if (err) {
    		console.log('There was an error contacting the Calendar service: ' + err);
    		return;
  		}
  		console.log(event.data.htmlLink);
		});
	},

	listEvents(auth, data) {
	  const calendar = google.calendar({version: 'v3', auth});
	  //return "calendar";
	  return new Promise ((resolved, rejected) => {
	  	calendar.events.list({
		    calendarId: 'primary',
		    timeMin: (new Date()).toISOString(),
		    maxResults: 10,
		    singleEvents: true,
		    orderBy: 'startTime',
		  }, (err, res) => {
		    if (err) rejected ('The API returned an error: ' + err);
		   	resolved (res.data.items);
		    /*if (events.length) {
		      //console.log('Upcoming 10 events:');
		      return events.map((event, i) => {
		        const start = event.start.dateTime || event.start.date;
		        //(`${start} - ${event.summary}`);
		      });
		    } 
		    //else {
		      //return ('No upcoming events found.');
		    //}*/
		  });
	  });
	}

};

function authorize(credentials, data, callback) {
		  const {client_secret, client_id, redirect_uris} = credentials.web;
		  const oAuth2Client = new google.auth.OAuth2(
		  	client_id, client_secret, redirect_uris[0]);

		  // Check if we have previously stored a token.
		  var token = fs.readFileSync(TOKEN_PATH);
		  if (!token) return getAccessToken(oAuth2Client, callback);
		  oAuth2Client.setCredentials(JSON.parse(token));
		  return callback(oAuth2Client, data);

}

function getAccessToken(oAuth2Client, callback) {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
      });
      console.log('Authorize this app by visiting this url:', authUrl);
      //return authUrl;
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
          if (err) return console.error('Error retrieving access token', err);
          oAuth2Client.setCredentials(token);
          // Store the token to disk for later program executions
          fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            console.log('Token stored to', TOKEN_PATH);
          });
          callback(oAuth2Client);
        });
      });
}

