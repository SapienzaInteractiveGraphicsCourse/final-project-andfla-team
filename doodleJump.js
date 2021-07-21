import * as THREE from './lib/three.js-master/build/three.module.js';
import {GLTFLoader} from "./lib/three.js-master/examples/jsm/loaders/GLTFLoader.js";
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';

import * as FOX from "./fox.js";
import * as PLATFORM from "./platform.js";
import {platform} from './platform.js';
import * as UTILS from './utils.js';
import {gameOver} from './index.js';

Physijs.scripts.worker = "./lib/physijs_worker.js";
Physijs.scripts.ammo = "./ammo.js";

const manager = new THREE.LoadingManager();
//const manager_platform = new THREE.LoadingManager();
const center_value = 10;

var fox;
var foxInitialPosition = {
    x: 0,
    y: -1,
    z: 0.5,
};
var platformID;
var firstJumpVar = true;

// Camera parameters
const camera = {
    obj: null,

    visible_height: 0,
    visible_width: 0,

    // Initializes the camera and adds it to the scene
    init: function(scene) {
        const z = 20;
        const fov = 75;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.1;
        const far = 100;
        this.obj = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.obj.position.set(0, center_value, z);
        this.obj.lookAt(0, center_value, 0);

        this.visible_height = UTILS.visibleHeightAtZDepth(0, this.obj);
        this.visible_width = UTILS.visibleWidthAtZDepth(0, this.obj);

        scene.add(this.obj);
    },

    // Moves the camera up by y points
    up: function(y) {
        const upAnimation = new TWEEN.Tween(this.obj.position)
            .to({y: y}, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
    }
}

// Lighting
const lights = {
    skyColor: 0xFFFFFF,
    groundColor: 0xFFFFFF,
    ambientLight: null,

    // Initializes the lights
    init: function(scene) {

        this.ambientLight = new THREE.HemisphereLight(this.skyColor, this.groundColor, 0.1);
        scene.add(this.ambientLight);

        const color = 0xFFFFFF;
        const light = new THREE.DirectionalLight(color, 1.0);
        light.position.set(0, 6, 15);
        scene.add(light);
    },
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
          wall:             "./resources/wall.jpg",
          wallNormal:       "./resources/wall_normal.jpg",

          ground:           "./resources/ground.jpg",
          groundNormal:     "./resources/ground_normal.jpg",

          platform1:        "./resources/platform_grass_block.jpg",
          platform1Normal:  "./resources/platform_grass_normal.jpg",

          platform2:        "./resources/legno_texture.jpg",
          platform2Normal:  "./resources/legno_normal.jpg",

          platform3:        "./resources/piastrelle.jpg",

          platform4:        "./resources/platform_white.jpg",

          platform5:        "./resources/wall_light.jpg",

          wall1:            "./resources/scraper_texture_1.jpg",
          wall1Normal:      "./resources/scraper_normal_1.jpg",
          wall1Roughness:   "./resources/scraper_roughness_1.jpg",
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
            root = fox.getObjectByName(FOX.fox_dic.Root);
            hip = fox.getObjectByName(FOX.fox_dic.Hip);
            spine1 = fox.getObjectByName(FOX.fox_dic.Spine1);
            spine2 = fox.getObjectByName(FOX.fox_dic.Spine2);
            neck = fox.getObjectByName(FOX.fox_dic.Neck);
            head = fox.getObjectByName(FOX.fox_dic.Head);

            // Front legs
            rightUpperArm = fox.getObjectByName(FOX.fox_dic.RightUpperArm);
            rightForeArm = fox.getObjectByName(FOX.fox_dic.RightForeArm);
            rightHand = fox.getObjectByName(FOX.fox_dic.RightHand);
            leftUpperArm = fox.getObjectByName(FOX.fox_dic.LeftUpperArm);
            leftForeArm = fox.getObjectByName(FOX.fox_dic.LeftForeArm);
            leftHand = fox.getObjectByName(FOX.fox_dic.LeftHand);

            // Back legs
            leftLeg1 = fox.getObjectByName(FOX.fox_dic.LeftLeg1);
            leftLeg2 = fox.getObjectByName(FOX.fox_dic.LeftLeg2);
            leftFoot1 = fox.getObjectByName(FOX.fox_dic.LeftFoot1);
            leftFoot2 = fox.getObjectByName(FOX.fox_dic.LeftFoot2);
            rightLeg1 = fox.getObjectByName(FOX.fox_dic.RightLeg1);
            rightLeg2 = fox.getObjectByName(FOX.fox_dic.RightLeg2);
            rightFoot1 = fox.getObjectByName(FOX.fox_dic.RightFoot1);
            rightFoot2 = fox.getObjectByName(FOX.fox_dic.RightFoot2);

            // Tail
            tail1 = fox.getObjectByName(FOX.fox_dic.Tail1);
            tail2 = fox.getObjectByName(FOX.fox_dic.Tail2);
            tail3 = fox.getObjectByName(FOX.fox_dic.Tail3);

            // Initial Rotations to adjust the fox
            root.rotation.z = (90 * Math.PI) / 180;
            root.rotation.y = (-3.5 * Math.PI) / 180;

            //dirLight.target = fox;

            scene.add(fox);
            FOX.collisionListener(fox);
            FOX.changeBoxPosition(fox);
        },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded')
            },
            (error) => {
                console.log(error);
            }
        );

    },

    loadWall: function(scene) {

        //TODO: SCEGLIERE:Current options: wall,wall1,platform1,platform5
        var texture = texLoader.load( this.assets.textures.wall1, function ( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set( 0, 0 );
            texture.repeat.set( 4, 700 );//700 per wall1, 600 per le altre
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.NearestMipmapLinearFilter;

            const geometry = new THREE.PlaneGeometry( 80, 10000 );
            geometry.translate( 0, 0, -2.1);

            var wallMaterial = new THREE.MeshStandardMaterial({
                map: texture,
                normalMap: texLoader.load(loader.assets.textures.wall1Normal),
                roughnessMap: texLoader.load(loader.assets.textures.wall1Roughness),
            });
            wall = new THREE.Mesh(geometry, wallMaterial, 0);
            scene.add(wall);
        } );

    },

    loadGround: function(scene) {

        var texture = texLoader.load( this.assets.textures.ground, function ( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set( 0, 0 );
            texture.repeat.set( 9, 9 );

            const geometry = new THREE.PlaneGeometry( window.innerWidth / 2, window.innerHeight );

            var groundMaterial = new THREE.MeshStandardMaterial({
                map: texture
            });
            var ground = new THREE.Mesh(geometry, groundMaterial, 0);
            ground.rotation.x = (-90 * Math.PI) / 180;

            scene.add(ground);
        } );
    },

    loadPlatform: function(scene) {
        // Load firsts platforms
        //Option1: Mattoncini con erba
        var texture = texLoader.load(loader.assets.textures.platform1);
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

        realPlatformMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            //normalMap: texLoader.load(loader.assets.textures.platform1Normal)
          },
            .8, // high friction
            .3 // low restitution
        );
