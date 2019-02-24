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

    right_bar = new ProgressBar.Circle('#guide_circle_right', {
        strokeWidth: 10,
        easing: 'easeInOut',
        duration: SELECTION_TIME,
        color: 'lime',
        trailWidth: 2,
        svgStyle: null        });
        //right_bar.animate(1);

    //Stereo scene
    renderer = new THREE.WebGLRenderer({ antialias: true });
    element = renderer.domElement;
    container = document.getElementById('scene');
    container.appendChild(element);

    effect = new THREE.StereoEffect(renderer);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, 1, 0.001, 700);


    // Camera in centre of box
    // camera.position.set(110, -5, 55)

    // Camera at street level
    camera.position.set(110, -240, 50);
    scene.add(camera);

    controls = new THREE.OrbitControls(camera, element);
    //controls.rotateUp(Math.PI / 4);
    controls.target.set(
        camera.position.x + 0.1,
        camera.position.y,
        camera.position.z
    );
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
    // define path and box sides images
    var path = 'textures/';
    var sides = [ path + 'sky.jpg', path + 'sky.jpg', path + 'sky.jpg', path + 'warlds_end.jpg', path + 'sky.jpg', path + 'sky.jpg' ];

    // load images
    scCube = THREE.ImageUtils.loadTextureCube(sides);
    scCube.format = THREE.RGBFormat;

    // prepare skybox material (shader)
    var skyShader = THREE.ShaderLib["cube"];
    skyShader.uniforms["tCube"].value = scCube;
    var skyMaterial = new THREE.ShaderMaterial( {
        fragmentShader: skyShader.fragmentShader, vertexShader: skyShader.vertexShader,
        uniforms: skyShader.uniforms, depthWrite: false, side: THREE.BackSide
    });

    // create Mesh with cube geometry and add to the scene
    var skyBox = new THREE.Mesh(new THREE.BoxGeometry(500, 500, 500), skyMaterial);
    skyMaterial.needsUpdate = true;

    skyBox.UserData = {name:"skyBox"};

    scene.add(skyBox);
}

function drawShapes() {

    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {

        console.log( item, loaded, total );

    };

    var objLoader = new THREE.OBJLoader( manager );
    // objLoader.load( "models/warlds_end.obj", meshloader("models/warld_end.obj"));
    // objLoader.load( "models/heart_charm.obj", meshloader("models/heart_charm.obj"));
    // objLoader.load( "models/clover_charm.obj", meshloader("models/clover_charm.obj"));
    // objLoader.load( "models/star_charm.obj", meshloader("models/star_charm.obj"));

    function meshloader(fileName){
        return function(geometry){

            //Place in scene
            var color;
            if (fileName.indexOf("warlds_end") !== -1){
                color = 0x37FDFC;
                geometry.scale.set(100, 100, 100);
                geometry.position.z = 25;
                geometry.rotation.z = Math.PI / 4;
                geometry.position.y = 10;
                selectableObjs.push(geometry);
                geometry.userData = {name:"warlds_end", touched:false};
                scene.add(geometry);


            }
            //Apply material
            geometry.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    var material = new THREE.MeshPhongMaterial(
                        { color: color,
                            side: THREE.DoubleSide,
                            emissive: 0x000000,
                            envMap: scCube
                        }
                    );
                    child.material = material;
                }
            });

        }
    }

}

//What happens after an object is selected
function postSelectAction(selectedObjectName){
    console.log(
        "The " +
        selectedObjectName +
         " was selected by user. Use this function to create appropriate scene transition."
     );

     document.getElementById("selection_confirmation_overlay").style.display = 'block';


     setTimeout(function() {
         document.getElementById("selection_confirmation_overlay").style.display = 'none';
     }, 250);

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

function getTouchMsg(charm){
    var msg = "That's a " + charm + ", which has the power to ";

    switch (charm) {
        case "heart":
            msg = msg + "bring things to life.";
            msg = msg.replace(charm, "pink " + charm);
            break;
        case "moon":
            msg = msg + "make things invisible.";
            msg = msg.replace(charm, "blue " + charm);
            break;
        case "clover":
            msg = msg + "bring luck (but you never know which kind).";
            msg = msg.replace(charm, "green " + charm);
            break;
        case "star":
            msg = msg + "make things fly (but you already have that).";
            msg = msg.replace(charm, "orange " + charm);
            break;

        }

    return msg + " Keep looking at it to select it."
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

    intersects = getIntersections(selectableObjs);

    if (intersects.length == 0){//nothing being "touched"
        left_bar.set(0.0);//reset any active progress bars to 0
        right_bar.set(0.0);

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
        msg = getTouchMsg(intersects[0].object.parent.userData.name); //update HUD text to register the touch
        updateHUDTxt(msg);
    }

    // effect.render(scene, camera);
    renderer.render(scene, camera);

}

function animate(t) {

    TWEEN.update();

    touchTweenTo.onUpdate(function() {
        animScale = this;
    });

    scene.traverse (function (object)
    {
        if (object instanceof THREE.Group)
        {
            object.rotation.y = object.rotation.y + 0.01;

            if (object.userData.touched){
                object.scale.x = animScale.x;
                object.scale.y = animScale.y;
                object.scale.z = animScale.z;


                if(left_bar.value() == 0){//don't restart progress bar if already progress
                    left_bar.animate(1.0, {
                    }, function() {
                        postSelectAction(object.userData.name);//add callback to left side progress bar to register completed selection
                    });
                }
                if(right_bar.value() == 0){//don't restart if in progress
                    right_bar.animate(1.0);
                }

            }
        }
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