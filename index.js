import './style/main.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'



//Basic set
const backgroundColor = '#F2EFEA'
let activePart = 'sofa'


//Initial Material
const initialMaterial = new THREE.MeshStandardMaterial({ 
    color: '#0a5694', 
    roughness: 0.5
})

const initMaterialMap = [
        {childID: "sofa", mtl: initialMaterial, colorID: 'Blue'},
        {childID: "cushion", mtl: initialMaterial, colorID: 'Blue'}
]


//Model price
const price = document.querySelector('.js-price')
const defaultPrice = 790
price.innerHTML = `USD ${defaultPrice}`

const sofaChoice = document.querySelector('.js-couch-info')
const cushionChoice = document.querySelector('.js-cushion-info')

initMaterialMap.forEach(i => {
    if(i.childID === 'sofa'){
        sofaChoice.innerHTML = i.colorID
    }
})
initMaterialMap.forEach(i => {
    if(i.childID === 'cushion'){
        cushionChoice.innerHTML = i.colorID
    }
})


//Color options
const colors = [
    {
        color: '#0a5694',
        colorID: 'Blue',
        roughness: 0.5,
        isActive: true
    },
    {
        color: '#363636',
        colorID: 'Black',
        roughness: 0.5
        },
    {
        colorID: 'Denim',
        roughness: 1,
        texture: 'texture/denim01/color01.jpg',
        normal:'texture/denim01/denimNormal.jpg',
        price: 890,
        extra: 100
    },
    {
        color: '#4a4a4a',
        colorID: 'Leather gray',
        normal: 'texture/leather/normal.jpg',
        roughnessMap: 'texture/leather/rustic.jpg',
        price: 1100,
        extra: 310
    },
    {
        color: '#ccc0a5',
        colorID: 'Leather beige',
        normal: 'texture/leather/normal.jpg',
        roughnessMap: 'texture/leather/rustic.jpg',
        price: 1100,
        extra: 310
    },
    {
        color: '#cf5219',
        colorID: 'Leather orange',
        normal: 'texture/leather/normal.jpg',
        roughnessMap: 'texture/leather/rustic.jpg',
        price: 1100,
        extra: 310
    }
]

console.log(colors)

//Color options
const cushionColors = colors.slice(0, colors.length)
console.log(cushionColors)


//Model Loader

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)


let model

gltfLoader.load(
    'model/model.glb',
    function(gltf){
        console.log(gltf)


        model = gltf.scene

        model.scale.set(0.5,0.5,0.5)

        scene.add(model)

        model.traverse(o => {
            if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshStandardMaterial) {
              o.castShadow = true;
              o.receiveShadow = true;
            }
          })

        for (let object of initMaterialMap) {
            initColor(model, object.childID, object.mtl);
          }    
        
        // console.log(model)
        jsLoader.remove();

    
    },
    function(){
        console.log('progress')
    },
    function(){
        console.log('An error')
    }
)



//Initial Color Material

function initColor(parent, type, mtl) {
    parent.traverse(o => {
     if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshStandardMaterial) {
        if (o.name.includes(type)) {
                o.material = mtl
                o.nameID = type
            }
        o.traverse(c => {
            if(c instanceof THREE.Mesh && c.material instanceof THREE.MeshStandardMaterial)
            {
                c.material = o.material
                c.nameID = o.nameID

            }
        })
     }
   });
  }


/**
 * Sizes
 */
const sizes = {}
sizes.width = window.innerWidth*0.6
sizes.height = window.innerHeight
if(window.innerWidth <= 768){
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight* 0.8

}

window.addEventListener('resize', () =>
{
    // Save sizes
    sizes.width = window.innerWidth*0.6
    sizes.height = window.innerHeight
    if(window.innerWidth <= 768){
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight* 0.8

    }

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    renderer.setSize(sizes.width, sizes.height)
})

/**
 * Environnements
 */
// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(backgroundColor)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 1, 6)
scene.add(camera)

// Test
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(10,10),
    new THREE.ShadowMaterial({opacity: 0.1})
)
floor.rotation.x = -Math.PI/2
floor.position.y = -1.1
scene.add(floor)
floor.receiveShadow = true

