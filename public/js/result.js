var documents = [];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var searchmsgtimeout = null;
var cleared = false;

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

// If we have a report
function doReport(report){
    document.getElementById("searchInput").value = '';
    document.getElementById("mobSearchInput").value = '';
        $( window ).load(function() {
            document.getElementById("thebody").style.display ='block';
        });

       document.getElementById("resultsHeader").style.visibility = "hidden";
   document.getElementById("itemBar").style.display = "block";
   document.getElementById("resultsBar").style.display = "none";

    document.getElementById("outputSearchResult").style.display = "none";
    cleared = false;
    searchmsgtimeout = setTimeout(function(){if (!cleared) document.getElementById('searching').style.display = 'block';}, 300);

    $.ajax({
                url: "/getitem?q=" + report,
                method: "GET"
        }).success(function(res){
                for(var i = 0, j = res.length; i < j; i++){
                        res[i]._id = parseDate(res[i]._id);
		    };

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
                document.getElementById("itemTitle").innerHTML = res[0].title;

	    var elementString = "<a href='/download?hash=" + res[0].sha256 + "'><span style='display:table-cell;'><img src='/img/download.png' style='padding-right: 10px; width: 60px;' /></span><span style='display:table-cell;'><h4>Latest version: "
	    + months[res[0]._id.getMonth()]
	    + " " + res[0]._id.getDate()
	    + ", " + res[0]._id.getFullYear() +"</h4></span></a>";

	    if (res.length > 1) {
		elementString += "<hr><h4> Additional versions </h4><div style='margin-left: 20px;'><table style='font-size:16px;'>";

for(var i = 1; i < res.length; i++) {
    elementString += "<tr><td style='padding:5px; white-space:nowrap;'>"
	+ " " + months[res[i]._id.getMonth()]
	+ " " + res[i]._id.getDate()
	+ ", " + res[i]._id.getFullYear()
	+ "</td><td style='padding:5px;'>" + 
	"<a href='/download?hash=" + res[i].sha256 + "'>"
	+ res[i].title
	+"</a></td></tr>"
}

elementString += "</table>";

};
        clearTimeout(searchmsgtimeout);
cleared = true;
document.getElementById("outputSearchResult").innerHTML = elementString;
document.getElementById("outputSearchResult").style.display = "block";
//document.getElementById("searching").style.visibility = "hidden";
document.getElementById("searching").style.display = "none";
document.getElementById("resultsHeader").style.visibility = "visible";

});
}




function doSearch(query) {
   document.getElementById("resultsHeader").style.visibility = "hidden";
   document.getElementById("itemBar").style.display = "none";
   document.getElementById("resultsBar").style.display = "block";
   document.getElementById("outputSearchResult").style.display = "none";

//   if(!query){
//	document.getElementById("outputSearchResult").innerHTML= "<h3>You did not enter a search. Please enter a keyword to view related reports.</h3>";
//   }

   if (query){
        var disp_query = query.replace(new RegExp('\\+','g'), " ");
        document.getElementById("searchInput").value = disp_query;
        document.getElementById("mobSearchInput").value = disp_query;
        $( window ).load(function() {
            document.getElementById("thebody").style.display ='block';
        });

       cleared = false;
        searchmsgtimeout = setTimeout(function(){if (!cleared) document.getElementById('searching').style.display = 'block';}, 300);
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
		
			elementString += "<div class='resultitem'><a href='result#r=" + documents[i]._id + "'><span style='font-size:18px;'>" + documents[i].title + "</span></a></br><span class='document-row' style='font-weight:bold;'>Latest version: &nbsp </span >" + months[documents[i].date.getMonth()] + " " + documents[i].date.getDate() + ", " + documents[i].date.getFullYear() + "<br/><span class='document-row' style='font-weight:bold;'>Order Code: &nbsp; </span>" + documents[i]._id + "<br/></div>"

	}
	elementString += "</br>"
        clearTimeout(searchmsgtimeout);
    cleared = true;
	document.getElementById("outputSearchResult").innerHTML = elementString;
        document.getElementById("outputSearchResult").style.display = "block";
//        document.getElementById("searching").style.visibility = "hidden";
    document.getElementById("searching").style.display = "none";


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
  return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
};

// On hash change
window.onpopstate = function(event)
{
    var report = getUrlParameter("r");
    if (report) {
	doReport(report);
    }

    var query = getUrlParameter("q");
    if(query) {
	doSearch(query);
    }
};

var report = getUrlParameter("r");
if (report) {
    doReport(report);
}

var query = getUrlParameter("q");
if(query) {
    doSearch(query);
}
