var documents = [];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var searchmsgtimeout = null;

function getUrlParameter(sParam) {
	var sPageURL = decodeURIComponent(window.location.hash.substring(1)),
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

function doSearch() {
   var query = getUrlParameter("q"); 
   document.getElementById("resultsHeader").style.visibility = "hidden";
   document.getElementById("outputSearchResult").style.display = "none";

   if(!query){
	document.getElementById("outputSearchResult").innerHTML= "<h3>You did not enter a search. Please enter a keyword to view related reports.</h3>";
   }

   if (query){
        var disp_query = query.replace(new RegExp('\\+','g'), " ");
        document.getElementById("searchInput").value = disp_query;
        document.getElementById("mobSearchInput").value = disp_query;
        searchmsgtimeout = setTimeout(function(){document.getElementById('searching').style.visibility = 'visible';}, 300);
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
                        document.getElementById("numReports").innerHTML = documents.length + " " + reportWord;
                        document.getElementById("resultsHeader").style.visibility = "visible";
			displayDocuments();
		}).error(function(res){
			//If no documents, display a "Search Again" message
		document.getElementById("outputSearchResult").innerHTML = "<h3>The search term you entered did not show any results. Please try another query.</h3>";
			//Code to redirect to Home Page:
			//window.location.href="/";
		});
   };
}

function displayDocuments() {
	var elementString = "";
	for(var i = 0; i < documents.length; i++) {
		
			elementString += "<div class='resultitem'><a href='items?q=" + documents[i]._id + "'><span style='font-size:18px;'>" + documents[i].title + "</span></a></br><span class='document-row' style='font-weight:bold;'>Latest version: &nbsp </span >" + months[documents[i].date.getMonth()] + " " + documents[i].date.getDate() + ", " + documents[i].date.getFullYear() + "<br/><span class='document-row' style='font-weight:bold;'>Order Code: &nbsp; </span>" + documents[i]._id + "<br/></div>"

	}
	elementString += "</br>"
	document.getElementById("outputSearchResult").innerHTML = elementString;
        document.getElementById("outputSearchResult").style.display = "block";
        document.getElementById("searching").style.visibility = "hidden";
        clearTimeout(searchmsgtimeout);
};

function sortDocuments(sortBy){
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

doSearch();
