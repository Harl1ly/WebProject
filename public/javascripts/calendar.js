//index.js code for integrating Google Calendar

const express = require('express');
const {google} = require('googleapis');
require('dotenv').config();

const app = express();

const SCOPES = 'https://www.googleapis.com/auth/calendar';
const GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCwGq+Ue9f/Rzvv\nsQO40EaDBwHwukiKG0XgyY/bep665E+28XHghb7CARr7iUyH/MCxZdnt7JCAEiEu\n8uUckc2STvLbwtpEgGEM/Q/z71+qe6nnn+n5Tb/3ti0L9mhhAw0WMEh5Esm2DD/S\nZMjh9Dj6KM9mhiI1B4cuwCPo5pRFW5o5+yTpQzjNXw+zFrClX7p0LSU7sKJluHXK\nGsr9YCD0By0lkVhbPm34XwLboVn5YGyuoUY3coW60bsKaUw0OH3Yyv+QrGFQ1FoR\np++EYd9OtCtA1UyaHiqMZF4JSXviY42AhXpPl7t2TEuWfTj2gBnnavCCJyZif5n/\njyFJ34QzAgMBAAECggEADp0gTeubCJGiPSlM3ETYXR4zQIVM6L0LpvRDDl0WF/9D\nSDSwFQg0RMgvs4j4w14rpW0E0TQs55vZihpY/e5xhz8q8yav0zhuFVRYww7tuumJ\nN3HzSh90GzvQcCoyDj7hEqLOGNIA0C0jDLQVYX7RTZ0eXO0roIfv5WbHdBfSXRDy\nLkW4NiiL01ycpHRE90VqO3jv5Q47f6LpNJkmEBncjc2TjuIwk/xJk0nYPEHJBq2D\nc0DVCiE5cedpsuBw7z4EHETiQ+JlTXwiNksgpvbd+iPQheok6Qf8011JEBWn+mcT\nJUfxEv7cx2ACcFsH2fBz+C8xcXPulzhgINNtYUYUMQKBgQDdCPkH6/cK6PZ5kwon\nWKTs3F2o94kSz9G1HEujNt0xsf3zapvtoqLNpWUDpjjShFzgmx4CMryG7P6xBeSR\nLlH6SIWzl2AXZysvi5LlRdMr5Whg1nKZCMid0UMB6Cse+SWYlh1mR3goo20bslUP\nU4RcyFERZRrLCgqPilR8TWrlYwKBgQDL9jJc0xXn/rN6O2be8ekHBqIRP7NEdxLX\nxGkYm0eR3BiNzWw0Uke3yS14A3zZz5oHmoZh1xX+qCBllQu9yqm0PvRU56N09yxk\nnSGiYEiRDG7mCTKsQ2lfqqxp1Viihww5Gx8rvD8fTF/FwCwDRkjexXf8UIz6fPaE\n29HIR9HG8QKBgCLjD6tYax2lt4Fo2+lp7F4WShIpP9FgS9EyLh4MwszdMyAAa6wO\nR3P97vuseLuBeMdatFnUeD0zmt+F9pWTogzG9ZNrCReoiQBwHzdg1fvPsbHXJy9Q\nW5nNNa5PXr78xBpZVzqVfTms0cPVWeeZXwLl+yWrt5bkdtZBFySnc3/RAoGBAI2f\nO8UchP976Z+cE4gGrWnFf08+zfliPOE5bkg5ue5bx2jfFJ0X7Nh+hmXo9g4/ipJx\nB5J0SL90elpOrcJxMHkJpZo25VbYMikCulIHTRv6aB6ukFLw1AArgGBUVaE06JXW\ncURrB+FxpKapE2aKrRqSPwgh3mIn1vzVrcrFo7HhAoGBAIw3rzT4ptZbqLlPpCUe\nlAl9usZJUNp99ZpgMR9qXeq4WtatTBHul8ZbpI/GmemZ6tjV+89pYeJpHdE+iM4Q\nin1xjQxQZTYvXM3eLEq+egxs+bQuxImp5ejBqHSpkzUW3NL5cDCxFW7F8Esg/tph\nCdwl5QwMqMGahYZ91oN5d964\n-----END PRIVATE KEY-----\n"
const GOOGLE_CLIENT_EMAIL = "harley@wdc-project-352012.iam.gserviceaccount.com";
const GOOGLE_PROJECT_NUMBER = "wdc-project-352012";
const GOOGLE_CALENDAR_ID = "lgpo67ckd6mjt67oojnecoa8uc@group.calendar.google.com"


const auth = new google.auth.JWT(
	GOOGLE_CLIENT_EMAIL,
	null,
	GOOGLE_PRIVATE_KEY,
	SCOPES
);

const calendar = google.calendar({
	version: 'v3',
	project: GOOGLE_PROJECT_NUMBER,
	auth: jwtClient
});

app.get('/', (req, res) => {

calendar.events.list({
	calendarId: GOOGLE_CALENDAR_ID,
	timeMin: (new Date()).toISOString(),
	maxResults: 10,
	singleEvents: true,
	orderBy: 'startTime',
}, (error, result) => {
	if (error) {
	res.send(JSON.stringify({ error: error }));
	} else {
	if (result.data.items.length) {
		res.send(JSON.stringify({ events: result.data.items }));
	} else {
		res.send(JSON.stringify({ message: 'No upcoming events found.' }));
	}
	}
});
});

app.get("/createEvent",(req,res)=>{
  var event = {
    'summary': 'My first event!',
    'location': 'Australia',
    'description': 'First event with nodeJS!',
    'start': {
      'dateTime': '2022-01-12T09:00:00-07:00',
      'timeZone': 'Asia/Dhaka',
    },
    'end': {
      'dateTime': '2022-01-14T17:00:00-07:00',
      'timeZone': 'Asia/Dhaka',
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
});
app.listen(3000, () => console.log(`App listening on port 3000!`));
