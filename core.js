// EVENTS ----------------------------------------------------------------------
/**
 * Contains all the events of the game
 */
var events = {
    data: [], // Contains all events
    variables: [], // Contains all the variables
    freeIDs: [] // FreeIDs
};

/**
 * For adding a new event
 * @param {function} event
 */
function addEvent(fnc) {
    // Add
    events.data.push(fnc);
    // ID management
    if (events.freeIDs.length > 0) events.data[events.data.length - 1].id = events.freeIDs[0].pop();
    else events.data[events.data.length - 1].id = events.data.length - 1;
}

/**
 * Remove an event
 */
function removeEvent(id) {
    for (var i = 0, l = events.data.length; i < l; i++)
        if (events.data[i].id == id) {
            // Remove if ID found
            events.data.splice(id, 1);
            // ID Management
            events.freeIDs.push(id);
            break;
        }
}

/**
 * Generate the data for the events
 */
function generateEventData() {
    // Datastring
    for (var i = 0, l = events.data.length; i < l; i++)
        game.data += "addEvent(" + events.data[i] + ");\n";
}

// SPRITESHEETS ----------------------------------------------------------------

/**
 * Contains all the spritesheets of the game
 */
var spritesheets = {
    data: [], // Contains the spritesheets
    freeIDs: [] // Free IDs
};

/**
 * For adding a new spritesheet
 */
function addSprite(src, spritesX, spritesY, spriteWidth, spriteHeight, name) {
    // Add
    spritesheets.data.push(new Spritesheet(src, spritesX, spritesY, spriteWidth, spriteHeight, name));
    // ID management
    if (spritesheets.freeIDs.length > 0) spritesheets.data[spritesheets.data.length - 1].id = spritesheets.freeIDs[0].pop();
    else spritesheets.data[spritesheets.data.length - 1].id = spritesheets.data.length - 1;
}

/**
 * Remove a spritesheet
 */
function removeSprite(id) {
    for (var i = 0, l = spritesheets.data.length; i < l; i++)
        if (spritesheets.data[i].id == id) {
            // Remove if ID found
            spritesheets.data.splice(id, 1);
            // ID Management
            spritesheets.freeIDs.push(id);
            break;
        }
}

/**
 * Generate the data for the spritesheets
 */
function generateSpriteData() {
    // Datastring
    for (var i = 0, l = spritesheets.data.length; i < l; i++)
        game.data += "addSprite('" + spritesheets.data[i].img.src + "', " + +spritesheets.data[i].spritesX + ", " + +spritesheets.data[i].spritesY + ", " + +spritesheets.data[i].spriteWidth + ", " + +spritesheets.data[i].spriteHeight + ");\n";
}

/**
 * Spritesheet for map-tiles and objects
 */
