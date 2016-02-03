

homeClick = function(){
	
	alert("derp");
	var home = document.getElementById("Home");
	var browse = document.getElementById("Browse");
	var account = document.getElementById("Account");
	
	home.attributes.display = "block";
	browse.attributes.display = "none";
	account.attributes.display = "none";
	
}

browseClick = function(){
		
	var home = document.getElementById("Home");
	var browse = document.getElementById("Browse");
	var account = document.getElementById("Account");
	
	home.attributes.display = "none";
	browse.attributes.display = "block";
	account.attributes.display = "none";
	
}

accountClick = function(){
	
	var home = document.getElementById("Home");
	var browse = document.getElementById("Browse");
	var account = document.getElementById("Account");
	
	home.attributes.display = "none";
	browse.attributes.display = "none";
	account.attributes.display = "block";
	
}