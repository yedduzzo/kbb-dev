import 'three';
import 'three/OrbitControls';
import 'three/GLTFLoader';
import 'jquery';

document.addEventListener("deviceready", app, false);

//
//      --- ThreeJS canvas rendering ---

function app() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;  // the canvas default
  const near = 1;
  const far = 10;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 4;
  camera.position.y = 0.5;

  const scene = new THREE.Scene();

  
  // Light
  {
    var rearSpotLight = new THREE.SpotLight( 'red' );
    rearSpotLight.position.set( 0, -10, -5 );
    rearSpotLight.intensity = 1;
    scene.add( rearSpotLight );

    var bottomSpotLight = new THREE.SpotLight( 'white' );
    bottomSpotLight.position.set( -5, -5, 20 );
    bottomSpotLight.intensity = 5;
    scene.add( bottomSpotLight );

    var frontRSpotLight = new THREE.SpotLight( 'white' );
    frontRSpotLight.position.set( 5, 15, 10 );
    frontRSpotLight.intensity = 2;
    scene.add( frontRSpotLight );

    var frontLSpotLight = new THREE.SpotLight( 'white' );
    frontLSpotLight.position.set( -5, 15, 10 );
    frontLSpotLight.intensity = 2;
    scene.add( frontLSpotLight );
  }

  
  // Objects
  const gltfLoader = new THREE.GLTFLoader();
  var model;
  var group;
  var axis;

  gltfLoader.load( './assets/models/smallStellatedDodecahedronGOLD.glb', function ( gltf ) {
    model = gltf.scene;  
    group = new THREE.Group();
    axis = new THREE.Vector3(0.5, 0, 0).normalize();
    group.rotateOnAxis(axis, THREE.Math.degToRad(7.5));   // Axis Tilt through group to perserve rotation
    group.add( model );
    // adding group instead of the model to perserve rotation
    scene.add( group );  
  }, undefined, function ( error ) {
    console.error( error );
  } );


  // mouseover class
  class PickHelper {
    constructor() {
      this.raycaster = new THREE.Raycaster();
      this.pickedObject = null;
      this.pickedObjectSavedColor = 0;
    }
    pick(normalizedPosition, scene, camera, time) {
      // restore the color if there is a picked object
      if (this.pickedObject) {
        this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
        this.pickedObject = undefined;
      }
   
      // cast a ray through the frustum
      this.raycaster.setFromCamera(normalizedPosition, camera);
      // get the list of objects the ray intersected
      const intersectedObjects = this.raycaster.intersectObjects(scene.children, true);
      if (intersectedObjects.length > 0) {
        canvas.style.cursor = 'pointer';
        rearSpotLight.intensity = 100;
        frontRSpotLight.intensity = 0;
        frontLSpotLight.intensity = 0;
        if (model) model.rotation.y += 0.2;
      } else {
        canvas.style.cursor = 'auto';
        rearSpotLight.intensity = 1;
        frontRSpotLight.intensity = 2;
        frontLSpotLight.intensity = 2;
        if (model) model.rotation.y += 0.015;
      }
    }
  }
  const pickPosition = {x: 0, y: 0};
  clearPickPosition();
  
  function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * canvas.width  / rect.width,
      y: (event.clientY - rect.top ) * canvas.height / rect.height,
    };
  }
   
  function setPickPosition(event) {
    const pos = getCanvasRelativePosition(event);
    pickPosition.x = (pos.x / canvas.width ) *  2 - 1;
    pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
  }
   
  function clearPickPosition() {
    // unlike the mouse which always has a position
    // if the user stops touching the screen we want
    // to stop picking. For now we just pick a value
    // unlikely to pick something
    pickPosition.x = -100000;
    pickPosition.y = -100000;
  }
   
  window.addEventListener('mousemove', setPickPosition);
  window.addEventListener('mouseout', clearPickPosition);
  window.addEventListener('mouseleave', clearPickPosition);

  const pickHelper = new PickHelper();


  // resizeRenderer
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setPixelRatio( 0.7 );
      renderer.setSize(width, height, false);
    }
    return needResize;
  }


  // Animation
  function render(time) {
    time *= 0.001; // convert to seconds

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    //if (model) model.rotation.y += 0.01;
    pickHelper.pick(pickPosition, scene, camera, time);

    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

}

app();


//
//      --- JQuery HomePage functions ---

// open TextBox chosing from menu
$(document).ready(
  function(){
      $(".unit").click(function () {
          $(".textbox").css("display", "block");
      });
});


// textBox scrollbar Function
$(document).ready(function() {
  $(".tcontent").css("max-height", ($(".textbox").height()-$(".thead").height() - 15 ));
});


// close TextBox clicking X
$(document).ready(
  function(){
      $("#textbox-x").click(function () {
          $(".textbox").css("display", "none");
      });
});

