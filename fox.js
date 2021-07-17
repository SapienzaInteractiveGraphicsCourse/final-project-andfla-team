"use strict";

import * as THREE from './lib/three.js-master/build/three.module.js';

// Definizione modello e animazioni
let left;
let right;
let jumping;
let gravityFall;
let isFalling = false;
let simpleJumpValue = 5;
let simpleFallValue = 5;

const fox_dic = {
    Root: "b_Root_00",

    Hip: "b_Hip_01",
    Spine1: "b_Spine01_02",
    Spine2: "b_Spine02_03",
    Neck: "b_Neck_04",
    Head: "b_Head_05",

    RightUpperArm: "b_RightUpperArm_06",
    RightForeArm: "b_RightForeArm_07",
    RightHand: "b_RightHand_08",
    LeftUpperArm: "b_LeftUpperArm_09",
    LeftForeArm: "b_LeftForeArm_010",
    LeftHand: "b_LeftHand_011",

    Tail1: "b_Tail01_012",
    Tail2: "b_Tail02_013",
    Tail3: "b_Tail03_014",

    LeftLeg1: "b_LeftLeg01_015",
    LeftLeg2: "b_LeftLeg02_016",
    LeftFoot1: "b_LeftFoot01_017",
    LeftFoot2: "b_LeftFoot02_018",
    RightLeg1: "b_RightLeg01_019",
    RightLeg2: "b_RightLeg02_020",
    RightFoot1: "b_RightFoot01_021",
    RightFoot2: "b_RightFoot02_022",
};

// Fox moves Left
function moveLeft(fox) {
    left = new TWEEN.Tween(fox.position)
        .to( {x: -2 + fox.position.x}, 100)
        .easing(TWEEN.Easing.Linear.None)
        .start()
}

// Fox moves Right
function moveRight(fox) {
    right = new TWEEN.Tween(fox.position)
        .to( {x: +2 + fox.position.x}, 100)
        .easing(TWEEN.Easing.Linear.None)
        .start()
}

// Starts the falling animation
function fall(fox) {
    gravityFall = new TWEEN.Tween(fox.position) 
        .to({y: - simpleFallValue + fox.position.y}, 1000)
        .easing(TWEEN.Easing.Quadratic.In)
        .start();
}

// Stops the falling animation
function stopFallAnimation() {
    jump.stop();
    gravityFall.stop();
}

function jump(fox) {
    jumping = new TWEEN.Tween(fox.position) 
        .to({y: +simpleJumpValue + fox.position.y}, 600)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
}

export{fox_dic, moveLeft, moveRight, jump, fall}