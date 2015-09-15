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
			res[i].parsed_metadata.date = new Date(res[i].parsed_metadata.date);
		};
		if(res.length > 1){
			res.sort(function(a,b){
				if(a.parsed_metadata.date.getTime() < b.parsed_metadata.date.getTime()){
					return 1;
				} else if (a.parsed_metadata.date.getTime() > b.parsed_metadata.date.getTime()) {
					return -1;
				} 
				return 0;
			})
		}
		document.getElementById("itemHeader").innerHTML = '<div class="col-lg-12 col-md-12 col-sm-12" style="top: 2em; background-color: #D3D3D3; text-align: center; font-family: Helvetica, serif; font-size: 1.8em; "><p style="padding: 10px; 30px; 0px; 30px;" class="col-lg-9 col-md-9 col-sm-9">' + res[0].parsed_metadata.title + '</p></div>';

		var elementString = "<img src='/img/download.png' style='float: left; padding-right: 10px; width: 5vw;' /><h4>Date: " + months[res[0].parsed_metadata.date.getMonth()] + " " + res[0].parsed_metadata.date.getDate() + ", " + res[0].parsed_metadata.date.getFullYear() +"</h4>";

		if (res.length > 1) {
			elementString += "<h4> Additional Versions </h4><div style='margin-left: 20px;'>";

			for(var i = 1; i < res.length; i++) {
			
			elementString += "<a><h5 style='padding:10px'>" + months[res[i].parsed_metadata.date.getMonth()] + " " + res[i].parsed_metadata.date.getDate() + ", " + res[i].parsed_metadata.date.getFullYear() +"</h5></a>"
	}
	//<a href='google.com' ><img src='/img/download.png'/ style='width: 3vw; float: left; padding-right: 10px;'></a>
	elementString += "</div></br>"
	
		};
		document.getElementById("outputItem").innerHTML = elementString;
	});
};

var searchResult = function() {
	var query = document.getElementById("queryInput").value;	
	window.document.location = "result.html?q=" + query;
};

//onkeydown enter triggers search
$("#queryInput").keyup(function(event){
    if(event.keyCode == 13){
        searchResult();
    }
});