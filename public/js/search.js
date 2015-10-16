var submit = function(e){
};

$("#mobSearchForm").on("submit", function(e){
    e.preventDefault();
    window.location.href="/result#q=" + document.getElementById("mobSearchInput").value;
    doSearch();
    return false;
});

$("#searchForm").on("submit", function(e){
    e.preventDefault();
    window.location.href="/result#q=" + document.getElementById("searchInput").value;
    doSearch();
    return false;
});