//Light
const ambientLight = new THREE.AmbientLight()
const directionalLightFront = new THREE.DirectionalLight()
const directionalLightBack = new THREE.DirectionalLight()
directionalLightFront.castShadow = true
directionalLightFront.shadow.mapSize.set(1024,1024)
directionalLightFront.shadow.camera.near = 2
directionalLightFront.shadow.camera.far = 12
directionalLightFront.shadow.camera.left = 3
directionalLightFront.shadow.camera.right = -3
directionalLightFront.shadow.normalBias = 0.05

const directionalLightFrontHelper = new THREE.CameraHelper(directionalLightFront.shadow.camera)
//scene.add(directionalLightFrontHelper)

ambientLight.intensity = 0.4
directionalLightFront.intensity = 0.4
directionalLightFront.position.set(2, 4, 4)
directionalLightBack.intensity = 0.4
directionalLightBack.position.set(0, 4, -4)
scene.add(ambientLight, directionalLightFront, directionalLightBack)


// Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
})
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
renderer.setSize(sizes.width, sizes.height)

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

//Control
const control = new OrbitControls(camera, canvas)
control.update()
control.enableDamping = true
control.maxPolarAngle = Math.PI / 2
control.minPolarAngle = Math.PI / 8
control.autoRotate = false
control.autoRotateSpeed = 0.2
control.maxDistance = 7
control.minDistance = 3

//Mouse Event Raycast
const mouse = new THREE.Vector2()
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = -(event.clientY / sizes.height) * 2 + 1
})


//Meshes to intersect
const raycaster = new THREE.Raycaster()





// Function - Opening rotate
let initRotate = 0;
let loaded = false;

function initialRotation() {
  initRotate++;
  if (initRotate <= 120) {
    model.rotation.y += Math.PI / 60;
  } else {
    loaded = true;
  }
}


/**
 * Loop
 */
const loop = () =>
{

    //Rotation
    if (model != null && loaded == false) {
        initialRotation();
    }

    //Raycast
    raycaster.setFromCamera(mouse, camera)

    // Update
    control.update()
    
    // Render
    renderer.render(scene, camera)

    // Keep looping
    window.requestAnimationFrame(loop)
}
loop()




/* Control palette create colorChart Function */
const palette = document.getElementById('js-palette')

function buildColors(colors) {
    for (let [i, color] of colors.entries()) {
      let div = document.createElement('div')
      let colorChart = document.createElement('div')
      let colorName = document.createElement('div')


      if(color.isActive){
        colorChart.classList.add('--is-active')
        colorName.classList.add('--is-active')
    }
      colorChart.classList.add('colorChart')

    if (color.texture)
    {
        colorChart.style.backgroundImage = "url(" + color.texture + ")";
    } else
    {
        colorChart.style.background = color.color
    }
      
      colorChart.setAttribute('data-key', i)



      div.classList.add('grid')
      
      colorName.innerHTML = color.colorID
      colorName.classList.add('colorID')
        
      palette.append(div)
      div.append(colorChart)
      div.append(colorName)
    }
  }
  
  buildColors(colors)



//Create cushion ColorChart
const cushionPalette = document.getElementById('js-palette-cushion')
function buildCushionColors(colors) {
    for (let [i, color] of colors.entries()) {
      let div = document.createElement('div')
      let colorChart = document.createElement('div')
      let colorName = document.createElement('div')


      if(color.isActive){
        colorChart.classList.add('--is-active')
        colorName.classList.add('--is-active')
    }
      colorChart.classList.add('colorChart')
      colorChart.setAttribute('data-key', i)
      
      if (color.texture)
      {
          colorChart.style.backgroundImage = "url(" + color.texture + ")";
      } else
      {
          colorChart.style.background = color.color
      }
        



      div.classList.add('grid')
      
      colorName.innerHTML = color.colorID
      colorName.classList.add('colorID')
        
      cushionPalette.append(div)
      div.append(colorChart)
      div.append(colorName)
    }
  }

  buildCushionColors(cushionColors)

  if(activePart === 'sofa'){
    cushionPalette.style.display = 'none'
    palette.style.display = 'grid'
  }


  //ActivePart Switches
