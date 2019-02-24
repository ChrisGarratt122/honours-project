var urlimage = getUrlParameter('image');

console.log(urlimage);

//Following is an array of images in the tour. make sure it matches with all 360 images defined in a-assets in html
//First index is the name of the image found in the url, second is the corresponding a-asset name
var images = [
    ["outside_stairs", "image1" ],
    ["tunnel_stairs", "image2" ],
    ["tunnel1", "image3" ],
    ["tunnel2", "image4" ],
    ["tunnel3", "image5" ],
    ["tunnel4", "image6" ],
    ["tunnel5", "image7" ]
  ];

  var matchimage;
  var match = false;

$.each(images, function(index, value) {

    if (this[0] == urlimage) {
      console.log("MATCH: " + this[0]);
      console.log("ASSET: " + this[1]);
      matchimage = this[0];
      match = true;

      // $("#landing").attr("src", "/img/360gallery/" + matchimage + ".jpg");
      // $("#cam").before("<a-sky id='skybox' src='" + assetimage + "'></a-sky>");
      // $("#skybox").attr("src", assetimage);

    }
    // if (match == true) {
    //   console.log("Appending sky.");
    //   // $("#landing").src("/img/360gallery/" + matchimage + ".jpg");
    //   $("#landing").attr("src", "/img/360gallery/" + matchimage + ".jpg");
    //
    // }

    var length = ($(images).length - 1);
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
