function component(width, height, color, x, y, type, spriteWidth, spriteHeight, spritesX, spritesY) {
    this.type = type;
    if (type == "image" || type == "background" || type == "sprite") {
        this.image = new Image();
        this.image.src = color;
    }
    // Standard Properties
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;    
    this.speedX = 0;
    this.speedY = 0;
    this.speed = 2;
    this.walkthrough = false;
    
    // TODO: https://www.w3schools.com/graphics/tryit.asp?filename=trygame_rotate_game
    //this.angle = 0; 
    //this.angleSpeed = 0;
    
    // Sprite Properties
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.spritesX = spritesX;
    this.spritesY = spritesY;
    this.sequence = 25;
    this.direction = DIR_S;
    
    // Animated
    this.animationTime = 3;
    this.animations;
    
    /*
    // Gravity
    this.gravityX = 0.0;
    this.gravityY = 0.0;
    this.gravitySpeedX = 0;
    this.gravitySpeedY = 0;
    // Bounce
    this.bounceX = 0.0;
    this.bounceY = 0.0;
    */    
    
    this.update = function() {
        
        // Update the direction the component is facing
        this.isFacing();
        // Resolve Collision with the map
        if (!this.walkthrough)
            this.mapCollsion();
        
        // Update Position
        this.x += this.speedX;
        this.y += this.speedY;
        
        // If Gravity ...
        //this.gravitySpeedX += this.gravityX;
        //this.gravitySpeedY += this.gravityY;
        //this.x += this.speedX + this.gravitySpeedX;
        //this.y += this.speedY + this.gravitySpeedY;        
        
        // Sets Animations if defined based on moving and direction
        this.isMoving();
        this.animate();
        // Reset Movement
        this.speedX = 0;
        this.speedY = 0;
        
        //this.hitBottom();
        
        // Render component
        ctx = myGameArea.context;
        // Image
        if (this.type == "image") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        // Sprite
        else if (this.type == "sprite") {
            if (this.sequence != undefined) {
                // Animated
                if (this.sequence.length != undefined) {
                    if (AnimationCounter[AnimationCounterIndex].animationDelay++ >= this.animationTime) {
                        AnimationCounter[AnimationCounterIndex].animationDelay = 0;
                        AnimationCounter[AnimationCounterIndex].animationIndexCounter++;
                        if (AnimationCounter[AnimationCounterIndex].animationIndexCounter >= this.sequence.length) {
                            AnimationCounter[AnimationCounterIndex].animationIndexCounter = 0;
                        }
                        AnimationCounter[AnimationCounterIndex].animationCurrentFrame = this.sequence[AnimationCounter[AnimationCounterIndex].animationIndexCounter];
                    }
                    var res = i2xy(AnimationCounter[AnimationCounterIndex].animationCurrentFrame, Math.max(this.spritesX, this.spritesY));
                    ctx.drawImage(this.image, res[0]*this.spriteWidth, res[1]*this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x-gameCamera.x, this.y-gameCamera.y, this.spriteWidth, this.spriteHeight);
                    AnimationCounterIndex++;
                }
                // Standing still
                else {
                    var res = i2xy(this.sequence, Math.max(this.spritesX, this.spritesY));
                    ctx.drawImage(this.image, res[0]*this.spriteWidth, res[1]*this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x-gameCamera.x, this.y-gameCamera.y, this.spriteWidth, this.spriteHeight);
                }
            }
        }
        else if (this.type == "background") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            //ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        } 
        
        // Rectangle
        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    /*
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeedY = -(this.gravitySpeedY * this.bounceY);
        }
        if (this.y == rockbottom) {
            this.midair = false;
        }
    }
    */
    
    // Use maps tile width & height for collision
    this.crashWith = function(otherobj, x2, y2) {
        if (this.walkthrough) return false;
        if (otherobj.walkthrough) return false;
        var myleft = this.x + x2;
        var myright = this.x + x2 + (this.width);
        if (this.type == "sprite") myright = this.x +x2 + 16;
        var mytop = this.y + y2;
        var mybottom = this.y + y2 + (this.height);
        if (this.type == "sprite") mybottom = this.y +y2 + 16;
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        if (this.type == "sprite") otherright = otherobj.x + 16;
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        if (this.type == "sprite") otherbottom = otherobj.y + 16;
        var crash = true;
        if ((mybottom <= othertop) ||
               (mytop >= otherbottom) ||
               (myright <= otherleft) ||
               (myleft >= otherright)) {
           crash = false;
        }
        return crash;
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
    
    // For 4-direction movement (for 8-direction add more cases)
    this.isFacing = function() {
        if (this.speedY < 0) this.direction = DIR_N;
        if (this.speedY > 0) this.direction = DIR_S;
        if (this.speedX < 0) this.direction = DIR_W;
        if (this.speedX > 0) this.direction = DIR_E;
    }
    
    // Map Collision Resolver
    this.mapCollsion = function() {
        // Rare TODO: Check if there is no collision between the old and the new position (happens if moving too fast!)
        if(!maps[mapID].isWalkable(this.x-gameCamera.x+this.speedX, this.y-gameCamera.y+this.speedY)) {
        this.speedX /= 2;
        this.speedY /= 2;
        }
        //this.speedX = Math.ceil(this.speedX);
        //this.speedY = Math.ceil(this.speedY);
        if (!maps[mapID].isWalkable(this.x-gameCamera.x+this.speedX, this.y-gameCamera.y+this.speedY)) {
            this.speedX = 0;
            this.speedY = 0;
        }
    }
    
    this.isMoving = function() {
        if (this.speedX == 0 && this.speedY == 0)
            return false;        
        return true;
    }
    
    // For 4-direction movement (for 8-direction add more cases)
    this.animate = function() {
        if (this.animations != undefined) {
            // Moving
            if (this.isMoving()){
                if (this.direction == DIR_N) this.sequence = this.animations.moveUp;
                if (this.direction == DIR_S) this.sequence = this.animations.moveDown;
                if (this.direction == DIR_W) this.sequence = this.animations.moveLeft;
                if (this.direction == DIR_E) this.sequence = this.animations.moveRight;         
            }
            // Idle (Animated or Still)
            else {
                if (this.direction == DIR_N) this.sequence = this.animations.idleUp;
                if (this.direction == DIR_S) this.sequence = this.animations.idleDown;
                if (this.direction == DIR_W) this.sequence = this.animations.idleLeft;
                if (this.direction == DIR_E) this.sequence = this.animations.idleRight;                       
            }
        }
    }
}