const options = document.querySelectorAll(".switch")

for (const option of options){
    option.addEventListener('click', selectOption)
}

function selectOption(e) {
    let option = e.target
    activePart = e.target.dataset.option

    if(activePart === 'sofa'){
        cushionPalette.style.display = 'none'
        palette.style.display = 'grid'

      }else if(activePart === 'cushion'){
        cushionPalette.style.display = 'grid'
        palette.style.display = 'none'
      }

      console.log(activePart)

    for (const otherOption of options) {
      otherOption.classList.remove('--is-active');
    }
    option.classList.add('--is-active')

  }


  


  
//Select Colors
//Sofa
const colorChart = palette.querySelectorAll('.colorChart') 
for(const color of colorChart){
    color.addEventListener('click', selectColor)
}

//Cushion
const cushionColorChart = cushionPalette.querySelectorAll('.colorChart') 
for(const color of cushionColorChart){
    color.addEventListener('click', selectColor)
}






//Create new selected color material
const textureLoader = new THREE.TextureLoader()
function selectColor(e){
    let color = colors[e.target.dataset.key];
    let newMaterial;

    if(color.texture){
    
            let texture = textureLoader.load(color.texture)
            let normalTexture = textureLoader.load(color.normal)

            texture.repeat.set(5,5);
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;

            newMaterial = new THREE.MeshStandardMaterial({
                map: texture,
                normalMap: normalTexture,
                roughness: color.roughness
            })

    }else if(color.normal){
        let normalTexture = textureLoader.load(color.normal)
        let roughnessTexture = textureLoader.load(color.roughnessMap)
        newMaterial = new THREE.MeshStandardMaterial({
            color: color.color,
            normalMap: normalTexture,
            roughnessMap: roughnessTexture
        })
    }else{
        newMaterial = new THREE.MeshStandardMaterial({
            color: color.color,
            roughness: color.roughness
    })}
   

    if(activePart === 'sofa'){
        for(const others of colorChart){
            others.classList.remove('--is-active')
            others.nextSibling.classList.remove('--is-active')
        }
        e.target.classList.add('--is-active')
        e.target.nextSibling.classList.add('--is-active') 
        if(color.price){
            price.innerHTML = `USD ${color.price}`
        }else{
            price.innerHTML =  `USD ${defaultPrice}`
        }
        if(color.extra){
            sofaChoice.innerHTML = color.colorID + " " + " + USD " + color.extra
        }else{
            sofaChoice.innerHTML = color.colorID
        }

    }else if(activePart === 'cushion'){
        for(const others of cushionColorChart){
            others.classList.remove('--is-active')
            others.nextSibling.classList.remove('--is-active')
        }
        e.target.classList.add('--is-active')
        e.target.nextSibling.classList.add('--is-active') 
        cushionChoice.innerHTML = color.colorID
    }





    changeMaterial(model, activePart, newMaterial)
}


//Set Material
function changeMaterial(parent, activePart, material){
    parent.traverse(o => {
        if(o instanceof THREE.Mesh && o.material instanceof THREE.MeshStandardMaterial){
            if(o.nameID === activePart){
                o.material = material
                console.log(o.material)
            }
        }
    })
}


//Mouse Pointer & 3D icon handle
canvas.addEventListener('mousedown', () => {
    canvas.style.cursor = 'grabbing'
})
canvas.addEventListener('mouseup', () => {
    canvas.style.cursor = 'grab'
})





const icon = document.querySelector('.icon')


canvas.addEventListener('touchstart', interactionStart);
canvas.addEventListener('touchend', interactionDone);
canvas.addEventListener('touchmove', interactionStart);
canvas.addEventListener('mousedown', interactionStart);
canvas.addEventListener('mouseup', interactionDone);


function interactionStart(){
    icon.style.transition = "opacity 0.3s"
    icon.style.opacity = "0"

}

function interactionDone(){
    icon.style.transition = "opacity 0.3s"
    icon.style.opacity = "1"
}