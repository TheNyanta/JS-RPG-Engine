// EVENTS ----------------------------------------------------------------------
/**
 * Contains all the events of the game
 */
var events = {
    data: [], // Contains all events
    variables: [], // Contains all the variables
};

/**
 * For adding a new event
 * @param {function}
 */
function addEvent(fnc) {
    events.data.push(fnc);
    // Datastring
    myGameArea.data += "addEvent(" + fnc + ");\n";
}

// SPRITESHEETS ----------------------------------------------------------------

/**
 * Contains all the spritesheets of the game
 */
var spritesheets = {
    data: [] // Contains the spritesheets
};

/**
 * For adding a new spritesheet
 */
function addSprite(src, spritesX, spritesY, spriteWidth, spriteHeight, name) {
    spritesheets.data.push(new Spritesheet(src, spritesX, spritesY, spriteWidth, spriteHeight, name));
    spritesheets.data[spritesheets.data.length - 1].id = spritesheets.data.length - 1;
    // Datastring
    myGameArea.data += "addSprite('" + src + "', " + spritesX + ", " + spritesY + ", " + spriteWidth + ", " + spriteHeight + ", " + name + ");\n";
}


/**
 * Draw a specific sprite of a spritesheet
 * @param the context where to draw it
 * @param the spritesheet where the source image is
 * @param the specific sprite
 * @param x position
 * @param y position
 */
function drawSprite(ctx, spritesheet, number, x, y) {
    var res = i2xy(number, Math.max(spritesheet.spritesX, spritesheet.spritesY));
    ctx.drawImage(spritesheet.img, res[0] * spritesheet.spriteWidth, res[1] * spritesheet.spriteHeight, spritesheet.spriteWidth, spritesheet.spriteHeight, x, y, spritesheet.spriteWidth, spritesheet.spriteHeight);
}

/**
 * Spritesheet for map-tiles and objects
 */
function Spritesheet(src, spritesX, spritesY, spriteWidth, spriteHeight, name) {
    this.img = new Image();
    this.img.src = src;
    this.width = spritesX * spriteWidth;
    this.height = spritesY * spriteHeight;
    this.spritesX = spritesX;
    this.spritesY = spritesY;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    if (name != undefined) this.name = name;
    else this.name = src.match(/[\w]+\.[A-Za-z]{3}$/)[0];
}

// MAPS ----------------------------------------------------------------------

/**
 * Contains all the maps of the game
 */
var maps = {
    data: [], // Contains the maps
    currentMap: 0, // The map which is currently used
    nextMap: 0, // The map that will be switched to in the next iteration
};

/**
 * For adding a new map
 * @param a background panorama
 * @param id of the spritesheet
 * @param the maps number of tiles in x direction
 * @param the maps number of tiles in y direction
 * @param give the map a name
 */
function addMap(image, spritesheetId, mapWidth, mapHeight) {
    maps.data.push(new Map(image, spritesheets.data[spritesheetId], mapWidth, mapHeight, name));
    maps.data[maps.data.length - 1].id = maps.data.length - 1;
    // Datastring
    if (image != undefined)
        myGameArea.data += "addMap('" + image + "', spritesheets.data[" + spritesheetId + "], " + mapWidth + ", " + mapHeight + ");\n";
    else
        myGameArea.data += "addMap(" + image + ", spritesheets.data[" + spritesheetId + "], " + mapWidth + ", " + mapHeight + ");\n";
}

/**
 * A Tile
 * @param {spritesheet} spritesheet
 */
