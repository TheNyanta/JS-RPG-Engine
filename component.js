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
        
        // ######################
        // ## Sprite functions ##
        // ######################
        
        /**
        * Draw the sprite
        * animated & still
        */
        this.drawSprite = function(ctx) {
            if (this.sequence != undefined) {
                // Animation: Moving / Idle
                if (this.sequence.length != undefined) {
                    if (this.animationDelay++ >= this.animationTime) {
                        this.animationDelay = 0;
                        this.animationIndexCounter++;
                        if (this.animationIndexCounter >= this.sequence.length) {
                            this.animationIndexCounter = 0;
                        }
                        this.animationCurrentFrame = this.sequence[this.animationIndexCounter];
                    }
                    var res = i2xy(this.animationCurrentFrame, Math.max(this.spritesX, this.spritesY));
                    ctx.drawImage(this.img, res[0]*this.width, res[1]*this.height, this.width, this.height, this.x-gameCamera.x, this.y-gameCamera.y, this.width, this.height);
                }
                // No Animation: Just sprite image
                else {
                    var res = i2xy(this.sequence, Math.max(this.spritesX, this.spritesY));
                    // For cached tiles
                    if (this.static) ctx.drawImage(this.img, res[0]*this.width, res[1]*this.height, this.width, this.height, this.x, this.y, this.width, this.height);
                    // For moving objects
                    else ctx.drawImage(this.img, res[0]*this.width, res[1]*this.height, this.width, this.height, this.x-gameCamera.x, this.y-gameCamera.y, this.width, this.height);
                }
            }
        }
    
        /**
        * Update the facing direction based on the speed
        * This is used for drawing the right animation sequence and
        * to determinate the front of the component for interactions
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
            if (this.speedX == 0 && this.speedY == 0 || gameSequence){
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
        
        /**
        * Key Control: Setup keys with the control function
        * move the component up/down/left/right if the key is pressed
        */
        this.keyControl = function() {
            // Check if it key control is allowed
            if (!this.disableControls /*&& !this.finishMove*/) {
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
        
        this.animationDelay = 0;
        this.animationIndexCounter = 0;
        this.animationCurrentFrame = 0;
        
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
        
        // #########################
        // ## Collision functions ##
        // #########################
        
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
                this.rects[i].draw(myGameArea.context);
        }
        
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
        
        this.updateFront = function() {
            if (this.direction == DIR_N) {
                this.front.x = this.x + this.offset_x;
                this.front.y = this.y + this.offset_y - 16;
            }
            if (this.direction == DIR_S) {
                this.front.x = this.x + this.offset_x
                this.front.y = this.y + this.offset_y + 16;
            }
            if (this.direction == DIR_W) {
                this.front.x = this.x + this.offset_x - 16;
                this.front.y = this.y + this.offset_y;
            }
            if (this.direction == DIR_E) {
                this.front.x = this.x + this.offset_x + 16;
                this.front.y = this.y + this.offset_y;
            }
        }
        
        // Interaction available if this front is overlapping with another object
        // Press enter to start
        this.updateInteraction = function(otherobj) {
            if (this.front.collisionOverlap(otherobj)) {
                // You can set an event if an interaction is available (i.e. maybe a little sparkling animation for hidden things or highlight for dialog [maybe also show what kind of event?])
                // if (otherobj.onInRangeForInteraction != undefined) otherobj.onInRangeForInteraction();
                
                if (myGameArea.keys) {
                    // Enter key down
                    if (myGameArea.keys[KEY_ENTER]) {
                        if (otherobj.enterEvent) {
                            if (otherobj.faceOnInteraction) this.turntoface(otherobj);
                            if (otherobj.onEnterEvent != undefined) otherobj.onEnterEvent();
                            otherobj.enterEvent = false;
                        }
                    }
                    // Enter key up: Enable enter event
                    else otherobj.enterEvent = true;
                }
            }
            else otherobj.enterEvent = false;
        }
        
        /**
        * Turn other object if interaction
        * If you talk to a other person you expect them to turn to face you
        */
        this.turntoface = function(otherobj) {
            // Stop running animation if Enter is pressed while moving
            this.updateAnimation();
            // Turn otherobj to face this
            if (this.direction == DIR_N) otherobj.direction = DIR_S;
            if (this.direction == DIR_S) otherobj.direction = DIR_N;
            if (this.direction == DIR_E) otherobj.direction = DIR_W;
            if (this.direction == DIR_W) otherobj.direction = DIR_E;
            otherobj.updateAnimation(); 
        }
        
        return this;
    }
    
    /**
    * Adds Clicking
    * A onclick-Event can be defined that will be fired on click
    */
    this.clickable = function() {
        this.click = false;
        this.clickEvent = true;
        
        /**
        * Updates the click state of the component and fires one onclick-Event if defined
        */
        this.updateClick = function() {
            this.click = false;
            this.clicked();
            
            if (this.click)
                if (this.clickEvent) {
                    if (this.onClickEvent != undefined) this.onClickEvent();
                    this.clickEvent = false;
                }
        }
        
        /**
        * Tells if the component is clicked on
        * If it's not clicked an on-click Event can be fired again
        */
        this.clicked = function() {
            var myleft = this.x;
            var myright = this.x + (this.width);
            var mytop = this.y;
            var mybottom = this.y + (this.height);
        
            // The game canvas by default
            if (activeCanvas == undefined) {
                var clickX = myGameArea.clickdownX + gameCamera.x;
                var clickY = myGameArea.clickdownY + gameCamera.y;
            }                
            // The game canvas can move so you have to add the gameCameras x and y  
            else if (activeCanvas == 0) {
                var clickX = myGameArea.clickdownX + gameCamera.x;
                var clickY = myGameArea.clickdownY + gameCamera.y;
            }
            // The tileset canvas will be always full drawn
            else if (activeCanvas == 1) {
                var clickX = myGameArea.clickdownX;
                var clickY = myGameArea.clickdownY;
            }       
            
            if (myGameArea.mousedown || myGameArea.touchdown) this.click = true;
            else this.clickEvent = true; // Enable Click Event again
        
            if ((mybottom < clickY) || (mytop > clickY) || (myright < clickX) || (myleft > clickX)) this.click = false;
        }
        
        return this;
    }
    
    /**
    * Updating:
    * - First step: How will the component move only based on it's control-input (speedX/Y)?
    * - Second step: Will it collide with other components? Resolve collision! If all involved components not moveable: all speedX/Y = 0.
    * - Third step: Is the resolved collision ok with the map collision? If not speedX/Y of all colliding comps = 0.
    */
    
    
    /**
    * Update the components movement (based on speedX/Y values)
    * Movement can change through user control, movement events (and TODO: moveable interaction)
    */
    this.updateMovement = function() {
        // If the component has a key control
        if (this.keyControl != undefined) this.keyControl();
        
        // If the component has an movement event it will be called here
        if (this.movementEvent != undefined) this.movementEvent();
        
        // If the component has an onClick event this will check if it is clicked
        if (this.onClickEvent != undefined) this.updateClick();
        
        // The direction the component is facing can be updated after the speedX/Y is set
        if (this.direction != undefined) this.updateDirection();
        
        // Checks if there is a collision with the map and adjust movement if needed
        this.mapCollsion();
        
        return this;
    }
    
    /**
    * Update the components position after all collision checks are done
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
    
    /*
    this.updateEvent = function() {
        // If the component has a repeating Event it will be called here: it has to be defined extra
        if (this.repeatingEvent != undefined) this.repeatingEvent();
        // Character stands infront of the component and presses enter
        if (this.interactionEvent != undefined) this.interactionEvent();
    }*/
    
    /**
    * Render component
    * Draw it on the canvas
    */
    this.draw = function (ctx) {        
        //ctx = myGameArea.context;          
        
        // Image
        if (this.type == "image") {
            ctx.drawImage(this.img, this.x-gameCamera.x, this.y-gameCamera.y, this.width, this.height);
        }
        
        // Sprite
        else if (this.type == "sprite") {
            // Extra drawings for debugging
            if (debug) {
                // Draw Standing tiles
                if (this.rects != undefined) this.showStandingOnTiles();
                // Draw Front
                if (this.front != undefined) this.front.draw(myGameArea.context);
                // Draw Collision Box
                ctx.strokeStyle = "black";
                ctx.strokeRect(this.x + this.offset_x - gameCamera.x, this.y + this.offset_y - gameCamera.y, this.offset_width , this.offset_height);
            }
            // Draw Sprite
            this.drawSprite(ctx);                       
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
    * Always stop on a whole tile
    */
    /*
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
    }*/    
}