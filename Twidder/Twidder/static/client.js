window.onload = function(){
    init();
} 

var xhttp;
var loggedInEmail;

init = function(){

    //Get the content we want
    var contentView = document.getElementById("contentView");
    var welcomeView = document.getElementById("welcomeView");
    var profileView = document.getElementById("profileView");

    if (localStorage.getItem("loggedInEmail") != null){
	loggedInEmail = localStorage.getItem("loggedInEmail");
	console.log("socketHelper");
	socketHelper(true);
    }
    //Paste that mofo in there
    if(localStorage.getItem("token") != null){
	//Logged in, load Profile View
	contentView.innerHTML = profileView.innerHTML;
	getUserData();
	var fileinput = document.getElementById("fileinput");
	if(fileinput)
	    fileinput.addEventListener('change', uploadFile, false);
	else
	    console.log("Something fucked up, ggwp fileupload");
	
	var browseFileinput = document.getElementById("browseFileinput");
	if(browseFileinput)
	    browseFileinput.addEventListener('change', browseUploadFile, false);
	else
	    console.log("Something fucked up, ggwp fileupload");
    }else{
	//Not logged in, load welcomeView
	contentView.innerHTML = welcomeView.innerHTML;
    }
}


socketHelper = function (login){

    var socketExists = false;

    if(!socketExists){
	var socket = new WebSocket("ws://localhost:5001/socket");
	socketExists = true;
    }
    if(login == true){
	
	socket.onmessage = function(event){
	    console.log(event.data);
	    if(event.data == "close"){
		logout("autologout");
	    }

	}

	socket.onopen = function(){
	    console.log("Socket opened");
	    socket.send(loggedInEmail);
	}

	socket.onclose = function(){
	    console.log("Socket closed");
	}

	socket.onerror = function (error) {
	    console.log('WebSocket Error ' + error);
	};

    }else{
	socket.close();
	socketExists = false;
    }
}





var login = function(form){
    
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
	if (xhttp.readyState == 4 & xhttp.status == 200) {
	    var response = JSON.parse(xhttp.responseText);
	    if(response.success == true){
		//Logged in, fix token etc
		localStorage.setItem("token", response.data);
		localStorage.setItem("loggedInEmail", form.email.value);
		loggedInEmail = form.email.value;
		socketHelper(true);
		//load homepage
		contentView.innerHTML = profileView.innerHTML;
		getUserData();
		var fileinput = document.getElementById("fileinput");
		if(fileinput)
		    fileinput.addEventListener('change', uploadFile, false);
		else
		    console.log("Something fucked up, ggwp fileupload");
		
		var browseFileinput = document.getElementById("browseFileinput");
		if(browseFileinput)
		    browseFileinput.addEventListener('change', browseUploadFile, false);
		else
		    console.log("Something fucked up, ggwp fileupload");
	    }else{
		//Not logged in, promt user to try again
		document.getElementById("errorMsg").innerHTML = response.message;
	    }
	}	
    }

    xhttp.open("POST", "/signin", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("email="+form.email.value+"&password="+form.password.value);

}

logout = function(type){
    type = type || "normal"
    console.log("type: " + type)
    var token = localStorage.getItem("token");
    if(token != null){
	
	xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
	    if (xhttp.readyState == 4 & xhttp.status == 200) {
		var response = JSON.parse(xhttp.responseText);
		if(response.success == true){
		    //Logged out, fix token etc
		    //socketHelper(false);
		    localStorage.removeItem("token");
		    localStorage.removeItem("loggedInEmail");
		    console.log("token removed");
		    //load welcome page
		    init();
		}else{
		    //Not logged out, prompt user to try again
		    document.getElementById("errorMsg").innerHTML = response.message;
		}
	    }	
	}

	xhttp.open("POST", "/signout", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("token="+token+"&type="+type);	
    }else{
	document.getElementById("errorMsg").innerHTML = "A problem occurred during log out";
    }
}

signup = function(form){
    if(passwordValidation(form.password1.value, form.password2.value)){
	//This creates a submission object with the values email, password, firstname, familyname, gender, city and country. 
	xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
	    if (xhttp.readyState == 4 & xhttp.status == 200) {

		var result = JSON.parse(xhttp.responseText);
		//this tells the user if the creation was succesful or not
		document.getElementById("errorMsg").innerHTML = result.message;

		if(result.success){
		    document.getElementById("fname").value = "";
		    document.getElementById("lname").value = "";
		    document.getElementById("city").value = "";
		    document.getElementById("country").value = "";
		    document.getElementById("email").value = "";
		    document.getElementById("password1").value = "";
		    document.getElementById("password2").value = "";
		    return true;
		}
	    }
	}
	xhttp.open("POST", "/signup", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("email="+form.email.value+"&password="+form.password1.value+"&fname="+form.fname.value+"&lname="+form.lname.value+"&gender="+form.gender.value+"&city="+form.city.value+"&country="+form.country.value);
    }
    return false;
}

