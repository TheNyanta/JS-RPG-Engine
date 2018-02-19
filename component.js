/**
 * Component constructor
 * @param x-position
 * @param y-position
 */
function Component(x, y, spritesheet) {
    // Properties
    this.x = x;
    this.y = y;

    this.spritesheet = spritesheet;
    this.width = this.spritesheet.spriteWidth;
    this.height = this.spritesheet.spriteHeight;
    // Default first sprite image
    this.sequence = 0;

    //this.lastx = x;
    //this.lasty = y;    

    // Other properties
    // TODO: https://www.w3schools.com/graphics/tryit.asp?filename=trygame_rotate_game
    //this.angle = 0; 
    //this.angleSpeed = 0;

    this.draw = function (ctx) {
        // Debug information
        if (myGameArea.debug) {
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
        this.controlEvent = function () {
            // Check if it key control is allowed
            if (!this.disableControls) {
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
         * This is used for drawing the right animation sequence
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
            if (this.specialOn) {
                this.sequence = this.special;
                if (this.animationIndexCounter == this.special.length - 1) {
                    this.specialOn = false;
                    this.sequence = this.special[this.special.length - 1];
                }
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
         * (Can happen if either moving really fast or realtime moving <big delta * speed>)]
         */
        this.mapCollision = function () {
            this.mapWalking();
            if (this.direction != undefined) this.updateDirection();
        }

        /**
         * Calculates the new position and checks if it's walkable by using the maps collision layer
         *  8x8 tiles - "may TODO": Adept for all sizes
         */
        this.mapWalking = function () {

            var d = maps.data[maps.currentMap];

            // Check map borders
            if (this.x + this.offset_x + this.speedX < 0) this.speedX = 0;
            else if (this.y + this.offset_y + this.speedY < 0) this.speedY = 0;
            else if (this.x + this.offset_x + this.speedX + this.offset_width > d.width) this.speedX = 0;
            else if (this.y + this.offset_y + this.speedY + this.offset_height > d.height) this.speedY = 0;

            // Converts the cartesian to grid coordiantes
            var x1 = Math.floor((this.x + this.offset_x + this.speedX) / 8);
            var x2 = x1 + 1;
            var x3 = Math.floor((this.x + this.offset_x + this.speedX + this.offset_width) / 8);
            var y1 = Math.floor((this.y + this.offset_y + this.speedY) / 8);
            var y2 = y1 + 1;
            var y3 = Math.floor((this.y + this.offset_y + this.speedY + this.offset_height) / 8);

            if (Math.abs(x3 - (this.x + this.offset_x + this.offset_width + this.speedX) / 8) < 0.1) x3 = x2;
            if (Math.abs(y3 - (this.y + this.offset_y + this.offset_height + this.speedY) / 8) < 0.1) y3 = y2;

            if (this.collidable) {
                // Apply the movement restriction of the tiles the component is standing on to it
                this.tileRestriction(d.tiles[xy2i(x1, y1, d.mapWidth)]);
                this.tileRestriction(d.tiles[xy2i(x1, y2, d.mapWidth)]);
                this.tileRestriction(d.tiles[xy2i(x1, y3, d.mapWidth)]);
                this.tileRestriction(d.tiles[xy2i(x2, y1, d.mapWidth)]);
                this.tileRestriction(d.tiles[xy2i(x2, y2, d.mapWidth)]);
                this.tileRestriction(d.tiles[xy2i(x2, y3, d.mapWidth)]);
                this.tileRestriction(d.tiles[xy2i(x3, y1, d.mapWidth)]);
                this.tileRestriction(d.tiles[xy2i(x3, y2, d.mapWidth)]);
                this.tileRestriction(d.tiles[xy2i(x3, y3, d.mapWidth)]);
            }

            // Checks if the component can trigger tile events
            if (this.actor) {
                // stepOnEvent
                if (d.tiles[xy2i(x1, y1, d.mapWidth)].stepOnEvent != undefined) d.tiles[xy2i(x1, y1, d.mapWidth)].stepOnEvent(this);
                else if (d.tiles[xy2i(x1, y2, d.mapWidth)].stepOnEvent != undefined) d.tiles[xy2i(x1, y2, d.mapWidth)].stepOnEvent(this);
                else if (d.tiles[xy2i(x1, y3, d.mapWidth)].stepOnEvent != undefined) d.tiles[xy2i(x1, y3, d.mapWidth)].stepOnEvent(this);
                else if (d.tiles[xy2i(x2, y1, d.mapWidth)].stepOnEvent != undefined) d.tiles[xy2i(x2, y1, d.mapWidth)].stepOnEvent(this);
                else if (d.tiles[xy2i(x2, y2, d.mapWidth)].stepOnEvent != undefined) d.tiles[xy2i(x2, y2, d.mapWidth)].stepOnEvent(this);
                else if (d.tiles[xy2i(x2, y3, d.mapWidth)].stepOnEvent != undefined) d.tiles[xy2i(x2, y3, d.mapWidth)].stepOnEvent(this);
                else if (d.tiles[xy2i(x3, y1, d.mapWidth)].stepOnEvent != undefined) d.tiles[xy2i(x3, y1, d.mapWidth)].stepOnEvent(this);
                else if (d.tiles[xy2i(x3, y2, d.mapWidth)].stepOnEvent != undefined) d.tiles[xy2i(x3, y2, d.mapWidth)].stepOnEvent(this);
                else if (d.tiles[xy2i(x3, y3, d.mapWidth)].stepOnEvent != undefined) d.tiles[xy2i(x3, y3, d.mapWidth)].stepOnEvent(this);
                // onEnterEvent
                if (d.tiles[xy2i(x1, y1, d.mapWidth)].enterEvent != undefined) d.tiles[xy2i(x1, y1, d.mapWidth)].enterEvent(this);
                else if (d.tiles[xy2i(x1, y2, d.mapWidth)].enterEvent != undefined) d.tiles[xy2i(x1, y2, d.mapWidth)].enterEvent(this);
                else if (d.tiles[xy2i(x1, y3, d.mapWidth)].enterEvent != undefined) d.tiles[xy2i(x1, y3, d.mapWidth)].enterEvent(this);
                else if (d.tiles[xy2i(x2, y1, d.mapWidth)].enterEvent != undefined) d.tiles[xy2i(x2, y1, d.mapWidth)].enterEvent(this);
                else if (d.tiles[xy2i(x2, y2, d.mapWidth)].enterEvent != undefined) d.tiles[xy2i(x2, y2, d.mapWidth)].enterEvent(this);
                else if (d.tiles[xy2i(x2, y3, d.mapWidth)].enterEvent != undefined) d.tiles[xy2i(x2, y3, d.mapWidth)].enterEvent(this);
                else if (d.tiles[xy2i(x3, y1, d.mapWidth)].enterEvent != undefined) d.tiles[xy2i(x3, y1, d.mapWidth)].enterEvent(this);
                else if (d.tiles[xy2i(x3, y2, d.mapWidth)].enterEvent != undefined) d.tiles[xy2i(x3, y2, d.mapWidth)].enterEvent(this);
                else if (d.tiles[xy2i(x3, y3, d.mapWidth)].enterEvent != undefined) d.tiles[xy2i(x3, y3, d.mapWidth)].enterEvent(this);
            }
        }

        /**
         * Set movement based on the tiles collision restricting certain directions
         * ?TODO? uncomment when setting collision box = tile size
         * @param the tile
         */
        this.tileRestriction = function (tile) {
            // NO RESTRICTION (equal without typecheck: 0 == [0] => true, equal with typecheck:: 0 === [0] => false)
            if (tile.collision === 0) {}
            // FULL RESTRICTION
            else if (tile.collision === 1) {
                this.speedX = 0;
                this.speedY = 0;
            }
            // DIRECTION RESTRICTIONS (assume collision is an array i.e. [0] / [1,2] / [0,2,3] / ... )
            // 0: UP, 1: DOWN, 2: LEFT, 3: RIGHT
            else {
                for (var i = 0, l = tile.collision.length; i < l; i++) {
                    // RESTRICTED: UP
                    if (tile.collision[i] == 0) {
                        if (this.y + this.offset_y > tile.y /*+ tile.height*/)
                            if (this.speedY < 0) this.speedY = 0;
                    }
                    // RESTRICTED: DOWN 
                    else if (tile.collision[i] == 1) {
                        if (this.y + this.offset_y /*+ this.offset_height*/ < tile.y)
                            if (this.speedY > 0) this.speedY = 0;
                    }
                    // RESTRICTED: LEFT
                    else if (tile.collision[i] == 2) {
                        if (this.x + this.offset_x > tile.x /*+ tile.width*/)
                            if (this.speedX < 0) this.speedX = 0;
                    }
                    // RESTRICTED: RIGHT
                    else if (tile.collision[i] == 3) {
                        if (this.x + this.offset_x /*+ this.offset_width*/ < tile.x)
                            if (this.speedX > 0) this.speedX = 0;
                    }
                }
            }
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
         * Prevent collision with other Components
         * Has to be called in the main loop for all combinations after the control updates of all Components
         * (TODO: Pushable Components -> if (pushable && otherobj.noMapCollision) => push) 
         */
        this.componentCollision = function (otherobj) {
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

    this.mid = function () {
        return [this.x + this.offset_x + this.offset_width / 2, this.y + this.offset_y + this.offset_height / 2];
    }

    this.distance = function (other) {
        return Math.sqrt(Math.pow(this.mid()[0] - other.mid()[0], 2) + Math.pow(this.mid()[1] - other.mid()[1], 2));
    }

    /**
     * Add Interactions
     * Interactions can be started if the distance between two components is short enough
     * and the initiator (=controlled character) is facing the other component
     * that has an event if for i.e. the "enter"-key is pressed (or it's clicked/touched).
     * @param Enable enter interaction
     */
    this.interactive = function (enter) {
        this.actor = true;
        // Press enter to start
        this.updateInteraction = function (otherobj) {
            if (this.distance(otherobj) <= Math.min(otherobj.width, otherobj.height) && this.facing(otherobj)) {
                if (myGameArea.keys) {
                    // Enter key down
                    if (myGameArea.keys[constants.KEY_ENTER]) {
                        if (otherobj.fireEvent) {
                            if (otherobj.faceOnInteraction) this.face(otherobj);
                            if (otherobj.enterEvent != undefined) otherobj.enterEvent();
                            otherobj.fireEvent = false;
                        }
                    }
                    // Enter key up: Enable enter event
                    else otherobj.fireEvent = true;
                }
            } else otherobj.fireEvent = false;
        }

        /**
         * Turn other object if interaction
         * If you talk to a other person you expect them to turn to face you
         */
        this.face = function (otherobj) {
            // Stop running animation if Enter is pressed while moving
            this.updateAnimation();
            // Turn otherobj to face this
            if (this.direction == constants.DIR_N) otherobj.direction = constants.DIR_S;
            if (this.direction == constants.DIR_S) otherobj.direction = constants.DIR_N;
            if (this.direction == constants.DIR_E) otherobj.direction = constants.DIR_W;
            if (this.direction == constants.DIR_W) otherobj.direction = constants.DIR_E;
            otherobj.updateAnimation();
        }

        /**
         * Check if the component is looking at the other object
         */
        this.facing = function (otherobj) {
            // Left or Right
            if (Math.abs(this.mid()[0] - otherobj.mid()[0]) > Math.abs(this.mid()[1] - otherobj.mid()[1])) {
                if (this.x > otherobj.x) return (this.direction == constants.DIR_W);
                else return (this.direction == constants.DIR_E);
            }
            // Up or Below
            else {
                if (this.y > otherobj.y) return (this.direction == constants.DIR_N);
                else return (this.direction == constants.DIR_S);
            }

            return false;
        }

        return this;
    }

    /**
     * Adds Clicking
     * A onclick-Event can be defined that will be fired on click
     * @param the function that will be called on a click
     */
    this.addClickEvent = function (fnc) {
        this.fireClickEvent = true;
        this.clickEvent = fnc;

        /**
         * Updates the click state of the Component and fires one onclick-Event
         */
        this.updateClick = function () {
            if (this.isClicked()) {
                if (this.fireClickEvent) {
                    this.clickEvent();
                    this.fireClickEvent = false;
                }
            }
        }

        /**
         * Tells if the Component is clicked on
         * If it's not clicked a clickEvent can be fired again
         */
        this.isClicked = function () {
            // Mouse / Touchdown
            if (myGameArea.mousedown || myGameArea.touchdown) {
                if (myGameArea.clickdownX != undefined && myGameArea.clickdownY != undefined) {
                    // Not clicked (on sprite)
                    if ((this.x > myGameArea.clickdownX + myGameArea.gameCamera.x) ||
                        (this.x + this.width < myGameArea.clickdownX + myGameArea.gameCamera.x) ||
                        (this.y > myGameArea.clickdownY + myGameArea.gameCamera.y) ||
                        (this.y + this.height < myGameArea.clickdownY + myGameArea.gameCamera.y)) return false;
                    // Clicked
                    else return true;
                }
            }
            // Click / Touch ended: enable Click Event again
            else {
                this.fireClickEvent = true;
                return false;
            }
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
     * Update the components movement (based on speedX/Y values)
     * Movement can change through user control, movement events (and TODO: moveable interaction)
     */
    this.updateMovement = function () {
        // If the component has a control event
        if (this.controlEvent != undefined) this.controlEvent();

        // If the component has an movement event it will be called here
        if (this.movementEvent != undefined) this.movementEvent();

        // If the component has an onClick event this will check if it is clicked
        if (this.clickEvent != undefined) this.updateClick();

        // The direction the component is facing can be updated after the speedX/Y is set
        if (this.direction != undefined) this.updateDirection();

        // Checks if there is a collision with the map and adjust movement if needed
        if (this.mapCollision != undefined) this.mapCollision();

        return this;
    }

    /**
     * Update the components position after all collision checks are done
     */
    this.updatePosition = function () {
        // Update Position
        this.x += this.speedX;
        this.y += this.speedY;

        // Check if moving (for animation)
        this.isMoving()

        // Reset Movement
        this.speedX = 0;
        this.speedY = 0;

        return this;
    }
}
