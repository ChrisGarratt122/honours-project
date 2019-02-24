var urltopic = getUrlParameter('topic');

console.log(urltopic);

//Arrays of locations and co-ordinates for town square map.
var topiclist = [
    "warlds_end",
    "dalrymple_hall",
    "broad_street",
    "saltoun_square",
    "high_street",
    "kinnaird_lighthouse",
    "marconi",
    "wine_tower",
    "fraserburgh_harbour",
    "trading_harbour"
];

var match = false;
var pagetopic;

$.each(topiclist, function(index, value) {
  // console.log("Currently at " + this);
  if (this == urltopic) {
    console.log("MATCH: " + this);
    match = true;
    //Load the page content

    //Tidy topic value by replacing underscores with whitespace and capitalising leading letters.
    pagetopic = urltopic.replace(/_/g, ' ');
    pagetopic = pagetopic.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

    //Append H1 Page Title
    $(".pagetitle").append("<h1>" + pagetopic + "</h1>");

    //Append link appropriate to topic to <a> tag
    $(".vr-link").attr("href", "/virtualcity?location=" + urltopic);

  }
  var length = ($(topiclist).length - 1);
  console.log("LENGTH: " + length);
  if ( (index == length) && (match == false) ) {
    console.log("NO MATCH - 404;");
    //Load or redirect to 404 page.

    $("body").empty();
    $("body").append("<h1> 404 Page Not Found. </h1>");
  }

});

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};