passwordValidation = function(pwd1, pwd2){
    
    //var pwd1 = form.password1.value;
    //var pwd2 = form.password2.value;
    //check so the password is the correct length
    if(pwd1.length < 6){
	document.getElementById("errorMsg").innerHTML = "Your password has to be at least 6 characters long!";
	return false;
    }
    
    //check so the passwords match
    if(pwd1 != pwd2){
	document.getElementById("errorMsg").innerHTML = "The passwords does not match";
	return false;
    }
    //all the other checks are done by HTML5 in the client.html document by using required tags and email-type where necessary.
    return true;
}

/*profileView*/

changePassword = function(form){    
    if(passwordValidation(form.newPassword1.value, form.newPassword2.value)){
	
	var token = localStorage.getItem('token');
	var old_pw = form.currPassword.value;
	var new_pw = form.newPassword1.value;
	
	xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
	    if (xhttp.readyState == 4 & xhttp.status == 200) {
		
		var response = JSON.parse(xhttp.responseText);

		document.getElementById("errorMsg").innerHTML = response.message;
		if(response.success){
		    document.getElementById("currPassword").value = "";
		    document.getElementById("newPassword1").value = "";
		    document.getElementById("newPassword2").value = "";
		}
	    }
	}

	xhttp.open("POST", "/changepassword", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("token="+token+"&old_password="+old_pw+"&new_password="+new_pw);
    }
}




tabClick = function(tab){
    
    console.log("Tab clicked");
    var home = document.getElementById("Home");
    var browse = document.getElementById("Browse");
    var account = document.getElementById("Account");
    
    home.style.display = "none";
    browse.style.display = "none";
    account.style.display = "none";
    homeTab.style.backgroundColor = "#dddddd";
    browseTab.style.backgroundColor = "#dddddd";
    accountTab.style.backgroundColor = "#dddddd";

    if(tab == Home) {
	home.style.display = "block";
	homeTab.style.backgroundColor = "white";
	getMessages();
    } else if(tab == Browse) {
	browse.style.display = "block";
	browseTab.style.backgroundColor = "white";
    } else if(tab == Account) {
	account.style.display = "block";
	accountTab.style.backgroundColor = "white";
    }else{
	console.log("Error in tabClick()");
    }
    
}


/*Home tab*/

