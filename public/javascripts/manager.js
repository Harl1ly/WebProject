//THIS FILE INCLUDE AJAX FOR ADMIN PAGES

//Sign up new admin (admin_sign_up.html)
function add_manager(){
    var xhttp = new XMLHttpRequest();
    var m_name = document.getElementById("m_name").value;
    var m_pass = document.getElementById("m_pass").value;
    var m_key = document.getElementById("m_key").value;

    xhttp.open("POST", "/add_manager", true);
    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200){
        alert("Your account has been successfully created! Please login to check more details.");
        window.location.href = "/manager_log_in.html";
       }else if(this.readyState == 4 && this.status == 403) {
        alert("Your access key is invalid, please contact developer via harlily01@gmail.com.")
        window.location.href = "/project.html";
       }
    };
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({"m_name":m_name, "m_pass":m_pass, "m_key": m_key}));
}

//Log in as admin (manager_log_in.html)
function manager_log() {
    var xhttp = new XMLHttpRequest();
        var name = document.getElementById("m_name").value;
        var pass = document.getElementById("m_pass").value;

        xhttp.open("POST", "/manager_log", true);

        xhttp.onreadystatechange = function () {
            if(this.readyState == 4 && this.status == 401) {
                document.getElementById('err').style.display = "block";
           }else if (this.readyState == 4 && this.status == 200){
            vueinst.top_menu[0].title = "Manager Account";
            vueinst.top_menu[0].url = "/manager_account.html";
            window.location.href = "/manager_user_profile.html";
           }
        };

        document.getElementById('err').style.display = "none";
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify({"name": name, "pass": pass}));
    }

//Show user list (manager_user_profile.html)
function manager_show_user_details(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            let array = JSON.parse(this.responseText);
            for(let post of array){
                var div = document.createElement('div');
                var details = document.getElementById("users_details");
                details.appendChild(div);
                var p1 = document.createElement('p');
                var p2 = document.createElement('p');
                var p3 = document.createElement('p');
                var p4 = document.createElement('p');

                p1.innerHTML = "</br>Username: " + "<b>" + post.username + "</b>" + "   (" + post.first_name + " " + post.last_name + ")";
                p2.innerText = "User Email: " + post.email;
                p3.innerText = "Contact Number: " + post.contact_number;
                p4.innHTML = "</hr>";

                div.appendChild(p1);
                div.appendChild(p2);
                div.appendChild(p3);
                div.appendChild(p4);
            }
        }
    }
    xhttp.open("POST", "/manager_show_details", true);
    xhttp.send();
}

//Show event list of selected user (manager_user_profile.html)
function m_show_event(){
    var xhttp = new XMLHttpRequest();
    var u_name = document.getElementById("m_search").value;

    xhttp.open("POST", "/m_show_event", true);
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            let event_array = JSON.parse(this.responseText);
            document.getElementById("users_details").style.display = "none";
            document.getElementById("e_details").style.display = "block";
            for(let post of event_array){
                var div = document.createElement('div');
                var e_details = document.getElementById("e_details");
                e_details.appendChild(div);

                var p1 = document.createElement('p');
                var p2 = document.createElement('p');
                var p3 = document.createElement('p');
                var p4 = document.createElement('p');
                
                p1.innerHTML = "</br>Event Type: " + post.event_type;
                p2.innerText = "Event Name: " + post.event_name;
                p3.innerText = "Event Time: " + post.date + post.time;
                p4.innerText = "Event Address: " + post.street_number + " " + post.street_name + " " + post.city + " " + post.post_code;

                div.appendChild(p1);
                div.appendChild(p2);
                div.appendChild(p3);
                div.appendChild(p4);
            }
        }
    }
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({"u_name": u_name}));
}

//Check if admin is logged in (files required admin access)
function m_checkIfLog() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if(this.readyState == 4 && this.status == 200) {
            let misLog = this.responseText;
            if (misLog === "true") {
                vueinst.top_menu[0].title = "User Profile";
                vueinst.top_menu[0].url = "/manager_user_profile.html";
            }else {
                vueinst.top_menu[0].title = "Login";
                vueinst.top_menu[0].url = "/log_in.html";
                window.location.href("/log_in.html")
            }
        }
    };
    xhttp.open("GET", "/m_islogin", true);
    xhttp.send();
}

//Log out admin (manager_user_profile.html)
function m_logout() {
var xhttp = new XMLHttpRequest();
    console.log("manager logout!");
     xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200){
        vueinst.top_menu[0].title = "Login";
        vueinst.top_menu[0].url = "/log_in.html";
        window.location.href = "/project.html";
       }
    };
    xhttp.open("POST", "/m_logout", true);
    xhttp.send();
}