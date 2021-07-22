"use strict";

import * as THREE from './lib/three.js-master/build/three.module.js';

// Definizione modello e animazioni
var moveOnX;
var rotateAroundY;

var trapBox;

const trap_dic = {
    Root: "RootNode",

};

// Animations
function move(trap) {
    moveOnX = new TWEEN.Tween(trap.position)
        .to( {x: -40 + trap.position.x}, 3000)
        .repeat(Infinity)
        .easing(TWEEN.Easing.Linear.None)
        .yoyo(true)
        .start()
}

function rotate(trap){
    var fromRotate = {
        y_leftRotation: trapRoot.rotation.y,
        };
    var toRotate = {
        y_leftRotation: (50 * Math.PI) / 180,
    };

    rotateAroundY = new TWEEN.Tween(fromRotate)
        .to(toRotate ,100)
        .easing(TWEEN.Easing.Linear.None)
        .repeat(Infinity)
        .yoyo(true)
        .onUpdate(function () {
            trapRoot.rotation.y= fromRotate.y_leftRotation;
      })
      .start();
  }


// COLLISIONS FUNCTIONS
function collisionListener(trap) {
    var material = Physijs.createMaterial( new THREE.MeshStandardMaterial({side: THREE.DoubleSide, transparent: true, opacity: 0, depthWrite: false} ));

    var trapGeometry = new THREE.BoxGeometry(1.5, 4, 1);
    trapBox = new Physijs.BoxMesh(trapGeometry, material, 0);
    trapBox.position.set(trap.position.x, trap.position.y, trap.position.z);

    trapBox.setCcdMotionThreshold(1);
    scene.add(trapBox);

    trapBoxID = trapBox._physijs.id;

}

function changeBoxPosition(trap) {
    trapBox.position.set( trap.position.x, trap.position.y, trap.position.z );

    var trapBoxPos = trapBox.position.clone();
    trapBox.position.copy(trapBoxPos);
    trapBox.rotation.set(0, 0, 0);
    trapBox.__dirtyPosition = true;
    trapBox.__dirtyRotation = true;
}

export{trap_dic, move, rotate, collisionListener, changeBoxPosition}
