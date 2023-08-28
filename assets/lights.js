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

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)
gui.add(ambientLight, 'intensity', 0, 2).name('Ambintensity')

const pointLight = new THREE.PointLight(0xffffff, 75)
gui.add(pointLight, 'intensity', 0, 500).name('PLintensity')
// gui.add(pointLight, 'shadow')
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 2
pointLight.castShadow = true
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
const PlightShadowhelper=new THREE.CameraHelper(pointLight.shadow.camera)
// scene.add(PlightShadowhelper)
pointLight.shadow.camera.far=10
// pointLight.

gui.add(pointLight,'castShadow')
scene.add(pointLight)

const directionalLight = new THREE.DirectionalLight(0xff00ff)
gui.add(directionalLight, 'intensity', 0, 2).name('Diintensity')
// scene.add(directionalLight)
directionalLight.castShadow = true
const hemisphereLight = new THREE.HemisphereLight(0x00ff00, 0xff0000,0.3) 
gui.add(hemisphereLight, 'intensity', 0, 2).name('Hemiintensity')

const hemiHelper=new THREE.HemisphereLightHelper(hemisphereLight)
// scene.add(hemiHelper)
// scene.add(hemisphereLight)

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
gui.add(rectAreaLight, 'intensity', 0, 10,0.001).name('Rectintensity')
// scene.add(rectAreaLight)


const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
gui.add(spotLight, 'intensity', 0, 10,0.001).name('Spotintensity')
spotLight.position.set(0, 2, 3)

spotLight.target.position.x=-1.5
// scene.add(spotLight,spotLight.target)
gui.add(spotLight.target.position, 'x',-3,3,0.01).name('SpotLightAngel')

//shadows





/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5
sphere.castShadow = true

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)
cube.castShadow = true

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5
torus.castShadow = true

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65
plane.receiveShadow = true

scene.add(sphere, cube, torus, plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
gui.add(renderer.shadowMap, 'enabled').name('Shadow')
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()