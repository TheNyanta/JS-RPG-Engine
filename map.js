/**
 * Contains all the maps of the game
 */
var maps = {
    data: [], // Contains the maps
    currentMap: 0, // The map which is currently used
    shownMap: 0 // The map that is shown
};

/**
 * For adding a new map
 * @param {Map} 'new Map(...)' object
 */
function addMap(map) {
    map.id = maps.data.length;
    maps.data.push(map);
}

/**
 * Define a map
 * @param a background panorama
 * @param {Spritesheet} a spritesheet with the tiles for the map
 * @param the maps number of tiles in x direction
 * @param the maps number of tiles in y direction
 * @param give the map a name
 */
function Map(image, tileset, mapWidth, mapHeight, name) {

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

    if (name != undefined) this.name = name;
    else this.name = tileset.name.match(/[\w]+/)[0];

    // Map Layers
    this.layers = [[], [], []];
    this.layerC = [];

    /**
     * Load layers into the the map
     * @param layer1 (background)
     * @param layer2 (background)
     * @param layer3 (foreground)
     * @param collision layer
     */
    this.loadLayers = function (l1, l2, l3, lc) {
        // Layer 1: Background 1
        this.layers[0] = l1;
        // Layer 2: Background 2
        this.layers[1] = l2;
        // Layer 3: Foreground
        this.layers[2] = l3;
        // Collision Layer
        this.layerC = lc;
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

        var mapIndex = 0;
        var tile_w, tile_h;
        for (var h = 0; h < this.mapHeight; h++) {
            for (var w = 0; w < this.mapWidth; w++, mapIndex++) {
                tile_w = w * this.tileset.spriteWidth;
                tile_h = h * this.tileset.spriteHeight;
                //(ctx, spritesheet, number, x, y)
                if (this.layers[0][mapIndex] - 1 >= 0) drawSprite(myGameArea.cgx2, this.tileset, this.layers[0][mapIndex] - 1, tile_w, tile_h);
                if (this.layers[1][mapIndex] - 1 >= 0) drawSprite(myGameArea.cgx2, this.tileset, this.layers[1][mapIndex] - 1, tile_w, tile_h);
                if (this.layers[2][mapIndex] - 1 >= 0) drawSprite(myGameArea.cgx3, this.tileset, this.layers[2][mapIndex] - 1, tile_w, tile_h);
                // Draw maps collision layer
                if (myGameArea.debug) {
                    myGameArea.cgx3.globalAlpha = 0.3;
                    if (this.layerC[mapIndex]) myGameArea.cgx3.fillStyle = "blue";
                    else myGameArea.cgx3.fillStyle = "red";
                    myGameArea.cgx3.fillRect(tile_w, tile_h, this.tileset.spriteWidth, this.tileset.spriteHeight);
                    myGameArea.cgx3.globalAlpha = 1.0;
                }
            }
        }
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

    /**
     * print layers as string to console
     */
    this.printLayers = function (name) {
        var output = "";
        // Layer 1
        output += "var " + name + "_layer1 = [";
        for (var i = 0; i < this.mapWidth * this.mapHeight; i++) {
            output += this.layers[0][i];
            if (i < this.mapWidth * this.mapHeight - 1)
                output += ", ";
        }
        output += "];\n";
        // Layer 2
        output += "var " + name + "_layer2 = [";
        for (var i = 0; i < this.mapWidth * this.mapHeight; i++) {
            output += this.layers[1][i];
            if (i < this.mapWidth * this.mapHeight - 1)
                output += ", ";
        }
        output += "];\n";
        // Layer 3
        output += "var " + name + "_layer3 = [";
        for (var i = 0; i < this.mapWidth * this.mapHeight; i++) {
            output += this.layers[2][i];
            if (i < this.mapWidth * this.mapHeight - 1)
                output += ", ";
        }
        output += "];\n";
        // Collision Layer
        output += "var " + name + "_layerC = [";
        for (var i = 0; i < this.mapWidth * this.mapHeight; i++) {
            output += this.layerC[i];
            if (i < this.mapWidth * this.mapHeight - 1)
                output += ", ";
        }
        output += "];\n";
        //Print
        console.log(output);
    }

    // Map editing: get tiles from tileset and place them on the map
    this.clickedTile = function (x, y) {
        var x;
        var y;

        // Click on Map
        if (activeCanvas == 0) {
            x = Math.floor((x + myGameArea.gameCamera.x) / this.tileset.spriteWidth);
            y = Math.floor((y + myGameArea.gameCamera.y) / this.tileset.spriteHeight);
            if (drawingOn) {
                if (currentLayer < 3) this.layers[currentLayer][xy2i(x, y, this.mapWidth)] = tiletype;
                else this.layerC[xy2i(x, y, this.mapWidth)] = toggle(this.layerC[xy2i(x, y, this.mapWidth)]);
                maps.data[maps.currentMap].drawCache();
            }
            document.getElementById("clickedXY").innerHTML = "[" + x + " | " + y + "]";
        }
        // Click on Tileset
        if (activeCanvas == 1) {
            x = Math.floor(x / this.tileset.spriteWidth);
            y = Math.floor(y / this.tileset.spriteHeight);
            tiletype = xy2i(x, y, this.tileset.spritesX) + 1;
            document.getElementById("selectedTile").innerHTML = tiletype;
            document.getElementById("clickedXY").innerHTML = "[" + x + " | " + y + "]";
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
        for (var h = 0; h < this.tileset.spritesY; h++) {
            for (var w = 0; w < this.tileset.spritesX; w++, mapIndex++) {
                tile_w = w * this.tileset.spriteWidth;
                tile_h = h * this.tileset.spriteHeight;
                //(ctx, spritesheet, number, x, y)
                drawSprite(myGameArea.tilecontext, this.tileset, mapIndex, tile_w, tile_h);
            }
        }
    }
}
