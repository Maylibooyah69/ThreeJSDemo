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
 * Test cube
 */
const parameters = {}
parameters.count = 100000
parameters.size = 0.01
parameters.radius = 5
parameters.branches = 3
parameters.spin = 2
parameters.randomness = 0.2
parameters.random_power = 3
parameters.insideColor= '#ff6030'
parameters.outsideColor= '#1b3984'

let geometry = null
let material = null
let points = null

function generate_galaxy() {
    if (geometry !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }
    geometry = new THREE.BufferGeometry()
    material = new THREE.PointsMaterial({ size: parameters.size, sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending,vertexColors:true })
    const colorArray=new Float32Array(parameters.count * 3)
    const positionArray = new Float32Array(parameters.count * 3)

    const colorInside=new THREE.Color(parameters.insideColor);
    const colorOutside=new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
        const radius = parameters.radius * Math.random()
        const branch_angel = (i % parameters.branches) / parameters.branches * Math.PI * 2
        const spin_angel = radius * parameters.spin
        const randomX = Math.pow(Math.random(), parameters.random_power) * parameters.randomness * (Math.random() < 0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random(), parameters.random_power) * parameters.randomness * (Math.random() < 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(), parameters.random_power) * parameters.randomness * (Math.random() < 0.5 ? 1 : -1)

        positionArray[i * 3] = Math.cos(branch_angel + spin_angel) * radius + randomX
        positionArray[i * 3 + 1] = 0 + randomY
        positionArray[i * 3 + 2] = Math.sin(branch_angel + spin_angel) * radius + randomZ

        const mixedColor=colorInside.clone().lerp(colorOutside, radius/parameters.radius)
        colorArray[i * 3 ] = mixedColor.r
        colorArray[i * 3 +1] = mixedColor.g
        colorArray[i * 3 +2] = mixedColor.b
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3))
    points = new THREE.Points(geometry, material)
    scene.add(points)
}
generate_galaxy()

gui.add(parameters, 'count').min(100).max(10000).step(10).name('Count').onFinishChange(generate_galaxy)
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).name('Size').onFinishChange(generate_galaxy)
gui.add(parameters, 'radius').min(0.01).max(10).step(0.01).name('Radius').onFinishChange(generate_galaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).name('Branches').onFinishChange(generate_galaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(1).name('spin').onFinishChange(generate_galaxy)
gui.add(parameters, 'randomness').min(0.01).max(2).name('randomness').onFinishChange(generate_galaxy)
gui.add(parameters, 'random_power').min(1).max(10).name('randomness power').onFinishChange(generate_galaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generate_galaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generate_galaxy)

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
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
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