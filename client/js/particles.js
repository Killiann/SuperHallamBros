var breakParticle = {
  maxParticles: 15,
  size: 8,
  sizeRandom: 2,
  speed: 0.2,
  speedRandom: 1.05,
  // Lifespan in frames
  lifeSpan: 29,
  lifeSpanRandom: 0,
  // Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
  angle: 0,
  angleRandom: 180,
  startColour: [90, 90, 90, 0.9],
  endColour: [70, 70, 70, 0.1],
  // Only applies when fastMode is off, specifies how sharp the gradients are drawn
  sharpness: 20,
  // Random spread from origin
  spread: 20,
  // How many frames should this last
  duration: 30,
  // Will draw squares instead of circle gradients
  fastMode: true,
  gravity: { x: 0, y: 0.04 },
  // sensible values are 0-3
  jitter: 0,
}


var deathParticle = {
  maxParticles: 300,
    size: 4,
    sizeRandom: 2,
    speed: 0.4,
    speedRandom: 0,
    // Lifespan in frames
    lifeSpan: 29,
    lifeSpanRandom: 0,
    // Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
    angle: 0,
    angleRandom: 180,
    startColour: [90, 90, 90, 0.9],
    endColour: [70, 70, 70, 0.1],

    // Random spread from origin
    spread: 40,
    // How many frames should this last
    duration: 50,
    // Will draw squares instead of circle gradients
    fastMode: true,
    gravity: { x: 0, y: 0.005 },
    // sensible values are 0-3
    jitter: 0,
    // Offset for the origin of the particles
    originOffset: {x: 25, y: 20}
}
//If we have many particles this should be a main method.
function createBreakParticle(x, y){
    let part = Crafty.e('2D, Canvas, Particles').attr({w:40, h:40, x: x, y: y}).particles(breakParticle);
    setTimeout(function(){
      part.destroy();
    }, 2000);
}

function createDeathParticle(x, y){
    let part = Crafty.e('2D, Canvas, Particles').attr({w:20, h:40, x: x, y: y}).particles(deathParticle);
    setTimeout(function(){
      part.destroy();
    }, 5000);
}
