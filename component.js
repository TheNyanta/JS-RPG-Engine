/**
 * A Component in the game that will be drawn
 * For Geometric Objects, Images & Sprites
 * @param x-position
 * @param y-position
 */
function Component(x, y, width, height) {
    // Standard Properties of any Component
    this.x = x;
    this.y = y;

    if (width != undefined && height != undefined) {
        this.width = width;
        this.height = height;
        this.draw = function () {};
    }

    //this.lastx = x;
    //this.lasty = y;    

    // Other properties
    // TODO: https://www.w3schools.com/graphics/tryit.asp?filename=trygame_rotate_game
    //this.angle = 0; 
    //this.angleSpeed = 0;

    /**
     * image Component
     * @param {file} image src
     * @param image draw width
     * @param image draw height
     */
    this.image = function (img, width, height) {
        this.type = "image";
        if (this.img == undefined) this.img = new Image();
        this.img.src = img;
        this.width = width;
        this.height = height;

        this.draw = function (ctx) {
            ctx.drawImage(this.img, this.x - myGameArea.gameCamera.x, this.y - myGameArea.gameCamera.y, this.width, this.height);
        }
        return this;
    }

    /**
     * sprite Component
     * @param {spritesheet} spritesheet
     */
    this.sprite = function (spritesheet) {
        this.type = "sprite";
        this.spritesheet = spritesheet;
        this.width = this.spritesheet.spriteWidth;
        this.height = this.spritesheet.spriteHeight;
        // Default first sprite image
        this.sequence = 0;

        this.draw = function (ctx) {
            // Debug information
            if (myGameArea.debug) {
                // Draw Standing tiles
                if (this.rects != undefined) this.showStandingOnTiles();
                // Draw Front
                if (this.front != undefined) this.front.draw(myGameArea.context);
                // Draw Collision Box
                ctx.strokeStyle = "black";
                ctx.strokeRect(this.x + this.offset_x - myGameArea.gameCamera.x, this.y + this.offset_y - myGameArea.gameCamera.y, this.offset_width, this.offset_height);
            }

            // Sets Animations if defined (based on moving and direction)        
            if (this.updateAnimation != undefined) this.updateAnimation();

            // Animation: Moving / Idle
            if (this.sequence.length != undefined) {
                if (this.animationDelay++ >= this.animationTime) {
                    this.animationDelay = 0;
                    this.animationIndexCounter++;
                    if (this.animationIndexCounter >= this.sequence.length) this.animationIndexCounter = 0;
                }
                drawSprite(ctx, this.spritesheet, this.sequence[this.animationIndexCounter], (this.x - myGameArea.gameCamera.x), (this.y - myGameArea.gameCamera.y));
            }
            // No Animation: Just sprite image
            else drawSprite(ctx, this.spritesheet, this.sequence, (this.x - myGameArea.gameCamera.x), (this.y - myGameArea.gameCamera.y));
        }
        return this;
    }

    /**
     * rectangle Component
     * @param width of rectangle
     * @param height of rectangle
     * @param fillColor of rectangle
     * @param {bool} rectangle filled or not
     * @param outlineColor of rectangle
     * @param {bool} rectangle outline or not
     */
    this.rectangle = function (width, height, fillColor, filled, outlineColor, outline) {
        this.type = "rectangle";
        this.width = width;
        this.height = height;
        this.fillColor = fillColor;
        this.filled = filled;
        this.outlineColor = outlineColor;
        this.outline = outline;

        this.draw = function (ctx) {
            ctx.fillStyle = this.fillColor;
            ctx.strokeStyle = this.outlineColor;
            if (this.filled) ctx.fillRect(this.x - myGameArea.gameCamera.x, this.y - myGameArea.gameCamera.y, this.width, this.height);
            else if (this.filled == undefined) ctx.fillRect(this.x, this.y, this.width, this.height);
            if (this.outline) ctx.strokeRect(this.x - myGameArea.gameCamera.x, this.y - myGameArea.gameCamera.y, this.width, this.height);
        }
        return this;
    }

    /**
     * adds motion properties
     * @param default moving speed
     */
    this.velocity = function (speed) {
        this.speedX = 0;
        this.speedY = 0;
        this.speed = speed;

        this.moving = false;
        this.isMoving = function () {
            if (this.speedX == 0 && this.speedY == 0) this.moving = false;
            else this.moving = true;
        }

        return this;
    }

    /**
     * add key control
     * make Component listen to key inputs
     */
    this.control = function (up, down, left, right) {
        // Key Control Properties
        this.up = up;
        this.down = down;
        this.left = left;
        this.right = right;

        this.disableControls = false;

        /**
         * Key Control: Setup keys with the control function
         * move the Component up/down/left/right if the key is pressed
         */
        this.keyControl = function () {
            // Check if it key control is allowed
            if (!this.disableControls /*&& !this.finishMove*/ ) {
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
     * TODO: clean-up, add special onetime animations (i.e. open door, box, ...)
     */
    this.animation = function () {
        this.animationTime = 0;
        this.animationDelay = 0;
        this.animationIndexCounter = 0;
        this.direction = constants.DIR_S; // Default Direction

        this.idleAnimation = function (idleAnimationTime, idleUp, idleDown, idleLeft, idleRight) {
            this.idleAnimationTime = idleAnimationTime;

            this.idleUp = idleUp;
            this.idleDown = idleDown;
            this.idleLeft = idleLeft;
            this.idleRight = idleRight;

            return this;
        }

        this.moveAnimation = function (moveAnimationTime, moveUp, moveDown, moveLeft, moveRight) {
            this.moveAnimationTime = moveAnimationTime;

            this.moveUp = moveUp;
            this.moveDown = moveDown;
            this.moveLeft = moveLeft;
            this.moveRight = moveRight;

            return this;
        }

        this.specialAnimation = function (specialAnimationTime, special) {
            this.specialAnimationTime = specialAnimationTime;
            this.special = special;
            this.specialOn = false;
            this.specialTimer = new timer();

            this.startSpecial = function () {
                this.specialOn = true;
                this.animationTime = this.specialAnimationTime;
                this.specialTimer.init(1000);
            }

            return this;
        }

        /**
         * Update the facing direction based on the speed
         * This is used for drawing the right animation sequence and
         * to determinate the front of the Component for interactions
         * For 4-direction movement (for more than four directions add more cases)
         */
        this.updateDirection = function () {
            if (this.speedY < 0) this.direction = constants.DIR_N;
            if (this.speedY > 0) this.direction = constants.DIR_S;
            if (this.speedX < 0) this.direction = constants.DIR_W;
            if (this.speedX > 0) this.direction = constants.DIR_E;
        }

        /**
         * Updates the shown animation sequence based on the direction te Component is facing
         * For 4-direction movement (for more than four directions add more cases)
         */
        this.updateAnimation = function () {
            this.sequence = 0; // Default
            // Special animation
            if (this.specialAnimationTime != undefined) {
                if (this.specialTimer.check()) this.specialOn = false;
            }
            if (this.specialOn) {
                this.sequence = this.special;
            }
            // Idle (Animation or Still)
            else if (!this.moving || myGameArea.gameSequence) {
                if (this.idleAnimationTime != undefined) {
                    this.animationTime = this.idleAnimationTime;
                    if (this.direction == constants.DIR_N) this.sequence = this.idleUp;
                    if (this.direction == constants.DIR_S) this.sequence = this.idleDown;
                    if (this.direction == constants.DIR_W) this.sequence = this.idleLeft;
                    if (this.direction == constants.DIR_E) this.sequence = this.idleRight;
                }
            }
            // Moving
            else {
                if (this.moveAnimationTime != undefined) {
                    this.animationTime = this.moveAnimationTime;
                    if (this.direction == constants.DIR_N) this.sequence = this.moveUp;
                    if (this.direction == constants.DIR_S) this.sequence = this.moveDown;
                    if (this.direction == constants.DIR_W) this.sequence = this.moveLeft;
                    if (this.direction == constants.DIR_E) this.sequence = this.moveRight;
                }
            }
        }

        return this;
    }

    /**
     * Add Collision to the Component
     * @param x position relative to the sprite image
     * @param y position relative to the sprite image
     * @param width
     * @param height
     */
    this.collision = function (x, y, width, height) {
        // Collision Properties
        this.collidable = true;
        this.moveable = false; // True if it can be pushed away by other Components. TODO: Implement
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
        this.mapCollision = function () {
            var tmp = this.speedY;

            // X Collision
            this.speedY = 0;
            if (!this.isMapWalkable()) {
                if (this.direction != undefined) this.updateDirection();
                this.speedX = 0;
                this.xCollisionMap = true;
            } else this.xCollisionMap = false;

            // Y Collision
            this.speedY = tmp;
            if (!this.isMapWalkable()) {
                if (this.direction != undefined) this.updateDirection();
                this.speedY = 0;
                this.yCollisionMap = true;
            } else this.yCollisionMap = false;
        }

        /**
         * Calculates the new position and checks if it's walkable by using the maps collision layer
         * "may TODO": Adept for all sizes
         */
        /*
        // 16x16 tiles
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
            if (myGameArea.debug) {
                this.rects = [];
                for (i = 0; i < 4; i++) this.rects[i] = new Component().rectangle(16, 16, "black", false, "blue", true);    
                
                this.rects[0].x = x1*16; this.rects[0].y = y1*16;
                this.rects[1].x = x1*16; this.rects[1].y = y2*16;
                this.rects[2].x = x2*16; this.rects[2].y = y1*16;
                this.rects[3].x = x2*16; this.rects[3].y = y2*16;
            
                if (maps.data[maps.currentMap].layerC[xy2i(x1,y1,maps.data[maps.currentMap].mapWidth)]) this.rects[0].outlineColor = "blue"; else this.rects[0].outlineColor = "red";
                if (maps.data[maps.currentMap].layerC[xy2i(x1,y2,maps.data[maps.currentMap].mapWidth)]) this.rects[1].outlineColor = "blue"; else this.rects[1].outlineColor = "red";
                if (maps.data[maps.currentMap].layerC[xy2i(x2,y1,maps.data[maps.currentMap].mapWidth)]) this.rects[2].outlineColor = "blue"; else this.rects[2].outlineColor = "red";
                if (maps.data[maps.currentMap].layerC[xy2i(x2,y2,maps.data[maps.currentMap].mapWidth)]) this.rects[3].outlineColor = "blue"; else this.rects[3].outlineColor = "red";
            }
        
            // Check map borders
            if (x1 < 0 || y1 < 0 || x2 > maps.data[maps.currentMap].mapWidth - 1 || y2 > maps.data[maps.currentMap].mapHeight - 1)
                return false;
          
            // Use collision layer of the map and check if all 4 tiles are walkable (=true)
            return (maps.data[maps.currentMap].layerC[xy2i(x1,y1,maps.data[maps.currentMap].mapWidth)] && maps.data[maps.currentMap].layerC[xy2i(x1,y2,maps.data[maps.currentMap].mapWidth)] && maps.data[maps.currentMap].layerC[xy2i(x2,y1,maps.data[maps.currentMap].mapWidth)] && maps.data[maps.currentMap].layerC[xy2i(x2,y2,maps.data[maps.currentMap].mapWidth)]);
        }
        */
        // 8x8 tiles
        this.isMapWalkable = function () {
            if (!this.collidable) return true;

            // Converts the cartesian to grid coordiantes
            var x1 = Math.floor((this.x + this.offset_x + this.speedX) / 8);
            var y1 = Math.floor((this.y + this.offset_y + this.speedY) / 8);
            var x2 = x1 + 1;
            var y2 = y1 + 1;
            var x3 = Math.floor((this.x + this.offset_x + this.offset_width + this.speedX) / 8);
            var y3 = Math.floor((this.y + this.offset_y + this.offset_height + this.speedY) / 8);

            // Check if standing exactly on a tile-axis; tolarance=0.1
            if (Math.abs(x3 - (this.x + this.offset_x + this.offset_width + this.speedX) / 8) < 0.1) x3 = x2;
            if (Math.abs(y3 - (this.y + this.offset_y + this.offset_height + this.speedY) / 8) < 0.1) y3 = y2;

            // Debugging Map Collision: Shows on which tiles the object is standing and map collisions
            if (myGameArea.debug) {
                this.rects = [];
                for (i = 0; i < 9; i++) this.rects[i] = new Component().rectangle(8, 8, "black", false, "blue", true);

                this.rects[0].x = x1 * 8;
                this.rects[0].y = y1 * 8;
                this.rects[1].x = x1 * 8;
                this.rects[1].y = y2 * 8;
                this.rects[2].x = x1 * 8;
                this.rects[2].y = y3 * 8;
                this.rects[3].x = x2 * 8;
                this.rects[3].y = y1 * 8;
                this.rects[4].x = x2 * 8;
                this.rects[4].y = y2 * 8;
                this.rects[5].x = x2 * 8;
                this.rects[5].y = y3 * 8;
                this.rects[6].x = x3 * 8;
                this.rects[6].y = y1 * 8;
                this.rects[7].x = x3 * 8;
                this.rects[7].y = y2 * 8;
                this.rects[8].x = x3 * 8;
                this.rects[8].y = y3 * 8;


                if (maps.data[maps.currentMap].layerC[xy2i(x1, y1, maps.data[maps.currentMap].mapWidth)]) this.rects[0].outlineColor = "blue";
                else this.rects[0].outlineColor = "red";
                if (maps.data[maps.currentMap].layerC[xy2i(x1, y2, maps.data[maps.currentMap].mapWidth)]) this.rects[1].outlineColor = "blue";
                else this.rects[1].outlineColor = "red";
                if (maps.data[maps.currentMap].layerC[xy2i(x1, y3, maps.data[maps.currentMap].mapWidth)]) this.rects[2].outlineColor = "blue";
                else this.rects[2].outlineColor = "red";
                if (maps.data[maps.currentMap].layerC[xy2i(x2, y1, maps.data[maps.currentMap].mapWidth)]) this.rects[3].outlineColor = "blue";
                else this.rects[3].outlineColor = "red";
                if (maps.data[maps.currentMap].layerC[xy2i(x2, y2, maps.data[maps.currentMap].mapWidth)]) this.rects[4].outlineColor = "blue";
                else this.rects[4].outlineColor = "red";
                if (maps.data[maps.currentMap].layerC[xy2i(x2, y3, maps.data[maps.currentMap].mapWidth)]) this.rects[5].outlineColor = "blue";
                else this.rects[5].outlineColor = "red";
                if (maps.data[maps.currentMap].layerC[xy2i(x3, y1, maps.data[maps.currentMap].mapWidth)]) this.rects[6].outlineColor = "blue";
                else this.rects[6].outlineColor = "red";
                if (maps.data[maps.currentMap].layerC[xy2i(x3, y2, maps.data[maps.currentMap].mapWidth)]) this.rects[7].outlineColor = "blue";
                else this.rects[7].outlineColor = "red";
                if (maps.data[maps.currentMap].layerC[xy2i(x3, y3, maps.data[maps.currentMap].mapWidth)]) this.rects[8].outlineColor = "blue";
                else this.rects[8].outlineColor = "red";
            }

            // Check map borders
            if (x1 < 0 || y1 < 0 || x2 > maps.data[maps.currentMap].mapWidth - 1 || y2 > maps.data[maps.currentMap].mapHeight - 1)
                return false;

            // Use collision layer of the map and check if all 4 tiles are walkable (=true)
            return (maps.data[maps.currentMap].layerC[xy2i(x1, y1, maps.data[maps.currentMap].mapWidth)] &&
                maps.data[maps.currentMap].layerC[xy2i(x1, y2, maps.data[maps.currentMap].mapWidth)] &&
                maps.data[maps.currentMap].layerC[xy2i(x1, y3, maps.data[maps.currentMap].mapWidth)] &&
                maps.data[maps.currentMap].layerC[xy2i(x2, y1, maps.data[maps.currentMap].mapWidth)] &&
                maps.data[maps.currentMap].layerC[xy2i(x2, y2, maps.data[maps.currentMap].mapWidth)] &&
                maps.data[maps.currentMap].layerC[xy2i(x2, y3, maps.data[maps.currentMap].mapWidth)] &&
                maps.data[maps.currentMap].layerC[xy2i(x3, y1, maps.data[maps.currentMap].mapWidth)] &&
                maps.data[maps.currentMap].layerC[xy2i(x3, y2, maps.data[maps.currentMap].mapWidth)] &&
                maps.data[maps.currentMap].layerC[xy2i(x3, y3, maps.data[maps.currentMap].mapWidth)]);
        }

        /**
         * Tell if the collision boxes of the two Components are overlapping
         */
        this.collisionOverlap = function (otherobj) {
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
         * Prevent Collision with other Components
         * Has to be called in the main loop for all combinations after the control updates of all Components
         * (TODO: Pushable Components -> if (pushable && otherobj.noMapCollision) => push) 
         */
        this.ComponentCollision = function (otherobj) {
            if (!this.collidable || !otherobj.collidable) return false;

            // Saving y-speed
            var tmp1 = this.speedY;
            var tmp2 = otherobj.speedY;

            // Checking X Collision
            this.speedY = 0;
            otherobj.speedY = 0;

            if ((this.y + this.offset_y + this.speedY + this.offset_height <= otherobj.y + otherobj.offset_y + otherobj.speedY) ||
                (this.y + this.offset_y + this.speedY >= otherobj.y + otherobj.offset_y + otherobj.speedY + otherobj.offset_height) ||
                (this.x + this.offset_x + this.speedX + this.offset_width <= otherobj.x + otherobj.offset_x + otherobj.speedX) ||
                (this.x + this.offset_x + this.speedX >= otherobj.x + otherobj.offset_x + otherobj.speedX + otherobj.offset_width)) {
                // No X Collision
                this.xLeftCollision = false;
                this.xRightCollision = false;
            } else {
                if ((this.x + this.offset_x + this.speedX + this.offset_width > otherobj.x + otherobj.offset_x + otherobj.speedX)) {
                    // X Right Collision
                    this.xRightCollision = true;
                    if (this.speedX <= 0) this.speedX = 0;
                    if (otherobj.speedX >= 0) otherobj.speedX = 0;
                }
                if ((this.x + this.offset_x + this.speedX < otherobj.x + otherobj.offset_x + otherobj.speedX + otherobj.offset_width)) {
                    // X Left Collision
                    this.xLeftCollision = true;
                    if (this.speedX >= 0) this.speedX = 0;
                    if (otherobj.speedX <= 0) otherobj.speedX = 0;
                }
            }

            // Checking Y Collision
            this.speedY = tmp1;
            otherobj.speedY = tmp2;

            if ((this.y + this.offset_y + this.speedY + this.offset_height <= otherobj.y + otherobj.offset_y + otherobj.speedY) ||
                (this.y + this.offset_y + this.speedY >= otherobj.y + otherobj.offset_y + otherobj.speedY + otherobj.offset_height) ||
                (this.x + this.offset_x + this.speedX + this.offset_width <= otherobj.x + otherobj.offset_x + otherobj.speedX) ||
                (this.x + this.offset_x + this.speedX >= otherobj.x + otherobj.offset_x + otherobj.speedX + otherobj.offset_width)) {
                // NO Y Collision
                this.yTopCollision = false;
                this.yBottomCollision = false;
            } else {
                if ((this.y + this.offset_y + this.speedY + this.offset_height > otherobj.y + otherobj.offset_y + otherobj.speedY)) {
                    // Y Top Collision
                    this.yTopCollision = true;
                    if (this.speedY >= 0) this.speedY = 0;
                    if (otherobj.speedY <= 0) otherobj.speedY = 0;
                }
                if ((this.y + this.offset_y + this.speedY < otherobj.y + otherobj.offset_y + otherobj.speedY + otherobj.offset_height)) {
                    // Y Bottom Collision
                    this.yBottomCollision = true;
                    if (this.speedY >= 0) this.speedY = 0;
                    if (otherobj.speedY <= 0) otherobj.speedY = 0;
                }
            }

        }

        /**
         * For debug: Shows the tiles the Component is standing (blue rectangles)
         */
        this.showStandingOnTiles = function () {
            for (i = 0; i < this.rects.length; i++)
                this.rects[i].draw(myGameArea.context);
        }

        return this;
    }

    /**
     * Tell this obj overlaps with another obj
     */
    this.rectangleOverlap = function (otherobj) {
        if ((this.y + this.offset_y + this.offset_height <= otherobj.y) ||
            (this.y + this.offset_y >= otherobj.y + otherobj.height) ||
            (this.x + this.offset_x + this.offset_width <= otherobj.x) ||
            (this.x + this.offset_x >= otherobj.x + otherobj.width))
            return false

        return true;
    }

    /**
     * Add Interactions
     * Interactions are started if the Component stands in front of another Component
     * that has an event if for i.e. the "enter"-key is pressed (or it's clicked/touched).
     * @param Enable enter interaction
     */
    this.interactive = function (enter) {
        // The front of the Component
        this.front = new Component().rectangle(16, 16, "black", false, "white", true).collision(0, 0, 16, 16);

        // Update fronts position based on the direction of this Component
        this.updateFront = function () {
            if (this.direction == constants.DIR_N) {
                this.front.x = this.x + this.offset_x;
                this.front.y = this.y + this.offset_y - 16;
            }
            if (this.direction == constants.DIR_S) {
                this.front.x = this.x + this.offset_x
                this.front.y = this.y + this.offset_y + 16;
            }
            if (this.direction == constants.DIR_W) {
                this.front.x = this.x + this.offset_x - 16;
                this.front.y = this.y + this.offset_y;
            }
            if (this.direction == constants.DIR_E) {
                this.front.x = this.x + this.offset_x + 16;
                this.front.y = this.y + this.offset_y;
            }
        }

        // Interaction available if this front is overlapping with another object
        // Press enter to start
        this.updateInteraction = function (otherobj) {
            if (this.front.rectangleOverlap(otherobj)) {
                if (myGameArea.keys) {
                    // Enter key down
                    if (myGameArea.keys[constants.KEY_ENTER]) {
                        if (otherobj.enterEvent) {
                            if (otherobj.faceOnInteraction) this.turntoface(otherobj);
                            if (otherobj.onEnterEvent != undefined) otherobj.onEnterEvent();
                            otherobj.enterEvent = false;
                        }
                    }
                    // Enter key up: Enable enter event
                    else otherobj.enterEvent = true;
                }
            } else otherobj.enterEvent = false;

            // onStepOn: i.E. map switch teleport
            if (this.rectangleOverlap(otherobj)) {
                if (otherobj.onStepEvent != undefined) otherobj.onStepEvent();
            }
        }

        /**
         * Turn other object if interaction
         * If you talk to a other person you expect them to turn to face you
         */
        this.turntoface = function (otherobj) {
            // Stop running animation if Enter is pressed while moving
            this.updateAnimation();
            // Turn otherobj to face this
            if (this.direction == constants.DIR_N) otherobj.direction = constants.DIR_S;
            if (this.direction == constants.DIR_S) otherobj.direction = constants.DIR_N;
            if (this.direction == constants.DIR_E) otherobj.direction = constants.DIR_W;
            if (this.direction == constants.DIR_W) otherobj.direction = constants.DIR_E;
            otherobj.updateAnimation();
        }

        return this;
    }

    /**
     * Adds Clicking
     * A onclick-Event can be defined that will be fired on click
     */
    this.clickable = function () {
        this.click = false;
        this.clickEvent = true;

        /**
         * Updates the click state of the Component and fires one onclick-Event if defined
         */
        this.updateClick = function () {
            this.click = false;
            this.clicked();

            if (this.click)
                if (this.clickEvent) {
                    if (this.onClickEvent != undefined) this.onClickEvent();
                    this.clickEvent = false;
                }
        }

        /**
         * Tells if the Component is clicked on
         * If it's not clicked an on-click Event can be fired again
         */
        this.clicked = function () {
            var myleft = this.x;
            var myright = this.x + (this.width);
            var mytop = this.y;
            var mybottom = this.y + (this.height);

            // The game canvas by default
            if (activeCanvas == undefined) {
                var clickX = myGameArea.clickdownX + myGameArea.gameCamera.x;
                var clickY = myGameArea.clickdownY + myGameArea.gameCamera.y;
            }
            // The game canvas can move so you have to add the myGameArea.gameCameras x and y  
            else if (activeCanvas == 0) {
                var clickX = myGameArea.clickdownX + myGameArea.gameCamera.x;
                var clickY = myGameArea.clickdownY + myGameArea.gameCamera.y;
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
     * - First step: How will the Component move only based on it's control-input (speedX/Y)?
     * - Second step: Will it collide with other Components? Resolve collision! If all involved Components not moveable: all speedX/Y = 0.
     * - Third step: Is the resolved collision ok with the map collision? If not speedX/Y of all colliding comps = 0.
     */


    /**
     * Update the Components movement (based on speedX/Y values)
     * Movement can change through user control, movement events (and TODO: moveable interaction)
     */
    this.updateMovement = function () {
        // If the Component has a key control
        if (this.keyControl != undefined) this.keyControl();

        // If the Component has an movement event it will be called here
        if (this.movementEvent != undefined) this.movementEvent();

        // If the Component has an onClick event this will check if it is clicked
        if (this.onClickEvent != undefined) this.updateClick();

        // The direction the Component is facing can be updated after the speedX/Y is set
        if (this.direction != undefined) this.updateDirection();

        // Checks if there is a collision with the map and adjust movement if needed
        if (this.mapCollision != undefined) this.mapCollision();

        return this;
    }

    /**
     * Update the Components position after all collision checks are done
     */
    this.updatePosition = function () {
        // Update Position
        this.x += this.speedX;
        this.y += this.speedY;

        // Update Front
        if (this.front != undefined)
            this.updateFront();

        // Check if moving
        this.isMoving()

        // Reset Movement
        this.speedX = 0;
        this.speedY = 0;

        // Stop only on tiles: Causes problems with Component-Component-collision if both step on the same tile!
        //this.moveFinisher();

        return this;
    }

    /*
    this.updateEvent = function() {
        // If the Component has a repeating Event it will be called here: it has to be defined extra
        if (this.repeatingEvent != undefined) this.repeatingEvent();
        // Character stands infront of the Component and presses enter
        if (this.interactionEvent != undefined) this.interactionEvent();
    }*/

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
            if (this.direction == constants.DIR_W) this.speedX = -this.speed;
            else if (this.direction == constants.DIR_E) this.speedX = this.speed;
        }
        // Finish moving in y-direction
        if (yFin) {
            console.log("y");
            if (this.direction == constants.DIR_N) this.speedY = -this.speed;
            else if (this.direction == constants.DIR_S) this.speedY = this.speed;
        }
        if (!xFin && !yFin) {
            console.log("end");
            this.finishMove = false;
        }        
    }*/
}
