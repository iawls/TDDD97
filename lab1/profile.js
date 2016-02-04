

tabClick = function(tab){
	
	console.log("Tab clicked");
	var home = document.getElementById("Home");
	var browse = document.getElementById("Browse");
	var account = document.getElementById("Account");
	
	home.style.display = "none";
	browse.style.display = "none";
	account.style.display = "none";

	if(tab == Home) {
		home.style.display = "block";
	} else if(tab == Browse) {
		browse.style.display = "block";
	} else if(tab == Account) {
		account.style.display = "block";
	}else{
		console.log("Error in tabClick()");
	}
		
}