// Make sure that the home page placeholder text is right
function setWidth(){
   if ($(window).width() < 768) {
     $('#searchInput').attr('placeholder', 'SEARCH');
   }
   else if ($(window).width() >= 768) {
     $('#searchInput').attr('placeholder', 'SEARCH  CRSREPORTS.COM');
   }
}
$(window).on('resize', function(){
setWidth();
});
setWidth();

$("input:text:visible:first").focus();
