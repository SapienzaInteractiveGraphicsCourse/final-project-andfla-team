"use strict";

import * as THREE from './lib/three.js-master/build/three.module.js';

// Definizione modello e animazioni
var left;
var right;
var rotateLeft;
var rotateRight;
var jumping;
var extending;
var bending;
var gravityFall;
var landing;
var firstJumping;

var isFalling = false;

var simpleJumpValue = 15;
var simpleFallValue = -30;

var tweenStartBending,tweenGoalBending;
var tweenStartExtending,tweenGoalExtending;
var tweenStartJumping,tweenGoalJumping;
var tweenStartFalling,tweenGoalFalling;
var tweenStartLanding,tweenGoalLanding;

var foxBox;

groupLeft = new TWEEN.Group();
groupRight = new TWEEN.Group();
groupJumping = new TWEEN.Group();
groupRotating = new TWEEN.Group();
groupFalling = new TWEEN.Group();


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

//function traslate(fox,direction)
function moveLeft(fox) {
    //console.log("Root : " + root.rotation.z);
    left = new TWEEN.Tween(fox.position,groupLeft)
        .to( {}, 1000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
          fox.position.x -= 0.2;
        })
        .start()
}

// Fox moves Right
function moveRight(fox) {
    right = new TWEEN.Tween(fox.position, groupRight)
        .to( {}, 1000) //{x: +2 + fox.position.x}
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
            fox.position.x += 0.2;
        })
        .start()
}


function rotateBody(fox, direction){

    var tweenStartLeft = {
        z_leftRotation: root.rotation.z,
        y_leftRotation: root.rotation.y,
        };
    var tweenGoalLeft = {
        z_leftRotation: (-90 * Math.PI) / 180,
        y_leftRotation: (2 * Math.PI) / 180,
    };
    var tweenStartRight = {
        z_rightRotation: root.position.z,
        y_leftRotation: root.rotation.y,
    };
    var tweenGoalRight = {
        z_rightRotation: (90 * Math.PI) / 180,
        y_leftRotation: (-2 * Math.PI) / 180,
    };

    if (direction == "left") {
    //console.log("Root, prima di rotazione verso sinistra: " + root.rotation.z);

    rotateLeft = new TWEEN.Tween(tweenStartLeft, groupRotating)
        .to(tweenGoalLeft ,100)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
            root.rotation.z= tweenStartLeft.z_leftRotation;
            root.rotation.y= tweenStartLeft.y_leftRotation;
      })
      .start();
      //console.log("Root, dopo rotazione verso sinistra: " + root.rotation.z);
  }

  if (direction == "right") {
    rotateRight = new TWEEN.Tween(tweenStartRight, groupRotating)
      .to(tweenGoalRight, 100)  //{z: (90 * Math.PI) / 180 }
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(function () {
        root.rotation.z = tweenStartRight.z_rightRotation;
        root.rotation.y= tweenStartRight.y_leftRotation;
      })
      .start();
  }
}

// Starts the falling animation of game over
function fall(fox) {
    gravityFall = new TWEEN.Tween(fox.position, groupFalling)
        .to({y:  simpleFallValue + fox.position.y}, 1000)

        .easing(TWEEN.Easing.Quadratic.In)
        .start();
}

// Stops the falling animation
function stopFallAnimation() {
    jump.stop();
    gravityFall.stop();
} //unused

function firstJump(fox) {
    firstJumping = new TWEEN.Tween(fox.position)
        .to({y: +simpleJumpValue + fox.position.y}, 600)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
}

