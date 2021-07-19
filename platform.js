"use strict";

import * as UTILS from './utils.js';

const platform = {
    ID: 0,
    
    width:  6,
    height: 0.5,
    depth:  4,
    
    position: {
        x: 0,
        y: 0,
        z: 0,        
    },
    
    type: 0,
    
    generate: function (visible_width, visible_height) {
        this.position.x = UTILS.generateRandomInt(-visible_width, +visible_width);
        this.position.y = 6 * this.ID + visible_height/platforms.number;
    }
}

const platforms = {
  obj: [],
  
  number: 10,
}

// COLLISIONS FUNCTIONS
function createBoxWithListener(platform) {
    var material = Physijs.createMaterial( new THREE.MeshStandardMaterial({color: 0x00ff00} ));
    
    var geometry = new THREE.BoxGeometry(6, 0.5, 4);
    var boxPlatform;
    boxPlatform = new Physijs.BoxMesh(geometry, material, 50);
    boxPlatform.position.set(platform.position.x, platform.position.y, platform.position.z);
    
    boxPlatform.setCcdMotionThreshold(1);
    scene.add(boxPlatform);
    
    boxPlatform.addEventListener("collision", function() {
        console.log("collided, insert here code for BOXXXX");
    });
    
    return boxPlatform;
}

function changeBoxPosition(boxPlatform, platform) {
    box.position.set( platform.position.x, platform.position.y + 1, platform.position.z );

    var platBoxPos = platform.position.clone();
    box.position.copy(platBoxPos);
    box.rotation.set(0, 0, 0);
    box.__dirtyPosition = true;
    box.__dirtyRotation = true;
}

export {platform, platforms, changeBoxPosition, createBoxWithListener};