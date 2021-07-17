import * as THREE from './lib/three.js-master/build/three.module.js';
import {GLTFLoader} from "./lib/three.js-master/examples/jsm/loaders/GLTFLoader.js";
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';

import * as FOX from "./fox.js";

const manager = new THREE.LoadingManager();
const scene = new THREE.Scene();
var fox;
var foxInitialPosition = {
    x: 0,
    y: -1,
    z: 0.5,
};
var foxCurrentPosition = {
    x: 0,
    y: -1,
    z: 0.5,
};

// Camera parameters
const camera = {
    obj: null,

    // Initializes the camera and adds it to the scene
    init: function(scene) {
        const fov = 75;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.1;
        const far = 100;
        const center_value = 10;
        this.obj = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.obj.position.set(0, center_value, 20);

        this.obj.lookAt(0, center_value, 0);
        scene.add(this.obj);
    },

    // Updates the camera matrices
    update: function() {
        this.obj.updateMatrix();
        this.obj.updateMatrixWorld();
    },

    // Moves the camera up by y points
    up: function(y) {
        const upAnimation = new TWEEN.Tween(this.obj.position) 
            .to({y: 40+y}, 1000) 
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    }
}

// Projection
const frustum = {
    obj: null,

    // Initialized the view frustum
    init: function() {
        this.obj = new THREE.Frustum();
    },

    // Updates the view frustum
    update: function() {
        this.obj.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.obj.projectionMatrix, camera.obj.matrixWorldInverse));
    }
}

// Lighting
const lights = {
    skyColor: 0xFFFFFF,
    groundColor: 0xFFFFFF,
    ambientLight: null,

    // Initializes the lights
    init: function(scene) {
        
        this.ambientLight = new THREE.HemisphereLight(this.skyColor, this.groundColor, 1.0);
        //scene.add(this.ambientLight);
    
        const color = 0xFFFFFF;
        const light = new THREE.DirectionalLight(color, 1.0);
        light.position.set(0, 6, 15);
        scene.add(light);
        
        const helper = new THREE.DirectionalLightHelper(light, 5);
        scene.add(helper);
    },

    // Updates the lights colours
    update: function() {
        if (camera.obj.position.y>500) {
            const newSkyColor = new THREE.Color(this.skyColor)
                .lerp(new THREE.Color(0 ,0, 0), (camera.obj.position.y-500)/500);
            const newGroundColor = new THREE.Color(this.groundColor)
                .lerp(new THREE.Color(0 ,0, 0), (camera.obj.position.y-500)/500);
                
            if (newSkyColor.r<0) newSkyColor.r = 0;
            if (newSkyColor.g<0) newSkyColor.g = 0;
            if (newSkyColor.b<0) newSkyColor.b = 0;
            if (newGroundColor.r<0) newGroundColor.r = 0;
            if (newGroundColor.g<0) newGroundColor.g = 0;
            if (newGroundColor.b<0) newGroundColor.b = 0;

            this.ambientLight.color = newSkyColor;
            this.ambientLight.groundColor = newGroundColor;
        }
    }
}

// Background
const backgroundAndFog = {
    color: 0x00BFFF,        //0x00BFFF
    // Initializes the background and the fog
    init: function(scene) {
        scene.background = new THREE.Color(this.color);
        scene.fog = new THREE.Fog(scene.background, ground.depth, ground.depth+20);
    },
    // Updates the color of the background and of the fog
    update: function(scene) {
        if (camera.obj.position.y>500) {
            const newColor = new THREE.Color(this.color).lerp(new THREE.Color(0 ,0, 0), (camera.obj.position.y-500)/500);
            
            if (newColor.r<0) newColor.r = 0;
            if (newColor.g<0) newColor.g = 0;
            if (newColor.b<0) newColor.b = 0;

            scene.background = newColor;
            scene.fog.color = scene.background;
        } 
    }
}

// Ground
const ground = {
    width: 200,
    depth: 60,
    obj: null,
    plane: new THREE.Plane(new THREE.Vector3(0,1,0)),

    // Initializes the ground and adds it to the scene
    init: function(scene) {
        const material = new THREE.MeshBasicMaterial({
            map: Loader.assets.textures.groundMap.data
        });
        material.map.repeat.set(this.width/10, this.depth/10);

        const geometry = new THREE.PlaneBufferGeometry(this.width, this.depth);
        geometry.rotateX(-Math.PI/2);

        this.obj = new THREE.Mesh(geometry, material);

        scene.add(this.obj);
    },

    // Updates the ground matrices
    update: function() {
        this.obj.updateMatrix();
        this.obj.updateMatrixWorld();
        this.plane.applyMatrix4(this.obj.matrixWorld);
    }
}

const cube = {
    obj: null,
    init: function(scene) {
        // Object
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshStandardMaterial();
        material.color = new THREE.Color(0xff0000);
        material.metalness = 0.7;
        material.roughness = 0.1;
        
        
        this.obj = new THREE.Mesh( geometry, material );
        scene.add( this.obj );
    }
}