getUserData = function(){
    console.log("getUserData");
    xhttp = new XMLHttpRequest();
    var token = localStorage.getItem("token");
    console.log("[getUserData] token: "+token);
    console.log("[getUserData] loggedInEmail: "+loggedInEmail);
    xhttp.onreadystatechange = function() {
	console.log("[getUserData] xhttp status: "+xhttp.status);
	console.log("[getUserData] xhttp readystate: "+xhttp.readyState);

	if (xhttp.readyState == 4 & xhttp.status == 200) {
	    console.log("[getUserData] inside xhttp readystate");
	    var userData = JSON.parse(xhttp.responseText);
	    console.log(userData.message);
	    console.log(userData.email);
	    if(userData.success == true){
		console.log("[getUserData] userData.success: true");
		document.getElementById("homeName").innerHTML = "Name: "+userData.fname+" "+userData.lname;
		document.getElementById("homeGender").innerHTML = "Gender: "+userData.gender;
		document.getElementById("homeCity").innerHTML = "City: "+userData.city;
		document.getElementById("homeCountry").innerHTML = "Country: "+userData.country;
		document.getElementById("homeEmail").innerHTML = "Email: "+userData.email;
		getMessages();
	    }else{
		document.getElementById("errorMsg").innerHTML = userData.message;
	    }
	}
    }

	xhttp.open("GET", "/getuserdatabytoken?token="+token, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send();
}

post = function(postText){
    xhttp = new XMLHttpRequest();
    var token = localStorage.getItem("token");
    var reciever = loggedInEmail;
    console.log("[post] token: "+token);
    console.log("[post] reciever: "+reciever);
    xhttp.onreadystatechange = function() {
	if (xhttp.readyState == 4 & xhttp.status == 200) {
	    var response = JSON.parse(xhttp.responseText);
	    if(response.success == true){
		document.getElementById("postText").value ="";
		getMessages();		
	    }else{
		document.getElementById("errorMsg").innerHTML = response.message;
	    }
	}
    }
    xhttp.open("POST", "/postmessage", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("token="+token+"&message="+postText.postData.value+"&email="+reciever);

}

getMessages = function(){
    xhttp = new XMLHttpRequest();
    var token = localStorage.getItem("token");
    xhttp.onreadystatechange = function() {
	if (xhttp.readyState == 4 & xhttp.status == 200) {
	    var messages = JSON.parse(xhttp.responseText);
	    if(messages.success){
		document.getElementById("wallContent").innerHTML = "";
		

		for(i = 0; i<messages.data.length; ++i){
		    if(messages.data[i][3] == "no"){
			document.getElementById("wallContent").innerHTML += "<div id=\"message"+i+"\"class=\"message\" draggable=\"true\" ondragstart=\"drag(event)\"><b>"+messages.data[i][0]+": </b>"+messages.data[i][2]+"</div>";
		    }else if(messages.data[i][3] == "png" || messages.data[i][3] == "jpg"){
			//document.getElementById("wallContent").innerHTML += "<div id=\"message"+i+"\"class=\"message\" draggable=\"false\" ondragstart=\"drag(event)\"><b>Someone says: </b> <img src=\"{{ url_for('send_file', filename='wimage.png') }}\"></img></div>";
			document.getElementById("wallContent").innerHTML += "<div id=\"message"+i+"\"class=\"message\" draggable=\"false\" ondragstart=\"drag(event)\"><b>"+messages.data[i][0]+":</b> <p><img src=\"send_file?token="+token+"&filename="+messages.data[i][2]+"\" height=\"100\"><p></div>";
			//getMedia("wimage.png");
		    }else if(messages.data[i][3] == "mp3"){
			document.getElementById("wallContent").innerHTML += "<div id=\"message"+i+"\"class=\"message\" draggable=\"false\" ondragstart=\"drag(event)\"><b>"+messages.data[i][0]+": </b> <p><audio controls><source src=\"send_file?token="+token+"&filename="+messages.data[i][2]+"\" type=\"audio/mpeg\"></audio><p></div>";
		     }else if(messages.data[i][3] == "mp4"){
			document.getElementById("wallContent").innerHTML += "<div id=\"message"+i+"\"class=\"message\" draggable=\"false\" ondragstart=\"drag(event)\"><b>"+messages.data[i][0]+":</b> <p><video height=\"100\" controls<source src=\"send_file?token="+token+"&filename="+messages.data[i][2]+"\" type=\"video/mp4\"></video><p></div>";
		    }
		    document.getElementById("message" + i).scrollIntoView();
		}
	    }
	}
    }

    xhttp.open("GET", "/getusermessagesbytoken?token="+token, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}

/*
getMedia = function(postText){
    xhttp = new XMLHttpRequest();
    var token = localStorage.getItem("token");
    xhttp.onreadystatechange = function() {
	if (xhttp.readyState == 4 & xhttp.status == 200) {
	    var response = JSON.parse(xhttp.responseText);
	    if(response.success == true){
		return "<div id=\"message"+i+"\"class=\"message\" draggable=\"false\" ondragstart=\"drag(event)\"><b>Someone says: </b> <image src=\"{{ url_for('send_file', filename=wimage.png) }}\"></image></div>";
		return "sup"
	    }else{
		document.getElementById("errorMsg").innerHTML = response.message;
	    }
	}
    }
    xhttp.open("POST", "/send_file/wimage.png", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //xhttp.send("token="+token+"&message="+postText.browsePostData.value+"&email="+reciever);
    xhttp.send();
}
*/
//Browse

var browsedEmail;

refreshWall = function(){
    if(browsedEmail != null){
	xhttp = new XMLHttpRequest();
	var token = localStorage.getItem("token");
	xhttp.onreadystatechange = function() {
	    if (xhttp.readyState == 4 & xhttp.status == 200) {
		
		var messages = JSON.parse(xhttp.responseText);

		document.getElementById("browseWallContent").innerHTML = "";
		for(i = 0; i<messages.data.length; ++i){
		     if(messages.data[i][3] == "no"){
		    	document.getElementById("browseWallContent").innerHTML += "<div id=\"message"+i+"\"class=\"message\" draggable=\"true\" ondragstart=\"drag(event)\"><b>"+messages.data[i][0]+": </b>"+messages.data[i][2]+"</div>";
		    }else if(messages.data[i][3] == "png" || messages.data[i][3] == "jpg"){
			document.getElementById("browseWallContent").innerHTML += "<div id=\"message"+i+"\"class=\"message\" draggable=\"false\" ondragstart=\"drag(event)\"><b>"+messages.data[i][0]+":</b> <p><img src=\"send_file?token="+token+"&filename="+messages.data[i][2]+"\" height=\"100\"><p></div>";
			//getMedia("wimage.png");
		    }else if(messages.data[i][3] == "mp3"){
			document.getElementById("browseWallContent").innerHTML += "<div id=\"message"+i+"\"class=\"message\" draggable=\"false\" ondragstart=\"drag(event)\"><b>"+messages.data[i][0]+": </b> <p><audio controls><source src=\"send_file?token="+token+"&filename="+messages.data[i][2]+"\" type=\"audio/mpeg\"></audio><p></div>";
		     }else if(messages.data[i][3] == "mp4"){
			document.getElementById("browseWallContent").innerHTML += "<div id=\"message"+i+"\"class=\"message\" draggable=\"false\" ondragstart=\"drag(event)\"><b>"+messages.data[i][0]+":</b> <p><video height=\"100\" controls<source src=\"send_file?token="+token+"&filename="+messages.data[i][2]+"\" type=\"video/mp4\"></video><p></div>";
		    }
		    document.getElementById("message" + i).scrollIntoView();
		}
	    }
	}

	xhttp.open("GET", "/getusermessagesbyemail?token="+token+"&email="+browsedEmail, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send();
    }else{
	document.getElementById("errorMsg").innerHTML = "You need to browse a user to refresh their wall";

    }
}

browseUser = function(form){
    browsedEmail = form.email.value;
    xhttp = new XMLHttpRequest();
    var token = localStorage.getItem("token");
    console.log(token);
    xhttp.onreadystatechange = function() {
	if (xhttp.readyState == 4 & xhttp.status == 200) {

	    var userData = JSON.parse(xhttp.responseText);
	    console.log(userData.message);
	    console.log(userData.email);
	    if(userData.success == true){
		document.getElementById("browseName").innerHTML = "Name: "+userData.fname+" "+userData.lname;
		document.getElementById("browseGender").innerHTML = "Gender: "+userData.gender;
		document.getElementById("browseCity").innerHTML = "City: "+userData.city;
		document.getElementById("browseCountry").innerHTML = "Country: "+userData.country;
		document.getElementById("browseEmail").innerHTML = "Email: "+userData.email;
		refreshWall();
	    }else{
		document.getElementById("errorMsg").innerHTML = userData.message;
	    }
	}
    }

	xhttp.open("GET", "/getuserdatabyemail?token="+token+"&email="+browsedEmail, true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send();
}

browsePost = function(postText){
    if(browsedEmail != null){
	xhttp = new XMLHttpRequest();
	var token = localStorage.getItem("token");
	var reciever = browsedEmail;
	xhttp.onreadystatechange = function() {
	    if (xhttp.readyState == 4 & xhttp.status == 200) {
		var response = JSON.parse(xhttp.responseText);
		if(response.success == true){
		    document.getElementById("browsePostText").value ="";
		    refreshWall();		
		}else{
		    document.getElementById("errorMsg").innerHTML = response.message;
		}
	    }
	}
	xhttp.open("POST", "/postmessage", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("token="+token+"&message="+postText.browsePostData.value+"&email="+reciever);

    }else{
	document.getElementById("errorMsg").innerHTML = "You need to browse a user to post on their wall";
    }
    
}

/*Draggable messages*/


function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var text = document.getElementById(data).innerHTML;
    var tmp = text.indexOf("</b>");
    text = text.substring(tmp+4, text.length)
    document.getElementById("postText").value=text;
}
function browseDrop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var text = document.getElementById(data).innerHTML;
    var tmp = text.indexOf("</b>");
    text = text.substring(tmp+4, text.length)
    document.getElementById("browsePostText").value=text;
}


/*Streaming*/

function uploadFile(){
    console.log("[upload]");
    var url = '/upload';
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open("POST", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Every thing ok, file uploaded
            console.log(xhr.responseText); // handle response.
	    getMessages();
        }
    };
    console.log("asjkdgasdfkahsjdgsda: "+loggedInEmail);
    fd.append("upload_file", this.files[0]);
    fd.append("token", localStorage.getItem('token'));
    fd.append("reciever", loggedInEmail);

    xhr.send(fd);
}

function browseUploadFile(){
    var url = '/upload';
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open("POST", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Every thing ok, file uploaded
            console.log(xhr.responseText); // handle response.
	    refreshWall();
        }
    };
    console.log("asjkdgasdfkahsjdgsda: "+loggedInEmail);
    fd.append("upload_file", this.files[0]);
    fd.append("token", localStorage.getItem('token'));
    fd.append("reciever", browsedEmail);

    xhr.send(fd);
}

