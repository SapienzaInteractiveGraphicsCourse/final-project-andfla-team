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

var simpleJump = 15;
var simpleTime = 1000;
var time = simpleTime;
var simpleJumpValue = simpleJump;
var simpleFallValue = -30;

// Sound
var soundOn = true;
var jumpSound1;
var superJumpSound;
var vanishSound;
var trapSound;
var fallSound1;
var gameOverSound;
var gameOpenerSound;

var box;
var foxBox;
var platforms = [];
var boxPlatforms = [];
var wall;
var texLoader;

// Type of platform texture
var realPlatformMaterial;
var crashablePlatformMaterial;
var woodPlatformMaterial;

var prevHeight = 0;
var backgroundChoice = 0;

// Hardness
var difficulty = 2;    //2 = easy, 1.5 = medium, 1.25 = hard
var tReal = 70;
var tCrashable = 80

var score;

var repository_name = "/final-project-andfla-team/";