const loader = {
    loaded: false,

    assets: {
        textures: {
            wall: "./resources/wall.jpg",
            ground: "./resources/ground.jpg",
            platform1: "./resources/platform_grass_block.jpg",
            platform2: "./resources/platform_white.jpg",
        },
        objects: {
            foxGltf: "./resources/simple_fox/scene.gltf",
            robot: "./resources/robot/scene.gltf",
        },
    },

    loadFox: function(scene) {
        document.body.innerHTML = "";
        const text = document.createElement("h");
        text.innerText = "Loading...";
        document.body.appendChild(text);
        
        var gltfLoader = new GLTFLoader(manager);
        
        // TODO: aggiustare posizione e scaling
        gltfLoader.load(this.assets.objects.foxGltf, (gltf) => {
            fox = gltf.scene;
            fox.name = "fox";
            fox.position.set(foxInitialPosition.x, foxInitialPosition.y, foxInitialPosition.z);
            fox.scale.set(0.05, 0.05, 0.1);
            
            fox.traverse(function (child) {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            fox.castShadow = true;
            fox.receiveShadow = true;

            // Torso
            var root = fox.getObjectByName(FOX.fox_dic.Root);
            var hip = fox.getObjectByName(FOX.fox_dic.Hip);
            var spine1 = fox.getObjectByName(FOX.fox_dic.Spine1);
            var spine2 = fox.getObjectByName(FOX.fox_dic.Spine2);
            var neck = fox.getObjectByName(FOX.fox_dic.Neck);
            var head = fox.getObjectByName(FOX.fox_dic.Head);
            
            // Front legs
            var rightUpperArm = fox.getObjectByName(FOX.fox_dic.RightUpperArm);
            var rightForeArm = fox.getObjectByName(FOX.fox_dic.RightForeArm);
            var rightHand = fox.getObjectByName(FOX.fox_dic.RightHand);
            var leftUpperArm = fox.getObjectByName(FOX.fox_dic.LeftUpperArm);
            var leftForeArm = fox.getObjectByName(FOX.fox_dic.LeftForeArm);
            var leftHand = fox.getObjectByName(FOX.fox_dic.LeftHand);
            
            // Back legs
            var leftLeg1 = fox.getObjectByName(FOX.fox_dic.LeftLeg1);
            var leftLeg2 = fox.getObjectByName(FOX.fox_dic.LeftLeg2);
            var leftFoot1 = fox.getObjectByName(FOX.fox_dic.LeftFoot1);
            var leftFoot2 = fox.getObjectByName(FOX.fox_dic.LeftFoot2);
            var rightLeg1 = fox.getObjectByName(FOX.fox_dic.RightLeg1);
            var rightLeg2 = fox.getObjectByName(FOX.fox_dic.RightLeg2);
            var rightFoot1 = fox.getObjectByName(FOX.fox_dic.RightFoot1);
            var rightFoot2 = fox.getObjectByName(FOX.fox_dic.RightFoot2);
            
            // Tail
            var tail1 = fox.getObjectByName(FOX.fox_dic.Tail1);
            var tail2 = fox.getObjectByName(FOX.fox_dic.Tail2);
            var tail3 = fox.getObjectByName(FOX.fox_dic.Tail3);
            
            // TODO: controllare se hanno bisogno di rotazioni, aggiungere la coda
            //rightUpperArm.rotation.z = (0 * Math.PI) / 180;
            //leftUpperArm.rotation.z = (45 * Math.PI) / 180;
            root.rotation.z = (90 * Math.PI) / 180;
            
            //dirLight.target = fox;
            
            scene.add(fox);
        },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded')
            },
            (error) => {
                console.log(error);
            }
        );
        
        manager.onLoad = function() {
            this.loaded = true;
            loader.onLoad();
        };
    },

    loadWall: function(scene) {
        var loader = new THREE.TextureLoader();

        var texture = loader.load( this.assets.textures.wall, function ( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set( 0, 0 );
            texture.repeat.set( 3, 3 );

            const geometry = new THREE.PlaneGeometry( 100, 100 );
            geometry.translate( 0, 0, -2.1);
            
            var wallMaterial = new THREE.MeshBasicMaterial({
                map: texture
            });
            var wall = new THREE.Mesh(geometry, wallMaterial);
            scene.add(wall);
        } );
        
    },
    
    loadGround: function(scene) {
        var loader = new THREE.TextureLoader();

        var texture = loader.load( this.assets.textures.ground, function ( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set( 0, 0 );
            texture.repeat.set( 9, 9 );

            const geometry = new THREE.PlaneGeometry( window.innerWidth / 2, window.innerHeight );
            
            var groundMaterial = new THREE.MeshBasicMaterial({
                map: texture
            });
            var ground = new THREE.Mesh(geometry, groundMaterial);
            ground.rotation.x = (-90 * Math.PI) / 180;
            
            scene.add(ground);
        } );
    },
    
    loadPlatform: function(scene) {
        let platforms = [];
        let numPlatforms = 5;
        let space = 5;
        let platformMaterial1;
        var loader = new THREE.TextureLoader();
        
        // TODO: sistemare la creazione delle piattaforme, aggiungere aggiunta casuale
        for(var i=0; i < numPlatforms; i++)
        {
            var geometry = new THREE.BoxGeometry(6, 0.5, 4);
            geometry.translate( i*2, space + 4*i, 0);
            
            platformMaterial1 = new THREE.MeshBasicMaterial({
                color: 0x00ff00
            });
            
            platforms[i] = new THREE.Mesh(geometry, platformMaterial1);
            scene.add(platforms[i]);
        }
    },
}

const inputControls = {
    isMoving: 0,        // 0 not moving, 1 right, -1 left

    // Initializes the controls listeners
    init: function() {
        this.isMoving = 0;
        
    },
    keyDown: function (e) {
        if (e.keyCode == '37') {
            inputControls.isMoving = -1;
            console.log("Imposto  a -1 "+inputControls.isMoving);
        }
        else if (e.keyCode == '39') {
            inputControls.isMoving = 1;
        } else if (e.keyCode == '38') {
            // Top
            inputControls.isMoving = 2;
        } else if (e.keyCode == '40') {
            // Down
            inputControls.isMoving = 3;
        }
    },
    
    keyUp: function (e) {
        if (e.keyCode == '37' || e.keyCode == '39') {
            inputControls.isMoving = 0;
            console.log("Reimposto a 0 "+inputControls.isMoving);
        }
    },
}

// Start the game
function start() {
    // Clear web page
    document.body.innerHTML = "";
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvasID");
    const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    
    renderer.setSize(window.innerWidth / 2, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.gammaOutput = true;

    document.body.appendChild(canvas);

    // Init of the scene
    console.log(canvas.height);
    
    // keyboard event listeners
    inputControls.init();
    document.onkeydown = inputControls.keyDown;
    //document.onkeypress = inputControls.keyDown;
    document.onkeyup = inputControls.keyUp;
    
    camera.init(scene);
    //frustum.init();
    lights.init(scene);
    backgroundAndFog.init(scene);
    
    /*
    const controls = new OrbitControls(camera.obj, canvas);
    controls.target.set(0, 5, 0);
    controls.update();
    */
    
    const axesHelper = new THREE.AxesHelper( 5 );
    axesHelper.setColors( new THREE.Color("rgb(255, 0, 0)"),  new THREE.Color("rgb(0, 255, 0)"),  new THREE.Color("rgb(0, 0, 255)"))
    scene.add( axesHelper );
    
    console.log(loader.loaded);
    //renderer.render(scene, camera.obj);
    
    
    let isFalling = false;
    let i = 0.1;

    var animate = function (time) {
        // Resizes the canvas if the window size is changed
        if (resizeRendererToDisplaySize(renderer)) {
            camera.obj.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.obj.updateProjectionMatrix();
        }
        
        TWEEN.update(time);
        
        // Animation and movement
        if(inputControls.isMoving == -1) {
            // Left
            /*foxCurrentPosition.x -= i
            fox.position.set(foxCurrentPosition.x, foxInitialPosition.y, foxInitialPosition.z);
            */
            console.log("Old x :" +fox.position.x);
            FOX.moveLeft(fox);
            console.log("Updates x :" +fox.position.x);
        } else if (inputControls.isMoving == 1) {
            // Right
            FOX.moveRight(fox);
        } else if (inputControls.isMoving == 2) {
            // Top
            FOX.jump(fox);
            inputControls.isMoving = 0;
        } else if (inputControls.isMoving == 3) {
            // Down
            FOX.fall(fox);
            inputControls.isMoving = 0;
        }
        
        /*let isColliding = false;
        
        // TODO: caduta+salto DA FARE
        if (isFalling) {
            FOX.fall(fox);
            console.log("ora cado");
        } else if(isColliding) {
            FOX.jump(fox);
        }
        
        if (fox.position.y == foxInitialPosition.y) {
            FOX.jump(fox);
        }*/
        
        requestAnimationFrame(animate);
        render();
    };
    
    function render() {
        renderer.render(scene, camera.obj);
    }
    
    animate();
}

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    let pixelRatio = 1;
    
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

// Before starting the game we check if the assets have been already loaded
// if not we load them, after that the game is started

function startGame() {
    if(loader.loaded){
        start();
    } else {
        loader.loadFox(scene);
        loader.loadWall(scene);
        loader.loadGround(scene);
        loader.loadPlatform(scene);
        loader.onLoad = start;
    }
}

export {startGame};