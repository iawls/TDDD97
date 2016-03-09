window.onload = function(){
    init();
} 

var xhttp;
var socket = new WebSocket("ws://localhost:5000/socket");


init = function(){
    //Get the content we want
    var contentView = document.getElementById("contentView");
    var welcomeView = document.getElementById("welcomeView");
    var profileView = document.getElementById("profileView");
    //Paste that mofo in there
    
    if(localStorage.getItem("token") != null){
	//Logged in, load Profile View
	contentView.innerHTML = profileView.innerHTML;
	getUserData();
	getMessages();
    }else{
	//Not logged in, load welcomeView
	contentView.innerHTML = welcomeView.innerHTML;
    }
}

socket.onmessage = function(event){
    console.log("asjdasd");
}

socket.onopen = function(){
    console.log("Socket opened");
    socket.send('Ping');
}

socket.onclose = function(){
    console.log("Socket closed");
}

socket.onerror = function (error) {
  console.log('WebSocket Error ' + error);
};

var loggedInEmail;

var login = function(form){

    xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
	if (xhttp.readyState == 4 & xhttp.status == 200) {
	    var response = JSON.parse(xhttp.responseText);
	    if(response.success == true){
		//Logged in, fix token etc
		loggedInEmail = form.email.value;
		localStorage.setItem("token", response.data);
		socket.send(localStorage.getItem('token'));
		//load homepage
		contentView.innerHTML = profileView.innerHTML;
		getUserData();
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

logout = function(){
    var token = localStorage.getItem("token");
    if(token != null){
	
	xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
	    if (xhttp.readyState == 4 & xhttp.status == 200) {
		var response = JSON.parse(xhttp.responseText);
		if(response.success == true){
		    //Logged out, fix token etc
		    localStorage.removeItem("token");
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
	xhttp.send("token="+token);	
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
    console.log(token);
    xhttp.onreadystatechange = function() {
	if (xhttp.readyState == 4 & xhttp.status == 200) {

	    var userData = JSON.parse(xhttp.responseText);
	    console.log(userData.message);
	    console.log(userData.email);
	    if(userData.success == true){
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

	    document.getElementById("wallContent").innerHTML = "";
	    for(i = 0; i<messages.data.length; ++i){
		document.getElementById("wallContent").innerHTML += "<div class=\"message\"><b>"+messages.data[i][0]+" says: </b>"+messages.data[i][2]+"</div>";
	    }
	}
    }

    xhttp.open("GET", "/getusermessagesbytoken?token="+token, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}

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
		    document.getElementById("browseWallContent").innerHTML += "<div class=\"message\"><b>"+messages.data[i][0]+" says: </b>"+messages.data[i][2]+"</div>";
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