function jump(fox) {
    console.log("jump animation");

  tweenStartBending = {
    y:            fox.position.y,
    rightUpperArm:rightUpperArm.rotation.z,
    rightForeArm: rightForeArm.rotation.z,
    rightHand:    rightHand.rotation.z,
    leftUpperArm: leftUpperArm.rotation.z,
    leftForeArm:  leftForeArm.rotation.z,
    leftHand:     leftHand.rotation.z,
    rightLeg1:    rightLeg1.rotation.z,
    rightLeg2:    rightLeg2.rotation.z,
    leftLeg1:     leftLeg1.rotation.z,
    leftLeg2:     leftLeg2.rotation.z,
    neck:         neck.rotation.z,
  };
  tweenGoalBending = {
    y:           tweenStartBending.y-0.3,
    rightUpperArm:  (-45 * Math.PI) / 180,
    rightForeArm:   (-90 * Math.PI) / 180,
    rightHand:      (90 * Math.PI) / 180,

    leftUpperArm:   (-45 * Math.PI) / 180,
    leftForeArm:    (-90 * Math.PI) / 180,
    leftHand:       (90 * Math.PI) / 180,

    rightLeg1:      (-120 * Math.PI) / 180,
    rightLeg2:      (-90 * Math.PI) / 180,

    leftLeg1:       (-120 * Math.PI) / 180,
    leftLeg2:       (-90 * Math.PI) / 180,

    neck:           (10 * Math.PI) / 180,
  };
  tweenStartExtending = {

  //  y:            root.position.y,
    rightUpperArm:rightUpperArm.rotation.z,
    rightForeArm: rightForeArm.rotation.z,
    rightHand:    rightHand.rotation.z,
    leftUpperArm: leftUpperArm.rotation.z,
    leftForeArm:  leftForeArm.rotation.z,
    leftHand:     leftHand.rotation.z,
    rightLeg1:    rightLeg1.rotation.z,
    rightLeg2:    rightLeg2.rotation.z,
    leftLeg1:     leftLeg1.rotation.z,
    leftLeg2:     leftLeg2.rotation.z,
    neck:         neck.rotation.z,
  };
  tweenGoalExtending = {
    //root: -         5,
    rightUpperArm:  tweenStartBending.rightUpperArm,//(-75 * Math.PI) / 180,
    rightForeArm:   tweenStartBending.rightForeArm,//(-15 * Math.PI) / 180,
    rightHand:      tweenStartBending.rightHand,//(60 * Math.PI) / 180,

    leftUpperArm:   tweenStartBending.leftUpperArm,//(-60 * Math.PI) / 180,
    leftForeArm:    tweenStartBending.leftForeArm,//(-30 * Math.PI) / 180,
    leftHand:       tweenStartBending.leftHand,//(15 * Math.PI) / 180,

    rightLeg1:      tweenStartBending.rightLeg1,//(-180 * Math.PI) / 180,
    rightLeg2:      tweenStartBending.rightLeg2,//(-30 * Math.PI) / 180,

    leftLeg1:       tweenStartBending.leftLeg1,//(-180 * Math.PI) / 180,
    leftLeg2:       tweenStartBending.leftLeg2,//(-30 * Math.PI) / 180,

    neck:           tweenStartBending.neck,//(30 * Math.PI) / 180,
  };
  tweenStartJumping ={
      y:        tweenGoalBending.y, //fox.position.y,
  }
  tweenGoalJumping ={
      y:        tweenStartJumping.y + simpleJumpValue,
  }
  tweenStartFalling ={
      y:        tweenGoalJumping.y,
  }
  tweenGoalFalling ={
      y:        tweenStartFalling.y + simpleFallValue,
  }

//landing unused
  tweenStartLanding ={
      y:        tweenGoalFalling.y,
      rightUpperArm:rightUpperArm.rotation.z,
      rightForeArm: rightForeArm.rotation.z,
      rightHand:    rightHand.rotation.z,
      leftUpperArm: leftUpperArm.rotation.z,
      leftForeArm:  leftForeArm.rotation.z,
      leftHand:     leftHand.rotation.z,
      rightLeg1:    rightLeg1.rotation.z,
      rightLeg2:    rightLeg2.rotation.z,
      leftLeg1:     leftLeg1.rotation.z,
      leftLeg2:     leftLeg2.rotation.z,
      neck:         neck.rotation.z,
  }
  tweenGoalLanding = {
    y:           tweenStartLanding.y-5,
    rightUpperArm:  (-45 * Math.PI) / 180,
    rightForeArm:   (-90 * Math.PI) / 180,
    rightHand:      (90 * Math.PI) / 180,

    leftUpperArm:   (-45 * Math.PI) / 180,
    leftForeArm:    (-90 * Math.PI) / 180,
    leftHand:       (90 * Math.PI) / 180,

    rightLeg1:      (-120 * Math.PI) / 180,
    rightLeg2:      (-90 * Math.PI) / 180,

    leftLeg1:       (-120 * Math.PI) / 180,
    leftLeg2:       (-90 * Math.PI) / 180,

    neck:           (10 * Math.PI) / 180,
  };

    bending = new TWEEN.Tween(tweenStartBending, groupJumping)
        .to(tweenGoalBending,100)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
          fox.position.y = tweenStartBending.y;
          rightUpperArm.rotation.z = tweenStartBending.rightUpperArm;
          rightForeArm.rotation.z = tweenStartBending.rightForeArm;
          rightHand.rotation.z = tweenStartBending.rightHand;
          leftUpperArm.rotation.z = tweenStartBending.leftUpperArm;
          leftForeArm.rotation.z = tweenStartBending.leftForeArm;
          leftHand.rotation.z = tweenStartBending.leftHand;
          rightLeg1.rotation.z = tweenStartBending.rightLeg1;
          rightLeg2.rotation.z = tweenStartBending.rightLeg2;
          leftLeg1.rotation.z = tweenStartBending.leftLeg1;
          leftLeg2.rotation.z = tweenStartBending.leftLeg2;
          neck.rotation.z = tweenStartBending.neck;

          isFalling = false;
          //console.log("bending");
        })
        .start();

    extending = new TWEEN.Tween(tweenStartExtending, groupJumping)
        .to(tweenGoalExtending,500)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
          rightUpperArm.rotation.z = tweenStartExtending.rightUpperArm;
          rightForeArm.rotation.z = tweenStartExtending.rightForeArm;
          rightHand.rotation.z = tweenStartExtending.rightHand;
          leftUpperArm.rotation.z = tweenStartExtending.leftUpperArm;
          leftForeArm.rotation.z = tweenStartExtending.leftForeArm;
          leftHand.rotation.z = tweenStartExtending.leftHand;
          rightLeg1.rotation.z = tweenStartExtending.rightLeg1;
          rightLeg2.rotation.z = tweenStartExtending.rightLeg2;
          leftLeg1.rotation.z = tweenStartExtending.leftLeg1;
          leftLeg2.rotation.z = tweenStartExtending.leftLeg2;
          neck.rotation.z = tweenStartExtending.neck;

          isFalling = false;
          //console.log("ext");
        })
        .delay(100)
        .start();

    jumping = new TWEEN.Tween(tweenStartJumping, groupJumping)
        .to(tweenGoalJumping, 1000) //{y: +simpleJumpValue + fox.position.y},tweenGoalJumping
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
        //  console.log("jumping");
          fox.position.y = tweenStartJumping.y;
          isFalling=false;
        })
        .delay(100)
        .start()
        .onComplete(function(){
          isFalling=true;
        });

