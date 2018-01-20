var Animate = function(animationDelay, animationIndexCounter, animationCurrentFrame) {
    this.animationDelay = animationDelay;
    this.animationIndexCounter = animationIndexCounter;
    this.animationCurrentFrame = animationCurrentFrame;
};

var AnimationCounterIndex = 0;
var AnimationCounter = new Array();

function InitalizeAnimationCounters() {
    for (var i = 0; i < 1000; i++) {
        AnimationCounter[i] = new Animate(0, 0, 0);
    }
}

function ResetAnimationCounter() {
    AnimationCounterIndex = 0;
}

function animation(idleUp, idleDown, idleLeft, idleRight, moveUp, moveDown, moveLeft, moveRight) {
    this.idleUp = idleUp;
    this.idleDown = idleDown;
    this.idleLeft = idleLeft;
    this.idleRight = idleRight;
    this.moveUp = moveUp;
    this.moveDown = moveDown;
    this.moveLeft = moveLeft;
    this.moveRight = moveRight;
}