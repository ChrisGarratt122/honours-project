var container;

var camera, controls, scene, renderer;
var lighting, ambient, keyLight, fillLight, backLight;


//Loop through each 3d box on page, changing container variable
//to current DOM element for each
$('.modelbox').each(function(i, obj) {
  container = obj;
  init();
  animate();
  drawGUI();
});

// ----  Code of this page altered but originally inspired from: https://manu.ninja/webgl-3d-model-viewer-using-three-js ----

function init() {

    /* Camera */

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 5;

    /* Scene */

    scene = new THREE.Scene();
    lighting = false;

    ambient = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambient);

    keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
    keyLight.position.set(-100, 0, 100);

    fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
    fillLight.position.set(100, 0, 100);

    backLight = new THREE.DirectionalLight(0xffffff, 1.0);
    backLight.position.set(100, 0, -100).normalize();

    /* Model */

    //Get model required from name specified in html
    var modelstring = container.id;
    console.log("Model string = " + modelstring);

    var mtlLoader = new THREE.MTLLoader();

    //Set directory path of model
    mtlLoader.setPath('models/'+modelstring+'/3dviewer/');
    mtlLoader.load(modelstring+'.mtl', function (materials) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('models/'+modelstring+'/3dviewer/');
        objLoader.load(modelstring+'.obj', function (object) {

            scene.add(object);

        });
    });


    // var loader = new THREE.FBXLoader();
		// 		loader.load( 'models/warlds_end/model/warlds_end.FBX', function ( object ) {
    //
		// 			scene.add( object );
		// 		} );

    /* Renderer */

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize($('#'+modelstring).width(), $('#'+modelstring).height());
    renderer.setClearColor(new THREE.Color("hsl(0, 0%, 10%)"));

    container.appendChild(renderer.domElement);



    /* Controls */

    /* Orbit Controls */

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    /* Events */

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('keydown', onKeyboardEvent, false);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize($('#modelbox').width(), $('#modelbox').height());

}

function onKeyboardEvent(e) {

    if (e.code === 'KeyL') {

        lighting = !lighting;

        if (lighting) {

            ambient.intensity = 0.25;
            scene.add(keyLight);
            scene.add(fillLight);
            scene.add(backLight);

        } else {

            ambient.intensity = 1.0;
            scene.remove(keyLight);
            scene.remove(fillLight);
            scene.remove(backLight);

        }

    }

}

function animate() {

    requestAnimationFrame(animate);

    controls.update();

    render();

}

function render() {

    renderer.render(scene, camera);

}

function drawGUI() {

// Append ui div over canvas

console.log("Drawing GUI");

var uiDiv = "<div id='viewerui'>";
uiDiv = uiDiv + "<div id='verticalUI'> <div class='arrow' id='up'></div> <div class='arrow' id='down'></div>  </div>";
uiDiv = uiDiv + "<p id='uiTxt'>Drag to rotate or scroll to zoom.</p>>";
uiDiv = uiDiv + "<div id='horizontalUI'> <div class='arrow' id='left'></div> <div class='arrow' id='right'></div>  </div>";

// $("#modelbox").append( uiDiv );

$( "canvas" ).before( uiDiv );



}
