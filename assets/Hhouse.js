import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false



/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')




// Scene
const scene = new THREE.Scene()
const fog = new THREE.Fog('#262837', 1, 15)
scene.fog = fog
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
import doorColor from './resources/textures/door/color.jpg'
const doorColorTexture = textureLoader.load(doorColor)
import doorAlpha from './resources/textures/door/alpha.jpg'
const doorAlphaTexture = textureLoader.load(doorAlpha)
import doorNormal from './resources/textures/door/Normal.jpg'
const doorNormalTexture = textureLoader.load(doorNormal)
import doorroughness from './resources/textures/door/roughness.jpg'
const doorroughnessTexture = textureLoader.load(doorroughness)
import doorheight from './resources/textures/door/height.jpg'
const doorheightTexture = textureLoader.load(doorheight)
import doorAmbientOcclusion from './resources/textures/door/AmbientOcclusion.jpg'
const doorAmbientOcclusionTexture = textureLoader.load(doorAmbientOcclusion)

import brickColor from './resources/textures/bricks/color.jpg'
const brickColorTexture = textureLoader.load(brickColor)
import brickAmbientOcclusion from './resources/textures/bricks/AmbientOcclusion.jpg'
const brickAmbientOcclusionTexture = textureLoader.load(brickAmbientOcclusion)
import brickNormal from './resources/textures/bricks/Normal.jpg'
const brickNormalTexture = textureLoader.load(brickNormal)
import brickRoughness from './resources/textures/bricks/Roughness.jpg'
const brickRoughnessTexture = textureLoader.load(brickRoughness)

import grasColor from './resources/textures/grass/color.jpg'
const grasColorTexture = textureLoader.load(grasColor)
import grasAmbientOcclusion from './resources/textures/grass/AmbientOcclusion.jpg'
const grasAmbientOcclusionTexture = textureLoader.load(grasAmbientOcclusion)
import grasNormal from './resources/textures/grass/Normal.jpg'
const grasNormalTexture = textureLoader.load(grasNormal)
import grasRoughness from './resources/textures/grass/Roughness.jpg'
const grasRoughnessTexture = textureLoader.load(grasRoughness)
grasColorTexture.repeat.set(8,8)
grasColorTexture.wrapS=THREE.RepeatWrapping
grasColorTexture.wrapT=THREE.RepeatWrapping
grasAmbientOcclusionTexture.repeat.set(8,8)
grasAmbientOcclusionTexture.wrapS=THREE.RepeatWrapping
grasAmbientOcclusionTexture.wrapT=THREE.RepeatWrapping
grasNormalTexture.repeat.set(8,8)
grasNormalTexture.wrapS=THREE.RepeatWrapping
grasNormalTexture.wrapT=THREE.RepeatWrapping
grasRoughnessTexture.repeat.set(8,8)
grasRoughnessTexture.wrapS=THREE.RepeatWrapping
grasRoughnessTexture.wrapT=THREE.RepeatWrapping


/**
 * House
 */
// group
const house = new THREE.Group()
scene.add(house)

//walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(3.5, 3, 3.5),
    new THREE.MeshStandardMaterial({ map:brickColorTexture,aoMap: brickAmbientOcclusionTexture, transparent: true,
        normalMap: brickNormalTexture,roughnessMap: brickRoughnessTexture})
)
walls.position.y = 1.5
house.add(walls)
//roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial()
)
roof.position.y = 3.5
roof.rotation.y = Math.PI * 0.25
house.add(roof)

//door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2,64,64),
    new THREE.MeshStandardMaterial({ map: doorColorTexture, alphaMap: doorAlphaTexture, transparent: true, normalMap: doorNormalTexture, roughnessMap: doorroughnessTexture,aoMap:doorAmbientOcclusionTexture,
    displacementMap: doorheightTexture,displacementScale:0.1})
)
house.add(door)
door.position.z = 3.5 / 2 + 0.001
door.position.y = 1

//bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMat = new THREE.MeshBasicMaterial({ color: "green" })
const bush1 = new THREE.Mesh(bushGeometry, bushMat)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2, 2)
const bush2 = new THREE.Mesh(bushGeometry, bushMat)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMat)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(- 0.8, 0.1, 2.2)
const bush4 = new THREE.Mesh(bushGeometry, bushMat)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(- 1, 0.05, 2.6)
house.add(bush1, bush2, bush3, bush4)


//graves
const graves = new THREE.Group()
scene.add(graves)
const gravesGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const gravesMat = new THREE.MeshStandardMaterial({ color: "black" })
for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2 // Random angle
    const radius = 3 + Math.random() * 6      // Random radius
    const x = Math.cos(angle) * radius        // Get the x position using cosinus
    const z = Math.sin(angle) * radius        // Get the z position using sinus

    // Create the mesh
    const grave = new THREE.Mesh(gravesGeometry, gravesMat)

    // Position
    grave.position.set(x, 0.3, z)

    // Rotation
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.castShadow=true
    // Add to the graves container
    graves.add(grave)
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ map:grasColorTexture,aoMap: grasAmbientOcclusionTexture, transparent: true, normalMap: grasNormalTexture,
    roughnessMap: grasRoughnessTexture})
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
floor.side = THREE.DoubleSide
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 2)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(5).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

//doorLight
const doorLight = new THREE.PointLight('#ff7d45', 2, 7)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)

//ghost 
const ghost1=new THREE.PointLight('#ff00ff', 2, 3)
const ghost2=new THREE.PointLight('#ffffff', 2, 3)
const ghost3=new THREE.PointLight('#00ffff', 2, 3)


scene.add(ghost1, ghost2, ghost3)

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')
/**
 * Animate
 */


//shadows
moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
house.receiveShadow = true

floor.castShadow = true
floor.receiveShadow = true
renderer.shadowMap.enabled = true


const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    //ghost 
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 3)

    const ghost2Angle = - elapsedTime * 0.32
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    const ghost3Angle = - elapsedTime * 0.18
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()