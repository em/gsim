var container;
var camera, scene, renderer;
var mesh, group1, group2, group3, light;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  var info = document.createElement( 'div' );
  info.style.position = 'absolute';
  info.style.top = '10px';
  info.style.width = '100%';
  info.style.textAlign = 'center';
  container.appendChild( info );
// 
  /* camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 ); */

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 500;
  camera.up = new THREE.Vector3(0,0,1);

  controls = new THREE.OrbitControls( camera );
  controls.addEventListener( 'change', render );

  scene = new THREE.Scene();



  // tool

  tool = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 10, 20), new THREE.MeshNormalMaterial());

  var line = new THREE.Line( geometry, material );
  tool.rotation.x = Math.PI/2;
  tool.position.z = -20;
  tool.material.transparent = true;
  tool.material.opacity = 0.5;
  scene.add(tool);

  // Grid

  var size = 10, step = 10;

  var geometry = new THREE.Geometry();

  for ( var i = - size; i <= size; i += step ) {

    geometry.vertices.push( new THREE.Vector3( - size, i, 1) );
    geometry.vertices.push( new THREE.Vector3(   size, i, 1 ) );

    geometry.vertices.push( new THREE.Vector3( i, - size, 1 ) );
    geometry.vertices.push( new THREE.Vector3( i, size, 1 ) );

  }

  var material = new THREE.LineBasicMaterial( { color: 0xcccccc, opacity: 0.5 } );

  var line = new THREE.Line( geometry, material );

  line.receiveShadow = true;
  line.type = THREE.LinePieces;
  scene.add( line );

  // Lights

  var ambientLight = new THREE.AmbientLight(0x10);
  scene.add( ambientLight );

  var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
  directionalLight.position.x = Math.random() - 0.5;
  directionalLight.position.y = Math.random() - 0.5;
  directionalLight.position.z = Math.random() - 0.5;
  directionalLight.position.normalize();
  scene.add( directionalLight );

  var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
  directionalLight.position.x = Math.random() - 0.5;
  directionalLight.position.y = Math.random() - 0.5;
  directionalLight.position.z = Math.random() - 0.5;
  directionalLight.position.normalize();
  scene.add( directionalLight );

  renderer = new THREE.CanvasRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
// 
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setClearColor( 0xeeeeee );
  renderer.setSize( window.innerWidth, window.innerHeight );


  container.appendChild( renderer.domElement );

  window.addEventListener( 'resize', onWindowResize, false );
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  // document.addEventListener( 'mousewheel', onMouseWheel, false );
  // document.addEventListener( 'keypress', onKeyPress, false );
  window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {
  mouseX = ( event.clientX - windowHalfX );
  mouseY = ( event.clientY - windowHalfY );
}

function onMouseWheel( event ){
  var delta = 0;

  if (event.wheelDelta) { /* IE/Opera. */
          delta = event.wheelDelta/120;
  } 
  //	firefox
  else if( event.detail ){
    delta = -event.detail/3;
  }

  if (delta)
          handleMWheel(delta);

  event.preventDefault();		
}	

function onKeyPress( event ) {
  var key = String.fromCharCode(event.charCode);

  switch(key) {
    case 't':
      camera.mode = 'fixed';
      camera.position.x = 0;
      camera.position.y = 0;
      camera.position.z = 0;
      break;
  }
}

var zoom = 1;
function handleMWheel( delta ) {
  zoom += delta * 0.1;
  zoom = Math.min(50.0,zoom);
  zoom = Math.max(0.001,zoom);

  camera.fov = 35 * zoom;
  camera.updateProjectionMatrix();
  // camera.fov.set(fov,fov,fov);
}

//
function animate() {
  requestAnimationFrame( animate );

  render();
}

function render() {
  var x = ( mouseX ) * 0.5;
  var y = ( mouseY ) * 0.5;

  // camera.position.z = 100 * zoom;

  var yt = -y / (window.innerHeight/2) + 0.5;
  // camera.position = new THREE.Vector3(0,0,0);
  // camera.position.z = 1000 * yt;


  if(window.simulator) {
    var t = x / (window.innerWidth/2) + 0.5;
    var i = simulator.all.length*t;
    var a = Math.floor(i);
    var b = Math.ceil(i);
    var pa = simulator.all[a];
    var pb = simulator.all[b] || pa;

    var l = (pb.dist - pa.dist)*(t%1);

    var p = pb.clone().sub(pa).setLength(l).add(pa);

    if(p) {
      tool.position = p.clone();
    }
  }

  var d = window.simulator && simulator.meta.tooldiameter || 1; 
  tool.scale.x = d;
  tool.scale.y = d;
  tool.scale.z = d;
  tool.position.z += 5*d;
  // tool.scale.z = d;

  // camera.lookAt( tool.position );

  renderer.render( scene, camera );
}

window.scene = scene;
