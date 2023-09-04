import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from "gsap"
THREE.ColorManagement.enabled = false

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor').onChange(() => {
        material.color.set(parameters.materialColor)
        particleMateral.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test cube
 */
import grad from "./resources/textures/gradients/3.jpg"
const textureLoader = new THREE.TextureLoader()
const gradTexture = textureLoader.load(grad)
gradTexture.magFilter = THREE.NearestFilter

const material = new THREE.MeshToonMaterial({ color: 'red', gradientMap: gradTexture })
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

scene.add(mesh1, mesh2, mesh3)
const objDistance = 4
mesh1.position.y = -objDistance * 0
mesh1.position.x = 2
mesh2.position.y = -objDistance * 1
mesh2.position.x = -2
mesh3.position.y = -objDistance * 2
mesh3.position.x = 2
const sectionMeshs = [mesh1, mesh2, mesh3]


const light = new THREE.DirectionalLight(0xffffff, 3)
light.position.set(1, 1, 0)
scene.add(light)

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

const particle_count=200
const positionArray = new Float32Array(particle_count * 3)
for (let i = 0; i < particle_count; i++) {
    positionArray[i * 3 + 0] = Math.random() * 10 - 5
    positionArray[i * 3 + 1] = objDistance*0.5- Math.random() * objDistance*sectionMeshs.length
    positionArray[i * 3 + 2] = Math.random() * 10 - 5
}
const particleGeometry = new THREE.BufferGeometry()
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
const particleMateral=new THREE.PointsMaterial({
    color:"red",sizeAttenuation:true,size:0.1,
})
const particles=new THREE.Points(particleGeometry, particleMateral)
scene.add(particles)


/**
 * Camera
 */
// Base camera
const cameraGroup=new THREE.Group()
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)
scene.add(cameraGroup)


let scrollY = window.scrollY
let currentSection=0
window.addEventListener('scroll', () => {
    scrollY = window.scrollY
    const newSection=Math.round(scrollY/sizes.height)
    if (newSection!==currentSection) {
        currentSection=newSection
        gsap.to(sectionMeshs[currentSection].rotation,{duration:1.5,ease:'power2.inOut',x:'+=6',y:'+=3'})
    }
})
const cursor = {}
cursor.x = 0
cursor.y = 0
window.addEventListener('mousemove', (e) => {
    cursor.x = e.clientX / sizes.width - 0.5
    cursor.y = e.clientY / sizes.height - 0.5
})


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    for (const mesh of sectionMeshs) {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }
    const parallaxX = -cursor.x
    const parallaxY = cursor.y
    camera.position.x = parallaxX
    camera.position.y = -scrollY / sizes.height * objDistance + parallaxY
    // camera.position.y = parallaxY


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()