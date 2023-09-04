import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import * as CANNON from "cannon-es"


THREE.ColorManagement.enabled = false

/**
 * Debug
 */
const gui = new dat.GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
// Sound
import sound from "./resources/sounds/hit.mp3"
const hitSound=new Audio(sound)
let MaxImpact=0
const playHitSound=(c)=>{
    const impactStrength = c.contact.getImpactVelocityAlongNormal()
    MaxImpact=Math.max(MaxImpact,impactStrength)
    if(impactStrength>1.5){
        hitSound.currentTime=0;
        hitSound.volume=0.5*impactStrength/MaxImpact;
        hitSound.play()
    }
    
}



/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

// const environmentMapTexture = cubeTextureLoader.load([
//     '/textures/environmentMaps/0/px.png',
//     '/textures/environmentMaps/0/nx.png',
//     '/textures/environmentMaps/0/py.png',
//     '/textures/environmentMaps/0/ny.png',
//     '/textures/environmentMaps/0/pz.png',
//     '/textures/environmentMaps/0/nz.png'
// ])

//physics
const world = new CANNON.World()
world.gravity.set(0, -10, 0)
const defaultMat = new CANNON.Material('default')
world.broadphase = new CANNON.SAPBroadphase(world) 
world.allowSleep = true
const sphereShape = new CANNON.Sphere(0.5)
const sphereBody = new CANNON.Body({ mass: 1, position: new CANNON.Vec3(0, 3, 0), shape: sphereShape })
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
const defaultConcatMat = new CANNON.ContactMaterial(defaultMat, defaultMat, { friction: 0.1, restitution: 0.9 })

sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))

floorBody.mass = 0
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
floorBody.addShape(floorShape)



world.defaultContactMaterial = defaultConcatMat
world.addBody(floorBody)
world.addBody(sphereBody)




/**
 * Test sphere
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({
        metalness: 0.3,
        roughness: 0.4,
        envMapIntensity: 0.5
    })
)
sphere.castShadow = true
sphere.position.y = 0.5
scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const objects2update=[]
const sphereGeometry=new THREE.SphereGeometry(1, 32, 32)
const sphereMat=new THREE.MeshStandardMaterial({ metalness: 0.3, roughness: 0.7 })


function createSphere(radius, position) {
    const mesh = new THREE.Mesh(sphereGeometry, sphereMat)
    mesh.scale.set(radius,radius,radius)
    mesh.castShadow = true
    mesh.position.copy(position)
    const shape=new CANNON.Sphere(radius)
    const body=new CANNON.Body({ mass: 1, position: new CANNON.Vec3(position),shape,material: defaultMat })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)
    scene.add(mesh)
    objects2update.push({
        mesh:mesh,
        body:body,
    })

}

createSphere(0.3,{x:2,y:3,z:0})

const BoxGeometry=new THREE.BoxGeometry(1, 1,1)
const BoxMat=new THREE.MeshStandardMaterial({ metalness: 0.3, roughness: 0.7 })


function createBox(w,h,d, position) {
    const mesh = new THREE.Mesh(BoxGeometry, BoxMat)
    mesh.scale.set(w,h,d)
    mesh.castShadow = true
    mesh.position.copy(position)
    const shape=new CANNON.Box(new CANNON.Vec3(w/2,h/2,d/2))
    const body=new CANNON.Body({ mass: 1, position: new CANNON.Vec3(position),shape,material: defaultMat })
    body.position.copy(position)
    world.addBody(body)
    scene.add(mesh)
    objects2update.push({
        mesh:mesh,
        body:body,
    })

}





const debugObj={}
debugObj.createSphere=()=>{
    createSphere(0.3,{x:Math.random()-0.5,
        y:Math.random()+1,
        z:Math.random()-0.5})
}
debugObj.createBox=()=>{
    createBox(Math.random(),Math.random(),Math.random(),{x:Math.random(),
        y:Math.random(),
        z:Math.random()})
}
debugObj.reSet=()=>{
    for(const obj of objects2update){
        obj.body.removeEventListener('collide', playHitSound)
        world.removeBody(obj.body)
        scene.remove(obj.mesh)
    }
    objects2update.splice(0,objects2update.length)
}

gui.add(debugObj,'createSphere')
gui.add(debugObj,'createBox')
gui.add(debugObj,'reSet')
const clock = new THREE.Clock()
let prevTime = 0
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - prevTime
    prevTime = elapsedTime
    // Update controls
    controls.update()
    //update phyics

    sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)
    world.step(1 / 60, deltaTime, 3)
    sphere.position.copy(sphereBody.position)
    for(const obj of objects2update){
        obj.mesh.position.copy(obj.body.position)
        obj.mesh.quaternion.copy(obj.body.quaternion)
    }


    // Update the scene
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()