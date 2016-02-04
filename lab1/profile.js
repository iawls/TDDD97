

tabClick = function(tab){
	
	console.log("Tab clicked");
	var home = document.getElementById("Home");
	var browse = document.getElementById("Browse");
	var account = document.getElementById("Account");
	
	home.attributes.display = "none";
	browse.attributes.display = "none";
	account.attributes.display = "none";

	if(tab == "Home") {
		home.attributes.display = "block";
	} else if(tab == "Browse") {
		browse.attributes.display = "block";
	} else if(tab == "Account") {
		browse.attributes.display = "block";
	}
		
}