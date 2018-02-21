// IMAGES ----------------------------------------------------------------------
/**
 * Contains all the images of the game
 */
var images = {
    data: [], // Contains all loaded images
    freeIDs: [] // FreeIDs
};

/**
 * For adding a new image
 * @param {file} image src
 */
function addImage(image) {
    // Add
    images.data.push(new Image());
    images.data[images.data.length - 1].src = image;
    // ID management
    if (images.freeIDs.length > 0) images.data[images.data.length - 1].id = images.freeIDs[0].pop();
    else images.data[images.data.length - 1].id = images.data.length - 1;
}

/**
 * Remove an image
 */
function removeImage(id) {
    for (var i = 0, l = images.data.length; i < l; i++)
        if (images.data[i].id == id) {
            // Remove if ID found
            images.data.splice(id, 1);
            // ID Management
            images.freeIDs.push(id);
            break;
        }
}

/**
 * Generate the data for loading the images
 */
function generateImageData() {
    // Datastring
    for (var i = 0, l = images.data.length; i < l; i++)
        game.data += "addImage('" + images.data[i].src + "');\n";
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
        game.data += "addSprite(" + spritesheets.data[i].imageID + ", " + +spritesheets.data[i].spritesX + ", " + +spritesheets.data[i].spritesY + ", " + +spritesheets.data[i].spriteWidth + ", " + +spritesheets.data[i].spriteHeight + ");\n";
}

/**
 * Spritesheet for map-tiles and objects
 */
function Spritesheet(imageID, spritesX, spritesY, spriteWidth, spriteHeight) {
    this.imageID = imageID;
    this.width = spritesX * spriteWidth;
    this.height = spritesY * spriteHeight;
    this.spritesX = spritesX;
    this.spritesY = spritesY;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.name = images.data[this.imageID].src.match(/[\w]+\.[A-Za-z]{3}$/)[0];
}

/**
 * Draw a specific sprite of a spritesheet
 * @param the context where to draw it
 * @param the spritesheet
 * @param the specific sprite
 * @param x position
 * @param y position
 */
function drawSprite(ctx, spritesheet, number, x, y) {
    var res = i2xy(number, Math.max(spritesheet.spritesX, spritesheet.spritesY));
    ctx.drawImage(images.data[spritesheet.imageID], res[0] * spritesheet.spriteWidth, res[1] * spritesheet.spriteHeight, spritesheet.spriteWidth, spritesheet.spriteHeight, x, y, spritesheet.spriteWidth, spritesheet.spriteHeight);
}

// MAPS ----------------------------------------------------------------------

/**
 * Contains all the maps of the game
 */
var maps = {
    data: [], // Contains the maps
    freeIDs: [] // Free IDs
};

/**
 * For adding a new map
 * @param imageID of the background panorama
 * @param spritesheetID of the tile spritesheet
 * @param the maps number of tiles in x direction
 * @param the maps number of tiles in y direction
 */
function addMap(imageID, spritesheetID, mapWidth, mapHeight) {
    // Add
    maps.data.push(new Map(imageID, spritesheetID, mapWidth, mapHeight));
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
            maps.data.splice(i, 1);
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
        game.data += "addMap(" + maps.data[i].imageID + ", " + maps.data[i].spritesheetID + ", " + maps.data[i].mapWidth + ", " + maps.data[i].mapHeight + ");\n";
}

/**
 * A Tile
 * @param spritesheetID
 */
function Tile(spritesheetID, x, y) {
    this.spritesheetID = spritesheetID;
    this.width = spritesheets.data[this.spritesheetID].spriteWidth;
    this.height = spritesheets.data[this.spritesheetID].spriteHeight;
    // Position
    this.x = x;
    this.y = y;
    // Layers: Set which part of the spritesheet should be drawn
    this.layer1 = 0;
    this.layer2 = 0;
    this.layer3 = 0;
    // Collision
    this.collision = 0;

    /** This draws the tile on the cached canvas'
     * @param Cached canvas context for layer 1 & 2 (Background)
     * @param Cached canvas context for layer 3 (Foreground)
     */
    this.draw = function (ctx1, ctx2) {
        if (this.layer1 - 1 >= 0) drawSprite(ctx1, spritesheets.data[this.spritesheetID], this.layer1 - 1, this.x, this.y);
        if (this.layer2 - 1 >= 0) drawSprite(ctx1, spritesheets.data[this.spritesheetID], this.layer2 - 1, this.x, this.y);
        if (this.layer3 - 1 >= 0) drawSprite(ctx2, spritesheets.data[this.spritesheetID], this.layer3 - 1, this.x, this.y);
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
        }
    }
}

