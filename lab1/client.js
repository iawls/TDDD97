window.onload = function(){

    init();

} 


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


login = function(form){
    //TODO
    //var user = {username: form.email.value, password: form.password.value};
    var response = serverstub.signIn(form.email.value, form.password.value);
    
    if(response.success == true){
	//Logged in, fix token etc
	localStorage.setItem("token", response.data);
	
    }else{
	//Not logged in, promt user to try again
	document.getElementById("errorMsg").innerHTML = response.message;
    }
}

signup = function(form){
    if(passwordValidation(form.password1.value, form.password2.value)){
	//This creates a submission object with the values email, password, firstname, familyname, gender, city and country. 
	var submission = {email: form.email.value, password: form.password1.value, firstname: form.fname.value, familyname: form.lname.value, gender: form.gender.value, city: form.city.value, country: form.country.value};
	//It sends it onwards to the server.
	var result = serverstub.signUp(submission);
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
	}
    }
    return false
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
    console.log("change password");
    
    if(passwordValidation(form.newPassword1.value, form.newPassword2.value)){
	var response = serverstub.changePassword(localStorage.getItem("token"), form.currPassword.value, form.newPassword1.value);
	document.getElementById("errorMsg").innerHTML = response.message;
	if(response.success){
	    document.getElementById("currPassword").value = "";
	    document.getElementById("newPassword1").value = "";
	    document.getElementById("newPassword2").value = "";
	}
    }
}

logout = function(){
    if(localStorage.getItem("token") != null){
	localStorage.removeItem("token");
	init();
    }else{
	document.getElementById("errorMsg").innerHTML = "A problem occurred during log out";

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
    
    var token = localStorage.getItem("token");
    var userData = serverstub.getUserDataByToken(token);
    
    document.getElementById("homeName").innerHTML = "Name: "+userData.data.firstname+" "+userData.data.familyname;
    document.getElementById("homeGender").innerHTML = "Gender: "+userData.data.gender;
    document.getElementById("homeCity").innerHTML = "City: "+userData.data.city;
    document.getElementById("homeCountry").innerHTML = "Country: "+userData.data.country;
    document.getElementById("homeEmail").innerHTML = "Email: "+userData.data.email;
}

post = function(postText){

    var token = localStorage.getItem("token");
    var user = serverstub.getUserDataByToken(token);
    var email = user.data.email;
    
    console.log(postText.postData.value);
    var message = serverstub.postMessage(token, postText.postData.value, email);
    
    getMessages();

    document.getElementById("postText").value ="";
}

getMessages = function(){
    
    var token = localStorage.getItem("token");
    var messages = serverstub.getUserMessagesByToken(token);
    document.getElementById("wallContent").innerHTML = "";
    for(i = 0; i<messages.data.length; ++i){
	document.getElementById("wallContent").innerHTML += "<div class=\"message\"><b>"+messages.data[i].writer+" says: </b>"+messages.data[i].content+"</div>";
    }
    
}

//Browse

var browsedEmail;

refreshWall = function(){
    if(browsedEmail != null){
	var token = localStorage.getItem("token");
	var messages = serverstub.getUserMessagesByEmail(token, browsedEmail);

	document.getElementById("browseWallContent").innerHTML = "";
	for(i = 0; i<messages.data.length; ++i){
	    document.getElementById("browseWallContent").innerHTML += "<div class=\"message\"><b>"+messages.data[i].writer+" says: </b>"+messages.data[i].content+"</div>";
	}
    }else{
	document.getElementById("errorMsg").innerHTML = "You need to browse a user to refresh their wall";

    }
}

browseUser = function(form){
    
    var token = localStorage.getItem("token");
    var userData = serverstub.getUserDataByEmail(token, form.email.value);
    
    if(userData.success){
	document.getElementById("browseName").innerHTML = "Name: "+userData.data.firstname+" "+userData.data.familyname;
	document.getElementById("browseGender").innerHTML = "Gender: "+userData.data.gender;
	document.getElementById("browseCity").innerHTML = "City: "+userData.data.city;
	document.getElementById("browseCountry").innerHTML = "Country: "+userData.data.country;
	document.getElementById("browseEmail").innerHTML = "Email: "+userData.data.email;
	
	browsedEmail = userData.data.email;
	
	refreshWall();
    }else{
	document.getElementById("errorMsg").innerHTML = userData.message;

    }
    
    
}

browsePost = function(postText){
    if(browsedEmail != null){
	var token = localStorage.getItem("token");
	var user = serverstub.getUserDataByEmail(token, browsedEmail);
	var email = user.data.email;
	
	var message = serverstub.postMessage(token, postText.browsePostData.value, email);
	
	refreshWall();
	document.getElementById("browsePostText").value ="";
    }else{
	document.getElementById("errorMsg").innerHTML = "You need to browse a user to post on their wall";
    }
    
}
