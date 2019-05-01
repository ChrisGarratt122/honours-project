// There are problems lining up the vr sterographic view for different makes of phone
// Samsung Galaxy S8 (Original Testing Device) has problems in particular and the following Code
// fixes it,although this is device specific... --------COMMENT IF NOT GALAXY S8--------
// window.webvrpolyfill.polyfillDisplays[0].deviceInfo_.viewer.interLensDistance = 0.050;

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
window.webvrpolyfill.polyfillDisplays[0].deviceInfo_.viewer.interLensDistance = 0.050;
}

var urlimage = getUrlParameter('image');

console.log(urlimage);

//Following is an array of images in the tour. make sure it matches with all 360 images defined in a-assets in html
//First index is the name of the image found in the url, second is the corresponding a-asset name

//ST ANDREWS TEST IMAGES
// var images = [
//     ["outside_stairs", "image1" ],
//     ["tunnel_stairs", "image2" ],
//     ["tunnel1", "image3" ],
//     ["tunnel2", "image4" ],
//     ["tunnel3", "image5" ],
//     ["tunnel4", "image6" ],
//     ["tunnel5", "image7" ]
//   ];

//Fraserburgh
var images = [
    ["PHOTO_0332", "image1" ],
    ["PHOTO_0335", "image2" ],
    ["PHOTO_0336", "image3" ],
    ["PHOTO_0338", "image4" ],
    ["PHOTO_0342", "image5" ],
    ["PHOTO_0344", "image6" ],
    ["PHOTO_0348", "image7" ],
    ["PHOTO_0350", "image8" ],
    ["PHOTO_0353", "image9" ],
    ["PHOTO_0354", "image10" ],
    ["PHOTO_0356", "image11" ],
    ["PHOTO_0358", "image12" ],
    ["PHOTO_0360", "image13" ],
    ["PHOTO_0361", "image14" ],
    ["PHOTO_0364", "image15" ],
    ["PHOTO_0366", "image16" ]
  ];

  var matchimage;
  var assetimage;
  var match = false;

$.each(images, function(index, value) {


    if (this[0] == urlimage) {
      console.log("MATCH: " + this[0]);
      console.log("ASSET: " + this[1]);
      matchimage = this[0];
      assetimage = this[1];
      match = true;

      console.log("CREATING SKY");
      // $("#landing").attr("src", "/img/360gallery/" + matchimage + ".jpg");
      // $("#cam").before("<a-sky id='skybox' src='#" + assetimage + "'></a-sky>");
      $("#skybox").attr("src", "#" + assetimage);

      console.log("Scaling #group-" + assetimage);
      $("#group-" + assetimage).attr("scale", "1 1 1");



    }
    // if (match == true) {
    //   console.log("Appending sky.");
    //   // $("#landing").src("/img/360gallery/" + matchimage + ".jpg");
    //   $("#landing").attr("src", "/img/360gallery/" + matchimage + ".jpg");
    //
    // }
    //
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
