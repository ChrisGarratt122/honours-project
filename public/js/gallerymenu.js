//Elements added using names in array.

//ADDING EXTRA IMAGES ---- DO NOT NEED TO CHANGE ANYTHING ELSE (Make sure entry is the same as corresponding image file name.)
//To add an image link, append the name of the image to the array.
var imagearray = ['outside_stairs','tunnel_stairs','tunnel1','tunnel2', 'tunnel3', 'tunnel4', 'tunnel5'];

var count = 1;

$('.carousel-control-prev').hide();
$('.carousel-control-next').hide();

$.each(imagearray, function(index, value) {
  console.log(value);

  //Replacing underlines and capitalising words to make 'tidy' string to br displayed
  var tidyvalue = value.replace(/_/g, ' ');
  tidyvalue = tidyvalue.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});

  var htmlstring = '<div class="col-md-3">';
  htmlstring += '<div class="link-container">';
  htmlstring += '<a href="/a-tour?image=' + value + '">';
  htmlstring += '<div class="image-thumb" id="thumb' + value + '">';
  htmlstring += '</div>';
  htmlstring += '<p>' + tidyvalue + '</p>';
  htmlstring += '</a>';
  htmlstring += '</div>';
  htmlstring += '</div>';

  console.log(htmlstring);
  console.log("Appending a new link box.");

  $(".row:last").append(htmlstring);

  if (count == 4) {
    console.log("Count is 4");
    // count = 1
    // $(".menu-container").append("<div class='row'> </div>");
    $(".carousel-item:last").append("<div class='row'> </div>");
  }
  if (count == 8) {
    console.log("Count is 8. Resetting.");
    count = 1;

    htmlstring = "<div class='carousel-item'>";
    htmlstring += "<div class='row'>";
    htmlstring += "</div>";
    htmlstring += "</div>";

    $(".carousel-control-prev").show();
    $(".carousel-control-next").show();

    console.log("Appenbding new item: " + htmlstring);

    $(".carousel-inner").append(htmlstring);
  }

  count ++;

  var elementid = document.getElementById("thumb" + value);
  var attribute = "background-image";
  // var cssvalue = "url('/img/360gallery/" + value + ".jpg')";
  var cssvalue = "url('/img/360gallery/" + value + ".jpg')";
  console.log(elementid);
  console.log(attribute);
  console.log(cssvalue);

  // $(elementid).css(attribute, cssvalue);
  $(elementid).css(attribute, cssvalue);

});