function Tile(spritesheet, x, y) {
    this.spritesheet = spritesheet;
    this.width = this.spritesheet.spriteWidth;
    this.height = this.spritesheet.spriteHeight;
    // Position
    this.x = x;
    this.y = y;
    // Layers: Set which part of the spritesheet should be drawn
    this.layer1 = 0;
    this.layer2 = 0;
    this.layer3 = 0;
    // Collision
    this.collision = 0;

    // To fire only a single event on enter / mousedown / touchdown
    this.fireEvent = true

    /** This draws the tile on the cached canvas'
     * @param Cached canvas context for layer 1 & 2 (Background)
     * @param Cached canvas context for layer 3 (Foreground)
     */
    this.draw = function (ctx1, ctx2) {
        if (this.layer1 - 1 >= 0) drawSprite(ctx1, this.spritesheet, this.layer1 - 1, this.x, this.y);
        if (this.layer2 - 1 >= 0) drawSprite(ctx1, this.spritesheet, this.layer2 - 1, this.x, this.y);
        if (this.layer3 - 1 >= 0) drawSprite(ctx2, this.spritesheet, this.layer3 - 1, this.x, this.y);
        // Debug information
        if (myGameArea.debug) {
            // Show collision layer: TODO: Visualize direction restrictions
            myGameArea.cgx3.globalAlpha = 0.3;
            if (this.collision === 0) myGameArea.cgx3.fillStyle = "blue";
            else if (this.collision === 1) myGameArea.cgx3.fillStyle = "red";
            else {
                if (this.collision[0] == 0) myGameArea.cgx3.fillStyle = "purple";
                if (this.collision[0] == 1) myGameArea.cgx3.fillStyle = "cyan";
                if (this.collision[0] == 2) myGameArea.cgx3.fillStyle = "yellow";
                if (this.collision[0] == 3) myGameArea.cgx3.fillStyle = "black";
            }
            myGameArea.cgx3.fillRect(this.x, this.y, this.width, this.height);
            myGameArea.cgx3.globalAlpha = 1.0;
            // Show event
            if (this.stepOnEvent != undefined || this.enterEvent != undefined) {
                myGameArea.cgx3.font = "bold 8px Serif";
                myGameArea.cgx3.fillStyle = "black";
                myGameArea.cgx3.fillText("E", this.x + 1, this.y + 7);
            }
        }
    }
}

/**
 * Define a map
 * @param a background panorama
 * @param {Spritesheet} a spritesheet with the tiles for the map
 * @param the maps number of tiles in x direction
 * @param the maps number of tiles in y direction
 */
