$("#VRbutton").click(function() {
  console.log("Tried VR click");
  var doc = window.document;
  var docEl = doc.documentElement;
  fullscreen(docEl);
});

var camera, scene, renderer, sphere, cube;
var left_bar, right_bar;
var effect, controls;
var element, container;
var scCube;
var selectableObjs = [];
var width = window.innerWidth, height = window.innerHeight;

var clock = new THREE.Clock();

var min = { x: 100, y: 100, z: 100 }
var touchTweenTo = new TWEEN.Tween(min);
var max = { x: 120, y: 120, z: 120 };

//Set up animation cycle used on touched objects
touchTweenTo.to(max, 200);
touchTweenTo.easing(TWEEN.Easing.Bounce.InOut);
touchTweenTo.repeat(Infinity); // repeats forever
touchTweenTo.start();

var SELECTION_TIME = 2000;

var x, y, z;

var urllocation = getUrlParameter('location');

console.log(urllocation);

//Arrays of locations and co-ordinates for town square map.
var locations = [
    ["warlds_end", 135, -220, 120 ],
    ["dalrymple_hall", 90, -219, 145],
    ["broad_street", 45, -213, -120],
    ["saltoun_square", 40, -213, -185],
    ["high_street", -120, -211, -215]
  ];

  $.each(locations, function(index, value) {

    if (this[0] == urllocation) {
      x = this[1];
      y = this[2];
      z = this[3];

      // urllocation = urllocation + "_map";

      console.log(this[0] + " MATCH:");

      console.log("x = " + x);
      console.log("y = " + y);
      console.log("z = " + z);
    }

    console.log("value test:-");
    console.log(value);
    console.log(this[0]);
});
//Build Three.js scene

init();
animate();

function init() {

    left_bar = new ProgressBar.Circle('#guide_circle_left', {
        strokeWidth: 10,
        easing: 'easeInOut',
        duration: SELECTION_TIME,
        color: 'lime',
        trailWidth: 2,
        svgStyle: null
    });

    // right_bar = new ProgressBar.Circle('#guide_circle_right', {
    //     strokeWidth: 10,
    //     easing: 'easeInOut',
    //     duration: SELECTION_TIME,
    //     color: 'lime',
    //     trailWidth: 2,
    //     svgStyle: null        });
    //     //right_bar.animate(1);

    //Stereo scene
    renderer = new THREE.WebGLRenderer({ antialias: true });
    element = renderer.domElement;
    container = document.getElementById('scene');
    container.appendChild(element);

    effect = new THREE.StereoEffect(renderer);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);

    // Camera in centre of box
    // camera.position.set(0, 0, 0)

    // Camera at street level (warlds_end)
    // camera.position.set(135, -220, 120);

    // Camera at street level (dalrymple_hall)
    // camera.position.set(90, -219, 145);

    // Camera at street level (broad_street)
    // camera.position.set(45, -213, -120);

    // Camera at street level (saltoun_square)
    // camera.position.set(40, -213, -185);

    // Camera at street level (high_street)
    // camera.position.set(-120, -211, -215);

    camera.position.set(x, y, z);


    scene.add(camera);

    controls = new THREE.OrbitControls(camera, element);
    //controls.rotateUp(Math.PI / 4);
    controls.target.set(
        camera.position.x + 0.1,
        camera.position.y,
        camera.position.z,
    );

    // controls = new THREE.FirstPersonControls( camera );
		// controls.movementSpeed = 100;
		// controls.lookSpeed = 0.1;

    //controls.noZoom = true;
    //controls.noPan = true;

    function setOrientationControls(e) {
        if (!e.alpha) {
            return;
        }

        controls = new THREE.DeviceOrientationControls(camera, true);
        controls.connect();
        controls.update();

        element.addEventListener('click', fullscreen, false);

        window.removeEventListener('deviceorientation', setOrientationControls, true);
    }
    window.addEventListener('deviceorientation', setOrientationControls, true);


    // Add lights
    var ambLight = new THREE.AmbientLight( 0x808080 ); // soft white light
    scene.add( ambLight );

    var ptLight = new THREE.PointLight(0xffffff, 1.75, 1000);
    ptLight.position.set(-100, 100, 100);
    scene.add(ptLight);

    //Add other scene elements
    drawSimpleSkybox();
    drawShapes();

    window.addEventListener('resize', resize, false);
    setTimeout(resize, 1);
}

function drawSimpleSkybox() {
  ///ENTIRE SECTION TAKEN FROM - THREE.JS EXAMPLE : https://threejs.org/examples/?q=sky#webgl_shaders_sky

  // Add Sky
  sky = new THREE.Sky();
  sky.scale.setScalar( 450000 );
  scene.add( sky );
  // Add Sun Helper
  sunSphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry( 20000, 16, 8 ),
    new THREE.MeshBasicMaterial( { color: 0xffffff } )
  );
  sunSphere.position.y = - 700000;
  sunSphere.visible = false;
  scene.add( sunSphere );
  /// GUI
  var effectController  = {
    turbidity: 4.8,
    rayleigh: 1.014,
    mieCoefficient: 0.005,
    mieDirectionalG: 1,
    luminance: 1.1,
    inclination: 0, // elevation / inclination
    azimuth: 0.2319, // Facing front,
    sun: true
  };
  var distance = 400000;
  function guiChanged() {
    var uniforms = sky.material.uniforms;
    uniforms[ "turbidity" ].value = effectController.turbidity;
    uniforms[ "rayleigh" ].value = effectController.rayleigh;
    uniforms[ "luminance" ].value = effectController.luminance;
    uniforms[ "mieCoefficient" ].value = effectController.mieCoefficient;
    uniforms[ "mieDirectionalG" ].value = effectController.mieDirectionalG;
    var theta = Math.PI * ( effectController.inclination - 0.5 );
    var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );
    sunSphere.position.x = distance * Math.cos( phi );
    sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
    sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );
    sunSphere.visible = effectController.sun;
    uniforms[ "sunPosition" ].value.copy( sunSphere.position );
    renderer.render( scene, camera );
  }

  guiChanged();

}

