$("#searchForm").on("submit", function(e){
	e.preventDefault();
	window.location.href="/result?q="+document.getElementById("searchInput").value;
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
        document.getElementById("searchInput").value = query.replace(new RegExp('\\+','g'), " ");
	$.ajax({
		url: "/search?q=" + query,
		method: "GET"
	}).success(function(res){
		documents.length = 0;
		documents.push.apply(documents,res);

                // Handle plurals
                var reportWord = "reports";
                if (documents.length == 1) reportWord = "report";

		for(var i = 0; i < documents.length; i++) {
				documents[i].date = parseDate(documents[i].date);
			};
			document.getElementById("resultsHeader").innerHTML = '<div class="col-xs-2"></div><div class="col-xs-4" style="display: inline-block; vertical-align: middle; float: none; text-align: left; font-family: Helvetica, serif; font-size: 16px; font-weight:bold; "><div style="padding-left:20px;">Displaying '+ documents.length + ' ' + reportWord + '</div></div>' + '<div class="col-xs-4" style="display: inline-block; vertical-align: middle; float: none; text-align:right; font-family: Helvetica, serif; font-size: 16px;"> <!--Sort By Drop-down menu--><div style="padding-right:7px;"><img src="/img/SortBar.png" style="height:30px; margin-right:3px;"/><span style="font-weight:bold; margin-right:15px;">Sort by</span><button class="btn btn-default dropdown-toggle" data-toggle="dropdown" id="dropdownSortMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><span id="sortText">Relevance</span> <img src="/img/DropdownArrow.png"/></button><ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownSortMenu"><li><a onclick=\'sortDocuments("Relevance");\'>Relevance</a></li><li><a onclick=\'sortDocuments("Title");\'>Title</a></li><li><a onclick=\'sortDocuments("Title (descending)");\'>Title (descending)</a></li><li><a onclick=\'sortDocuments("Date");\'>Date</a></li><li><a onclick=\'sortDocuments("Date (oldest first)");\'>Date (oldest first)</a></li></ul></div></div></div>'
			displayDocuments();
		});
};

var displayDocuments = function() {
	var elementString = "";
	for(var i = 0; i < documents.length; i++) {
		
			elementString += "<div class='active-hover' style='padding:10px'><a href='items?q=" + documents[i]._id + "'><h3 class='document-row'>" + documents[i].title + "</h3></a></br><h4 class='document-row'>Current Version: &nbsp </h4 >" + months[documents[i].date.getMonth()] + " " + documents[i].date.getDate() + ", " + documents[i].date.getFullYear() + "<h4 class='document-row' style='text-indent: 5em;*'>Order Code: &nbsp </h4>" + documents[i]._id + "</br><hr></div>"



//<h4 class='document-row' style='text-indent: 5em;*'>Date: &nbsp </h4>
//			elementString += "<div class='active-hover' style='padding:10px'><a href='items?q=" + documents[i].parsed_metadata.ordercode + "'><h3 class='document-row'>" + documents[i].parsed_metadata.title + "</h3></a></br><h4 class='document-row'>Order Code: &nbsp </h4 >" + documents[i].parsed_metadata.ordercode + "</br><h4 class='document-row' style='text-indent: 5em;*'>Date: &nbsp </h4>" + months[documents[i].parsed_metadata.date.getMonth()] + " " + documents[i].parsed_metadata.date.getDate() + ", " + documents[i].parsed_metadata.date.getFullYear() +"</br><hr></div>"

	}
	//<a href='google.com' ><img src='/img/download.png'/ style='width: 3vw; float: left; padding-right: 10px;'></a>
	elementString += "</br>"
	document.getElementById("outputSearchResult").innerHTML = elementString;
};

var sortDocuments= function(sortBy){
   document.getElementById("sortText").innerHTML = sortBy;
   documents.sort(function(a,b){
       score = [b.score, a.score];
       date = [b.date, a.date];
       title = [a.title.toLowerCase(), b.title.toLowerCase()];
       ordercode = [a._id, b._id];
       if (sortBy === "Relevance") {
          sortOrder = [score, date, title, ordercode];
       } else if (sortBy === "Title") {
	   sortOrder = [title, score, date, ordercode];
       } else if (sortBy === "Title (descending)") {
	   sortOrder = [title.reverse(), score, date, ordercode];
       } else if (sortBy === "Date") {
	   sortOrder = [date, score, title, ordercode];
       } else if (sortBy === "Date (oldest first)") {
	   sortOrder = [date.reverse(), score, title, ordercode];
       }

       var idx = 0;
       while (true) {
          if(sortOrder[idx][0] > sortOrder[idx][1]){
             return 1;
          } else if(sortOrder[idx][1] > sortOrder[idx][0]){
             return -1;
          } else {
             idx+=1;
             if (idx >= sortOrder.length) {
                return 0;
             }
          }
       }
   });
   displayDocuments();

};

function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
};
