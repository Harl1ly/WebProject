//VUE.JS
var vueinst = new Vue({
    el:"#app",
    data:{
        top_menu:[
            { title:'Login',         url:'log_in.html' },
            { title:'Your Plan',        url:'checkevent.html' },
            { title:'Home',   url:'project.html' },
            ],

        user: {
            username:'default',
            firstname:'First',
            lastname:'Last',
            email: 'example@mail.com',
            mobile: '400000000'
        },
    }
});

//Send comfirm email (CreateEvent.html)
function sendEmail() {  
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200){
        alert("An email sent to your account!");
       }
    };
    xhttp.open("POST", "/email", true);
    xhttp.send();
}

//Create user (Sign_up.html)
function adduser() {
    var xhttp = new XMLHttpRequest();
    var u = document.getElementById("username").value;
    var l = document.getElementById("lastname").value;
    var f = document.getElementById("firstname").value;
    var e = document.getElementById("email").value;
    var p = document.getElementById("password").value;
    xhttp.open("POST", "/adduser", true);
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 500) {
            document.getElementById('err').style.display = "block";
       }else if (this.readyState == 4 && this.status == 200){
        alert("Your account has been successfully created! Please login to check more details.");
        window.location.href = "/log_in.html";
       }
    };
    document.getElementById('err').style.display = "none";
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({"firstname": f, "lastname": l, "username": u, "email": e, "password": p}));
}

//Create new event (CreateEvent.html)
function addevent() {
    let xhttp = new XMLHttpRequest();
    let num = document.getElementById("strnum").value;
    let name = document.getElementById("strn").value;
    let city = document.getElementById("city").value;
    let postc = document.getElementById("postc").value;

    let en = document.getElementById("ename").value;
    let type = document.getElementById("select-type").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;

    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            alert("Event create successfully! Please check");
            //window.location.href = "/myEvent.html";
       }
    };

    xhttp.open("POST", "/addevent", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({"strnum" : num, "strn" : name, "city" : city, "postc" : postc, "ename" : en, "stype" : type, "date" : date, "time" : time}));
}

//Generate link for event to share (CreateEvent.html)
function glink() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            var event_id = this.responseText;
            let link = "http://localhost:3000/event.html?event_id=" + event_id;
            console.log("your link: http://localhost:3000/event.html?event_id=" + event_id);
            navigator.clipboard.writeText(link);
       }
    };
    xhttp.open("POST", "/glink", true);
    xhttp.send();
}

//Load specific event (event.html)
function showEvent() {
    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log("ajax");
                let eventlist = JSON.parse(this.responseText);
                console.log(eventlist);
                document.getElementById("eventName").innerHTML = eventlist.q1[0].event_name;
                document.getElementById("et").innerHTML = eventlist.q1[0].event_type;
                document.getElementById("start").innerHTML = eventlist.q1[0].date + "  " + eventlist.q1[0].time;
                document.getElementById("eh").innerHTML = eventlist.q2[0].first_name + " " + eventlist.q2[0].last_name;
                document.getElementById('el').innerHTML = eventlist.q3[0].street_number + " " + eventlist.q3[0].street_name + " " + eventlist.q3[0].city + " " + eventlist.q3[0].post_code;
            }
        };
        let event_id = new URLSearchParams(window.location.search).get('event_id');
    xhttp.open("POST", "/event", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({"event_id":event_id}));
}

//Add event to calendar (CreateEvent.html)
function addCal() {
    let xhttp = new XMLHttpRequest();

    let num = document.getElementById("strnum").value;
    let name = document.getElementById("strn").value;
    let city = document.getElementById("city").value;
    let postc = document.getElementById("postc").value;
    let en = document.getElementById("ename").value;
    let type = document.getElementById("select-type").value;
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;

    alert("Event added to your google calendar!");

    xhttp.open("POST", "/addCal", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({"strnum" : num, "strn" : name, "city" : city, "postc" : postc, "ename" : en, "stype" : type, "date" : date, "time" : time}));
}

