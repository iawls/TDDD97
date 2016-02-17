window.onload = function(){
	getUserData();
}


getUserData() = function(){
	
	var token = localStorage.getItem("token");
	var userData = serverstub.getUserDataByToken(token);
	
	document.getElementById("homeName").value = userData.firstname+" "+userData.familyname;
	
}