function Map(image, tileset, mapWidth, mapHeight) {

    // Panorama Image
    if (image != undefined) {
        this.image = new Image();
        this.image.src = image;
        // Panorama Properties
        this.x = 0;
        this.y = 0;
        this.speedX = 0;
        this.speedY = 0;
    }

    // Tileset Spritesheet
    this.tileset = tileset;

    // Map Properties
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;

    // Pixel width & height
    this.width = this.mapWidth * tileset.spriteWidth;
    this.height = this.mapHeight * tileset.spriteHeight;

    // The name is the filename
    this.name = tileset.name.match(/[\w]+/)[0];

    // Contains all the tiles
    // A tile is a component which contains the layers and the collision
    this.tiles = [];
    for (var i = 0, l = this.mapWidth * this.mapHeight; i < l; i++) {
        var res = i2xy(i, this.mapWidth);
        this.tiles.push(new Tile(this.tileset, res[0] * this.tileset.spriteWidth, res[1] * this.tileset.spriteHeight));
    }
    // Contains all the components of the map
    this.components = [];
    // Function for adding components to the map
    this.addComponent = function (component) {
        if (component.length != undefined)
            for (var i = 0, l = component.length; i < l; i++) this.components.push(component[i]);
        else this.components.push(component);
    }

    // Contains all the events of the map
    this.events = [];
    // Function for adding events to the map
    this.addEvent = function (event) {
        if (event.length != undefined)
            for (var i = 0, l = event.length; i < l; i++) this.events.push(event[i]);
        else this.events.push(event[i]);
    }

    /**
     * Load layers into the the map
     * @param layer1 (background)
     * @param layer2 (background)
     * @param layer3 (foreground)
     * @param collision layer
     */
    this.loadLayers = function (l1, l2, l3, lc) {
        for (var i = 0, l = this.mapWidth * this.mapHeight; i < l; i++) {
            this.tiles[i].layer1 = l1[i];
            this.tiles[i].layer2 = l2[i];
            this.tiles[i].layer3 = l3[i];
            this.tiles[i].collision = lc[i];
        }
    }

    /**
     * If the cached images need to be updated
     */
    this.drawCache = function () {
        // Adjust the cache canvas' size
        myGameArea.panorama.width = myGameArea.canvas.width;
        myGameArea.panorama.height = myGameArea.canvas.height;

        myGameArea.background.width = this.width;
        myGameArea.background.height = this.height;

        myGameArea.foreground.width = this.width;
        myGameArea.foreground.height = this.height;

        // Clear the canvas' ...
        myGameArea.context.clearRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
        myGameArea.cgx1.clearRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
        myGameArea.cgx2.clearRect(0, 0, myGameArea.background.width, myGameArea.background.height);
        myGameArea.cgx3.clearRect(0, 0, myGameArea.foreground.width, myGameArea.foreground.height);

        // ...  and repaint!
        if (this.image != undefined) myGameArea.cgx1.drawImage(this.image, this.x, this.y, myGameArea.panorama.width, myGameArea.panorama.height);

        for (var i = 0, l = this.mapWidth * this.mapHeight; i < l; i++) this.tiles[i].draw(myGameArea.cgx2, myGameArea.cgx3);
    }

    // ####################################
    //  Draw functions for the game canvas
    // ####################################

    /// TODO: Drawing animated tiles need extra caches one for each animation [IF MANY animated tiles?]

    /**
     * Draws the Panorama & the background of the map
     */
    this.drawBackground = function () {
        ctx = myGameArea.context;
        ctx.drawImage(myGameArea.panorama, 0, 0);
        ctx.drawImage(myGameArea.background, -myGameArea.gameCamera.x, -myGameArea.gameCamera.y);
    }

    /**
     * Draws the foreground of the map
     */
    this.drawForeground = function () {
        ctx = myGameArea.context;
        ctx.drawImage(myGameArea.foreground, -myGameArea.gameCamera.x, -myGameArea.gameCamera.y);
    }

    // ################
    // ## Map Editor ##
    // ################

    this.initTilesetEditor = function () {

    }

    /**
     * Map editing
     * Get tile by clicking on the tileset
     * Get collision with buttons
     * Set tile + collision by clicking on the game
     */
    this.clickedTile = function (param_x, param_y) {
        // Click on Map
        if (myGameArea.activeCanvas == 0) {
            var x = Math.floor((param_x + myGameArea.gameCamera.x) / this.tileset.spriteWidth);
            var y = Math.floor((param_y + myGameArea.gameCamera.y) / this.tileset.spriteHeight);
            var d = maps.data[maps.currentMap].tiles[xy2i(x, y, this.mapWidth)];
            // Clicked Tile console.log(xy2i(x, y, this.mapWidth));
            if (myGameArea.drawingOn) {
                if (myGameArea.currentLayer == 0) d.layer1 = myGameArea.tiletype;
                if (myGameArea.currentLayer == 1) d.layer2 = myGameArea.tiletype;
                if (myGameArea.currentLayer == 2) d.layer3 = myGameArea.tiletype;
                if (myGameArea.currentLayer == 3) d.collision = myGameArea.tileCollisionType;

                maps.data[maps.currentMap].drawCache();
            }
            document.getElementById("clickedXY").innerHTML = "[" + x + " | " + y + "]";
        }
        // Click on Tileset
        if (myGameArea.activeCanvas == 1) {
            var x = Math.floor(param_x / this.tileset.spriteWidth);
            var y = Math.floor(param_y / this.tileset.spriteHeight);
            myGameArea.tiletype = xy2i(x, y, this.tileset.spritesX) + 1;
            document.getElementById("selectedTile").innerHTML = myGameArea.tiletype;
            document.getElementById("clickedXY").innerHTML = "[" + x + " | " + y + "]";
            this.drawTileset();
        }
    }

    /**
     * Draw the tileset on the tileset canvas
     */
    this.drawTileset = function () {
        myGameArea.tileset.width = this.tileset.spriteWidth * this.tileset.spritesX;
        myGameArea.tileset.height = this.tileset.spriteHeight * this.tileset.spritesY;
        myGameArea.tilecontext.clearRect(0, 0, this.tileset.spriteWidth * this.tileset.spritesX, this.tileset.spriteHeight * this.tileset.spritesY);

        var mapIndex = 0;
        var tile_w, tile_h;
        for (var h = 0, m = this.tileset.spritesY; h < m; h++) {
            for (var w = 0, n = this.tileset.spritesX; w < n; w++, mapIndex++) {
                tile_w = w * this.tileset.spriteWidth;
                tile_h = h * this.tileset.spriteHeight;
                //(ctx, spritesheet, number, x, y)
                drawSprite(myGameArea.tilecontext, this.tileset, mapIndex, tile_w, tile_h);

                // Show Tileset Grid
                if (false) {
                    myGameArea.tilecontext.strokeStyle = "black";
                    myGameArea.tilecontext.strokeRect(tile_w, tile_h, 8, 8);
                }

                if (myGameArea.tiletype - 1 == mapIndex) {
                    myGameArea.tilecontext.strokeStyle = "red";
                    myGameArea.tilecontext.strokeRect(tile_w, tile_h, 8, 8);
                }
            }
        }
    }

    /**
     * print layers as string to console
     */
    this.printLayers = function () {
        var output = "";
        // Layer 1
        output += "var " + this.name + "_layer1 = [";
        for (var i = 0, j = this.mapWidth * this.mapHeight; i < j; i++) {
            output += this.tiles[i].layer1;
            if (i < this.mapWidth * this.mapHeight - 1)
                output += ", ";
        }
        output += "];\n";
        // Layer 2
        output += "var " + this.name + "_layer2 = [";
        for (var i = 0, j = this.mapWidth * this.mapHeight; i < j; i++) {
            output += this.tiles[i].layer2;
            if (i < this.mapWidth * this.mapHeight - 1)
                output += ", ";
        }
        output += "];\n";
        // Layer 3
        output += "var " + this.name + "_layer3 = [";
        for (var i = 0, j = this.mapWidth * this.mapHeight; i < j; i++) {
            output += this.tiles[i].layer3;
            if (i < this.mapWidth * this.mapHeight - 1)
                output += ", ";
        }
        output += "];\n";
        // Collision Layer
        output += "var " + this.name + "_layerC = [";
        for (var i = 0, j = this.mapWidth * this.mapHeight; i < j; i++) {
            if (this.tiles[i].collision instanceof Array) output += "[" + this.tiles[i].collision + "]";
            else output += this.tiles[i].collision;
            if (i < this.mapWidth * this.mapHeight - 1)
                output += ", ";
        }
        output += "];\n";
        //Print
        console.log(output);
    }

    // After the maps tileset was changed, change the tileset of the tiles
    this.switchTileset = function () {
        for (var i = 0, j = this.mapWidth * this.mapHeight; i < j; i++) this.tiles[i].spritesheet = this.tileset;
    }
}

