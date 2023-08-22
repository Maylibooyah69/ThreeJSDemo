import React from 'react';
import * as THREE from 'three';
import gsap from 'gsap'

console.log(gsap)
const scene = new THREE.Scene()
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
const cube = new THREE.Mesh( geometry, material );
const cube2=new THREE.Mesh( geometry, material );
cube2.rotation.set(0.5,0.5,0.5)
cube2.position.set(0.5,0.5,0.5)
const cube3=new THREE.Mesh( geometry, material );
cube3.rotation.set(0.5,1.5,3.5)
cube3.position.set(-0.5,-0.5,0.5)
//scaling 
cube.scale.set( 0.5, 2.5, 0.5)
//rotationc
cube.rotation.reorder("YZX")
cube.rotation.set( 0.5, 1.5,Math.PI)
const threeCube=new THREE.Group()
scene.add(threeCube)
threeCube.add( cube,cube3,cube2 )

threeCube.position.set( 1,1,2)
threeCube.scale.set( 1,1,1)


const sizes={width:800,height:600}
const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height);
scene.add( camera );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( sizes.width,sizes.height );
document.body.appendChild( renderer.domElement );
camera.position.z = 5;
camera.position.y=0.1;
camera.position.x=-0.1;

const axesHelper=new THREE.AxesHelper( 10 );
scene.add( axesHelper );




console.log(camera.position.length())
renderer.render( scene, camera );
gsap.to(cube.position,{x:2, duration:1, delay:1})
//animation
const clock = new THREE.Clock()
function animate() {
    requestAnimationFrame( animate );
    const delta_t = clock.getElapsedTime();


    cube.rotation.x = Math.sin(delta_t)*Math.cos(2*delta_t);
    cube.rotation.y = Math.sin(delta_t)*Math.cos(2*delta_t);
    cube.rotation.z = Math.sin(delta_t)*Math.cos(2*delta_t);
    cube2.rotation.x = Math.sin(delta_t)*Math.cos(2*delta_t);
    cube2.rotation.y = Math.sin(delta_t)*Math.cos(2*delta_t);
    cube2.rotation.z = Math.sin(delta_t)*Math.cos(2*delta_t);
    cube3.rotation.x = Math.sin(delta_t)*Math.cos(2*delta_t);
    cube3.rotation.y = Math.sin(delta_t)*Math.cos(2*delta_t);
    cube3.rotation.z = Math.sin(delta_t)*Math.cos(2*delta_t);

    camera.position.x=Math.sin(delta_t)
    camera.lookAt(cube2.position)
    renderer.render( scene, camera );
}
animate()