/*

        //Option2: wooden platforms
        var texture = texLoader.load(loader.assets.textures.platform2);
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

        realPlatformMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            normalMap: texLoader.load(loader.assets.textures.platform2Normal)},
            .8, // high friction
            .3 // low restitution
        );
*/
/*
        //Option3: Piastrelle
        var texture = texLoader.load(loader.assets.textures.platform3);
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

        realPlatformMaterial = new THREE.MeshStandardMaterial({
            map: texture},
            //.8, // high friction
            //.3 // low restitution
        );
*/

        for (platformID = 0; platformID < platforms.number; platformID++) {
            drawPlatform(platformID);
        }
    },
}

function drawPlatform(platformID) {
    var platformMaterial1;

    platform.ID = platformID;
    platform.generate(camera.visible_width/4, 20);

    var boxPlatform = PLATFORM.createBoxWithListener(platform);

    platforms[platformID] = platform;
    boxPlatforms[platformID] = boxPlatform;
}

const inputControls = {
    isMoving: 0,        // 0 not moving, 1 right, -1 left
    isRightFacing: true,
    keyboard:true,

    // Initializes the controls listeners
    init: function() {
        this.isMoving = 0;//unused
        this.isRightFacing = true;
        this.keyboard = true;
    },
    keyDown: function (e) {
        if (e.keyCode == '37' && inputControls.keyboard==true) {

            if (inputControls.isRightFacing){
                groupRight.removeAll();
                groupRotating.removeAll();
                FOX.rotateBody(fox, "left");
                inputControls.isRightFacing = false;
            }
            inputControls.isMoving = -1;
            FOX.moveLeft(fox);
        }

        else if (e.keyCode == '39' && inputControls.keyboard==true) {
            if (!inputControls.isRightFacing){
                groupLeft.removeAll();
                groupRotating.removeAll();
                FOX.rotateBody(fox, "right");
                inputControls.isRightFacing = true;
            }
            inputControls.isMoving = 1;
            FOX.moveRight(fox);
         }
    },

    keyUp: function (e) {
        if (e.keyCode == '37' || e.keyCode == '39') {
            inputControls.isMoving = 0;
            groupLeft.removeAll();
            groupRight.removeAll();
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

    scene.setGravity(new THREE.Vector3( 0, 0, 0 ));

    renderer.setSize(window.innerWidth / 2, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.gammaOutput = true;

    document.body.appendChild(canvas);

    // keyboard event listeners
    inputControls.init();
    document.onkeydown = inputControls.keyDown;
    document.onkeyup = inputControls.keyUp;

    // Init of the scene
    lights.init(scene);
    backgroundAndFog.init(scene);

/*
    const controls = new OrbitControls(camera.obj, canvas);
    controls.target.set(0, 5, 0);
    controls.update();
*/

    let isFalling = false;
    let i = 0.1;

    //initialize the score at each new game
    score = 0;
    const scoreDiv = document.createElement("div");
    scoreDiv.setAttribute("id", "score");
    document.body.appendChild(scoreDiv);
    
    const scoreText = document.createElement("h");

    var animate = function (time) {

        // Resizes the canvas if the window size is changed
        if (resizeRendererToDisplaySize(renderer)) {
            camera.obj.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.obj.updateProjectionMatrix();
        }
        TWEEN.update(time);

        // Update animations
        groupLeft.update();
        groupRight.update();
        groupJumping.update();
        groupRotating.update();
        groupFalling.update();

        // Initial jump
        if(fox.position.y + 1 <= 0){
            FOX.jump(fox);
        }

        FOX.changeBoxPosition(fox);

        // Move camera if the fox pass half of the screen and generate new platform
        let simpleJumpValue = 5;
        if(fox.position.y >= camera.obj.position.y) {
            camera.up(simpleJumpValue + fox.position.y);

            platforms.pop();
            boxPlatforms.pop();

            platformID++;
            drawPlatform(platformID);
        }

        //Update score:
        if (fox.position.y > score) {
            score = Math.floor(fox.position.y);
            scoreText.innerText = "SCORE: " + score;
            scoreDiv.appendChild(scoreText);
        }
        

        // Physijs collisions
        scene.simulate();

        // Game over
        if( Math.abs(fox.position.y - camera.obj.position.y)  >= center_value + 6) {
            groupJumping.removeAll();
            groupLeft.removeAll();
            groupRight.removeAll();
            groupRotating.removeAll();

            FOX.stopFallAnimation(fox);
            inputControls.isMoving = 0;
            inputControls.keyboard = false;

            console.log("Final Score = " + score);

            //Remove the scene at the end of the game
            while(scene.children.length > 0){
                  scene.remove(scene.children[0]);
            }
            gameOver(score);
            return;
        }

	scene.simulate();
        requestAnimationFrame(animate);
        renderer.render(scene, camera.obj);
    };

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
        camera.init(scene);
        loader.loadPlatform(scene);
        loader.loadWall(scene);
        loader.loadGround(scene);
        loader.loadFox(scene);
        
        loader.onLoad = start;
        
        manager.onLoad = function() {
            this.loaded = true;
            loader.onLoad();
        };
    }
}

export{startGame};
