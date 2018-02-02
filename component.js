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
    
    this.update = function() {        
        this.mapCollsion();
        
        // Update the direction the component is facing
        this.isFacing();
        
        // Resolve Collision with the map
        //mapCollsion();
        
        if (this.type == "sprite")
            this.moveFinisher();
        
        // Update Position
        this.x += this.speedX;
        this.y += this.speedY;        
        
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
    
    // ########################
    // ## Collision handling ##
    // ########################
    
    this.collision = function(x, y, width, height) {
        // Collision Properties
        this.collidable = true;
        this.offset_x = x;
        this.offset_y = y;
        this.offset_width = width;
        this.offset_height = height;
        
        // Debugging Map Collision: Shows on which tiles the object is standing
        this.rect1 = new component(); this.rect1.rectangle(16, 16, "black", false, "blue", true);
        this.rect2 = new component(); this.rect2.rectangle(16, 16, "black", false, "blue", true);
        this.rect3 = new component(); this.rect3.rectangle(16, 16, "black", false, "blue", true);
        this.rect4 = new component(); this.rect4.rectangle(16, 16, "black", false, "blue", true);
    }
    
    // Only for width/height=16: => with tile-height/width=16 only max 4 tiles to stand on; "may TODO": Adept for all sizes
    this.isMapWalkable = function() {
        if (this.walkthrough) return true;
        
        var x1 = Math.floor((this.x+this.offset_x+this.speedX)/16);
        var y1 = Math.floor((this.y+this.offset_y+this.speedY)/16);
        var x2 = x1 + 1;
        var y2 = y1 + 1;
        
        // Check if standing exactly on a tile-axis; tolarance=0.1
        if (Math.abs(x1-(this.x+this.offset_x+this.speedX)/16) < 0.1) x2 = x1;
        if (Math.abs(y1-(this.y+this.offset_y+this.speedY)/16) < 0.1) y2 = y1;
        
        if (this.rect1 != undefined) {
            this.rect1.x = x1*16-gameCamera.x; this.rect1.y = y1*16-gameCamera.y;
            this.rect2.x = x1*16-gameCamera.x; this.rect2.y = y2*16-gameCamera.y;
            this.rect3.x = x2*16-gameCamera.x; this.rect3.y = y1*16-gameCamera.y;
            this.rect4.x = x2*16-gameCamera.x; this.rect4.y = y2*16-gameCamera.y;
        }
        
        // Check map borders
        if (x1 < 0 || y1 < 0 || x2 > maps[mapID].mapWidth - 1 || y2 > maps[mapID].mapHeight - 1)
            return false;
        
        if (this.rect1 != undefined) {
            if (maps[mapID].layerC[xy2i(x1,y1,maps[mapID].mapWidth)]) this.rect1.outlineColor = "blue"; else this.rect1.outlineColor = "red";
            if (maps[mapID].layerC[xy2i(x1,y2,maps[mapID].mapWidth)]) this.rect2.outlineColor = "blue"; else this.rect2.outlineColor = "red";
            if (maps[mapID].layerC[xy2i(x2,y1,maps[mapID].mapWidth)]) this.rect3.outlineColor = "blue"; else this.rect3.outlineColor = "red";
            if (maps[mapID].layerC[xy2i(x2,y2,maps[mapID].mapWidth)]) this.rect4.outlineColor = "blue"; else this.rect4.outlineColor = "red";
        }
        
        return (maps[mapID].layerC[xy2i(x1,y1,maps[mapID].mapWidth)] && maps[mapID].layerC[xy2i(x1,y2,maps[mapID].mapWidth)] && maps[mapID].layerC[xy2i(x2,y1,maps[mapID].mapWidth)] && maps[mapID].layerC[xy2i(x2,y2,maps[mapID].mapWidth)]);
    }
    
    // Map Collision Resolver
    // [TODO: Check if there is no collision between the old and the new position (only happens if moving really fast!)]
    this.mapCollsion = function() {
        // Half the move distance and check again
        if(!this.isMapWalkable()) {
            this.speedX /= 2;
            this.speedY /= 2;
        }
        // Collision even if component moves only half way
        if (!this.isMapWalkable()) {
            this.isFacing();
            this.speedX = 0;
            this.speedY = 0;
            this.collided = true;
        }
        else this.collided = false;
    }
    
    // Object Collision Resolver
    // Use maps tile width & height for collision
    this.crashWith = function(otherobj, x2, y2) {
        if (this.walkthrough) return false;
        if (otherobj.walkthrough) return false;
        
        var myleft = this.x + this.offset_x + x2;
        var myright = this.x + this.offset_x + x2 + this.offset_width ;
        var mytop = this.y + this.offset_y + y2;
        var mybottom = this.y + this.offset_y + y2 + this.offset_height;
        var otherleft = otherobj.x + otherobj.offset_x;
        var otherright = otherobj.x + otherobj.offset_x + otherobj.offset_width;
        var othertop = otherobj.y + otherobj.offset_y;
        var otherbottom = otherobj.y + otherobj.offset_y + otherobj.offset_height;
        
        var crash = true;
        if ((mybottom <= othertop) ||
               (mytop >= otherbottom) ||
               (myright <= otherleft) ||
               (myleft >= otherright)) {
           crash = false;
        }
        return crash;
    }
    
    // For debug
    this.showStandingOnTiles = function() {
        this.rect1.update();
        this.rect2.update();
        this.rect3.update();
        this.rect4.update();
    }
    
    // Always stop on a whole tile
    this.moveFinisher = function() {
        // Finish moving in x-direction
        if (this.speedX == 0) {
            var x1 = Math.floor((this.x+this.offset_x)/16);
            if (Math.abs(x1-(this.x+this.offset_x)/16) >= 0.1) {
                if (this.animation.direction == DIR_W) this.speedX = -this.speed;
                else if (this.animation.direction == DIR_E) this.speedX = this.speed;
            }
        }
        // Finish moving in y-direction
        if (this.speedY == 0) {
            var y1 = Math.floor((this.y+this.offset_y)/16);
            if (Math.abs(y1-(this.y+this.offset_y)/16) >= 0.1) {
                if (this.animation.direction == DIR_N) this.speedY = -this.speed;
                else if (this.animation.direction == DIR_S) this.speedY = this.speed;
            }
        }
    }
}
    