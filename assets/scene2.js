import React from 'react';
import * as THREE from 'three';
import gsap from 'gsap'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';


//debug
import GUI from 'lil-gui';
const gui=new GUI();




//base

THREE.ColorManagement.enabled = false

// set and adjust size of the canvas
const canvas = document.getElementById('webgl');
const sizes={width:window.innerWidth,height:window.innerHeight}
window.addEventListener('resize',()=>{
    sizes.width=window.innerWidth
    sizes.height=window.innerHeight
    console.log(sizes)
    //update camera
    camera.aspect=sizes.width/sizes.height
    camera.updateProjectionMatrix()
    //update renderer
    renderer.setSize( sizes.width,sizes.height );
    // renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})
window.addEventListener('dblclick',()=>{
    console.log('dblclick')
    if (!document.fullscreenElement){
        canvas.requestFullscreen()
    }
    else{
        document.exitFullscreen()
    }
})


const scene = new THREE.Scene()
const geometry = new THREE.BoxGeometry( 1, 1, 1 );


const loadingmanager=new THREE.LoadingManager()
loadingmanager.onStart=()=>{
    console.log('start')
}
loadingmanager.onProgress=()=>{
    console.log('progressing')
}
const textureloader=new THREE.TextureLoader(loadingmanager)
const cubetextureloader=new THREE.CubeTextureLoader(loadingmanager)


// organize imports into a separate file
import nx from "./resources/textures/environmentMaps/0/nx.jpg"
import ny from "./resources/textures/environmentMaps/0/ny.jpg"
import nz from "./resources/textures/environmentMaps/0/nz.jpg"
import px from "./resources/textures/environmentMaps/0/px.jpg"
import py from "./resources/textures/environmentMaps/0/py.jpg"
import pz from "./resources/textures/environmentMaps/0/pz.jpg"
const environmentMapTexture = cubetextureloader.load([px,nx,py,ny,pz,nz])

import Cimg from "./resources/door/color.jpg"
// import Cimg from "./resources/checkerboard-8x8.png"
const colorTexture=textureloader.load(Cimg)
import Nimg from "./resources/door/normal.jpg"
const normalTexture=textureloader.load(Nimg)
import Himg from "./resources/door/height.jpg"
const heightTexture=textureloader.load(Himg)
import Aimg from "./resources/door/alpha.jpg"
const alphaTexture=textureloader.load(Aimg)
import Rimg from "./resources/door/roughness.jpg"
const roughTexture=textureloader.load(Rimg)
import Mimg from "./resources/door/metalness.jpg"
const metalnessTexture=textureloader.load(Mimg)
import mcat1path from "./resources/textures/matcaps/1.png"
const mcat1=textureloader.load(mcat1path)
import gradpath from "./resources/textures/gradients/3.jpg"
const grad=textureloader.load(gradpath)
import aopath from "./resources/door/ambientOcclusion.jpg"
const ambientOcclusionTexture=textureloader.load(aopath)
grad.magFilter = THREE.NearestFilter
grad.minFilter = THREE.NearestFilter

// colorTexture.repeat.x=3
// colorTexture.repeat.y=3
// colorTexture.wrapS = THREE.RepeatWrapping
// colorTexture.wrapT = THREE.RepeatWrapping
gui.add(colorTexture.offset,'x',0,2).name('texture offset x')
gui.add(colorTexture,'rotation',0,Math.PI*2).name('texture rotation')
colorTexture.center.set(0.5,0.5)
// colorTexture.offset.x=0.5
colorTexture.rotation=0
// colorTexture.minFilter = THREE.NearestFilter
// colorTexture.minFilter = THREE.LinearFilter
colorTexture.magFilter = THREE.NearestFilter


// const material = new THREE.MeshBasicMaterial( {map:colorTexture,alphaMap:alphaTexture } );
// material.transparent = true
// material.side= THREE.DoubleSide
// gui.add(material,'transparent')
// gui.addColor(material,'color')


// const material = new THREE.MeshNormalMaterial( {} );
// material.flatShading=true

// const material = new THREE.MeshMatcapMaterial( {matcap:mcat1} );
// const material = new THREE.MeshDepthMaterial();
// const material = new THREE.MeshLambertMaterial();
// const material = new THREE.MeshPhongMaterial({color:'red'});
// const material = new THREE.MeshToonMaterial({gradientMap:grad});
const material = new THREE.MeshStandardMaterial();
material.metalness=0.7
material.roughness=0.2
// material.map=colorTexture
material.envMap=environmentMapTexture
// material.aoMap=ambientOcclusionTexture
// material.displacementMap=heightTexture
// material.metalnessMap=metalnessTexture
// material.normalMap=normalTexture


gui.add(material,'metalness',0,1,0.01).name('material metalness')
gui.add(material,'roughness',0,1,0.01).name('material roughness')
// gui.add(material,'aoMapIntensity',0,5,0.01).name('material aoMapIntensity')
// gui.add(material,'transparent')
// gui.add(material,'displacementScale',0,5,0.01).name('material displacementScale')

const ambientLight = new THREE.AmbientLight( 0xffffff,0.5 );
const pointLight = new THREE.PointLight(0xffffff, 60000 )
pointLight.position.set( 50, 50, 50 );
scene.add(pointLight,ambientLight);
// scene.add(ambientLight);

// material.specular=new THREE.Color(0x00ff00)


const cube = new THREE.Mesh( geometry, material );
const sphere =new THREE.Mesh( new THREE.SphereGeometry(0.5,16,16), material );
const plane =new THREE.Mesh( new THREE.PlaneGeometry(1,1,64,64), material);
const torus =new THREE.Mesh( new THREE.TorusGeometry(0.3,0.2,128,128), material );
sphere.position.set(1,0.5)
torus.position.set(0.5,2)
plane.position.set(-1,1)
const threeCube=new THREE.Group()
scene.add(threeCube)
threeCube.add(sphere,cube,plane,torus)



const params={
    spin:()=>{
        gsap.to(cube.position, { duration:1,y:1+cube.position.y%5,})
    }
}

gui.add(cube.position,'y',-3,3,0.01)
gui.add(cube,'visible')
gui.add(cube.material,'wireframe')
gui.add(params,'spin')

const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height,0.1,100);
const aspect_ratio = sizes.width/sizes.height
// const camera = new THREE.OrthographicCamera(-1*aspect_ratio,1*aspect_ratio,1,-1,0.1,100);
scene.add( camera );



const renderer = new THREE.WebGLRenderer({canvas:canvas});
renderer.setSize( sizes.width,sizes.height );
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
renderer.outputColorSpace = THREE.LinearSRGBColorSpace

// document.body.appendChild( renderer.domElement );
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;



camera.position.z = 3;
camera.position.y=0.1;
camera.position.x=-0.1;

const axesHelper=new THREE.AxesHelper( 10 );
scene.add( axesHelper );




renderer.render( scene, camera );
//animation
const clock = new THREE.Clock()
function animate() {
    requestAnimationFrame( animate );
    const delta_t = clock.getElapsedTime();

    controls.update()

    cube.rotation.x = Math.sin(delta_t)*Math.cos(2*delta_t);
    cube.rotation.y = Math.sin(delta_t)*Math.cos(2*delta_t);
    cube.rotation.z = Math.sin(delta_t)*Math.cos(2*delta_t);

    sphere.rotation.y = Math.sin(delta_t)*Math.PI
    torus.rotation.z=delta_t
    renderer.render( scene, camera );
}
animate()