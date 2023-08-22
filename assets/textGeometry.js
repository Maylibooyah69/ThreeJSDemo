import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

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
 * Textures
 */
import matcap1 from "./resources/textures/matcaps/7.png"
import matcap2 from "./resources/textures/matcaps/3.png"
const textureLoader = new THREE.TextureLoader()
const matcapTexture1=textureLoader.load(matcap1)
const matcapTexture2=textureLoader.load(matcap2)

const fontLoader = new FontLoader()
fontLoader.load('font', (font) => {
    const textGeoMetry = new TextGeometry("Hello World!", {
        font: font,
        size: 2,
        height: 0.5,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.05,
        bevelOffset: 0,
        bevelSegments: 5,
    })
    const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture1})
    const textMesh = new THREE.Mesh(textGeoMetry, textMaterial)
    textGeoMetry.center()
    scene.add(textMesh)

    const donutGeometry=new THREE.TorusGeometry(1, 0.5, 32, 32)
    const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture2})
    for (let i =0;i<100;i++){
        const donut = new THREE.Mesh(donutGeometry, donutMaterial)
        donut.position.x = (Math.random()-0.5) * 20
        donut.position.y = (Math.random()-0.5) * 20
        donut.position.z = (Math.random()-0.5) * 20

        donut.rotation.x = (Math.random()-0.5) * Math.PI * 2
        donut.rotation.y= (Math.random()-0.5) * Math.PI * 2
        const scale=Math.random()
        donut.scale.set(scale,scale,scale)
        scene.add(donut)
    }
})
/**
 * Object1
 */

// const axHelper = new THREE.AxesHelper(10)
// scene.add(axHelper)
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

// scene.add(cube)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 10
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()