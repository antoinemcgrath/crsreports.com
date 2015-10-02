var getUrlParameter = function getUrlParameter(sParam) {
	var sPageURL = decodeURIComponent(window.location.hostname.search.substring(1)),
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
console.log(query);
if (query){
	$.ajax({
		url: "/links_reports/q=" + query,
		method: "GET"
	}).success(function(res){
		console.log(res);
	});
};


