var getUrlParameter = function getUrlParameter(sParam) {
	var sPageURL = decodeURIComponent(window.location.search.substring(1)),
	sURLVariables = sPageURL.split('&'),
	sParameterName,
	i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : sParameterName[1];
		}
	}
};

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var query = getUrlParameter("q"); 

console.log(query);

if (query){
	$.ajax({
		url: "/getitem?q=" + query,
		method: "GET"
	}).success(function(res){
		for(var i = 0, j = res.length; i < j; i++){
			res[i]._id = new Date(res[i]._id);
		};
		console.log(res);
		if(res.length > 1){
			res.sort(function(a,b){
				if(a._id.getTime() < b._id.getTime()){
					return 1;
				} else if (a._id.getTime() > b._id.getTime()) {
					return -1;
				} 
				return 0;
			})
		}
		document.getElementById("itemHeader").innerHTML = '<div class="col-lg-12 col-md-12 col-sm-12" style="top: 2em; background-color: #D3D3D3; text-align: center; font-size: 1.8em; "><p style="padding: 10px; 30px; 0px; 30px;" class="col-lg-9 col-md-9 col-sm-9">' + res[0].title + '</p></div>';

		var elementString = "<a href='/links_reports/" + res[0].sha256 + "' download='"
		+ res[0].ordercode
		 +"_"+ res[0]._id.getFullYear()
		  +"-"+ months[res[0]._id.getMonth()]
		  +"-"+res[0]._id.getDate() 
		  +".pdf"+
		  "'><img src='/img/download.png' style='float: left; padding-right: 10px; width: 60px;' /><h4>Current Version: "
		   + months[res[0]._id.getMonth()]
		    + " " + res[0]._id.getDate()
		     + ", " + res[0]._id.getFullYear() +"</h4></a>";

		if (res.length > 1) {
			elementString += "<hr></br><h4> Additional Versions </h4><div style='margin-left: 20px;'>";

//file to serve url listed below 
for(var i = 1; i < res.length; i++) {
	elementString += "<a href='/links_reports/" + res[i].sha256 + "' download= '"
	+ res[i].ordercode 
	//+ "_" + res[i].parsed_metadata.title
	 + "_" + res[i]._id.getFullYear()
	 +"-"+months[res[i]._id.getMonth()]
	 +"-"+res[i]._id.getDate()
	 +".pdf"+
	 "'><h5 style='padding:10px'>"
	   + " " + months[res[i]._id.getMonth()]
	    + " " + res[i]._id.getDate()
	     + ", " + res[i]._id.getFullYear()	
	     + "&nbsp;&nbsp;&nbsp;&nbsp;" 
	      + res[i].title 

	      +"</h5></a>"
}
	//<a href='google.com' ><img src='/img/download.png'/ style='width: 3vw; float: left; padding-right: 10px;'></a>
//elementString += "</div></br>"
	
};
document.getElementById("outputItem").innerHTML = elementString;
});
};

var searchResult = function() {
	var query = document.getElementById("searchInput").value;	
	window.document.location = "result?q=" + query;
};

//onkeydown enter triggers search
$("#searchInput").keyup(function(event){
    if(event.keyCode == 13){
        searchResult();
    }
});