function Spritesheet(src, spritesX, spritesY, spriteWidth, spriteHeight) {
    this.img = new Image();
    this.img.src = src;
    this.width = spritesX * spriteWidth;
    this.height = spritesY * spriteHeight;
    this.spritesX = spritesX;
    this.spritesY = spritesY;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.name = src.match(/[\w]+\.[A-Za-z]{3}$/)[0];
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

// MAPS ----------------------------------------------------------------------

/**
 * Contains all the maps of the game
 */
var maps = {
    data: [], // Contains the maps
    currentMap: 0, // The map which is currently used
    nextMap: 0, // The map that will be switched to in the next iteration
    freeIDs: [] // Free IDs
};

/**
 * For adding a new map
 * @param a background panorama
 * @param id of the spritesheet
 * @param the maps number of tiles in x direction
 * @param the maps number of tiles in y direction
 */
function addMap(image, spritesheetId, mapWidth, mapHeight) {
    // Add
    maps.data.push(new Map(image, spritesheets.data[spritesheetId], mapWidth, mapHeight));
    // ID management
    if (maps.freeIDs.length > 0) maps.data[maps.data.length - 1].id = maps.freeIDs[0].pop();
    else maps.data[maps.data.length - 1].id = maps.data.length - 1;
}

/**
 * Remove a map
 */
function removeMap(id) {
    for (var i = 0, l = maps.data.length; i < l; i++)
        if (maps.data[i].id == id) {
            // Remove if ID found
            maps.data.splice(id, 1);
            // ID Management
            maps.freeIDs.push(id);
            break;
        }
}

/**
 * Generate the data for the maps
 * TODO: INCLUDE LAYER DATA and for this add a TILE EVENTS LAYER
 */
function generateMapData() {
    // Datastring
    for (var i = 0, l = maps.data.length; i < l; i++)
        game.data += "addMap(" + maps.data[i].image.src + ", " + maps.data[i].spritesheetID + ", " + maps.data[i].mapWidth + ", " + maps.data[i].mapHeight + ");\n";
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

    this.interactEventID;
    this.stepOnEventID;
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
        if (game.debug) {
            // Show collision layer: TODO: Visualize direction restrictions
            game.cgx3.globalAlpha = 0.3;
            if (this.collision === 0) game.cgx3.fillStyle = "blue";
            else if (this.collision === 1) game.cgx3.fillStyle = "red";
            else {
                if (this.collision[0] == 0) game.cgx3.fillStyle = "purple";
                if (this.collision[0] == 1) game.cgx3.fillStyle = "cyan";
                if (this.collision[0] == 2) game.cgx3.fillStyle = "yellow";
                if (this.collision[0] == 3) game.cgx3.fillStyle = "black";
            }
            game.cgx3.fillRect(this.x, this.y, this.width, this.height);
            game.cgx3.globalAlpha = 1.0;
            // Show event
            if (this.stepOnEventID != undefined || this.interactEventID != undefined) {
                game.cgx3.font = "bold 8px Serif";
                game.cgx3.fillStyle = "black";
                game.cgx3.fillText("E", this.x + 1, this.y + 7);
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
        game.panorama.width = game.canvas.width;
        game.panorama.height = game.canvas.height;

        game.background.width = this.width;
        game.background.height = this.height;

        game.foreground.width = this.width;
        game.foreground.height = this.height;

        // Clear the canvas' ...
        game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
        game.cgx1.clearRect(0, 0, game.canvas.width, game.canvas.height);
        game.cgx2.clearRect(0, 0, game.background.width, game.background.height);
        game.cgx3.clearRect(0, 0, game.foreground.width, game.foreground.height);

        // ...  and repaint!
        if (this.image != undefined) game.cgx1.drawImage(this.image, this.x, this.y, game.panorama.width, game.panorama.height);

        for (var i = 0, l = this.mapWidth * this.mapHeight; i < l; i++) this.tiles[i].draw(game.cgx2, game.cgx3);
    }

    // ####################################
    //  Draw functions for the game canvas
    // ####################################

    /// TODO: Drawing animated tiles need extra caches one for each animation [IF MANY animated tiles?]

    /**
     * Draws the Panorama & the background of the map
     */
    this.drawBackground = function () {
        ctx = game.context;
        ctx.drawImage(game.panorama, 0, 0);
        ctx.drawImage(game.background, -game.camera.x, -game.camera.y);
    }

    /**
     * Draws the foreground of the map
     */
    this.drawForeground = function () {
        ctx = game.context;
        ctx.drawImage(game.foreground, -game.camera.x, -game.camera.y);
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
        if (game.activeCanvas == 0) {
            var x = Math.floor((param_x + game.camera.x) / this.tileset.spriteWidth);
            var y = Math.floor((param_y + game.camera.y) / this.tileset.spriteHeight);
            var d = maps.data[maps.currentMap].tiles[xy2i(x, y, this.mapWidth)];
            // Clicked Tile console.log(xy2i(x, y, this.mapWidth));
            if (game.drawingOn) {
                if (game.currentLayer == 0) d.layer1 = game.tiletype;
                if (game.currentLayer == 1) d.layer2 = game.tiletype;
                if (game.currentLayer == 2) d.layer3 = game.tiletype;
                if (game.currentLayer == 3) d.collision = game.tileCollisionType;

                maps.data[maps.currentMap].drawCache();
            }
            document.getElementById("clickedXY").innerHTML = "[" + x + " | " + y + "]";
        }
        // Click on Tileset
        if (game.activeCanvas == 1) {
            var x = Math.floor(param_x / this.tileset.spriteWidth);
            var y = Math.floor(param_y / this.tileset.spriteHeight);
            game.tiletype = xy2i(x, y, this.tileset.spritesX) + 1;
            document.getElementById("selectedTile").innerHTML = game.tiletype;
            document.getElementById("clickedXY").innerHTML = "[" + x + " | " + y + "]";
            this.drawTileset();
        }
    }

    /**
     * Draw the tileset on the tileset canvas
     */
    this.drawTileset = function () {
        game.tileset.width = this.tileset.spriteWidth * this.tileset.spritesX;
        game.tileset.height = this.tileset.spriteHeight * this.tileset.spritesY;
        game.tilecontext.clearRect(0, 0, this.tileset.spriteWidth * this.tileset.spritesX, this.tileset.spriteHeight * this.tileset.spritesY);

        var mapIndex = 0;
        var tile_w, tile_h;
        for (var h = 0, m = this.tileset.spritesY; h < m; h++) {
            for (var w = 0, n = this.tileset.spritesX; w < n; w++, mapIndex++) {
                tile_w = w * this.tileset.spriteWidth;
                tile_h = h * this.tileset.spriteHeight;
                //(ctx, spritesheet, number, x, y)
                drawSprite(game.tilecontext, this.tileset, mapIndex, tile_w, tile_h);

                // Show Tileset Grid
                if (false) {
                    game.tilecontext.strokeStyle = "black";
                    game.tilecontext.strokeRect(tile_w, tile_h, 8, 8);
                }

                if (game.tiletype - 1 == mapIndex) {
                    game.tilecontext.strokeStyle = "red";
                    game.tilecontext.strokeRect(tile_w, tile_h, 8, 8);
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

// COMPONENTS ----------------------------------------------------------------

/**
 * Contains all components of the game
 */
var components = {
    data: [], // Contains the components
    freeIDs: [] // Free IDs
}

/**
 * For adding a new component
 * @param name
 * @param spritesheetID
 * @param x-position
 * @param y-position
 * @param offsetX
 * @param offsetY
 * @param offsetWidth
 * @param offsetHeight
 * @param interactEventID
 * @param movementEventID
 */
function addComponent(name, spritesheetID, x, y, offsetX, offsetY, offsetWidth, offsetHeight, interactEventID, movementEventID, mapID) {
    // Add
    components.data.push(new Component(name, spritesheetID, x, y, offsetX, offsetY, offsetWidth, offsetHeight, interactEventID, movementEventID));
    // ID management
    if (components.freeIDs.length > 0) components.data[components.data.length - 1].id = components.freeIDs[0].pop();
    else components.data[components.data.length - 1].id = components.data.length - 1;
    // Add ID to map
    maps.data[mapID].components.push(components.data.length - 1);
}

/**
 * Remove a component
 */
function removeComponent(id) {
    for (var i = 0, l = components.data.length; i < l; i++)
        if (components.data[i].id == id) {
            // Remove if ID found
            components.data.splice(id, 1);
            // ID Management
            components.freeIDs.push(id);
            break;
        }
    // TODO: Run over maps and remove its id
    // Also check if there are any references elsewhere (i.e. events) hm...
}

/**
 * Generate the data for the components
 */
function generateComponentData() {
    // Datastring
    for (var i = 0, l = components.data.length; i < l; i++)
        game.data += "addComponent(" + components.data[i].name + ", " + components.data[i].spritesheetID + ", " + components.data[i].x + ", " + components.data[i].y + ", " + components.data[i].offsetX + ", " + components.data[i].offsetY + ", " + components.data[i].offsetWidth + ", " + components.data[i].offsetHeight + ", " + components.data[i].interactEventID + ", " + components.data[i].movementEventID + ");\n";
}

/**
 * Component constructor
 * @param name
 * @param spritesheetID
 * @param x-position
 * @param y-position
 * @param offsetX
 * @param offsetY
 * @param offsetWidth
 * @param offsetHeight
 * @param interactEventID
 * @param movementEventID
 */
function Component(name, spritesheetID, x, y, offsetX, offsetY, offsetWidth, offsetHeight, interactEventID, movementEventID) {

    this.name = name;
    this.spritesheetID = spritesheetID;

    this.x = x;
    this.y = y;
    this.width = spritesheets.data[this.spritesheetID].spriteWidth;
    this.height = spritesheets.data[this.spritesheetID].spriteHeight;

    // Movement Properties
    this.speed = 2;
    this.speedX = 0;
    this.speedY = 0;

    // Collision Properties
    this.collidable = true;
    //this.moveable = false; // True if it can be pushed away by other Components. TODO: Implement
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.offsetWidth = offsetWidth;
    this.offsetHeight = offsetHeight;

    // Animation Properties
    this.sequence = 0;
    this.isMoving = false;
    this.faceOnInteraction = true;
    this.animationTime = 0;
    this.animationDelay = 0;
    this.animationIndexCounter = 0;
    this.direction = 64; // Default Direction

    // Event Properties
    if (interactEventID != undefined) this.interactEventID = interactEventID;
    if (movementEventID != undefined) this.movementEventID = movementEventID;

    this.draw = function (ctx) {
        // Sets animations (based on moving and direction)        
        this.updateAnimation();

        // Debug information
        if (game.debug) {
            // Draw Collision Box
            ctx.strokeStyle = "black";
            ctx.strokeRect(this.x + this.offsetX - game.camera.x, this.y + this.offsetY - game.camera.y, this.offsetWidth, this.offsetHeight);
        }

        // Animation: Moving / Idle
        if (this.sequence.length != undefined) {
            if (this.animationDelay++ >= this.animationTime) {
                this.animationDelay = 0;
                this.animationIndexCounter++;
                if (this.animationIndexCounter >= this.sequence.length) this.animationIndexCounter = 0;
            }
            drawSprite(ctx, spritesheets.data[this.spritesheetID], this.sequence[this.animationIndexCounter], (this.x - game.camera.x), (this.y - game.camera.y));
        }
        // No Animation: Just sprite image
        else drawSprite(ctx, spritesheets.data[this.spritesheetID], this.sequence, (this.x - game.camera.x), (this.y - game.camera.y));
    }

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
        else if (this.isMoving && !game.gameSequence) {
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
        if (this.x + this.offsetX + this.speedX < 0) this.speedX = 0;
        else if (this.y + this.offsetY + this.speedY < 0) this.speedY = 0;
        else if (this.x + this.offsetX + this.speedX + this.offsetWidth > d.width) this.speedX = 0;
        else if (this.y + this.offsetY + this.speedY + this.offsetHeight > d.height) this.speedY = 0;

        // Converts the cartesian to grid coordiantes
        var x1 = Math.floor((this.x + this.offsetX + this.speedX) / 8);
        var x2 = x1 + 1;
        var x3 = Math.floor((this.x + this.offsetX + this.speedX + this.offsetWidth) / 8);
        var y1 = Math.floor((this.y + this.offsetY + this.speedY) / 8);
        var y2 = y1 + 1;
        var y3 = Math.floor((this.y + this.offsetY + this.speedY + this.offsetHeight) / 8);

        if (Math.abs(x3 - (this.x + this.offsetX + this.offsetWidth + this.speedX) / 8) < 0.1) x3 = x2;
        if (Math.abs(y3 - (this.y + this.offsetY + this.offsetHeight + this.speedY) / 8) < 0.1) y3 = y2;

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
        if (this == game.camera.target) {
            // stepOnEvent
            if (d.tiles[xy2i(x1, y1, d.mapWidth)].stepOnEventID != undefined)
                events.data[d.tiles[xy2i(x1, y1, d.mapWidth)].stepOnEventID](this.id);
            else if (d.tiles[xy2i(x1, y2, d.mapWidth)].stepOnEventID != undefined)
                events.data[d.tiles[xy2i(x1, y2, d.mapWidth)].stepOnEventID](this.id);
            else if (d.tiles[xy2i(x1, y3, d.mapWidth)].stepOnEventID != undefined)
                events.data[d.tiles[xy2i(x1, y3, d.mapWidth)].stepOnEventID](this.id);
            else if (d.tiles[xy2i(x2, y1, d.mapWidth)].stepOnEventID != undefined)
                events.data[d.tiles[xy2i(x2, y1, d.mapWidth)].stepOnEventID](this.id);
            else if (d.tiles[xy2i(x2, y2, d.mapWidth)].stepOnEventID != undefined)
                events.data[d.tiles[xy2i(x2, y2, d.mapWidth)].stepOnEventID](this.id);
            else if (d.tiles[xy2i(x2, y3, d.mapWidth)].stepOnEventID != undefined)
                events.data[d.tiles[xy2i(x2, y3, d.mapWidth)].stepOnEventID](this.id);
            else if (d.tiles[xy2i(x3, y1, d.mapWidth)].stepOnEventID != undefined)
                events.data[d.tiles[xy2i(x3, y1, d.mapWidth)].stepOnEventID](this.id);
            else if (d.tiles[xy2i(x3, y2, d.mapWidth)].stepOnEventID != undefined)
                events.data[d.tiles[xy2i(x3, y2, d.mapWidth)].stepOnEventID](this.id);
            else if (d.tiles[xy2i(x3, y3, d.mapWidth)].stepOnEventID != undefined)
                events.data[d.tiles[xy2i(x3, y3, d.mapWidth)].stepOnEventID](this.id);
            // onEnterEvent
            if (d.tiles[xy2i(x1, y1, d.mapWidth)].enterEventID != undefined)
                events.data[d.tiles[xy2i(x1, y1, d.mapWidth)].enterEventID](this.id);
            else if (d.tiles[xy2i(x1, y2, d.mapWidth)].enterEventID != undefined)
                events.data[d.tiles[xy2i(x1, y2, d.mapWidth)].enterEventID](this.id);
            else if (d.tiles[xy2i(x1, y3, d.mapWidth)].enterEventID != undefined)
                events.data[d.tiles[xy2i(x1, y3, d.mapWidth)].enterEventID](this.id);
            else if (d.tiles[xy2i(x2, y1, d.mapWidth)].enterEventID != undefined)
                events.data[d.tiles[xy2i(x2, y1, d.mapWidth)].enterEventID](this.id);
            else if (d.tiles[xy2i(x2, y2, d.mapWidth)].enterEventID != undefined)
                events.data[d.tiles[xy2i(x2, y2, d.mapWidth)].enterEventID](this.id);
            else if (d.tiles[xy2i(x2, y3, d.mapWidth)].enterEventID != undefined)
                events.data[d.tiles[xy2i(x2, y3, d.mapWidth)].enterEventID](this.id);
            else if (d.tiles[xy2i(x3, y1, d.mapWidth)].enterEventID != undefined)
                events.data[d.tiles[xy2i(x3, y1, d.mapWidth)].enterEventID](this.id);
            else if (d.tiles[xy2i(x3, y2, d.mapWidth)].enterEventID != undefined)
                events.data[d.tiles[xy2i(x3, y2, d.mapWidth)].enterEventID](this.id);
            else if (d.tiles[xy2i(x3, y3, d.mapWidth)].enterEventID != undefined)
                events.data[d.tiles[xy2i(x3, y3, d.mapWidth)].enterEventID](this.id);
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
                    if (this.y + this.offsetY > tile.y /*+ tile.height*/ )
                        if (this.speedY < 0) this.speedY = 0;
                }
                // RESTRICTED: DOWN 
                else if (tile.collision[i] == 1) {
                    if (this.y + this.offsetY /*+ this.offsetHeight*/ < tile.y)
                        if (this.speedY > 0) this.speedY = 0;
                }
                // RESTRICTED: LEFT
                else if (tile.collision[i] == 2) {
                    if (this.x + this.offsetX > tile.x /*+ tile.width*/ )
                        if (this.speedX < 0) this.speedX = 0;
                }
                // RESTRICTED: RIGHT
                else if (tile.collision[i] == 3) {
                    if (this.x + this.offsetX /*+ this.offsetWidth*/ < tile.x)
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

        if ((this.y + this.offsetY + this.speedY + this.offsetHeight <= otherobj.y + otherobj.offsetY + otherobj.speedY) ||
            (this.y + this.offsetY + this.speedY >= otherobj.y + otherobj.offsetY + otherobj.speedY + otherobj.offsetHeight) ||
            (this.x + this.offsetX + this.speedX + this.offsetWidth <= otherobj.x + otherobj.offsetX + otherobj.speedX) ||
            (this.x + this.offsetX + this.speedX >= otherobj.x + otherobj.offsetX + otherobj.speedX + otherobj.offsetWidth)) {
            // No X Collision
            this.xLeftCollision = false;
            this.xRightCollision = false;
        } else {
            if ((this.x + this.offsetX + this.speedX + this.offsetWidth > otherobj.x + otherobj.offsetX + otherobj.speedX)) {
                // X Right Collision
                this.xRightCollision = true;
                if (this.speedX <= 0) this.speedX = 0;
                if (otherobj.speedX >= 0) otherobj.speedX = 0;
            }
            if ((this.x + this.offsetX + this.speedX < otherobj.x + otherobj.offsetX + otherobj.speedX + otherobj.offsetWidth)) {
                // X Left Collision
                this.xLeftCollision = true;
                if (this.speedX >= 0) this.speedX = 0;
                if (otherobj.speedX <= 0) otherobj.speedX = 0;
            }
        }

        // Checking Y Collision
        this.speedY = tmp1;
        otherobj.speedY = tmp2;

        if ((this.y + this.offsetY + this.speedY + this.offsetHeight <= otherobj.y + otherobj.offsetY + otherobj.speedY) ||
            (this.y + this.offsetY + this.speedY >= otherobj.y + otherobj.offsetY + otherobj.speedY + otherobj.offsetHeight) ||
            (this.x + this.offsetX + this.speedX + this.offsetWidth <= otherobj.x + otherobj.offsetX + otherobj.speedX) ||
            (this.x + this.offsetX + this.speedX >= otherobj.x + otherobj.offsetX + otherobj.speedX + otherobj.offsetWidth)) {
            // NO Y Collision
            this.yTopCollision = false;
            this.yBottomCollision = false;
        } else {
            if ((this.y + this.offsetY + this.speedY + this.offsetHeight > otherobj.y + otherobj.offsetY + otherobj.speedY)) {
                // Y Top Collision
                this.yTopCollision = true;
                if (this.speedY >= 0) this.speedY = 0;
                if (otherobj.speedY <= 0) otherobj.speedY = 0;
            }
            if ((this.y + this.offsetY + this.speedY < otherobj.y + otherobj.offsetY + otherobj.speedY + otherobj.offsetHeight)) {
                // Y Bottom Collision
                this.yBottomCollision = true;
                if (this.speedY >= 0) this.speedY = 0;
                if (otherobj.speedY <= 0) otherobj.speedY = 0;
            }
        }

    }

    this.mid = function () {
        return rectangleMid(this.x, this.y, this.width, this.height);
    }


    // Trigger on enter / click / touch when in range
    this.updateInteraction = function (other) {
        // No self interaction
        if (this != other) {
            if (distance(this.mid(), other.mid()) <= Math.min(other.width, other.height) && this.facing(other)) {
                if (game.enter || game.mousedown || game.touchdown) {
                    if (game.eventReady) {
                        if (other.faceOnInteraction) this.face(other);
                        if (other.interactEventID != undefined) events.data[other.interactEventID]();
                        game.eventReady = false;
                    }
                } else game.eventReady = true;
            }
        }
    }

    /**
     * Check if the component is clicked / touched
     * If it's not clicked a clickEvent can be fired again
     */
    this.isClicked = function () {
        // Mouse / Touchdown
        if (game.mousedown || game.touchdown) {
            if (game.clickdownX != undefined && game.clickdownY != undefined) {
                // Not clicked (on sprite)
                if ((this.x > game.clickdownX + game.camera.x) ||
                    (this.x + this.width < game.clickdownX + game.camera.x) ||
                    (this.y > game.clickdownY + game.camera.y) ||
                    (this.y + this.height < game.clickdownY + game.camera.y)) return false;
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
     * Here the movement can change through movementEvents (and TODO: moveable interaction)
     */
    this.updateMovement = function () {
        // If the component has an movement event it will be called here
        if (this.movementEventID != undefined) events.data[this.movementEventID](this);

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
    freeIDs: [] // FreeIDs
};

/**
 * For adding a new dialog
 * @param the text
 * @param eventID
 */
function addDialog(input, eventID) {
    // Add
    dialogs.data.push(new Dialog(input, eventID));
    // ID Management
    if (dialogs.freeIDs.length != 0) dialogs.data[dialogs.data.length - 1].id = dialogs.freeIDs.pop();
    else dialogs.data[dialogs.data.length - 1].id = dialogs.data.length - 1;
}

/**
 * Remove a dialog
 */
function removeDialog(id) {
    for (var i = 0, l = dialogs.data.length; i < l; i++)
        if (dialogs.data[i].id == id) {
            // Remove if ID found
            dialogs.data.splice(id, 1);
            // ID Management
            dialogs.freeIDs.push(id);
            break;
        }
}

/**
 * Generate the data for the dialogs
 */
function generateDialogData() {
    // Datastring
    for (var i = 0, l = dialogs.data.length; i < l; i++)
        game.data += "addDialog(" + JSON.stringify(dialogs.data[i].text) + ", " + dialogs.data[i].eventID + ");\n";
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
        ctx = game.context;
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
        this.y = game.canvas.height - 50;
        this.width = game.canvas.width + 1;

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
        if (game.keys[87] || game.keys[83] || game.keys[38] || game.keys[40]) {
            if (this.keyPush) {
                if (game.keys[87] || game.keys[38]) this.selectedOption--;
                else if (game.keys[83] || game.keys[40]) this.selectedOption++;
                this.keyPush = false;
            }
        } else this.keyPush = true;
        // TODO: Refine select with Mouseover / Touching
        if (game.x > 30 && game.x < 140 && game.y > 345 && game.y < 370) this.selectedOption = 0;
        else if (game.x > 30 && game.x < 140 && game.y > 370 && game.y < 395) this.selectedOption = 1;
        else if (game.x > 190 && game.x < 350 && game.y > 345 && game.y < 370) this.selectedOption = 2;
        else if (game.x > 190 && game.x < 350 && game.y > 370 && game.y < 395) this.selectedOption = 3;
        // Stay in range
        if (this.selectedOption < 0) this.selectedOption = this.selectedOption + this.text[this.chatCounter].length;
        else this.selectedOption = this.selectedOption % this.text[this.chatCounter].length;
    }

    this.nextText = function () {
        if (game.enter || game.mousedown || game.touchdown) {
            if (game.eventReady) {
                this.chatCounter++;
                game.eventReady = false;
            }
        } else game.eventReady = true;
    }
}

// AUDIO ---------------------------------------------------------------------

/**
 * Contains all the audio of the game
 */
var audio = {
    data: [], // The audios
    freeIDs: [] // freeIDs
}

/**
 * Add a new audio
 * @param {file} src
 */
function addAudio(src) {
    // Add
    audio.data.push(new Audio(src));
    // ID Management
    if (audio.freeIDs.length != 0) audio.data[audio.data.length - 1].id = audio.freeIDs.pop();
    else audio.data[audio.data.length - 1].id = audio.data.length - 1;
    // Sets default volume 0.2 for all added audios; maybe include as parameter on creating
    audio.data[audio.data.length - 1].volume = 0.2;
}

/**
 * Remove an audio
 */
function removeAudio(id) {
    for (var i = 0, l = audio.data.length; i < l; i++)
        if (audio.data[i].id == id) {
            // Remove if ID found
            audio.data.splice(id, 1);
            // ID Management
            audio.freeIDs.push(id);
            break;
        }
}

/**
 * Generate the data for the audios
 */
function generateAudioData() {
    // Datastring
    for (var i = 0, l = audio.data.length; i < l; i++)
        game.data += "addAudio('" + audio.data[i].src + "');\n";
}

// GENERATE GAME DATA --------------------------------------------------------

/**
 * Generate the all the data of the game
 */
function generateGameData() {
    generateEventData();
    generateSpriteData();
    generateMapData();
    generateComponentData();
    generateDialogData();
    generateAudioData();
}
