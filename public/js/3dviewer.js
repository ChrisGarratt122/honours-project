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

// init();
// animate();
// drawGUI();

function init() {

    // container = document.getElementById('modelbox');
    // document.body.appendChild(container);

    /* Camera */

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 3;

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

    /* Utilities */

    // var axisHelper = new THREE.AxisHelper( 1.50 );
    // scene.add( axisHelper );
    //
    //
    // var radius = 2;
    // var radials = 0;
    // var circles = 1;
    // var divisions = 0;
    //
    // var helper = new THREE.PolarGridHelper( radius, radials, circles, divisions );
    // scene.add( helper );

    /* Model */

    //Get model required
    var modelstring = container.id;
    console.log("Model string = " + modelstring);

    var mtlLoader = new THREE.MTLLoader();
    // mtlLoader.setBaseUrl('assets/');
    mtlLoader.setPath('models/'+modelstring+'/');
    mtlLoader.load(modelstring+'.mtl', function (materials) {
    // mtlLoader.load('female-croupier-2013-03-26.mtl', function (materials) {
    // mtlLoader.load('test_building_recap_photo.mtl', function (materials) {

        materials.preload();

        // materials.materials.default.map.magFilter = THREE.NearestFilter;
        // materials.materials.default.map.minFilter = THREE.LinearFilter;

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('models/'+modelstring+'/');
        objLoader.load(modelstring+'.obj', function (object) {
        // objLoader.load('test_building_recap_photo.obj', function (object) {

            scene.add(object);

        });

    });

    /* Renderer */

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize($('#'+modelstring).width(), $('#'+modelstring).height());
    renderer.setClearColor(new THREE.Color("hsl(0, 0%, 10%)"));

    container.appendChild(renderer.domElement);



    /* Controls */


    /* Trackball Contols */

    // controls = new THREE.TrackballControls( camera );
    // controls.rotateSpeed = 5.0;
    // controls.zoomSpeed = 3.2;
    // controls.panSpeed = 0.8;
    // controls.noZoom = false;
    // controls.noPan = true;
    // controls.staticMoving = false;
    // controls.dynamicDampingFactor = 0.2;

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
