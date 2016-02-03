window.onload = function(){

init();

} 


init = function(){
  //Get the content we want
  var contentView = document.getElementById("contentView");
  var welcomeView = document.getElementById("welcomeView");
  
  //Paste that mofo in there
  contentView.innerHTML = welcomeView.innerHTML;
}


login = function(form){
	//TODO
	var user = {username: form.email.value, password: form.password.value};
	var response = serverstub.signIn(user);
	
	alert(response.message.value);
	
	if(response.success == true){
		//Logged in, fix token etc
	}else{
		//Not logged in, promt user to try again
	}
}

signup = function(form){
	if(signupValidation(form)){
		//This creates a submission object with the values email, password, firstname, familyname, gender, city and country. 
		var submission = {email: form.email.value, password: form.password1.value, firstname: form.fname.value, familyname: form.lname.value, gender: form.gender.value, city: form.city.value, country: form.country.value};
		//It sends it onwards to the server.
		var result = serverstub.signUp(submission);
		//this tells the user if the creation was succesful or not
		alert(result.message);
	}
	return false
}

signupValidation = function(form){
	
	var pwd1 = form.password1.value;
	var pwd2 = form.password2.value;
	//check so the password is the correct length
	if(form.password1.value.length < 6){
		alert("Your password has to be at least 6 characters long!");
		return false;
	}
		
	//check so the passwords match
	if(form.password1.value != form.password2.value){
		alert("The passwords does not match");
		return false;
	}
	
	//all the other checks are done by HTML5 in the client.html document by using required tags and email-type where necessary.
	
	return true;
}