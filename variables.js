var scene;

// Fox model
var root;
var hip;

var spine1;
var spine2;

var neck;
var head;

var rightUpperArm;
var rightForeArm;
var rightHand;
var leftUpperArm;
var leftForeArm;
var leftHand;

var leftLeg1;
var leftLeg2;
var leftFoot1;
var leftFoot2;
var rightLeg1;
var rightLeg2;
var rightFoot1;
var rightFoot2;

var tail1;
var tail2;
var tail3;

var groupLeft;
var groupRight;
var groupJumping;
var groupRotating;
var groupFalling;
var isFalling = false;

// Trap model
var trapRoot;
var trapBoxID;

var simpleJumpValue = 15;
var simpleFallValue = -30;

// Sound
var soundOn = true;
var jumpSound;
var jumpSound1;
var jumpSound2;
var trapSound;
var fallSound1;
var fallSound2;
var gameOverSound;
var gameOpenerSound;

var box;
var foxBox;
var platforms = [];
var boxPlatforms = [];
var wall;
var texLoader;
var realPlatformMaterial;
var prevHeight = 0;

var backgroundChoice = 0;

// Probability
var difficulty = 2;    //2 = easy, 1.5 = medium, 1.25 = hard

var score;
