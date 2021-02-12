import 'three';
import 'three/OrbitControls';
import 'three/GLTFLoader';
//import 'three/GLTFLoader';


function app() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});
  
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;  // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 4;
    camera.position.y = 1;
  
    const scene = new THREE.Scene();
  
    // Light
    {
      var rearSpotLight = new THREE.SpotLight( 'red' );
      rearSpotLight.position.set( 0, -10, -5 );
      rearSpotLight.intensity = 20;
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
  
    gltfLoader.load( 'assets/models/smallStellatedDodecahedronGOLD.glb', function ( gltf ) {
      model = gltf.scene;
      scene.add( model );
    }, undefined, function ( error ) {
      console.error( error );
    } );
  
    // Responsiveness
    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width  = canvas.clientWidth  * pixelRatio | 0;
      const height = canvas.clientHeight * pixelRatio | 0;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }
  
    // Animation
    function render(time) {
      time *= 0.001;
  
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
  
      if (model) model.rotation.y += 0.02;
  
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.render(scene, camera);
  
      requestAnimationFrame(render);
    }
  
    requestAnimationFrame(render);
  }
app();