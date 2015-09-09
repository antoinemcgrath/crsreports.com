$("#searchForm").on("submit", function(e){
	e.preventDefault();
	window.location.href="/result.html?q="+document.getElementById("searchInput").value;
});

$("#searchQuery").on("submit", function(e){
	e.preventDefault();
	window.location.href="/result.html?q="+document.getElementById("queryInput").value;
});

var documents = [];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];



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

var query = getUrlParameter("q"); 

if (query){
	$.ajax({
		url: "/search?q=" + query,
		method: "GET"
	}).success(function(res){
		documents.length = 0;
		documents.push.apply(documents,res);
		for(var i = 0; i < documents.length; i++) {
			// result = documents[i].authors.split('[(u\'')[1].split('\',')[0];
				//documents[i].authors = result;
				documents[i].parsed_metadata.date = parseDate(documents[i].parsed_metadata.date);
			};
			document.getElementById("resultsHeader").innerHTML = '<div class="col-lg-12 col-md-12 col-sm-12" style="top: 150px; background-color: #D3D3D3; text-align: left; font-family: Arial, serif; font-size: 22px; "><p style="padding: 30px 0px 0px 30px">Displaying '+ documents.length + '  Reports, Filter: "' + query +'"  <!--Sort By Drop-down menu--><div class="dropdown" style="float: left; padding: 0px 50px 30px 30px;"><button class="btn btn-default dropdown-toggle" data-toggle="dropdown" id="dropdownSortMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Sort By    <span class="caret"></span></button><ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownSortMenu"><li><a onclick=\'sortDocuments("title");\'>Title</a></li><li><a onclick=\'sortDocuments("title", 1);\'>Title (descending)</a></li><li><a onclick=\'sortDocuments("time", 1);\'>Date</a></li><li><a onclick=\'sortDocuments("time");\'>Date (oldest first)</a></li></ul></div></p></div>'
			displayDocuments();
		});
};

var displayDocuments = function() {
	var elementString = "";
	for(var i = 0; i < documents.length; i++) {
		
		elementString += "<div class='well well-lg'><h3 class='document-row'>" + documents[i].parsed_metadata.title + "</h3></br><h4 class='document-row'>Original Format: </h4 >" + documents[i].magic + "</br><h4 class='document-row'>Date:  </h4>" + months[documents[i].parsed_metadata.date.getMonth()] + " " + documents[i].parsed_metadata.date.getDate() + ", " + documents[i].parsed_metadata.date.getFullYear() +"</br></div>"
	}
	elementString += "</br>"
	document.getElementById("outputSearchResult").innerHTML = elementString;
};

var sortDocuments= function(sortBy, reverse){
	documents.sort(function(a,b){
		if(sortBy === "title") {
			a = a.parsed_metadata.title.toLowerCase();
			b = b.parsed_metadata.title.toLowerCase();
		}
		if (sortBy === "time") {
			a = a.parsed_metadata.date.getTime();
			b = b.parsed_metadata.date.getTime();
		}
		if(a < b){
			return -1;
		}
		if(a > b){
			return 1;
		}
		return 0;
	});
	if(reverse) {
		documents = documents.reverse();
	}
	displayDocuments();

};

function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
};

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
