/**
* A component to display in the game: Geometric Objects, Images & Sprites
* @param x-position
* @param y-position
*/
function component(x, y) {
    // Standard Properties of any component
    this.x = x;
    this.y = y;    
    this.speedX = 0;
    this.speedY = 0;
    this.speed = 2;    
    // TODO: https://www.w3schools.com/graphics/tryit.asp?filename=trygame_rotate_game
    //this.angle = 0; 
    //this.angleSpeed = 0; 
    
    /**
    * image component
    * @param {file} image src
    * @param image draw width
    * @param image draw height
    */
    this.image = function(img, width, height) {
        this.type = "image";
        if (this.img == undefined) this.img = new Image();
        this.img.src = img;
        this.width = width;
        this.height = height;
    }
    
    /**
    * sprite component
    * @param {file} sprite src
    * @param width of on sprite on the spritesheet
    * @param height of on sprite on the spritesheet
    * @param number of sprites horizontal
    * @param number of sprites vertical
    */
    this.sprite = function(spritesheet, width, height, spritesX, spritesY) {
        this.type = "sprite";
        if (this.img == undefined) this.img = new Image();
        this.img.src = spritesheet;
        this.width = width;
        this.height = height;
        this.spritesX = spritesX;
        this.spritesY = spritesY;
    }
    
    /**
    * line component
    * @param
    *//*
    this.line = function() {
        this.
    }
    
    this.vecx = vecx;
    this.vecy = vecy;
    
    this.draw = function(width, color) {
        gfx.beginPath();
        gfx.lineWidth = width; //2px
        gfx.moveTo(this.x, this.y);
        gfx.lineTo(this.x + vecx, this.y + vecy);
        gfx.strokeStyle = color;
        gfx.stroke();
    }
    
    this.length = function() {
        var dx = this.vecx;
        var dy = this.vecy;
        return Math.sqrt(dx * dx + dy * dy);
    }*/
    
    /**
    * rectangle component
    * @param width of rectangle
    * @param height of rectangle
    * @param fillColor of rectangle
    * @param {bool} rectangle filled or not
    * @param outlineColor of rectangle
    * @param {bool} rectangle outline or not
    */
    this.rectangle = function(width, height, fillColor, filled, outlineColor, outline) {
        this.type = "rectangle";
        this.width = width;
        this.height = height;
        this.fillColor = fillColor;
        this.filled = filled;
        this.outlineColor = outlineColor;
        this.outline = outline;        
    }
    
    this.update = function(delta) {
        
        // Update the direction the component is facing
        if (this.isMoving()) this.isFacing();
        
        // Resolve Collision with the map
        //mapCollsion();
        
        // Update Position
        this.x += this.speedX;// * delta); //delta = 16,...
        this.y += this.speedY;// * delta);
    }
    
    this.draw = function() {
        
        // Sets Animations if defined based on moving and direction
        this.isMoving();
        this.updateAnimate();
        
        // Render component
        ctx = myGameArea.context;
        
        // Image
        if (this.type == "image") {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
        
        // Sprite
        else if (this.type == "sprite") {
            this.drawSprite();
        }
        
        // Rectangle
        else if (this.type == "rectangle"){
            ctx.fillStyle = this.fillColor;
            ctx.strokeStyle = this.outlineColor;
            if (this.filled) ctx.fillRect(this.x, this.y, this.width, this.height);
            else if (this.filled == undefined) ctx.fillRect(this.x, this.y, this.width, this.height);
            if (this.outline) ctx.strokeRect(this.x, this.y, this.width, this.height);     
        }
        
        // Reset Movement
        this.speedX = 0;
        this.speedY = 0;
    }
    
    this.clicked = function() {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var clicked;
        if (myGameArea.x && myGameArea.y && (myGameArea.mousedown || myGameArea.touchdown)) { clicked = true; }
        if ((mybottom < myGameArea.y) || (mytop > myGameArea.y) || (myright < myGameArea.x) || (myleft > myGameArea.x)) {
            clicked = false;
        }
        return clicked;
    }
    
    // Update the facing direction based on the speed
    // For 4-direction movement (for 8-direction add more cases)
    this.isFacing = function() {
        if (this.speedY < 0) this.animation.direction = DIR_N;
        if (this.speedY > 0) this.animation.direction = DIR_S;
        if (this.speedX < 0) this.animation.direction = DIR_W;
        if (this.speedX > 0) this.animation.direction = DIR_E;
    }
    
    this.isMoving = function() {
        if (this.speedX == 0 && this.speedY == 0)
            return false;        
        return true;
    }
    
    // Updates the shown animation sequence based on the direction te component is facing
    // For 4-direction movement (for 8-direction add more cases)
    this.updateAnimate = function() {
        if (this.animation != undefined) {
            // Moving
            if (this.isMoving()){
                if (this.animation.direction == DIR_N) this.sequence = this.animation.moveUp;
                if (this.animation.direction == DIR_S) this.sequence = this.animation.moveDown;
                if (this.animation.direction == DIR_W) this.sequence = this.animation.moveLeft;
                if (this.animation.direction == DIR_E) this.sequence = this.animation.moveRight;         
            }
            // Idle (Animation or Still)
            else {
                if (this.animation.direction == DIR_N) this.sequence = this.animation.idleUp;
                if (this.animation.direction == DIR_S) this.sequence = this.animation.idleDown;
                if (this.animation.direction == DIR_W) this.sequence = this.animation.idleLeft;
                if (this.animation.direction == DIR_E) this.sequence = this.animation.idleRight;                       
            }
        }
    }
    
    this.drawSprite = function() {
        if (this.sequence != undefined) {
            // animation moving or idle
            if (this.sequence.length != undefined) {
                if (AnimationCounter[AnimationCounterIndex].animationDelay++ >= this.animation.animationTime) {
                    AnimationCounter[AnimationCounterIndex].animationDelay = 0;
                    AnimationCounter[AnimationCounterIndex].animationIndexCounter++;
                    if (AnimationCounter[AnimationCounterIndex].animationIndexCounter >= this.sequence.length) {
                        AnimationCounter[AnimationCounterIndex].animationIndexCounter = 0;
                    }
                    AnimationCounter[AnimationCounterIndex].animationCurrentFrame = this.sequence[AnimationCounter[AnimationCounterIndex].animationIndexCounter];
                }
                var res = i2xy(AnimationCounter[AnimationCounterIndex].animationCurrentFrame, Math.max(this.spritesX, this.spritesY));
                ctx.drawImage(this.img, res[0]*this.width, res[1]*this.height, this.width, this.height, this.x-gameCamera.x, this.y-gameCamera.y, this.width, this.height);
                AnimationCounterIndex++;
            }
            // Standing still
            else {
                var res = i2xy(this.sequence, Math.max(this.spritesX, this.spritesY));
                ctx.drawImage(this.img, res[0]*this.width, res[1]*this.height, this.width, this.height, this.x-gameCamera.x, this.y-gameCamera.y, this.width, this.height);
            }
        }
    }
    
}