/**
 * Define a map
 * @param imageID of background panorama
 * @param spritesheetID of the tiles spritesheet
 * @param the maps number of tiles in x direction
 * @param the maps number of tiles in y direction
 */
function Map(imageID, spritesheetID, mapWidth, mapHeight) {

    // Panorama Image
    if (imageID != undefined) {
        this.imageID = imageID;
        // Panorama Properties
        this.x = 0;
        this.y = 0;
        this.speedX = 0;
        this.speedY = 0;
    }

    // Tileset Spritesheet
    this.spritesheetID = spritesheetID;

    // Map Properties
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;

    // Pixel width & height
    this.width = this.mapWidth * spritesheets.data[this.spritesheetID].spriteWidth;
    this.height = this.mapHeight * spritesheets.data[this.spritesheetID].spriteHeight;

    // The name is the filename
    this.name = spritesheets.data[this.spritesheetID].name.match(/[\w]+/)[0];

    // Contains all the tiles of this map
    // A tile is a component which contains the layers and collision / stepOnEventID / interactEventID
    this.tiles = [];
    for (var i = 0, l = this.mapWidth * this.mapHeight; i < l; i++) {
        var res = i2xy(i, this.mapWidth);
        this.tiles.push(new Tile(this.spritesheetID, res[0] * spritesheets.data[this.spritesheetID].spriteWidth, res[1] * spritesheets.data[this.spritesheetID].spriteHeight));
    }

    // Contains all components of this map
    this.components = {
        data: [], // Contains the components
        freeIDs: [] // Free IDs
    }

    /**
     * Load layers + collision & eventIDs into the the map
     * @param layer1 (background)
     * @param layer2 (background)
     * @param layer3 (foreground)
     * @param collision
     * @param stepOnEventID
     * @param interactEventID
     */
    this.loadLayers = function (l1, l2, l3, collision) {
        for (var i = 0, l = this.mapWidth * this.mapHeight; i < l; i++) {
            this.tiles[i].layer1 = l1[i];
            this.tiles[i].layer2 = l2[i];
            this.tiles[i].layer3 = l3[i];
            this.tiles[i].collision = collision[i];
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
        if (this.imageID != undefined) game.cgx1.drawImage(images.data[this.imageID], this.x, this.y, game.panorama.width, game.panorama.height);

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
            var x = Math.floor((param_x + game.camera.x) / spritesheets.data[this.spritesheetID].spriteWidth);
            var y = Math.floor((param_y + game.camera.y) / spritesheets.data[this.spritesheetID].spriteHeight);
            var d = maps.data[game.currentMap].tiles[xy2i(x, y, this.mapWidth)];
            // Clicked Tile console.log(xy2i(x, y, this.mapWidth));
            if (game.drawingOn) {
                if (game.currentLayer == 0) d.layer1 = game.tiletype;
                if (game.currentLayer == 1) d.layer2 = game.tiletype;
                if (game.currentLayer == 2) d.layer3 = game.tiletype;
                if (game.currentLayer == 3) d.collision = game.tileCollisionType;

                maps.data[game.currentMap].drawCache();
            }
            document.getElementById("clickedXY").innerHTML = "[" + x + " | " + y + "]";
        }
        // Click on Tileset
        if (game.activeCanvas == 1) {
            var x = Math.floor(param_x / spritesheets.data[this.spritesheetID].spriteWidth);
            var y = Math.floor(param_y / spritesheets.data[this.spritesheetID].spriteHeight);
            game.tiletype = xy2i(x, y, spritesheets.data[this.spritesheetID].spritesX) + 1;
            document.getElementById("selectedTile").innerHTML = game.tiletype;
            document.getElementById("clickedXY").innerHTML = "[" + x + " | " + y + "]";
            this.drawTileset();
        }
    }

    /**
     * Draw the tileset on the tileset canvas
     */
    this.drawTileset = function () {
        game.tileset.width = spritesheets.data[this.spritesheetID].spriteWidth * spritesheets.data[this.spritesheetID].spritesX;
        game.tileset.height = spritesheets.data[this.spritesheetID].spriteHeight * spritesheets.data[this.spritesheetID].spritesY;
        game.tilecontext.clearRect(0, 0, spritesheets.data[this.spritesheetID].spriteWidth * spritesheets.data[this.spritesheetID].spritesX, spritesheets.data[this.spritesheetID].spriteHeight * spritesheets.data[this.spritesheetID].spritesY);

        var mapIndex = 0;
        var tile_w, tile_h;
        for (var h = 0, m = spritesheets.data[this.spritesheetID].spritesY; h < m; h++) {
            for (var w = 0, n = spritesheets.data[this.spritesheetID].spritesX; w < n; w++, mapIndex++) {
                tile_w = w * spritesheets.data[this.spritesheetID].spriteWidth;
                tile_h = h * spritesheets.data[this.spritesheetID].spriteHeight;
                //(ctx, spritesheet, number, x, y)
                drawSprite(game.tilecontext, spritesheets.data[this.spritesheetID], mapIndex, tile_w, tile_h);

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
 * For adding a new component
 * @param name
 * @param mapID: the original map of creation
 * @param spritesheetID
 * @param x-position
 * @param y-position
 * @param offsetX
 * @param offsetY
 * @param offsetWidth
 * @param offsetHeight
 * @param {function} trigger to be defined in function
 */
function addComponent(name, mapID, spritesheetID, x, y, offsetX, offsetY, offsetWidth, offsetHeight, triggerEvent, moveEvent) {
    var map = containsObject(maps.data, mapID);
    if (map != undefined) {
        // Add
        var index = map.components.data.push(new Component(name, mapID, spritesheetID, x, y, offsetX, offsetY, offsetWidth, offsetHeight, triggerEvent, moveEvent));
        // ID management
        if (map.components.freeIDs.length > 0) map.components.data[index - 1].id = map.components.freeIDs[0].pop();
        else map.components.data[index - 1].id = index - 1;
    }
}

/**
 * Remove a component
 */
function removeComponent(id) {
    for (var i = 0, l = components.data.length; i < l; i++)
        if (components.data[i].id == id) {
            // Remove if ID found
            //delete components.data[i];
            components.data.splice(id, 1);
            // ID Management
            components.freeIDs.push(id);
            break;
        }
    // Remove componentID reference from all maps
    for (var i = 0, l = maps.data.length; i < l; i++)
        for (var j = 0; j < maps.data[i].components.length; j++)
            if (maps.data[i].components[j] == id)
                maps.data[i].components.splice(j, 1);
}

/**
 * Generate the data for the components
 */
function generateComponentData() {
    // Datastring
    for (var i = 0, l = maps.data.length; i < l; i++)
        for (var j = 0; j < maps.data[i].components.data.length; j++) {
            var c = maps.data[i].components.data;
            game.data += "addComponent('" + c[j].name + "', " + c[j].mapID + ", " + c[j].spritesheetID + ", " + c[j].x + ", " + c[j].y + ", " + c[j].boundingBox.x + ", " + c[j].boundingBox.y + ", " + c[j].boundingBox.width + ", " + c[j].boundingBox.height + ", " + c[j].triggerEvent + ", " + c[j].moveEvent + ");\n";
        }
}

/**
 * Component constructor
 * @param name
 * @param spritesheetID
 * @param mapID: the original map of creation
 * @param x-position
 * @param y-position
 * @param offsetX
 * @param offsetY
 * @param offsetWidth
 * @param offsetHeight
 * @param {function} triggerEvent
 * @param {function} moveEvent
 */
function Component(name, mapID, spritesheetID, x, y, offsetX, offsetY, offsetWidth, offsetHeight, triggerEvent, moveEvent) {
    this.name = name;
    this.mapID = mapID;
    this.spritesheetID = spritesheetID;

    this.x = x;
    this.y = y;

    // Movement Properties
    this.speed = 2;
    this.speedX = 0;
    this.speedY = 0;

    // Collision Properties
    this.boundingBox = {
        x: x + offsetX,
        y: y + offsetY,
        width: offsetWidth,
        height: offsetHeight,
        offsetX: offsetX, // To restore this.x after a teleport
        offsetY: offsetY, // To restore this.y after a teleport
        collidable: true,
        //moveable: false // TODO: Implement
    };

    // NOOP function if no event
    this.triggerEvent = function () {};
    if (triggerEvent instanceof Function) this.triggerEvent = triggerEvent;
    this.moveEvent = function () {};
    if (moveEvent instanceof Function) this.moveEvent = moveEvent;

    // Animation Properties
    this.sequence = 0;
    this.isMoving = false;
    this.faceOnInteraction = true;
    this.animationTime = 0;
    this.animationDelay = 0;
    this.animationIndexCounter = 0;
    this.direction = 64; // Default Direction

    // NOOP function if no image
    this.draw = function () {};
    if (spritesheetID != undefined) {
        this.draw = function (ctx) {
            // Sets animations (based on moving and direction)        
            this.updateAnimation();

            // Debug information
            if (game.debug) {
                // Draw Collision Box
                ctx.strokeStyle = "black";
                ctx.strokeRect(this.boundingBox.x - game.camera.x, this.boundingBox.y - game.camera.y, this.boundingBox.width, this.boundingBox.height);
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

        var d = maps.data[game.currentMap];

        // Check map borders
        if (this.boundingBox.x + this.speedX < 0) this.speedX = 0;
        else if (this.boundingBox.y + this.speedY < 0) this.speedY = 0;
        else if (this.boundingBox.x + this.speedX + this.boundingBox.width > d.width) this.speedX = 0;
        else if (this.boundingBox.y + this.speedY + this.boundingBox.height > d.height) this.speedY = 0;

        // Converts the cartesian to grid coordiantes
        var x1 = Math.floor((this.boundingBox.x + this.speedX) / 8);
        var x2 = x1 + 1;
        var x3 = Math.floor((this.boundingBox.x + this.speedX + this.boundingBox.width) / 8);
        var y1 = Math.floor((this.boundingBox.y + this.speedY) / 8);
        var y2 = y1 + 1;
        var y3 = Math.floor((this.boundingBox.y + this.speedY + this.boundingBox.height) / 8);

        if (Math.abs(x3 - (this.boundingBox.x + this.boundingBox.width + this.speedX) / 8) < 0.1) x3 = x2;
        if (Math.abs(y3 - (this.boundingBox.y + this.boundingBox.height + this.speedY) / 8) < 0.1) y3 = y2;

        if (this.boundingBox.collidable) {
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
                    if (this.boundingBox.y > tile.y /*+ tile.height*/ )
                        if (this.speedY < 0) this.speedY = 0;
                }
                // RESTRICTED: DOWN 
                else if (tile.collision[i] == 1) {
                    if (this.boundingBox.y /*+ this.boundingBox.height*/ < tile.y)
                        if (this.speedY > 0) this.speedY = 0;
                }
                // RESTRICTED: LEFT
                else if (tile.collision[i] == 2) {
                    if (this.boundingBox.x > tile.x /*+ tile.width*/ )
                        if (this.speedX < 0) this.speedX = 0;
                }
                // RESTRICTED: RIGHT
                else if (tile.collision[i] == 3) {
                    if (this.boundingBox.x /*+ this.boundingBox.width*/ < tile.x)
                        if (this.speedX > 0) this.speedX = 0;
                }
            }
        }
    }

    /**
     * Prevent collision with other Components
     * Has to be called in the main loop for all combinations after the control updates of all Components
     * (TODO: Fix up/down/left/right collision dectection: if up it also detects down ...
     * Pushable Components -> if (pushable && otherobj.noMapCollision) => push) 
     */
    this.componentCollision = function (otherobj) {
        if (!this.boundingBox.collidable || !otherobj.boundingBox.collidable) return false;
        if (this == otherobj) return false;

        // Saving y-speed
        var tmp1 = this.speedY;
        var tmp2 = otherobj.speedY;

        // Checking X Collision
        this.speedY = 0;
        otherobj.speedY = 0;

        if ((this.boundingBox.y + this.speedY + this.boundingBox.height <= otherobj.boundingBox.y + otherobj.speedY) ||
            (this.boundingBox.y + this.speedY >= otherobj.boundingBox.y + otherobj.speedY + otherobj.boundingBox.height) ||
            (this.boundingBox.x + this.speedX + this.boundingBox.width <= otherobj.boundingBox.x + otherobj.speedX) ||
            (this.boundingBox.x + this.speedX >= otherobj.boundingBox.x + otherobj.speedX + otherobj.boundingBox.width)) {
            // No X Collision
            this.leftCollision = false;
            this.rightCollision = false;
        } else {
            if ((this.boundingBox.x + this.speedX + this.boundingBox.width > otherobj.boundingBox.x + otherobj.speedX)) {
                // X Right Collision
                this.rightCollision = true;
                if (this.speedX <= 0) this.speedX = 0;
                if (otherobj.speedX >= 0) otherobj.speedX = 0;
            }
            if ((this.boundingBox.x + this.speedX < otherobj.boundingBox.x + otherobj.speedX + otherobj.boundingBox.width)) {
                // X Left Collision
                this.leftCollision = true;
                if (this.speedX >= 0) this.speedX = 0;
                if (otherobj.speedX <= 0) otherobj.speedX = 0;
            }
        }

        // Checking Y Collision
        this.speedY = tmp1;
        otherobj.speedY = tmp2;

        if ((this.boundingBox.y + this.speedY + this.boundingBox.height <= otherobj.boundingBox.y + otherobj.speedY) ||
            (this.boundingBox.y + this.speedY >= otherobj.boundingBox.y + otherobj.speedY + otherobj.boundingBox.height) ||
            (this.boundingBox.x + this.speedX + this.boundingBox.width <= otherobj.boundingBox.x + otherobj.speedX) ||
            (this.boundingBox.x + this.speedX >= otherobj.boundingBox.x + otherobj.speedX + otherobj.boundingBox.width)) {
            // NO Y Collision
            this.upCollision = false;
            this.downCollision = false;
        } else {
            if ((this.boundingBox.y + this.speedY + this.boundingBox.height > otherobj.boundingBox.y + otherobj.speedY)) {
                // Y Up Collision
                this.upCollision = true;
                if (this.speedY >= 0) this.speedY = 0;
                if (otherobj.speedY <= 0) otherobj.speedY = 0;
            }
            if ((this.boundingBox.y + this.speedY < otherobj.boundingBox.y + otherobj.speedY + otherobj.boundingBox.height)) {
                // Y Down Collision
                this.downCollision = true;
                if (this.speedY >= 0) this.speedY = 0;
                if (otherobj.speedY <= 0) otherobj.speedY = 0;
            }
        }

    }

    this.mid = function () {
        return rectangleMid(this.boundingBox.x, this.boundingBox.y, this.boundingBox.width, this.boundingBox.height);
    }

    // Trigger on enter / click / touch when in range
    this.updateInteraction = function (other) {
        // No self interaction
        if (this != other) {
            if (this.boundingBoxOverlap(other) && this.facing(other)) {
                if (game.enter || game.mousedown || game.touchdown) {
                    if (game.eventReady) {
                        if (other.faceOnInteraction) this.face(other);
                        other.triggerEvent();
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
    }

    /**
     *
     */
    this.boundingBoxOverlap = function (other) {
        return rectangleOverlap(this.boundingBox.x, this.boundingBox.y, this.boundingBox.width, this.boundingBox.height, other.boundingBox.x, other.boundingBox.y, other.boundingBox.width, other.boundingBox.height);
        return false;
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
     * Tile Collision
     */
    this.updateMovement = function () {
        // Movement Function
        this.moveEvent();

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
        this.boundingBox.x += this.speedX;
        this.boundingBox.y += this.speedY;

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
    freeIDs: [] // FreeIDs
};

/**
 * For adding a new dialog
 * @param the text
 * @param fnc
 */
function addDialog(input, fnc) {
    // Add
    dialogs.data.push(new Dialog(input, fnc));
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
        game.data += "addDialog(" + JSON.stringify(dialogs.data[i].text) + ", " + dialogs.data[i].event + ");\n";
}

/**
 * Dialog
 * Input Examples
 * 1) Normal text: ["text1", "text2"]
 * 2) Text with option: ["question", ["answer1", "answer2"]]
 * The second parameter is for an eventID
 * TODO: Refine dialog styling
 */
function Dialog(input, fnc) {
    this.text = input;
    this.event = function () {};
    if (fnc instanceof Function) this.event = fnc;
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
    this.setEvent = function (fnc) {
        if (fnc instanceof Function) this.event = fnc;
    }

    this.update = function () {
        // Dialog finished
        if (this.chatCounter == this.text.length) {
            // Stop dialog updating in main-loop
            game.currentDialog = undefined;
            // Check for event
            this.event(this.selectedOption);
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

// GENERATE GAME DATA --------------------------------------------------------

/**
 * Generate the all the data of the game
 */
function generateGameData() {
    generateImageData();
    generateAudioData();
    generateSpriteData();
    generateMapData();
    generateComponentData();
    generateDialogData();
}
