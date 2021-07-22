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

var fromBending,toBending;
var fromExtending,toExtending;
var fromJumping,toJumping;
var fromFalling,toFalling;
var fromLanding,toLanding;

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

function moveLeft(fox) {
    left = new TWEEN.Tween(fox.position,groupLeft)
        .to( {x: -30 + fox.position.x}, 1000)
        .easing(TWEEN.Easing.Linear.None)
        .start()
}

function moveRight(fox) {
    right = new TWEEN.Tween(fox.position, groupRight)
        .to( {x: 30 + fox.position.x}, 1000) //{x: +2 + fox.position.x}
        .easing(TWEEN.Easing.Linear.None)
        .start()
}



function rotateBody(fox, direction){

    var fromLeft = {
        z_leftRotation: root.rotation.z,
        y_leftRotation: root.rotation.y,
        };
    var toLeft = {
        z_leftRotation: (-90 * Math.PI) / 180,
        y_leftRotation: (2 * Math.PI) / 180,
    };
    var fromRight = {
        z_rightRotation: root.position.z,
        y_leftRotation: root.rotation.y,
    };
    var toRight = {
        z_rightRotation: (90 * Math.PI) / 180,
        y_leftRotation: (-2 * Math.PI) / 180,
    };

    if (direction == "left") {
    rotateLeft = new TWEEN.Tween(fromLeft, groupRotating)
        .to(toLeft ,100)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
            root.rotation.z= fromLeft.z_leftRotation;
            root.rotation.y= fromLeft.y_leftRotation;
      })
      .start();
  }

  if (direction == "right") {
    rotateRight = new TWEEN.Tween(fromRight, groupRotating)
      .to(toRight, 100)  //{z: (90 * Math.PI) / 180 }
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(function () {
        root.rotation.z = fromRight.z_rightRotation;
        root.rotation.y= fromRight.y_leftRotation;
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
    gravityFall.stop();
}

function firstJump(fox) {
    firstJumping = new TWEEN.Tween(fox.position)
        .to({y: +simpleJumpValue + fox.position.y}, 600)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(function () {
            isFalling=false;
            })
        .start();

    var firstFalling = new TWEEN.Tween(fox.position)
        .to({y: -simpleJumpValue + fox.position.y}, 600)
        .easing(TWEEN.Easing.Quadratic.In)
        .onUpdate(function () {
            isFalling=true; })

    firstJumping.chain(firstFalling);
}

function jump(fox) {

  fromBending = {
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
  toBending = {
    y:           fromBending.y,
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
  fromExtending = {

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
  toExtending = {
    //root: -         5,
    rightUpperArm:  fromBending.rightUpperArm,//(-75 * Math.PI) / 180,
    rightForeArm:   fromBending.rightForeArm,//(-15 * Math.PI) / 180,
    rightHand:      fromBending.rightHand,//(60 * Math.PI) / 180,

    leftUpperArm:   fromBending.leftUpperArm,//(-60 * Math.PI) / 180,
    leftForeArm:    fromBending.leftForeArm,//(-30 * Math.PI) / 180,
    leftHand:       fromBending.leftHand,//(15 * Math.PI) / 180,

    rightLeg1:      fromBending.rightLeg1,//(-180 * Math.PI) / 180,
    rightLeg2:      fromBending.rightLeg2,//(-30 * Math.PI) / 180,

    leftLeg1:       fromBending.leftLeg1,//(-180 * Math.PI) / 180,
    leftLeg2:       fromBending.leftLeg2,//(-30 * Math.PI) / 180,

    neck:           fromBending.neck,//(30 * Math.PI) / 180,
  };
  fromJumping ={
      y:        toBending.y, //fox.position.y,
      tail1:    tail1.rotation.z,
  }
  toJumping ={
      y:        fromJumping.y + simpleJumpValue,
      tail1:    (180 * Math.PI) / 180,
  }
  fromFalling ={
      y:        toJumping.y,
      tail1:    toJumping.tail1,
  }
  toFalling ={
      y:        fromFalling.y + simpleFallValue,
      tail1:    (30 * Math.PI) / 180,
  }

//landing unused
  fromLanding ={
      y:        toFalling.y,
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
  toLanding = {
    y:           fromLanding.y-5,
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

    bending = new TWEEN.Tween(fromBending, groupJumping)
        .to(toBending,100)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
          fox.position.y = fromBending.y;
          rightUpperArm.rotation.z = fromBending.rightUpperArm;
          rightForeArm.rotation.z = fromBending.rightForeArm;
          rightHand.rotation.z = fromBending.rightHand;
          leftUpperArm.rotation.z = fromBending.leftUpperArm;
          leftForeArm.rotation.z = fromBending.leftForeArm;
          leftHand.rotation.z = fromBending.leftHand;
          rightLeg1.rotation.z = fromBending.rightLeg1;
          rightLeg2.rotation.z = fromBending.rightLeg2;
          leftLeg1.rotation.z = fromBending.leftLeg1;
          leftLeg2.rotation.z = fromBending.leftLeg2;
          neck.rotation.z = fromBending.neck;

          isFalling = false;
        })
        .start();

    extending = new TWEEN.Tween(fromExtending, groupJumping)
        .to(toExtending,500)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
          rightUpperArm.rotation.z = fromExtending.rightUpperArm;
          rightForeArm.rotation.z = fromExtending.rightForeArm;
          rightHand.rotation.z = fromExtending.rightHand;
          leftUpperArm.rotation.z = fromExtending.leftUpperArm;
          leftForeArm.rotation.z = fromExtending.leftForeArm;
          leftHand.rotation.z = fromExtending.leftHand;
          rightLeg1.rotation.z = fromExtending.rightLeg1;
          rightLeg2.rotation.z = fromExtending.rightLeg2;
          leftLeg1.rotation.z = fromExtending.leftLeg1;
          leftLeg2.rotation.z = fromExtending.leftLeg2;
          neck.rotation.z = fromExtending.neck;

          isFalling = false;
        })
        //.delay(100)
        //.start();

    jumping = new TWEEN.Tween(fromJumping, groupJumping)
        .to(toJumping, 1000) //{y: +simpleJumpValue + fox.position.y},toJumping
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
            fox.position.y = fromJumping.y;
            tail1.rotation.z = fromJumping.tail1;
            isFalling=false;
        })
        //.delay(100)
        //.start()
        .onComplete(function(){
          isFalling=true;
        });

      gravityFall = new TWEEN.Tween(fromFalling, groupJumping)
            .to(toFalling, 2500)  //y: - simpleFallValue + root.position.y
            .easing(TWEEN.Easing.Quadratic.In)
            .onUpdate( function(){
              if (isFalling){
                fox.position.y = fromFalling.y;
                tail1.rotation.z = fromFalling.tail1;
              }
            })
            //.delay(1000)
            //.start();

    bending.chain(extending,jumping);
    jumping.chain(gravityFall);
}

// COLLISIONS FUNCTIONS
function collisionListener(fox) {
    var material = Physijs.createMaterial( new THREE.MeshStandardMaterial({side: THREE.DoubleSide, opacity: 0, transparent: true, depthWrite: false} ));

    var foxGeometry = new THREE.BoxGeometry(2.7, 0.2, 2);
    foxBox = new Physijs.BoxMesh(foxGeometry, material, 50);
    foxBox.position.set(fox.position.x, fox.position.y , fox.position.z);

    foxBox.setCcdMotionThreshold(1);
    scene.add(foxBox);

    foxBox.addEventListener("collision", function(other_object, relative_velocity, relative_rotation, contact_normal) {
        if (other_object._physijs.id == trapBoxID)
        {
            if (soundOn) {
                trapSound.play();
                fallSound1.play();
            }
            fall(fox);
        }
        
        if (isFalling){
            if (soundOn)
                jumpSound1.play();
            jump(fox);
        }
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

export{fox_dic, moveLeft, moveRight, rotateBody, jump, fall, stopFallAnimation, firstJump, collisionListener, changeBoxPosition}