//Log in user (log_in.html)
function log() {
var xhttp = new XMLHttpRequest();
    var ulog = document.getElementById("ulog").value;
    var plog = document.getElementById("plog").value;
    xhttp.open("POST", "/log", true);

     xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 401) {
            document.getElementById('err').style.display = "block";
        }else if (this.readyState == 4 && this.status == 200){
            vueinst.top_menu[0].title = "Account";
            vueinst.top_menu[0].url = "/Account.html";
            window.location.href = "/Account.html";
       }
    };
    document.getElementById('err').style.display = "none";
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({"ulog": ulog, "plog": plog}));
}

//Log out user (Account.html)
function logout() {
var xhttp = new XMLHttpRequest();
    console.log("logout!");
     xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200){
        vueinst.top_menu[0].title = "Login";
        vueinst.top_menu[0].url = "/log_in.html";
        window.location.href = "/project.html";
       }
    };
    xhttp.open("POST", "/logout", true);
    xhttp.send();
}

//Check if user log in (Most html file)
function checkIfLog() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            var isLog = this.responseText;
            if (isLog === "true") {
                vueinst.top_menu[0].title = "Account";
                vueinst.top_menu[0].url = "/Account.html";
            }else {
                vueinst.top_menu[0].title = "Login";
                vueinst.top_menu[0].url = "/log_in.html";
            }
        }
    };
    xhttp.open("GET", "/islogin", true);
    xhttp.send();
}

//Check if user log in, if not prompt to log in page (html files that required user_id to access)
function createLog() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            var isLog = this.responseText;
            if (isLog === "true") {
                vueinst.top_menu[0].title = "Account";
                vueinst.top_menu[0].url = "/Account.html";
            }else {
                window.location.href = "/log_in.html";
            }
        }
    };
    xhttp.open("GET", "/islogin", true);
    xhttp.send();
}

//Show user details (Account.html)
function show() {
    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let post = JSON.parse(this.responseText);
                vueinst.user.username = post[0].username;
                vueinst.user.firstname = post[0].first_name;
                vueinst.user.lastname = post[0].last_name;
                vueinst.user.email = post[0].email;
                vueinst.user.mobile = post[0].contact_number; 
            }
        };
    xhttp.open("POST", "/getuser", true);
    xhttp.send();
}

//Log in via google (log_in.html)
function onSignIn(googleUser) {
  var token = googleUser.getAuthResponse().id_token;
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  //console.log(id_token);
  var xhr = new XMLHttpRequest();
    xhr.open('POST', '/log',true);
    xhr.onload = function() {
    console.log('Signed in as: ' + xhr.responseText);
    };

    xhr.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 401) {
            alert("Google account not linked yet! Please sign up with your Gmail!");
            window.location.href = "/sign_up.html";
       }else if (this.readyState == 4 && this.status == 200){
        vueinst.top_menu[0].title = "Account";
        vueinst.top_menu[0].url = "/Account.html";
        window.location.href = "/Account.html";
       }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify({"id_token" : token}));
}

//Log out google (log_in.html)
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
    });
}

//Update user profile details (Account.html)
function finish() {
    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var terms = document.getElementsByClassName("edit");
                for (var term of terms) {
                term.style.display = "none";
                }
                var shows = document.getElementsByClassName("show");
                for (var showitem of shows) {
                    showitem.style.display = "block";
                }
                document.getElementById("editB").style.display = "block";
                document.getElementById("editF").style.display = "none";
                }
        };
    xhttp.open("POST", "/edituser", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({"usernameE": vueinst.user.username, "firstnameE": vueinst.user.firstname, "lastnameE": vueinst.user.lastname, "emailE": vueinst.user.email, "mobileE": vueinst.user.mobile}));
}

