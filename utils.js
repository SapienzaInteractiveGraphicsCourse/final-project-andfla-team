function generateRandomInt(min,max){
    return Math.floor((Math.random() * (max-min)) +min);
}

function visibleHeightAtZDepth( depth, camera ) {
    // Compensate for cameras not positioned at z=0
    const cameraOffset = camera.position.z;
    if ( depth < cameraOffset ) depth -= cameraOffset;
    else depth += cameraOffset;

    // Vertical fov in radians
    const vFOV = camera.fov * Math.PI / 180; 

    // Math.abs to ensure the result is always positive
    return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
}

function visibleWidthAtZDepth( depth, camera ) {
    const height = visibleHeightAtZDepth( depth, camera );
    return height * camera.aspect;
}

export {generateRandomInt, visibleHeightAtZDepth, visibleWidthAtZDepth};