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
    this.animationTime = 3;
    
    // TODO: https://www.w3schools.com/graphics/tryit.asp?filename=trygame_rotate_game
    this.angle = 0; 
    this.angleSpeed = 0;
    
    // Sprite Properties
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.spritesX = spritesX;
    this.spritesY = spritesY;
    this.sequence = 25;
    this.direction = DIR_S;
    
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
        // Update Position
        //this.gravitySpeedX += this.gravityX;
        //this.gravitySpeedY += this.gravityY;
        //this.x += this.speedX + this.gravitySpeedX;
        this.x += this.speedX;
        //this.y += this.speedY + this.gravitySpeedY;
        this.y += this.speedY;
        // Reset Movement
        this.speedX = 0;
        this.speedY = 0;
        
        //this.hitBottom();
        
        // Render component
        ctx = myGameArea.context;
        // Image
        if (type == "image") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        else if (type == "sprite") {
            if (this.sequence != undefined) {
                // Animation
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
        else if (type == "background") {
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
    
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
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
        if (myGameArea.x && myGameArea.y) {
            clicked = true;
        }
        if ((mybottom < myGameArea.y) || (mytop > myGameArea.y) || (myright < myGameArea.x) || (myleft > myGameArea.x)) {
            clicked = false;
        }
        return clicked;
    }
    
    this.isMoving = function() {
        if (this.speedX != 0 || this.speedY !=0)
            return true;
        return false;
    }
}

/*
if (character_is_moving) {
        if (character_direction & DIR_W) char_seq = [36,37,38];
        if (character_direction & DIR_E) char_seq = [12,13,14];
        if (character_direction & DIR_N) char_seq = [0,1,2];
        if (character_direction & DIR_S) char_seq = [24,25,26];
        character.draw(charX[mapID]-relativeX[mapID], charY[mapID]-relativeY[mapID], char_seq);
    }
else {
        if (character_look[mapID] == DIR_W) char_look = 37;
        if (character_look[mapID] == DIR_E) char_look = 13;    
        if (character_look[mapID] == DIR_N) char_look = 1;
        if (character_look[mapID] == DIR_S) char_look = 25;
        character.draw(charX[mapID]-relativeX[mapID], charY[mapID]-relativeY[mapID], char_look);
    }*/