var submit = function(e){
};

$("#mobSearchForm").on("submit", function(e){
    e.preventDefault();
    var q = document.getElementById("mobSearchInput").value;
    if (q.trim().length) {
	window.location.href="/result#q=" + q;
	$(document.activeElement).blur();
	return false;
    }
});

$("#searchForm").on("submit", function(e){
    e.preventDefault();
    var q = document.getElementById("searchInput").value;
    if (q.trim().length) {
	window.location.href="/result#q=" + q;
	$(document.activeElement).blur();
	return false;
    }
});

