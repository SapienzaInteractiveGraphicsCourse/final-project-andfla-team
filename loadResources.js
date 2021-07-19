"use strict";

import * as THREE from './lib/three.js-master/build/three.module.js';
import { GLTFLoader } from "./lib/three.js-master/examples/jsm/loaders/GLTFLoader.js";
import * as foxFunc from "./fox.js";

const manager = new THREE.LoadingManager();
const renderer = new THREE.WebGLRenderer();

var fox;
var gltfLoader;

function setTextureProperties(tx) {
    tx.magFilter = THREE.LinearFilter;
    tx.minFilter = THREE.LinearMipmapLinearFilter;
    tx.anisotropy = renderer.capabilities.getMaxAnisotropy();
    tx.wrapS = THREE.RepeatWrapping;
    tx.wrapT = THREE.RepeatWrapping;
}

// The loader objects is used to load the assets
const Loader = {
    loaded: false,

    assets: {
        textures: {
            skyMap:     {href:"./../assets/sky.png"},
        },
        objects: {
            foxGltf: "./resources/simple_fox/scene.gltf",
        },
    },

    load: function() {
        document.body.innerHTML = "";
        const text = document.createElement("h");
        text.innerText = "Loading...";
        document.body.appendChild(text);

        gltfLoader = new GLTFLoader(manager);

        // TODO: aggiustare posizione e scaling
        console.log(this.assets.objects.foxGltf);
        gltfLoader.load(this.assets.objects.foxGltf, (gltf) => {
            fox = gltf.scene;
            fox.name = "fox";
            fox.position.set(0, -14.3, -620);
            fox.scale.set(0.3, 0.3, 0.3);

            fox.traverse(function (child) {
              if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
              }
            });
            fox.castShadow = true;
            fox.receiveShadow = true;

            // Torso
            var hip = fox.getObjectByName(foxFunc.fox_dic.Hip);
            var spine1 = fox.getObjectByName(foxFunc.fox_dic.Spine1);
            var spine2 = fox.getObjectByName(foxFunc.fox_dic.Spine2);
            var neck = fox.getObjectByName(foxFunc.fox_dic.Neck);
            var head = fox.getObjectByName(foxFunc.fox_dic.Head);
            var torso = fox.getObjectByName(foxFunc.fox_dic.Torso);

            // Front legs
            var rightUpperArm = fox.getObjectByName(foxFunc.fox_dic.RightUpperArm);
            var rightForeArm = fox.getObjectByName(foxFunc.fox_dic.RightForeArm);
            var rightHand = fox.getObjectByName(foxFunc.fox_dic.RightHand);
            var leftUpperArm = fox.getObjectByName(foxFunc.fox_dic.LeftUpperArm);
            var leftForeArm = fox.getObjectByName(foxFunc.fox_dic.LeftForeArm);
            var leftHand = fox.getObjectByName(foxFunc.fox_dic.LeftHand);

            // Back legs
            var leftLeg1 = fox.getObjectByName(foxFunc.fox_dic.LeftLeg1);
            var leftLeg2 = fox.getObjectByName(foxFunc.fox_dic.LeftLeg2);
            var leftFoot1 = fox.getObjectByName(foxFunc.fox_dic.LeftFoot1);
            var leftFoot2 = fox.getObjectByName(foxFunc.fox_dic.LeftFoot2);
            var rightLeg1 = fox.getObjectByName(foxFunc.fox_dic.RightLeg1);
            var rightLeg2 = fox.getObjectByName(foxFunc.fox_dic.RightLeg2);
            var rightFoot1 = fox.getObjectByName(foxFunc.fox_dic.RightFoot1);
            var rightFoot2 = fox.getObjectByName(foxFunc.fox_dic.RightFoot2);

            // Tail
            var tail1 = fox.getObjectByName(foxFunc.fox_dic.Tail1);
            var tail2 = fox.getObjectByName(foxFunc.fox_dic.Tail2);
            var tail3 = fox.getObjectByName(foxFunc.fox_dic.Tail3);

            /* TODO: controllare se hanno bisogno di rotazioni, aggiungere la coda
            rightUpperArm.rotation.z = (0 * Math.PI) / 180;
            leftUpperArm.rotation.z = (45 * Math.PI) / 180;
            upperArm_right.rotation.x = (0 * Math.PI) / 180;
            upperArm_left.rotation.x = (0 * Math.PI) / 180;
            upperLeg_right.rotation.x = (0 * Math.PI) / 180;
            upperLeg_left.rotation.x = (-180 * Math.PI) / 180;
            //dirLight.target = fox;
            */


            scene.add(fox);
            //keyboard(fox);
            //foxFunc.setFoxGeometry();
            //requestAnimationFrame(animate);
        });
    }
}

manager.onLoad = function() {
    Loader.loaded = true;
    Loader.onLoad();
};

export{Loader};