//Show event list of user (myEvent.html)
function my_event(){
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200){
            let event = JSON.parse(this.responseText);
            for(let post of event){

                var div = document.createElement('div');
                div.classList.add("e_details");
                var details = document.getElementById("event_details");
                details.appendChild(div);

                var p1 = document.createElement('p');
                
                var p2 = document.createElement('p');
                
                var p3 = document.createElement('p');

                var p4 = document.createElement('p');

                document.getElementById("editB").style.display = "none";
                document.getElementById("editF").style.display = "none";
                
                p1.classList.add("e_details");
                p2.classList.add("e_details");
                p3.classList.add("e_details");
                p4.classList.add("e_details");

                p1.innerHTML = "</br>Event Type: " + post.event_type;
                p2.innerText = "Event Name: " + post.event_name;
                p3.innerText = "Event Time: " + post.date + post.time;
                p4.innerText = "Event Address: " + post.street_number + post.street_name + post.city + post.post_code;


                div.appendChild(p1);
                div.appendChild(p2);
                div.appendChild(p3);
                div.appendChild(p4);
            }
        }
    }
    xhttp.open("POST", "/u_show_event", true);
    xhttp.send();
}

/*function show_details(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("ajax");
            let post = JSON.parse(this.responseText);
            vueinst.user.username = post[0].username;
            vueinst.user.firstname = post[0].first_name;
            vueinst.user.lastname = post[0].last_name;
            vueinst.user.email = post[0].email;
            vueinst.user.mobile = post[0].contact_number;
            console.log(post[0]);
            console.log(vueinst.user.username);
            console.log(post[0].username);
        }
    };
    xhttp.open("POST", "/show_accout_details", true);
    xhttp.send();
}*/

//Show selected event (myEvent.html)
function search_event(){
    var xhttp = new XMLHttpRequest();
    var es = document.getElementById("search").value;

    xhttp.open("POST", "/search_event", true);
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            let event_array = JSON.parse(this.responseText);
            document.getElementById("users_details").style.display = "none";
            document.getElementById("e_details").style.display = "block";
            document.getElementById("event_details").style.display = "none";

            for(let post of event_array){
                var div = document.createElement('div');
                var e_details = document.getElementById("e_details");
                e_details.appendChild(div);
                let pp1 = document.createElement('p');
                pp1.innerHTML = "</br>Event Type: ";
                let p1 = document.createElement('pre');
                p1.classList.add("show");

                let e1 = document.createElement('input');
                e1.classList.add("edit");
                e1.setAttribute("id", "et2c");

                let pp2 = document.createElement('p');
                pp2.innerHTML = "Event Name: ";
                let p2 = document.createElement('pre');
                p2.classList.add("show");

                let e2 = document.createElement('input');
                e2.classList.add("edit");
                e2.setAttribute("id", "en2c");

                let pp3 = document.createElement('p');
                pp3.innerHTML = "Event Time: ";
                let p3 = document.createElement('pre');
                p3.classList.add("show");

                let e3 = document.createElement('input');
                e3.classList.add("edit");
                e3.setAttribute("id", "t2c");

                document.getElementById("editB").style.display = "block";
                document.getElementById("editF").style.display = "none";

                p1.innerHTML = post.event_type;
                p2.innerText = post.event_name;
                p3.innerText = post.date + post.time;

                div.appendChild(pp1);
                div.appendChild(p1);
                div.appendChild(e1);

                div.appendChild(pp2);
                div.appendChild(p2);
                div.appendChild(e2);

                div.appendChild(pp3);
                div.appendChild(p3);
                div.appendChild(e3);
                
            }
        }
    }
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({"es": es}));
}

//Edit selected event info (myEvent.html)
function e_finish() {
    console.log("finish edit");
    let e1 = document.getElementById("et2c").value;
    let e2 = document.getElementById("en2c").value;
    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                //console.log("ajax");
                var terms = document.getElementsByClassName("edit");
                for (var term of terms) {
                term.style.display = "none";
                }
                var shows = document.getElementsByClassName("show");
                for (var showitem of shows) {
                    showitem.style.display = "block";
                }
                document.getElementById("editB").style.display = "block";
                document.getElementById("editF").style.display = "none";
                }
                alert ("Event update successfully! An confirm email has been sent please check.");
                location.reload();
        };
    xhttp.open("POST", "/editevent", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({"e1":e1, "e2":e2}));
}