function loadImage(img) {
    var tmp;
    for (var i = 0, l = spritesheets.data.length; i < l; i++) {
        if (spritesheets.data[i].img.src.match(/[\w]+\.[A-Za-z]{3}$/)[0] == img.match(/[\w]+\.[A-Za-z]{3}$/)[0]) {
            console.log("spritesheet already exists: taking existing one");
            tmp = spritesheets.data[i];
        }
    }
    if (tmp == undefined) {
        console.log("created new spritesheet")
        addSprite(img, 60, 32, 8, 8);
        tmp = spritesheets.data[spritesheets.data.length - 1];
    }
    //maps.data[maps.currentMap].image.src = img; //maps background image
    maps.data[maps.currentMap].tileset = tmp;
    maps.data[maps.currentMap].switchTileset();

    setTimeout(function () {
        maps.data[maps.currentMap].drawCache();
        maps.data[maps.currentMap].drawTileset();
    }, 100);
}

// COMPONENTS ----------------------------------------------------------------

/**
 * Component constructor
 * @param x-position
 * @param y-position
 */
function Component(x, y, spritesheet) {
    // Properties
    this.x = x;
    this.y = y;

    this.speed = 2;
    this.speedX = 0;
    this.speedY = 0;

    this.spritesheet = spritesheet;
    this.width = this.spritesheet.spriteWidth;
    this.height = this.spritesheet.spriteHeight;

    // Default first sprite image
    this.sequence = 0;
    this.isMoving = false;
    this.faceOnInteraction = true;

    this.draw = function (ctx) {
        // Sets animations (based on moving and direction)        
        this.updateAnimation();

        // Debug information
        if (myGameArea.debug) {
            // Draw Collision Box
            ctx.strokeStyle = "black";
            ctx.strokeRect(this.x + this.offset_x - myGameArea.gameCamera.x, this.y + this.offset_y - myGameArea.gameCamera.y, this.offset_width, this.offset_height);
        }

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
     * add key control
     * make Component listen to key inputs
     */
    this.control = function (up, down, left, right, mouse) {
        // Key Control Properties
        this.up = up;
        this.down = down;
        this.left = left;
        this.right = right;
        if (mouse != undefined) this.mouse = mouse

        this.disableControls = false;
        this.disableMouse = false;

        /**
         * Key Control: Setup keys with the control function
         * move the Component up/down/left/right if the key is pressed
         */
        this.controlEvent = function () {
            // Check if it key control is allowed
            if (!this.disableControls) {
                // Listen to keys: "Else if" to limit movement in only one direction at the same time (no diagonal moving)
                if (myGameArea.keys[this.up])
                    this.speedY = -this.speed;
                else if (myGameArea.keys[this.down])
                    this.speedY = this.speed;
                else if (myGameArea.keys[this.left])
                    this.speedX = -this.speed;
                else if (myGameArea.keys[this.right])
                    this.speedX = this.speed;
                else if (mouse && !this.disableMouse) {
                    // Move direction = To current mousemove/touch position
                    if (myGameArea.mousedown || myGameArea.touchdown) {
                        if (Math.abs(myGameArea.x + myGameArea.gameCamera.x - this.x - this.offset_x) >= Math.abs(myGameArea.y + myGameArea.gameCamera.y - this.y - this.offset_y)) {
                            if (this.x + this.offset_x < myGameArea.x + myGameArea.gameCamera.x - 4) this.speedX += this.speed;
                            else if (this.x + this.offset_x > myGameArea.x + myGameArea.gameCamera.x + 4) this.speedX -= this.speed;
                        } else {
                            if (this.y + this.offset_y < myGameArea.y + myGameArea.gameCamera.y - 4) this.speedY += this.speed;
                            else if (this.y + this.offset_y > myGameArea.y + myGameArea.gameCamera.y + 4) this.speedY -= this.speed;
                        }
                        /*
                        // Move direction = Difference between clicked and current mousemove/touch position
                        if (Math.abs(myGameArea.x - myGameArea.clickdownX) > Math.abs(myGameArea.y - myGameArea.clickdownY)) {
                            if (myGameArea.x < myGameArea.clickdownX - 4)
                                this.speedX -= this.speed;
                            else if (myGameArea.x > myGameArea.clickdownX + 4)
                                this.speedX += this.speed;
                        } else {
                            if (myGameArea.y < myGameArea.clickdownY - 4)
                                this.speedY -= this.speed;
                            else if (myGameArea.y > myGameArea.clickdownY + 4)
                                this.speedY += this.speed;
                        }*/
                    }
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
        this.direction = 64; // Default Direction

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
            this.specialTimer = new Timer();

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
            if (this.speedY < 0) this.direction = 4;
            if (this.speedY > 0) this.direction = 64;
            if (this.speedX < 0) this.direction = 16;
            if (this.speedX > 0) this.direction = 1;
        }

        /**
         * Updates the shown animation sequence based on the direction te Component is facing
         * For 4-direction movement (for more than four directions add more cases)
         */
        this.updateAnimation = function () {
            // Special sequence
            if (this.specialOn) {
                this.sequence = this.special;
                if (this.animationIndexCounter == this.special.length - 1) {
                    this.specialOn = false;
                    this.sequence = this.special[this.special.length - 1];
                }
            }
            // Moving sequence
            else if (this.isMoving && !myGameArea.gameSequence) {
                if (this.moveAnimationTime != undefined) {
                    this.animationTime = this.moveAnimationTime;
                    if (this.direction == 4) this.sequence = this.moveUp;
                    if (this.direction == 64) this.sequence = this.moveDown;
                    if (this.direction == 16) this.sequence = this.moveLeft;
                    if (this.direction == 1) this.sequence = this.moveRight;
                }
            }
            // Idle sequence
            else {
                if (this.idleAnimationTime != undefined) {
                    this.animationTime = this.idleAnimationTime;
                    if (this.direction == 4) this.sequence = this.idleUp;
                    if (this.direction == 64) this.sequence = this.idleDown;
                    if (this.direction == 16) this.sequence = this.idleLeft;
                    if (this.direction == 1) this.sequence = this.idleRight;
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
         * Prevents tile collision
         * [TODO: Check if there is no collision between the old and the new position
         * (Can happen if either moving really fast or realtime moving <big delta * speed>)]
         * Calculates the new position and checks if it's walkable by using the maps collision layer
         *  8x8 tiles - "may TODO": Adept for all sizes
         */
        this.tileCollision = function () {

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

            // Checks if the component can trigger tile events: the main character
            if (this == myGameArea.gameCamera.target) {
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
         * ?TODO? uncomment parts when setting collision box = tile size
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
                        if (this.y + this.offset_y > tile.y /*+ tile.height*/ )
                            if (this.speedY < 0) this.speedY = 0;
                    }
                    // RESTRICTED: DOWN 
                    else if (tile.collision[i] == 1) {
                        if (this.y + this.offset_y /*+ this.offset_height*/ < tile.y)
                            if (this.speedY > 0) this.speedY = 0;
                    }
                    // RESTRICTED: LEFT
                    else if (tile.collision[i] == 2) {
                        if (this.x + this.offset_x > tile.x /*+ tile.width*/ )
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

    this.mid = function () {
        return rectangleMid(this.x, this.y, this.width, this.height);
    }


    // Trigger on enter / click / touch when in range
    this.updateInteraction = function (other) {
        // No self interaction
        if (this != other) {
            if (distance(this.mid(), other.mid()) <= Math.min(other.width, other.height) && this.facing(other)) {
                if (myGameArea.enter || myGameArea.mousedown || myGameArea.touchdown) {
                    if (myGameArea.eventReady) {
                        if (other.faceOnInteraction) this.face(other);
                        if (other.enterEvent != undefined) other.enterEvent();
                        myGameArea.eventReady = false;
                    }
                } else myGameArea.eventReady = true;
            }
        }
    }

    /**
     * Check if the component is clicked / touched
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

    /**
     * Turn other object if interaction
     * If you talk to a other person you expect them to turn to face you
     */
    this.face = function (other) {
        // Stop running animation if Enter is pressed while moving
        this.updateAnimation();
        // Turn otherobj to face this
        if (this.direction == 4) other.direction = 64;
        if (this.direction == 64) other.direction = 4;
        if (this.direction == 1) other.direction = 16;
        if (this.direction == 16) other.direction = 1;
        other.updateAnimation();
    }

    /**
     * Check if the component is looking at the other object
     */
    this.facing = function (other) {
        // Left or Right
        if (Math.abs(this.mid()[0] - other.mid()[0]) > Math.abs(this.mid()[1] - other.mid()[1])) {
            if (this.x > other.x) return (this.direction == 16);
            else return (this.direction == 1);
        }
        // Up or Below
        else {
            if (this.y > other.y) return (this.direction == 4);
            else return (this.direction == 64);
        }
        return false;
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

        // If the component has an interactEvent it will be called here
        if (this.interactEvent != undefined) this.interactEvent();

        // The direction the component is facing can be updated after the speedX/Y is set
        this.updateDirection();

        // Checks if there is a collision with the map and adjust movement if needed
        this.tileCollision();

        return this;
    }

    /**
     * Update the components position after all collision checks are done
     */
    this.updatePosition = function () {
        // Check moving for animations
        this.isMoving = (this.speedX != 0 || this.speedY != 0);

        // Update Position
        this.x += this.speedX;
        this.y += this.speedY;

        // Reset Movement
        this.speedX = 0;
        this.speedY = 0;

        return this;
    }
}

// DIALOGS -------------------------------------------------------------------

/**
 * Contains all the dialogs of the game
 */
var dialogs = {
    data: [], // Contains the dialogs
    currentDialog: null, // The current dialog
};

/**
 * For adding a new dialog
 * @param the text
 */
function addDialog(input, eventID) {
    if (eventID != undefined) dialogs.data.push(new Dialog(input, eventID));
    else dialogs.data.push(new Dialog(input));
    dialogs.data[dialogs.data.length - 1].id = dialogs.data.length - 1;
    // Datastring
    myGameArea.data += "addDialog(" + JSON.stringify(input);
    if (eventID != undefined) myGameArea.data += ", " + eventID + ");\n";
    else myGameArea.data += ");\n";
}

/**
 * Dialog
 * Input Examples
 * 1) Normal text: ["text1", "text2"]
 * 2) Text with option: ["question", ["answer1", "answer2"]]
 * The second parameter is for an eventID
 * TODO: Refine dialog styling
 */
function Dialog(input, eventID) {
    this.text = input;
    if (events.data[eventID] != undefined) this.eventID = eventID;
    this.chatCounter = 0;
    this.selectedOption = 0;

    this.keyPush = false;

    this.x;
    this.y;
    this.width;
    this.height;

    // Set the dialog text
    this.setDialog = function (input) {
        this.text = input;
    }
    // Set the dialogs position (& TODO: Style)
    this.setPosition = function (x, y, width, height) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }
    // Set an event to fire when the dialog finished
    this.setEvent = function (eventID) {
        if (events.data[eventID] != undefined) this.eventID = eventID;
    }

    this.update = function () {
        // Dialog finished
        if (this.chatCounter == this.text.length) {
            // Stop dialog updating in main-loop
            dialogs.currentDialog = undefined;
            // Check for event
            if (this.eventID != undefined) events.data[this.eventID](this.selectedOption);
            // Reset dialog
            this.chatCounter = 0;
            this.selectedOption = 0;
        }
        // Draw Text
        else this.draw();
        // Increase dialog counter
        this.nextText();
    }

    this.draw = function () {
        // Setup dialog design
        ctx = myGameArea.context;
        // Black box
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
        ctx.fillRect(0, this.y, this.width - 1, 50);
        ctx.strokeRect(0, this.y, this.width - 1, 50);
        ctx.globalAlpha = 1.0;
        // Text Style
        ctx.font = '30px serif';
        ctx.fillStyle = 'white';
        // Position (for testing)
        this.y = myGameArea.canvas.height - 50;
        this.width = myGameArea.canvas.width + 1;

        // Options
        if (this.text[this.chatCounter] instanceof Array) {
            this.selectOption();
            // Highlight the currently selected option
            for (var i = 0, l = this.text[this.chatCounter].length; i < l; i++) {
                if (i == this.selectedOption)
                    ctx.fillStyle = 'white';
                else ctx.fillStyle = 'gray';
                if (i == 0) ctx.fillText(this.text[this.chatCounter][i], 50, this.y + 22);
                if (i == 1) ctx.fillText(this.text[this.chatCounter][i], 50, this.y + 44);
                if (i == 2) ctx.fillText(this.text[this.chatCounter][i], 200, this.y + 22);
                if (i == 3) ctx.fillText(this.text[this.chatCounter][i], 200, this.y + 44);
            }
        }
        // Text
        else ctx.fillText(this.text[this.chatCounter], 50, this.y + 22);
    }

    this.selectOption = function () {
        if (myGameArea.keys[87] || myGameArea.keys[83]) {
            if (this.keyPush) {
                if (myGameArea.keys[87]) this.selectedOption--;
                else if (myGameArea.keys[83]) this.selectedOption++;
                this.keyPush = false;
            }
        } else this.keyPush = true;
        // TODO: Refine select with Mouseover / Touching
        if (myGameArea.x > 30 && myGameArea.x < 140 && myGameArea.y > 345 && myGameArea.y < 370) this.selectedOption = 0;
        else if (myGameArea.x > 30 && myGameArea.x < 140 && myGameArea.y > 370 && myGameArea.y < 395) this.selectedOption = 1;
        else if (myGameArea.x > 190 && myGameArea.x < 350 && myGameArea.y > 345 && myGameArea.y < 370) this.selectedOption = 2;
        else if (myGameArea.x > 190 && myGameArea.x < 350 && myGameArea.y > 370 && myGameArea.y < 395) this.selectedOption = 3;
        // Stay in range
        if (this.selectedOption < 0) this.selectedOption = this.selectedOption + this.text[this.chatCounter].length;
        else this.selectedOption = this.selectedOption % this.text[this.chatCounter].length;
    }

    this.nextText = function () {
        if (myGameArea.enter || myGameArea.mousedown || myGameArea.touchdown) {
            if (myGameArea.eventReady) {
                this.chatCounter++;
                myGameArea.eventReady = false;
            }
        } else myGameArea.eventReady = true;
    }
}

// AUDIO ---------------------------------------------------------------------

/**
 * Contains all the audio of the game
 */
var audio = {
    data: []
}

/**
 * Add a new audio
 */
function addAudio(src) {
    audio.data.push(new Audio(src));
    audio.data[audio.data.length - 1].id = audio.data.length - 1;
    audio.data[audio.data.length - 1].volume = 0.2;
    // Datastring
    myGameArea.data += "addAudio(new Audio('" + src + "');\n";
}
