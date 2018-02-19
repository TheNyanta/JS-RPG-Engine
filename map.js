/**
 * Contains all the maps of the game
 */
var maps = {
    data: [], // Contains the maps
    currentMap: 0, // The map which is currently used
    shownMap: 0, // The map that is shown
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
    // Contains all the objects of the map
    this.objects = [];

    this.addObject = function (object) {
        if (object.length != undefined)
            for (var i = 0, l = object.length; i < l; i++) this.objects.push(object[i]);
        else this.objects.push(object);
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
