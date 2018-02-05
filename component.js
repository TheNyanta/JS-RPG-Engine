/**
* A component in the game that will be drawn
* For Geometric Objects, Images & Sprites
* @param x-position
* @param y-position
*/
function component(x, y) {
    // Standard Properties of any component
    this.x = x;
    this.y = y;
    
    //this.lastx = x;
    //this.lasty = y;
    
    
    // Other properties
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
        return this;
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
        return this;
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
        return this;
    }
    
    /**
    * adds motion properties
    * @param default moving speed
    */
    this.velocity = function(speed) {
        this.speedX = 0;
        this.speedY = 0;
        this.speed = speed;
        return this;
    }
    
    /**
    * add key control
    * make component listen to key inputs
    */
    this.control = function(up, down, left, right) {        
        // Key Control Properties
        this.up = up;
        this.down = down;
        this.left = left;
        this.right = right;
        
        this.disableControls = false;
        
        return this;
    }
    
    /**
    * add animations
    * 
    */
    this.animation = function(animationTime, idleUp, idleDown, idleLeft, idleRight, moveUp, moveDown, moveLeft, moveRight) {
        this.animationTime = animationTime;
        this.idleUp = idleUp;
        this.idleDown = idleDown;
        this.idleLeft = idleLeft;
        this.idleRight = idleRight;
        this.moveUp = moveUp;
        this.moveDown = moveDown;
        this.moveLeft = moveLeft;
        this.moveRight = moveRight;
        this.direction = DIR_S; // Default Direction
        
        return this;
    }
    
    /**
    * Add Collision to the component
    * @param x position relative to the sprite image
    * @param y position relative to the sprite image
    * @param width
    * @param height
    */
    this.collision = function(x, y, width, height) {
        // Collision Properties
        this.collidable = true;
        this.moveable = false; // True if it can be pushed away by other components. TODO: Implement
        this.offset_x = x;
        this.offset_y = y;
        this.offset_width = width;
        this.offset_height = height;
        
        return this;
    }
    
    /**
    * Add Interactions
    * Interactions are started if the component stands in front of another component
    * that has an event if for i.e. the "enter"-key is pressed (or it's clicked/touched).
    */
    this.interactive = function() {
        // The front of the component
        this.front = new component().rectangle(16, 16, "black", false, "white", true).collision(0, 0, 16, 16);
        // It's interacting state
        this.interacting = false;
        
        return this;
    }
    
    /**
    * Updating:
    * - First step: How will the component move only based on it's control-input (speedX/Y)?
    * - Second step: Will it collide with other components? Resolve collision! If all involved components not moveable: all speedX/Y = 0.
    * - Third step: Is the resolved collision ok with the map collision? If not speedX/Y of all colliding comps = 0.
    */
    
    
    /**
    * Update the components speedX/Y value based on the control-input
    */
    this.updateControl = function() {
        // A component is moved by setting it's speedX/Y and adding it to it's x/y position after checking for collisions
        this.keyControl();
        
        // Interactions: Dialog(Select Choice):Sstop all movement? Probably yes, (for automatic texts: maybe make it chooseable), Switches, ...
        this.keyEvent();
        
        // After the speedX/Y is set the direction the component is facing can be updated
        this.updateDirection();
        
        // Checks if there is a collision with the map
        this.mapCollsion();
        
        return this;
    }
    
    /**
    * Update the components position
    */
    this.updatePosition = function() {
        // Sets Animations if defined based on moving and direction
        if (this.type == "sprite")
            this.updateAnimation();
        
        // Update Position
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Update Front
        if (this.front != undefined)
            this.updateFront();
        
        // Reset Movement
        this.speedX = 0;
        this.speedY = 0;
        
        // Stop only on tiles: Causes problems with component-component-collision if both step on the same tile!
        //this.moveFinisher();
        
        return this;
    }
    
    /**
    * updates the component
    * calculates position, update animation sequence, check key events
    */
    this.update = function() {
        
        // A component is moved by setting it's speedX/Y and adding it to it's x/y position after checking for collisions
        this.keyControl();
        
        // Interactions: Dialog(Select Choice): Stop all movement? Probably yes, (for automatic texts: maybe make it chooseable), Switches, ...
        this.keyEvent();
        
        // After the speedX/Y is set the direction the component is facing can be updated
        this.updateDirection();
        
        // Checks if there is a collision with the map
        this.mapCollsion();
        
        // Sets Animations if defined based on moving and direction
        if (this.type == "sprite")
            this.updateAnimation();
        
        // Update Position
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Update Front
        if (this.front != undefined)
            this.updateFront();
        
        // Reset Movement
        this.speedX = 0;
        this.speedY = 0;
        
        // Stop only on tiles: Causes problems with component-component-collision if both step on the same tile!
        this.moveFinisher();
        
        return this;
    }
    
    /**
    * Render component
    * Draw it on the canvas
    */
    this.draw = function () {        
        ctx = myGameArea.context;
        
        if (debug) {
            if (this.rects != undefined) this.showStandingOnTiles();
            if (this.front != undefined) this.front.draw();
        }            
        
        // Image
        if (this.type == "image") {
            ctx.drawImage(this.img, this.x-gameCamera.x, this.y-gameCamera.y, this.width, this.height);
        }
        
        // Sprite
        else if (this.type == "sprite") {
            this.drawSprite();
        }
        
        // Rectangle
        else if (this.type == "rectangle"){
            ctx.fillStyle = this.fillColor;
            ctx.strokeStyle = this.outlineColor;
            if (this.filled) ctx.fillRect(this.x-gameCamera.x, this.y-gameCamera.y, this.width, this.height);
            else if (this.filled == undefined) ctx.fillRect(this.x, this.y, this.width, this.height);
            if (this.outline) ctx.strokeRect(this.x-gameCamera.x, this.y-gameCamera.y, this.width, this.height);     
        }
        
        return this;
    }
    
    /**
    * Tells if the component is clicked on
    */
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
    /**
    * Update the facing direction based on the speed
    * For 4-direction movement (for 8-direction add more cases)
    */
    this.updateDirection = function() {
        if (this.speedY < 0) this.direction = DIR_N;
        if (this.speedY > 0) this.direction = DIR_S;
        if (this.speedX < 0) this.direction = DIR_W;
        if (this.speedX > 0) this.direction = DIR_E;
    }
    
    /**
    * Updates the shown animation sequence based on the direction te component is facing
    * For 4-direction movement (for 8-direction add more cases)
    */
    this.updateAnimation = function() {
        // Idle (Animation or Still)
        if (this.speedX == 0 && this.speedY == 0){
            if (this.direction == DIR_N) this.sequence = this.idleUp;
            if (this.direction == DIR_S) this.sequence = this.idleDown;
            if (this.direction == DIR_W) this.sequence = this.idleLeft;
            if (this.direction == DIR_E) this.sequence = this.idleRight; 
        }
        // Moving
        else {
            if (this.direction == DIR_N) this.sequence = this.moveUp;
            if (this.direction == DIR_S) this.sequence = this.moveDown;
            if (this.direction == DIR_W) this.sequence = this.moveLeft;
            if (this.direction == DIR_E) this.sequence = this.moveRight;
        }
    }
    
    this.updateFront = function() {
        if (this.direction == DIR_N) {
                this.front.x = Math.floor((this.x + this.offset_x)/16)*16;
                this.front.y = Math.floor((this.y + this.offset_y - 16)/16)*16;
            }
            if (this.direction == DIR_S) {
                this.front.x = Math.floor((this.x + this.offset_x)/16)*16;
                this.front.y = Math.floor((this.y + this.offset_y + 16)/16)*16;
            }
            if (this.direction == DIR_W) {
                this.front.x = Math.floor((this.x + this.offset_x - 16)/16)*16;
                this.front.y = Math.floor((this.y + this.offset_y)/16)*16;
            }
            if (this.direction == DIR_E) {
                this.front.x = Math.floor((this.x + this.offset_x + 16)/16)*16;
                this.front.y = Math.floor((this.y + this.offset_y)/16)*16;
            }
    }
    
    /**
    * Draw the sprite
    * animated & still
    */
    this.drawSprite = function() {
        if (this.sequence != undefined) {
            // Animation: Moving / Idle
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
                ctx.drawImage(this.img, res[0]*this.width, res[1]*this.height, this.width, this.height, this.x-gameCamera.x, this.y-gameCamera.y, this.width, this.height);
                AnimationCounterIndex++;
            }
            // No Animation: Just sprite image
            else {
                var res = i2xy(this.sequence, Math.max(this.spritesX, this.spritesY));
                ctx.drawImage(this.img, res[0]*this.width, res[1]*this.height, this.width, this.height, this.x-gameCamera.x, this.y-gameCamera.y, this.width, this.height);
            }
        }
    }
    
    /**
    * Key Control: Setup keys with the control function
    * move the component up/down/left/right if the key is pressed
    */
    this.keyControl = function() {
        // Check if it key control is allowed
        if (!this.disableControls && !this.finishMove) {
            // Listen to keys: "Else if" to limit movement in only one direction at the same time (no diagonal moving)
            if (myGameArea.keys) {
                if (myGameArea.keys[this.up])
                    this.speedY = -this.speed;
                else if (myGameArea.keys[this.down])
                    this.speedY = this.speed;
                else if (myGameArea.keys[this.left])
                    this.speedX = -this.speed;
                else if (myGameArea.keys[this.right])
                    this.speedX = this.speed;
            }
        }
    }
    
    /**
    * Key Events
    * Interaction
    */
    this.keyEvent = function() {
        // Key Events for moving the component
        if (chatSequence) {
            if (myGameArea.keys && this.interacting) {
                if (myGameArea.keys[this.up])
                    currentDialog.selected = 0
                else if (myGameArea.keys[this.down])
                    currentDialog.selected = 1;
                else if (myGameArea.keys[this.left])
                    currentDialog.selected = 2;
                else if (myGameArea.keys[this.right])
                    currentDialog.selected = 3;
            }
        }
    }    
    
    // ########################
    // ## Collision handling ##
    // ########################
    
    /**
    * Prevents map collision
    * [TODO: Check if there is no collision between the old and the new position
    * (only happens if moving really fast!)]
    */
    this.mapCollsion = function() {
        if (!this.isMapWalkable()) {
            this.updateDirection();
            this.speedX = 0;
            this.speedY = 0;
            this.collided = true;
        }
        else this.collided = false;
    }
    
    /**
    * Calculates the new position and checks if it's walkable by using the maps collision layer
    * Only for width/height=16: => with tile-height/width=16 only max 4 tiles to stand on
    * "may TODO": Adept for all sizes
    */
    this.isMapWalkable = function() {
        if (!this.collidable) return true;
        
        // Converts the cartesian to grid coordiantes
        var x1 = Math.floor((this.x+this.offset_x+this.speedX)/16);
        var y1 = Math.floor((this.y+this.offset_y+this.speedY)/16);
        var x2 = x1 + 1;
        var y2 = y1 + 1;
        
        // Check if standing exactly on a tile-axis; tolarance=0.1
        if (Math.abs(x1-(this.x+this.offset_x+this.speedX)/16) < 0.1) x2 = x1;
        if (Math.abs(y1-(this.y+this.offset_y+this.speedY)/16) < 0.1) y2 = y1;
        
        // Debugging Map Collision: Shows on which tiles the object is standing and map collisions
        if (debug) {
            this.rects = [];
            for (i = 0; i < 4; i++) this.rects[i] = new component().rectangle(16, 16, "black", false, "blue", true);
        
            this.rects[0].x = x1*16; this.rects[0].y = y1*16;
            this.rects[1].x = x1*16; this.rects[1].y = y2*16;
            this.rects[2].x = x2*16; this.rects[2].y = y1*16;
            this.rects[3].x = x2*16; this.rects[3].y = y2*16;
            
            if (maps[mapID].layerC[xy2i(x1,y1,maps[mapID].mapWidth)]) this.rects[0].outlineColor = "blue"; else this.rects[0].outlineColor = "red";
            if (maps[mapID].layerC[xy2i(x1,y2,maps[mapID].mapWidth)]) this.rects[1].outlineColor = "blue"; else this.rects[1].outlineColor = "red";
            if (maps[mapID].layerC[xy2i(x2,y1,maps[mapID].mapWidth)]) this.rects[2].outlineColor = "blue"; else this.rects[2].outlineColor = "red";
            if (maps[mapID].layerC[xy2i(x2,y2,maps[mapID].mapWidth)]) this.rects[3].outlineColor = "blue"; else this.rects[3].outlineColor = "red";
        }
        
        // Check map borders
        if (x1 < 0 || y1 < 0 || x2 > maps[mapID].mapWidth - 1 || y2 > maps[mapID].mapHeight - 1)
            return false;
          
        // Use collision layer of the map and check if all 4 tiles are walkable (=true)
        return (maps[mapID].layerC[xy2i(x1,y1,maps[mapID].mapWidth)] && maps[mapID].layerC[xy2i(x1,y2,maps[mapID].mapWidth)] && maps[mapID].layerC[xy2i(x2,y1,maps[mapID].mapWidth)] && maps[mapID].layerC[xy2i(x2,y2,maps[mapID].mapWidth)]);
    }
    
    /**
    * Tell if the collision boxes of the two components are overlapping
    */
    this.collisionOverlap = function(otherobj) {
        if (!this.collidable) return false;
        if (!otherobj.collidable) return false;
        
        if ((this.y + this.offset_y + this.offset_height <= otherobj.y + otherobj.offset_y) ||
            (this.y + this.offset_y >= otherobj.y + otherobj.offset_y + otherobj.offset_height) ||
            (this.x + this.offset_x + this.offset_width <= otherobj.x + otherobj.offset_x) ||
            (this.x + this.offset_x >= otherobj.x + otherobj.offset_x + otherobj.offset_width))
            return false

        return true;
    }
    
    /**
    * Prevent collsion with other components
    * Has to be called in the main loop for all combinations after the control updates of all components
    */
    this.componentCollision = function(otherobj) {
        if (!this.collidable || !otherobj.collidable) return false;
        
        if ((this.y + this.offset_y + this.speedY + this.offset_height <= otherobj.y + otherobj.offset_y + otherobj.speedY) ||
            (this.y + this.offset_y + this.speedY >= otherobj.y + otherobj.offset_y + otherobj.speedY + otherobj.offset_height) ||
            (this.x + this.offset_x + this.speedX + this.offset_width <= otherobj.x + otherobj.offset_x + otherobj.speedX) ||
            (this.x + this.offset_x + this.speedX >= otherobj.x + otherobj.offset_x + otherobj.speedX + otherobj.offset_width)) {
            return false
        }
        else {
            if (!otherobj.moveable) {
                this.speedX = 0;
                this.speedY = 0;
                otherobj.speedX = 0;
                otherobj.speedY = 0;
            }
            /*else {
                otherobj.speedX = this.speedX;
                otherobj.speedY = this.speedY;
                // TODO: Prevent moving into other components
                
                for (i = 0; i < maps_objects[mapID].length; i++) {
                    if (maps_objects[mapID][i] != this && maps_objects[mapID][i] != otherobj) {
                        if ()
                    }
                }
                if (!otherobj.isMapWalkable()) {
                    this.speedX = 0;
                    this.speedY = 0;
                    otherobj.speedX = 0;
                    otherobj.speedY = 0;
                }                
            }*/
            return true;
        }
    }
    
    /**
    * For debug: Shows the tiles the component is standing (blue rectangles)
    */
    this.showStandingOnTiles = function() {
        for (i = 0; i < this.rects.length; i++)
        this.rects[i].draw();
    }
    
    /**
    * Always stop on a whole tile
    */
    this.moveFinisher = function() {
        var x1 = Math.floor((this.x+this.offset_x)/16);
        var y1 = Math.floor((this.y+this.offset_y)/16);
        var xFin = (Math.abs(x1-(this.x+this.offset_x)/16) >= 0.1);
        var yFin = (Math.abs(y1-(this.y+this.offset_y)/16) >= 0.1);
        // Prevents other movements through control
        this.finishMove = true;
        // Finish moving in x-direction
        if (xFin) {
            console.log("x");
            if (this.direction == DIR_W) this.speedX = -this.speed;
            else if (this.direction == DIR_E) this.speedX = this.speed;
        }
        // Finish moving in y-direction
        if (yFin) {
            console.log("y");
            if (this.direction == DIR_N) this.speedY = -this.speed;
            else if (this.direction == DIR_S) this.speedY = this.speed;
        }
        if (!xFin && !yFin) {
            console.log("end");
            this.finishMove = false;
        }
        
    }    
}