/*{        console.log("rightUpperArm.rotation.z= " +rightUpperArm.rotation.z);
        console.log("rightForeArm.rotation.z= " +rightForeArm.rotation.z);
        console.log("rightHand.rotation.z= " +rightHand.rotation.z);
        console.log("rightLeg1.rotation.z= " +rightLeg1.rotation.z);
        console.log("rightLeg2.rotation.z= " +rightLeg2.rotation.z);
        console.log("rightUpperArm.rotation.z= " +rightUpperArm.rotation.z);
        console.log("neck.rotation.z= " +neck.rotation.z);}*/

      gravityFall = new TWEEN.Tween(tweenStartFalling, groupJumping)
            .to(tweenGoalFalling, 3500)  //y: - simpleFallValue + root.position.y
            .easing(TWEEN.Easing.Quadratic.In)
            .onUpdate( function(){
              if (isFalling){
                fox.position.y = tweenStartFalling.y;
              }
              //console.log("root.position.y = "+ root.position.y);
              //console.log("Gravity Fall");
            })
            .delay(1000)
            .start()
            .onComplete(function(){
                isFalling = false;
            });

/*
      landing = new TWEEN.Tween(tweenStartLanding, groupJumping)
            .to(tweenGoalLanding,100)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function () {
                  root.position.y = tweenStartLanding.y;
                  rightUpperArm.rotation.z = tweenStartLanding.rightUpperArm;
                  rightForeArm.rotation.z = tweenStartLanding.rightForeArm;
                  rightHand.rotation.z = tweenStartLanding.rightHand;
                  leftUpperArm.rotation.z = tweenStartLanding.leftUpperArm;
                  leftForeArm.rotation.z = tweenStartLanding.leftForeArm;
                  leftHand.rotation.z = tweenStartLanding.leftHand;
                  rightLeg1.rotation.z = tweenStartLanding.rightLeg1;
                  rightLeg2.rotation.z = tweenStartLanding.rightLeg2;
                  leftLeg1.rotation.z = tweenStartLanding.leftLeg1;
                  leftLeg2.rotation.z = tweenStartLanding.leftLeg2;
                  neck.rotation.z = tweenStartLanding.neck;

                  isFalling = false;
                  console.log("Landing");
              })
              .start();
*/

            //jumping.chain(gravityFall);


    //bending.chain(jumping)
    //extending.chain(jumping);

    bending.chain(extending,jumping);
    jumping.chain(gravityFall);
    //gravityFall.chain(landing);
  //    gravityFall.chain(jumping);
}

/*

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

function firstJump(fox) {
    jumping = new TWEEN.Tween(fox.position)
        .to({y: +simpleJumpValue + fox.position.y}, 600)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
}

export{fox_dic, moveLeft, moveRight, jump, fall}
*/

// COLLISIONS FUNCTIONS
function collisionListener(fox) {
    var material = Physijs.createMaterial( new THREE.MeshStandardMaterial({color: 0x00ff00} ));
    
    var foxGeometry = new THREE.BoxGeometry(2.7, 0.2, 2);
    foxBox = new Physijs.BoxMesh(foxGeometry, material, 50);
    foxBox.position.set(fox.position.x, fox.position.y , fox.position.z);
    
    foxBox.setCcdMotionThreshold(1);
    scene.add(foxBox);
    
    foxBox.addEventListener("collision", function() {
        console.log("collided, insert here code FOXXXXXXXX");
    });
}

function changeBoxPosition(fox) {
    foxBox.position.set( fox.position.x, fox.position.y + 1, fox.position.z );

    var foxBoxPos = foxBox.position.clone();
    foxBox.position.copy(foxBoxPos);
    foxBox.rotation.set(0, 0, 0);
    foxBox.__dirtyPosition = true;
    foxBox.__dirtyRotation = true;
}

export{fox_dic, moveLeft, moveRight, rotateBody, jump, fall, firstJump, collisionListener, changeBoxPosition}



