function drawShapes() {


    // Declaring loading manager - displays name, status and load time of models in console
    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {

        console.log( item, loaded, total );

    };

    //Declaring mtl and object loaders. Loading relevant map object.
    var mtlLoader = new THREE.MTLLoader( manager );

    mtlLoader.setPath('models/' + urllocation + '/');
    mtlLoader.load(urllocation + '.mtl', function (materials) {

      materials.preload();

      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath('models/' + urllocation + '/');
      objLoader.load(urllocation + '.obj', function (object) {
        object.position.z = 215;
        object.position.x =  15;
        // object.rotation.z = Math.PI / 4;
        object.position.y = -230;
        selectableObjs.push(object);

        scene.add(object);

      });
    });

    //Loading relevant building model


    mtlLoader.setPath('models/' + urllocation + '/model/');
    mtlLoader.load(urllocation + '.mtl', function (materials) {

      materials.preload();

      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath('models/' + urllocation + '/model/');
      objLoader.load(urllocation + '.obj', function (object) {
        object.position.z = 115;
        object.position.x =  124;
        object.position.y = -220;

        // object.rotation.z = Math.PI / 4;
        // object.rotation.x = Math.PI / 4;
        object.rotation.y = Math.PI / 2;

        object.userData = {name:"warlds_end", touched:false};
        selectableObjs.push(object);

        scene.add(object);

      });
    });

    // var loader = new THREE.FBXLoader();
		// 		loader.load( 'models/warlds_end/model/warlds_end.fbx', function ( object ) {
    //
    //       object.position.z = 120;
    //       object.position.x = 130;
    //       object.position.y = -219;
    //
		// 			scene.add( object );
		// 		} );



}

//What happens after an object is selected
function postSelectAction(selectedObjectName){
    // console.log(
    //     "The " +
    //     selectedObjectName +
    //      " was selected by user. Use this function to create appropriate scene transition."
    //  );

     // document.getElementById("selection_confirmation_overlay").style.display = 'block';
     //
     //
     // setTimeout(function() {
     //     document.getElementById("selection_confirmation_overlay").style.display = 'none';
     // }, 250);

}

function getIntersections(objects){
    var raycaster = new THREE.Raycaster();

    var vector = new THREE.Vector3( 0, 0, - 1 );
    vector.applyQuaternion( camera.quaternion );

    raycaster.set( camera.position, vector );

    return raycaster.intersectObjects( objects, true );

}

function updateHUDTxt(msg){
    x=document.getElementsByClassName("info_text");  // Find the elements
    for(var i = 0; i < x.length; i++){
        x[i].innerText=msg;    // Change the content
    }
}

function getTouchMsg(bubble){
    var msg = "";

    switch (bubble) {
        case "warlds_end":
            msg = msg + "During the 18th century, Fraserburgh became a hotbed of Jacobite resistance. This was also reflected in Lord Saltoun’s opposition to the Act of the Union with England in 1707. \n Fraserburgh had manned gates, and a garrison built against the southern edge of the town, probably in the grounds of the building in front of you; Warld’s End. This house is considered to be the oldest in Fraserburgh, built over the original house, which was the summer residence of the staunchly Jacobite family, the Gordons of Glenbuchat.";
            break;
        // case "moon":
        //     msg = msg + "make things invisible.";
        //     msg = msg.replace(charm, "blue " + charm);
        //     break;
        }
    return msg
}

function resize() {
    var width = container.offsetWidth;
    var height = container.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    effect.setSize(width, height);
}

function update(dt) {
    resize();

    camera.updateProjectionMatrix();

    controls.update(dt);

}

function render(dt) {

    updateHUDTxt(""); //Set HUD txt to blank to start render loop.

    /*Establishing Selection of Object*/

    intersects = getIntersections(selectableObjs);

    if (intersects.length == 0){//nothing being "touched"
        left_bar.set(0.0);//reset any active progress bars to 0
        // right_bar.set(0.0);

        //Loop over all OBJ objects (the charms)
        scene.traverse (function (object)
        {
            //Set all charms touch flag to false as nothing is selected.
            if (object instanceof THREE.Group){
                if (intersects.length == 0){
                    object.userData.touched = false;
                }
            }
        });
    } else {//something being touched
        //Set the touched charm's touch flag to true, so we can give it special treatment in the animation function
        intersects[0].object.parent.userData.touched = true;
        // console.log(intersects[0].object.parent.userData.name);
        msg = getTouchMsg(intersects[0].object.parent.userData.name); //update HUD text to register the touch
        updateHUDTxt(msg);
    }


    effect.render(scene, camera);
    // renderer.render(scene, camera);

}

function animate(t) {

    TWEEN.update();

    /*Progress Bar*/

    touchTweenTo.onUpdate(function() {
        animScale = this;
    });

    requestAnimationFrame(animate);

    update(clock.getDelta());
    render(clock.getDelta());
}

function fullscreen(container) {
    if (container.requestFullscreen) {
        container.requestFullscreen();
    } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
    } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
    } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
    }
}

//Code inspired by: http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html

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
