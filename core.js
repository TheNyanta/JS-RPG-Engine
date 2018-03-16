// UTILITIES -------------------------------------------------------------------
// Convert 2dim array coordinates to 1dim array coordinates
function xy2i(x, y, width) {
    var index = y * width + x;
    return index;
}

// Convert 1dim array coordinates to 2dim array coordinates
function i2xy(index, width) {
    var x = index % width;
    var y = Math.floor(index / width);
    return [x, y];
}

// Rectangle collision
function rectangleOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
    if ((x1 + w1 < x2) || (x2 + w2 < x1) || (y1 + h1 < y2) || (y2 + h2 < y1)) return false;
    return true;
}

// Rectangle mid
function rectangleMid(x, y, w, h) {
    return [x + w / 2, y + h / 2];
}

// Euclidean distance between to points on a cartesian grid
function distance(xy1, xy2) {
    return Math.sqrt(Math.pow(xy1[0] - xy2[0], 2) + Math.pow(xy1[1] - xy2[1], 2));
}

/**
 * Check if array contains object with the given id
 * If it contains it return it else return undefined
 */
function containsID(data, id) {
    for (var i = 0, l = data.length; i < l; i++)
        if (data[i].id == id) return data[i];
    return undefined;
}

/**
 * Check if an array contains the component with the given id and mapID
 * If it contains it return it else return undefined
 * @param the array (i.e. maps.data)
 * @param the object (i.e. 3)
 */
function containsComponent(data, id, mapID) {
    for (var i = 0, l = data.length; i < l; i++)
        if (data[i].id == id && data[i].mapID == mapID) return data[i];
    return undefined;
}

// Not for nested arrays
function arrayEqual(arr1, arr2) {
    if (arr1.length != arr2.length) return false;
    for (var i = 0, l = arr1.length; i < l; i++)
        if (arr1[i] !== arr2[i]) return false
    return true;
}

function teleportComponent(component, map, x, y) {
    // Set new position
    if (x != null) component.x = x;
    if (y != null) component.y = y;
    // Remove component from current map and add to new
    if (game.currentMap != map) {
        for (var i = 0, l = maps.data[game.currentMap].components.data.length; i < l; i++) {
            if (maps.data[game.currentMap].components.data[i] == component)
                maps.data[map].components.data.push(maps.data[game.currentMap].components.data.splice(i, 1)[0]);
        }
    }
}

/**
 * For loading src: Check if the file name already exists
 */
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
    //maps.data[game.currentMap].image.src = img; //maps background image
    maps.data[game.currentMap].tileset = tmp;
    maps.data[game.currentMap].switchTileset();

    setTimeout(function () {
        maps.data[game.currentMap].drawCache();
        maps.data[game.currentMap].drawTileset();
    }, 100);
}

// Harp: audio.data[0-7].play();
var myHarp = (function () {
    var note = 0;
    var melody = [0, 4, 6, 7, 6, 4, 1, 2, 5, 4, 0, 3, 2, 1, 0, 2, 3, 1, 0, 7, 6, 4, 3, 2, 5, 7, 6, 4];
    var melodyIndex = 0;
    var playing = false;

    function change(mode) {
        // Random note
        if (mode == 0) note = Math.round(Math.random() * 7);
        // Melody note
        if (mode == 1) {
            melodyIndex++;
            if (melodyIndex == melody.length) melodyIndex = 0;
            note = melody[melodyIndex];
        }
    }
    return {
        currentNote: function () {
            return note;
        },
        isPlaying: function () {
            return playing;
        },
        startPlaying: function () {
            playing = true;
        },
        stopPlaying: function () {
            playing = false;
        },
        play: function (mode) {
            if (playing) {
                if (audio.data[note].ended) change(mode);
                audio.data[note].play();
            }
        }
    };
})();

// Timer: init() sets the start time to now, value() gets the start time, check(seconds) tells if "seconds" have passed
var Timer = function () {
    var start;

    function initStart() {
        start = new Date();
    }
    return {
        init: function () {
            initStart();
        },
        value: function () {
            return start;
        },
        check: function (seconds) {
            var tmp = new Date();
            if (Math.floor((tmp - start) / 1000 >= seconds)) return true;
            else return false;
        }
    }
};

//convert listmap to a grid
function getGrid(maplayer, width, height) {

    arr = [];
    k = 0;
    for (i = 0; i < height; i++) {
        tmp = [];
        for (j = 0; j < width; j++) {
            tmp[j] = maplayer[k];
            k++;
        }
        arr[i] = tmp;
    }

    return arr;
}

//convert mapCL to a graph
function getGraph() {
    var mapCL = maps.data[game.currentMap].layerC;
    var mapWidth = maps.data[game.currentMap].mapWidth;
    var mapHeight = maps.data[game.currentMap].mapHeight;

    var arr = Array();
    for (var i = 0; i < mapWidth; i++) {
        arr.push(Array());
    }
    for (var i = 0; i < mapWidth * mapHeight; i++) {
        if (mapCL[i])
            arr[i % mapWidth][Math.floor(i / mapWidth)] = 1;
        else
            arr[i % mapWidth][Math.floor(i / mapWidth)] = 0;
    }
    return arr;
}

// Get shortest path using astar algorithm
function astarPath(startX, startY, endX, endY) {
    var graph = new Graph(getGraph());
    // Check if start and end are valid positions (= not outside of the graph grid)
    if (startX < 0 || startX >= graph.grid.length || startY < 0 || startY >= graph.grid[0].length) return undefined;
    if (endX < 0 || endX >= graph.grid.length || endY < 0 || endY >= graph.grid[0].length) return undefined;
    var start = graph.grid[startX][startY];
    var end = graph.grid[endX][endY];
    //console.log("Start = ["+startX+"]["+startY+"]");
    //console.log("End = ["+endX+"]["+endY+"]");
    return astar.search(graph, start, end, {
        closest: true
    });
}

function DisableScrollbar() {
    document.documentElement.style.overflow = 'hidden';
    document.body.scoll = "no";
}

function EnableScrollbar() {
    document.documentElement.style.overflow = 'visible';
    document.body.scroll = "yes";
}

function enterFullscreen() {
    element = game.canvas;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

/**
 * Use localStorage to save game state
 * TODO: Change to save all the game state values
 */
function saveGameState(address, value) {
    // Check browser support
    if (typeof (Storage) !== "undefined") {
        // Store
        localStorage.setItem(address, value);
        console.log("Stored: " + value);
    } else {
        alert("Sorry, your browser does not support Web Storage...");
    }
}

/**
 * Use localStorage to load game state
 * TODO: Change to load all the game state values & apply them
 */
function loadGameState(address) {
    // Check browser support
    if (typeof (Storage) !== "undefined") {
        var value = localStorage.getItem(address);
        // Retrieve
        console.log("Retrieved: " + value);
    } else {
        alert("Sorry, your browser does not support Web Storage...");
    }
}

function toggle(boolean) {
    if (boolean) return false;
    return true;
}

function blackTransition() {
    ctx = game.context;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
}

function showTime() {
    ctx = game.context;
    ctx.font = "bold 20px Serif";
    ctx.fillStyle = "black";
    ctx.fillText("Timer : " + Math.floor(time / 1000), 5, 20);
}

// Init FPS and time
var start, before, now, time, fps;
start = Date.now();
before = Date.now();
fps = 0;

function everyinterval(n) {
    if ((game.frameNo / n) % 1 == 0) return true;
    return false;
}

function updateFPS() {
    now = Date.now();
    time = now - start;
    if (everyinterval(30)) fps = Math.floor(1000 / (now - before));
    before = now;
}

function showFPS() {
    ctx = game.context;
    ctx.font = "bold 20px Serif";
    ctx.fillStyle = "black";
    ctx.fillText("FPS : " + fps, 5, 40);
}

function showPosition(target) {
    ctx = game.context;
    ctx.fillStyle = "black";
    ctx.fillText("x:" + (target.x + target.boundingBox.x) + ", y:" + (target.y + target.boundingBox.y), 5, 60);
    ctx.fillText("Tile[" + Math.floor((target.x + target.boundingBox.x) / spritesheets.data[maps.data[game.currentMap].spritesheetID].spriteWidth) + ", " + Math.floor((target.y + target.boundingBox.y) / spritesheets.data[maps.data[game.currentMap].spritesheetID].spriteHeight) + "]", 5, 80);
}

function showDistance() {
    /*
    ctx = game.context;
    ctx.beginPath();
    ctx.lineWidth = 2; //2px
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = black;
    ctx.stroke();
    */
}

// Button functions

function debugButton() {
    game.debug = toggle(game.debug);
    maps.data[game.currentMap].drawCache();
    if (game.debug) document.getElementById("debugButton").setAttribute("class", "w3-button w3-green");
    else document.getElementById("debugButton").setAttribute("class", "w3-button w3-red");
}

function guiButton() {
    game.info = toggle(game.info);
    if (game.info) document.getElementById("guiButton").setAttribute("class", "w3-button w3-green");
    else document.getElementById("guiButton").setAttribute("class", "w3-button w3-red");
}

// ##########
// Map Editor
// ##########

// Layer Selection
function openlayerButton() {
    if (game.dom.layerSelection.className.indexOf("w3-show") == -1) game.dom.layerSelection.className += " w3-show";
    else game.dom.layerSelection.className = game.dom.layerSelection.className.replace(" w3-show", "");
}

function layerButton(i) {
    game.currentLayer = i;
    game.dom.layer1.setAttribute("class", "w3-bar-item w3-button w3-blue");
    game.dom.layer2.setAttribute("class", "w3-bar-item w3-button w3-blue");
    game.dom.layer3.setAttribute("class", "w3-bar-item w3-button w3-blue");
    game.dom.layerSelection.className = game.dom.layerSelection.className.replace(" w3-show", "");
    game.dom.collisionLayer.setAttribute("class", "w3-bar-item w3-button w3-blue");
    if (i == 0) {
        game.dom.layer1.setAttribute("class", "w3-bar-item w3-button w3-green");
        game.dom.currentLayer.innerHTML = "Layer 1";
    }
    if (i == 1) {
        game.dom.layer2.setAttribute("class", "w3-bar-item w3-button w3-green");
        game.dom.currentLayer.innerHTML = "Layer 2";
    }
    if (i == 2) {
        game.dom.layer3.setAttribute("class", "w3-bar-item w3-button w3-green");
        game.dom.currentLayer.innerHTML = "Layer 3";
    }
    if (i == 3) {
        game.dom.collisionLayer.setAttribute("class", "w3-bar-item w3-button w3-green");
        game.dom.currentLayer.innerHTML = "Collision";
        // Enable debug to see collision restriction
        if (!game.debug) debugButton();
        // Show restricition selection
        game.dom.currentRestriction.className = game.dom.currentRestriction.className.replace("w3-hide", "");

    }
    // Hide restriction selection
    else if (game.dom.currentRestriction.className.indexOf("w3-hide") == -1) game.dom.currentRestriction.className += " w3-hide";
    // Enable draw
    if (!game.drawingOn) drawButton();
}

// Collision Restriction Selection
function openCollisionButton() {
    if (game.dom.restrictionSelection.className.indexOf("w3-show") == -1) game.dom.restrictionSelection.className += " w3-show";
    else game.dom.restrictionSelection.className = game.dom.restrictionSelection.className.replace(" w3-show", "");
}

function restrictionButton(i, src) {
    game.dom.restrictionSelection.className = game.dom.restrictionSelection.className.replace(" w3-show", "");
    game.dom.currentRestriction.src = src;
    if (i == 0) game.tileCollisionType = 1; // Full Restriction
    if (i == 1) game.tileCollisionType = [1, 2, 3]; // Down, Left, Right Restriction
    if (i == 2) game.tileCollisionType = [0, 2, 3]; // Up, Left, Right Restriction
    if (i == 3) game.tileCollisionType = [0, 1, 3]; // Up, Down, Right Restriction
    if (i == 4) game.tileCollisionType = [0, 1, 2]; // Up, Down, Left Restriction
    if (i == 5) game.tileCollisionType = [2, 3]; // Left, Right Restriction
    if (i == 6) game.tileCollisionType = [1, 3]; // Down, Right Restriction
    if (i == 7) game.tileCollisionType = [1, 2]; // Down, Left Restriction
    if (i == 8) game.tileCollisionType = [0, 3]; // Up, Right Restriction
    if (i == 9) game.tileCollisionType = [0, 2]; // Up, Left Restriction
    if (i == 10) game.tileCollisionType = [0, 1]; // Up, Down Restriction
    if (i == 11) game.tileCollisionType = [3]; // Right Restriction
    if (i == 12) game.tileCollisionType = [2]; // Left Restriction
    if (i == 13) game.tileCollisionType = [1]; // Down Restriction
    if (i == 14) game.tileCollisionType = [0]; // Up Restriction
    if (i == 15) game.tileCollisionType = 0; // No restriction
}

// Enable draw button
function drawButton() {
    game.drawingOn = toggle(game.drawingOn);
    if (game.drawingOn) {
        game.control.disableMouse = true;
        document.getElementById("drawButton").setAttribute("class", "w3-button w3-green");
    } else {
        game.control.disableMouse = false;
        document.getElementById("drawButton").setAttribute("class", "w3-button w3-red");
    }
}

// Game/Engine Start Button
function startButton() {
    document.getElementById("startButton").parentNode.removeChild(document.getElementById("startButton"));
    // Display Editor Buttons
    document.getElementById("editorButtons").className += document.getElementById("editorButtons").className.replace(" w3-hide", "");
    // Initalize the game
    game.init();
    // Start after a short timeout
    setTimeout(game.start, 200);
}

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
            //Draw Collision Restriction of the tiles
            game.cgx3.globalAlpha = 0.3;
            if (this.collision === 0) game.cgx3.fillStyle = "blue";
            else if (this.collision === 1) game.cgx3.fillStyle = "red";
            else game.cgx3.fillStyle = "magenta";
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
            this.drawTileset();

            document.getElementById("selectedTile").innerHTML = game.tiletype;
            document.getElementById("clickedXY").innerHTML = "[" + x + " | " + y + "]";
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
 * Add a component
 * @param name
 * @param mapID: the original map of creation
 * @param spritesheetID
 * @param x-position
 * @param y-position
 * @param {offsetX: , offsetY: , width: , height: , collidable: }
 * @param {function} contactEvent
 * @param {function} triggerEvent
 * @param {function} moveEvent
 */
function addComponent(name, mapID, spritesheetID, x, y, boundingBox, contactEvent, triggerEvent, moveEvent) {
    // Check if the mapID is valid
    var map = containsComponent(maps.data, mapID);
    if (map != undefined) {
        // Add
        var index = map.components.data.push(new Component(name, mapID, spritesheetID, x, y, boundingBox, contactEvent, triggerEvent, moveEvent));
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
            game.data += "addComponent('" + c[j].name + "', " + c[j].mapID + ", " + c[j].spritesheetID + ", " + c[j].x + ", " + c[j].y + ", {x: " + c[j].boundingBox.x + ", y: " + c[j].boundingBox.y + ", width: " + c[j].boundingBox.width + ", height: " + c[j].boundingBox.height + ", collidable: " + c[j].boundingBox.collidable + "}, " + c[j].contactEvent + ", " + c[j].triggerEvent + ", " + c[j].moveEvent + ");\n";
        }
}

/**
 * Component constructor
 * @param name
 * @param mapID: the original map of creation
 * @param spritesheetID
 * @param x-position
 * @param y-position
 * @param {x: , y: , width: , height: , collidable: } //x, y are offsets to the components x,y which are for the sprite image
 * @param {function} contactEvent
 * @param {function} triggerEvent
 * @param {function} moveEvent
 */
function Component(name, mapID, spritesheetID, x, y, boundingBox, contactEvent, triggerEvent, moveEvent) {
    this.name = name;
    this.mapID = mapID;
    this.spritesheetID = spritesheetID;

    this.x = x;
    this.y = y;

    // Collision Properties
    this.boundingBox = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        collidable: false,
        //moveable: false // TODO: Implement
    };
    this.boundingBox = boundingBox;

    // NOOP function if no event
    this.contactEvent = function () {};
    if (contactEvent instanceof Function) this.contactEvent = contactEvent;
    this.triggerEvent = function () {};
    if (triggerEvent instanceof Function) this.triggerEvent = triggerEvent;
    this.moveEvent = function () {};
    if (moveEvent instanceof Function) this.moveEvent = moveEvent;

    // Movement Properties
    this.speed = 2;
    this.speedX = 0;
    this.speedY = 0;

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
     * Apply map tile collision to the component
     * First check map borders
     * If component can collide calculates its four corners and applies the tile restrictions of all the tile it is standing on
     * [TODO: Check if there is no collision between the old and the new position
     * (Can happen if either moving really fast or realtime moving <big delta * speed>)]
     */
    this.tileCollision = function () {

        var d = maps.data[game.currentMap];

        // Check map borders
        if (this.x + this.boundingBox.x + this.speedX < 0) this.speedX = 0;
        else if (this.y + this.boundingBox.y + this.speedY < 0) this.speedY = 0;
        else if (this.x + this.boundingBox.x + this.speedX + this.boundingBox.width > d.width) this.speedX = 0;
        else if (this.y + this.boundingBox.y + this.speedY + this.boundingBox.height > d.height) this.speedY = 0;

        if (this.boundingBox.collidable) {
            // Grid coordinates of the components corners 
            var x0 = Math.floor((this.x + this.boundingBox.x + this.speedX) / spritesheets.data[d.spritesheetID].spriteWidth);
            var y0 = Math.floor((this.y + this.boundingBox.y + this.speedY) / spritesheets.data[d.spritesheetID].spriteHeight);
            var xn = (this.x + this.boundingBox.x + this.boundingBox.width + this.speedX) / spritesheets.data[d.spritesheetID].spriteWidth;
            var yn = (this.y + this.boundingBox.y + this.boundingBox.height + this.speedY) / spritesheets.data[d.spritesheetID].spriteHeight;
            // Check if only touching right/down tile
            if (Math.floor(xn) - xn == 0) xn = Math.floor(xn) - 1;
            if (Math.floor(yn) - yn == 0) yn = Math.floor(yn) - 1;
            // Check collision for all the tiles the comonent is standing on
            for (var i = x0; i <= xn; i++)
                for (var j = y0; j <= yn; j++)
                    this.tileRestriction(d.tiles[xy2i(i, j, d.mapWidth)]);
        }
    }

    /**
     * Set movement based on the tiles collision restricting certain directions
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
                    if (this.y + this.boundingBox.y >= tile.y + tile.height)
                        if (this.speedY < 0) this.speedY = 0;
                }
                // RESTRICTED: DOWN 
                else if (tile.collision[i] == 1) {
                    if (this.y + this.boundingBox.y + this.boundingBox.height <= tile.y)
                        if (this.speedY > 0) this.speedY = 0;
                }
                // RESTRICTED: LEFT
                else if (tile.collision[i] == 2) {
                    if (this.x + this.boundingBox.x >= tile.x + tile.width)
                        if (this.speedX < 0) this.speedX = 0;
                }
                // RESTRICTED: RIGHT
                else if (tile.collision[i] == 3) {
                    if (this.x + this.boundingBox.x + this.boundingBox.width <= tile.x)
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

        if ((this.y + this.boundingBox.y + this.speedY + this.boundingBox.height <= otherobj.y + otherobj.boundingBox.y + otherobj.speedY) ||
            (this.y + this.boundingBox.y + this.speedY >= otherobj.y + otherobj.boundingBox.y + otherobj.speedY + otherobj.boundingBox.height) ||
            (this.x + this.boundingBox.x + this.speedX + this.boundingBox.width <= otherobj.x + otherobj.boundingBox.x + otherobj.speedX) ||
            (this.x + this.boundingBox.x + this.speedX >= otherobj.x + otherobj.boundingBox.x + otherobj.speedX + otherobj.boundingBox.width)) {
            // No X Collision
            this.leftCollision = false;
            this.rightCollision = false;
        } else {
            if ((this.x + this.boundingBox.x + this.speedX + this.boundingBox.width > otherobj.x + otherobj.boundingBox.x + otherobj.speedX)) {
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

        if ((this.y + this.boundingBox.y + this.speedY + this.boundingBox.height <= otherobj.y + otherobj.boundingBox.y + otherobj.speedY) ||
            (this.y + this.boundingBox.y + this.speedY >= otherobj.y + otherobj.boundingBox.y + otherobj.speedY + otherobj.boundingBox.height) ||
            (this.x + this.boundingBox.x + this.speedX + this.boundingBox.width <= otherobj.x + otherobj.boundingBox.x + otherobj.speedX) ||
            (this.x + this.boundingBox.x + this.speedX >= otherobj.x + otherobj.boundingBox.x + otherobj.speedX + otherobj.boundingBox.width)) {
            // NO Y Collision
            this.upCollision = false;
            this.downCollision = false;
        } else {
            if ((this.y + this.boundingBox.y + this.speedY + this.boundingBox.height > otherobj.y + otherobj.boundingBox.y + otherobj.speedY)) {
                // Y Up Collision
                this.upCollision = true;
                if (this.speedY >= 0) this.speedY = 0;
                if (otherobj.speedY <= 0) otherobj.speedY = 0;
            }
            if ((this.y + this.boundingBox.y + this.speedY < otherobj.y + otherobj.boundingBox.y + otherobj.speedY + otherobj.boundingBox.height)) {
                // Y Down Collision
                this.downCollision = true;
                if (this.speedY >= 0) this.speedY = 0;
                if (otherobj.speedY <= 0) otherobj.speedY = 0;
            }
        }
    }

    // Get the mid of the 
    this.mid = function () {
        return rectangleMid(this.x + this.boundingBox.x, this.y + this.boundingBox.y, this.boundingBox.width, this.boundingBox.height);
    }

    // Component interaction
    this.updateInteraction = function (other) {
        // No self interaction
        if (this != other) {
            // In range
            if (this.boundingBoxOverlap(other)) {
                // Fire the contactEvent of the other component with which this component collided
                other.contactEvent();
                // For interaction the component must look at the other component
                if (this.facing(other)) {
                    if (game.enter || other.isClicked()) {
                        if (game.eventReady) {
                            if (other.faceOnInteraction) this.face(other);
                            other.triggerEvent();
                            game.eventReady = false;
                        }
                    } else game.eventReady = true;
                }
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
            if (game.mousedown && game.clickdownX != undefined && game.clickdownY != undefined) {
                if ((this.x + this.boundingBox.x > game.clickdownX + game.camera.x) ||
                    (this.x + this.boundingBox.x + this.boundingBox.width < game.clickdownX + game.camera.x) ||
                    (this.y + this.boundingBox.y > game.clickdownY + game.camera.y) ||
                    (this.y + this.boundingBox.y + this.boundingBox.height < game.clickdownY + game.camera.y)) return false;
                // Clicked
                else return true;
            }
            if (game.touchdown && game.touchstartX != undefined && game.touchstartY != undefined) {
                if ((this.x + this.boundingBox.x > game.touchstartX + game.camera.x) ||
                    (this.x + this.boundingBox.x + this.boundingBox.width < game.touchstartX + game.camera.x) ||
                    (this.y + this.boundingBox.y > game.touchstartY + game.camera.y) ||
                    (this.y + this.boundingBox.y + this.boundingBox.height < game.touchstartY + game.camera.y)) return false;
                // Touched
                else return true;
            }
        }
    }

    /**
     *
     */
    this.boundingBoxOverlap = function (other) {
        return rectangleOverlap(this.x + this.boundingBox.x, this.y + this.boundingBox.y, this.boundingBox.width, this.boundingBox.height, other.x + other.boundingBox.x, other.y + other.boundingBox.y, other.boundingBox.width, other.boundingBox.height);
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

        // Checks for map collision and adjust speed to stop at zero distance
        if (this.speedX != 0) {
            var sign = Math.sign(this.speedX);
            for (var spd = Math.abs(this.speedX); 0 < spd; spd--) {
                this.speedX = sign * spd;
                this.tileCollision();
                if (this.speedX != 0) break;
            }
        }
        if (this.speedY != 0) {
            var sign = Math.sign(this.speedY);
            for (var spd = Math.abs(this.speedY); 0 < spd; spd--) {
                this.speedY = sign * spd;
                this.tileCollision();
                if (this.speedY != 0) break;
            }
        }

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
        if (game.activeCanvas == 0) {
            // TODO: Refine select with Mouseover / Touching
            if (game.x > 30 && game.x < 160 && game.y > 405 && game.y < 425) this.selectedOption = 0;
            else if (game.x > 30 && game.x < 160 && game.y > 425 && game.y < 445) this.selectedOption = 1;
            else if (game.x > 190 && game.x < 350 && game.y > 405 && game.y < 425) this.selectedOption = 2;
            else if (game.x > 190 && game.x < 350 && game.y > 425 && game.y < 445) this.selectedOption = 3;
        }
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

// GAME ----------------------------------------------------------------------
var game = {
    canvas: document.getElementById("game"),
    tileset: document.getElementById("tileset"),
    debug: false,
    info: false,
    // Map Editor Variables
    activeCanvas: undefined,
    tiletype: 1,
    tileCollisionType: 0,
    currentLayer: 0,
    drawingOn: false,
    // Game
    currentMap: 0, // The map which is currently used
    nextMap: 0, // The map that will be switched to in the next iteration of the game loop
    currentDialog: null, // The current dialog
    // The data of the game: When creating new spritesheets/maps/components it will be saved as a string
    // If you start the engine again and feed it this data it will be the same game data as before
    data: "",
    // Init control, maps, ..
    init: function () {
        // Game canvas
        this.context = this.canvas.getContext("2d");

        // Tileset canvas
        this.tilecontext = this.tileset.getContext("2d");

        // Pause game if not selected
        document.active = true;
        window.addEventListener('focus', function (e) {
            document.active = true;
        });
        window.addEventListener('blur', function (e) {
            document.active = false;
        });

        this.frameNo = 0;
        this.gameSequence = false;

        this.keys = [];

        // To only fire a single event on enter / mousedown / touchdown
        this.eventReady = false;
        this.enter = false;
        this.mousedown = false;
        this.touchdown = false;

        // Draw Tileset
        maps.data[game.currentMap].drawTileset();

        //this.canvas.style.cursor = "none"; //hide the original cursor

        // "Cache" Map on an hidden canvas
        this.panorama = document.createElement('canvas');
        this.cgx1 = this.panorama.getContext("2d");

        this.background = document.createElement('canvas');
        this.cgx2 = this.background.getContext("2d");

        this.foreground = document.createElement('canvas');
        this.cgx3 = this.foreground.getContext("2d");

        // For quick accessing of doms objects
        this.dom = {
            // Layer Selection
            layerSelection: document.getElementById("layerSelection"),
            currentLayer: document.getElementById("currentLayer"),
            layer1: document.getElementById("layer1Button"),
            layer2: document.getElementById("layer2Button"),
            layer3: document.getElementById("layer3Button"),
            collisionLayer: document.getElementById("collisionLayerButton"),
            // Collision Restriction Selection            
            currentRestriction: document.getElementById("currentRestriction"),
            restrictionSelection: document.getElementById("restrictionSelection"),
            restriction1: document.getElementById("restriction1"),
            restriction2: document.getElementById("restriction2"),
            restriction3: document.getElementById("restriction3"),
            restriction4: document.getElementById("restriction4"),
            restriction5: document.getElementById("restriction5"),
            restriction6: document.getElementById("restriction6"),
            restriction7: document.getElementById("restriction7"),
            restriction8: document.getElementById("restriction8"),
            restriction9: document.getElementById("restriction9"),
            restriction10: document.getElementById("restriction10"),
            restriction11: document.getElementById("restriction11"),
            restriction12: document.getElementById("restriction12"),
            restriction13: document.getElementById("restriction13"),
            restriction14: document.getElementById("restriction14"),
        }
        // Editor images
        this.arrows = {
            no: new Image(),
            up: new Image(),
            down: new Image(),
            left: new Image(),
            right: new Image(),
            up_down: new Image(),
            up_left: new Image(),
            up_right: new Image(),
            down_left: new Image(),
            down_right: new Image(),
            left_right: new Image(),
            up_down_left: new Image(),
            up_down_right: new Image(),
            up_left_right: new Image(),
            down_left_right: new Image(),
            up_down_left_right: new Image()
        }

        game.arrows.no.src = "Assets/Image/Restriction Arrows/no.png";
        game.arrows.up.src = "Assets/Image/Restriction Arrows/up.png";
        game.arrows.down.src = "Assets/Image/Restriction Arrows/down.png";
        game.arrows.left.src = "Assets/Image/Restriction Arrows/left.png";
        game.arrows.right.src = "Assets/Image/Restriction Arrows/right.png";
        game.arrows.up_down.src = "Assets/Image/Restriction Arrows/up_down.png";
        game.arrows.up_left.src = "Assets/Image/Restriction Arrows/up_left.png";
        game.arrows.up_right.src = "Assets/Image/Restriction Arrows/up_right.png";
        game.arrows.down_left.src = "Assets/Image/Restriction Arrows/down_left.png";
        game.arrows.down_right.src = "Assets/Image/Restriction Arrows/down_right.png";
        game.arrows.left_right.src = "Assets/Image/Restriction Arrows/left_right.png";
        game.arrows.up_down_left.src = "Assets/Image/Restriction Arrows/up_down_left.png";
        game.arrows.up_down_right.src = "Assets/Image/Restriction Arrows/up_down_right.png";
        game.arrows.up_left_right.src = "Assets/Image/Restriction Arrows/up_left_right.png";
        game.arrows.down_left_right.src = "Assets/Image/Restriction Arrows/down_left_right.png";
        game.arrows.up_down_left_right.src = "Assets/Image/Restriction Arrows/up_down_left_right.png";

        // Camera
        this.camera = new function () {
            this.x = 0;
            this.y = 0;

            this.setTarget = function (target) {
                this.target = target;
            }

            this.update = function () {
                // Move camera with WASD or Arrow Keys if no target is defined
                if (this.target == undefined) {
                    if (game.keys[38] || game.keys[87])
                        this.y--;
                    else if (game.keys[40] || game.keys[83])
                        this.y++;
                    else if (game.keys[37] || game.keys[65])
                        this.x--;
                    else if (game.keys[39] || game.keys[68])
                        this.x++;
                }
                // Camera will follow target
                else {
                    this.x = this.target.x - game.canvas.width / 2;
                    this.y = this.target.y - game.canvas.height / 2;
                }
                // Keep camera view inside the map
                if (this.x < 0) this.x = 0;
                if (this.y < 0) this.y = 0;
                if (this.x > maps.data[game.currentMap].width - game.canvas.width) this.x = maps.data[game.currentMap].width - game.canvas.width;
                if (this.y > maps.data[game.currentMap].height - game.canvas.height) this.y = maps.data[game.currentMap].height - game.canvas.height;
            }
        }

        // Control
        this.control = new function () {
            this.setTarget = function (target) {
                this.target = target;
            }

            this.disableControls = false;
            this.disableMouse = false;

            this.update = function () {
                if (this.target != undefined) {
                    // Check if it key control is allowed
                    if (!this.disableControls && !game.gameSequence) {
                        // Listen to keys: "Else if" to limit movement in only one direction at the same time (no diagonal moving)
                        if (game.keys[38] || game.keys[87])
                            this.target.speedY = -this.target.speed;
                        else if (game.keys[40] || game.keys[83])
                            this.target.speedY = this.target.speed;
                        else if (game.keys[37] || game.keys[65])
                            this.target.speedX = -this.target.speed;
                        else if (game.keys[39] || game.keys[68])
                            this.target.speedX = this.target.speed;
                        else if (!this.disableMouse) {
                            if (game.mousedown || game.touchdown) {
                                if (game.activeCanvas == 0) {
                                    /*
                                    // Move direction = Difference between clicked and current mousemove/touch position
                                    if (game.mousedown) {
                                        if (Math.abs(game.x - game.clickdownX) > Math.abs(game.y - game.clickdownY)) {
                                            if (game.x < game.clickdownX - 4)
                                                this.target.speedX -= this.target.speed;
                                            else if (game.x > game.clickdownX + 4)
                                                this.target.speedX += this.target.speed;
                                        } else {
                                            if (game.y < game.clickdownY - 4)
                                                this.target.speedY -= this.target.speed;
                                            else if (game.y > game.clickdownY + 4)
                                                this.target.speedY += this.target.speed;
                                        }
                                    }
                                    if (game.touchdown) {
                                        if (Math.abs(game.x - game.touchstartX) > Math.abs(game.y - game.touchstartY)) {
                                            if (game.x < game.touchstartX - 4)
                                                this.target.speedX -= this.target.speed;
                                            else if (game.x > game.touchstartX + 4)
                                                this.target.speedX += this.target.speed;
                                        } else {
                                            if (game.y < game.touchstartY - 4)
                                                this.target.speedY -= this.target.speed;
                                            else if (game.y > game.touchstartY + 4)
                                                this.target.speedY += this.target.speed;
                                        }
                                    }*/
                                }
                            }
                        }
                    }
                }
            }
        }

        // Set first component of the current map (start map) as the target of the camera and control
        this.hero = maps.data[0].components.data[0];
        this.camera.setTarget(game.hero);
        this.control.setTarget(game.hero);

        // Disable Mouse Control in Editor Mode
        if (game.editor) game.camera.disableMouse = true;

        // Initalize Maps
        for (i = 0, l = maps.data.length; i < l; i++) maps.data[i].loadLayers(layers1[i], layers2[i], layers3[i], layersC[i]);

        // Draw the first or current map onto the cached canvas'
        maps.data[game.currentMap].drawCache();

        // Insert tileset canvas after game canvas if editor mode
        if (game.editor) this.canvas.after(this.tileset);

        window.requestAnimationFrame = window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (f) {
                return setTimeout(f, 1000 / 60)
            }; // simulate calling code 60 

        window.cancelAnimationFrame = window.cancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            function (requestID) {
                clearTimeout(requestID)
            }; //fall back

        // OnCanvas
        this.onCanvas = function (x, y, canvas) {
            if (x > canvas.getBoundingClientRect().x &&
                x < canvas.getBoundingClientRect().x + canvas.width &&
                y > canvas.getBoundingClientRect().y &&
                y < canvas.getBoundingClientRect().y + canvas.height) return true;
            return false;
        }

        // INITIALIZE USER INPUT
        // Customize context menu on right click if canvas
        window.addEventListener('contextmenu', function (e) {
            if (game.onCanvas(e.clientX, e.clientY, game.canvas)) {
                //console.log("Default context menu prevent");
                e.preventDefault();
                //toggleMenuOn();
                //positionMenu(e);
            } else {
                //console.log("Default context menu");
                //taskItemInContext = null;
                //toggleMenuOff();
            }
        })
        // Keydown
        window.addEventListener('keydown', function (e) {
            game.keys = (game.keys || []);
            game.keys[e.keyCode] = (e.type == "keydown");
            if (game.printkeyCode) console.log(e.keyCode);
            // Enter key
            if (e.keyCode == 13) game.enter = true;
            // no scrolling on arrow keys
            if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) e.preventDefault();
        })
        // Keyup
        window.addEventListener('keyup', function (e) {
            game.keys[e.keyCode] = (e.type == "keydown");
            if (e.keyCode == 13) game.enter = false;
        })
        // MOUSE
        // Mouse down
        window.addEventListener('mousedown', function (e) {
            game.mousedown = true;
            game.clickdownX = e.clientX;
            game.clickdownY = e.clientY;

            if (game.onCanvas(e.clientX, e.clientY, game.canvas)) {
                e.preventDefault();
                game.clickdownX -= game.canvas.getBoundingClientRect().x;
                game.clickdownY -= game.canvas.getBoundingClientRect().y;
                maps.data[game.currentMap].clickedTile(game.clickdownX, game.clickdownY);
            } else if (game.onCanvas(e.clientX, e.clientY, game.tileset)) {
                e.preventDefault();
                game.clickdownX -= game.tileset.getBoundingClientRect().x;
                game.clickdownY -= game.tileset.getBoundingClientRect().y;
                maps.data[game.currentMap].clickedTile(game.clickdownX, game.clickdownY);
            }

            document.getElementById("clicked/touched").innerHTML = "Mousedown" + "[" + game.clickdownX + "|" + game.clickdownY + "]";
        })
        // Mouse up
        window.addEventListener('mouseup', function (e) {
            game.mousedown = false;
            game.clickupX = e.clientX;
            game.clickupY = e.clientY;

            if (game.onCanvas(e.clientX, e.clientY, game.canvas)) {
                game.clickupX -= game.canvas.getBoundingClientRect().x;
                game.clickupY -= game.canvas.getBoundingClientRect().y;
            } else if (game.onCanvas(e.clientX, e.clientY, game.tileset)) {
                game.clickupX -= game.tileset.getBoundingClientRect().x;
                game.clickupY -= game.tileset.getBoundingClientRect().y;
            }

            document.getElementById("clicked/touched").innerHTML = "-";
        })
        // Mouse move
        window.addEventListener('mousemove', function (e) {
            game.x = e.clientX;
            game.y = e.clientY;

            if (game.onCanvas(e.clientX, e.clientY, game.canvas)) {
                game.activeCanvas = 0;
                game.x = Math.floor(e.clientX - game.canvas.getBoundingClientRect().x);
                game.y = Math.floor(e.clientY - game.canvas.getBoundingClientRect().y);

                document.getElementById("activeCanvas").innerHTML = "Game";
                document.getElementById("canvasXY").innerHTML = "[" + game.x + " | " + game.y + "]";
            } else if (game.onCanvas(e.clientX, e.clientY, game.tileset)) {
                game.activeCanvas = 1;
                game.x = Math.floor(e.clientX - game.tileset.getBoundingClientRect().x);
                game.y = Math.floor(e.clientY - game.tileset.getBoundingClientRect().y);

                document.getElementById("activeCanvas").innerHTML = "Tileset";
                document.getElementById("canvasXY").innerHTML = "[" + game.x + " | " + game.y + "]";
            } else {
                game.activeCanvas = undefined;

                document.getElementById("activeCanvas").innerHTML = "Off Canvas";
                document.getElementById("canvasXY").innerHTML = "[" + e.clientX + " | " + e.clientY + "]";
            }
            document.getElementById("mtp").innerHTML = "-> [" + game.x + "|" + game.y + "]";
        })
        // TOUCH
        // Touch start
        window.addEventListener('touchstart', function (e) {
            game.touchdown = true;
            game.touchstartX = e.touches[0].clientX;
            game.touchstartY = e.touches[0].clientY;

            if (game.onCanvas(e.clientX, e.clientY, game.canvas)) {
                game.touchstartX -= game.canvas.getBoundingClientRect().x;
                game.touchstartY -= game.canvas.getBoundingClientRect().y;
            } else if (game.onCanvas(e.clientX, e.clientY, game.tileset)) {
                game.touchstartX -= game.tileset.getBoundingClientRect().x;
                game.touchstartY -= game.tileset.getBoundingClientRect().y;
            }

            document.getElementById("clicked/touched").innerHTML = "Touchstart" + "[" + game.touchstartX + "|" + game.touchstartY + "]";
        })
        // Touch end
        window.addEventListener('touchend', function (e) {
            game.touchdown = false;
            game.touchendX = e.touches[0].clientX;
            game.touchendY = e.touches[0].clientY;

            if (game.onCanvas(e.clientX, e.clientY, game.canvas)) {
                game.touchendX -= game.canvas.getBoundingClientRect().x;
                game.touchendY -= game.canvas.getBoundingClientRect().y;
            } else if (game.onCanvas(e.clientX, e.clientY, game.tileset)) {
                game.touchendX -= game.tileset.getBoundingClientRect().x;
                game.touchendY -= game.tileset.getBoundingClientRect().y;
            }

            document.getElementById("clicked/touched").innerHTML = "-";
        })
        // Touch move
        window.addEventListener('touchmove', function (e) {
            game.x = e.touches[0].clientX;
            game.y = e.touches[0].clientY;

            if (game.onCanvas(e.touches[0].clientX, e.touches[0].clientY, game.canvas)) {
                activeCanvas = 0;
                game.x = Math.floor(e.touches[0].clientX - game.canvas.getBoundingClientRect().x);
                game.y = Math.floor(e.touches[0].clientY - game.canvas.getBoundingClientRect().y);

                document.getElementById("activeCanvas").innerHTML = "Game";
                document.getElementById("canvasXY").innerHTML = "[" + game.x + " | " + game.y + "]";
            } else if (game.onCanvas(e.touches[0].clientX, e.touches[0].clientY, game.tileset)) {
                activeCanvas = 1;
                game.x = Math.floor(e.touches[0].clientX - game.tileset.getBoundingClientRect().x);
                game.y = Math.floor(e.touches[0].clientY - game.tileset.getBoundingClientRect().y);

                document.getElementById("activeCanvas").innerHTML = "Tileset";
                document.getElementById("canvasXY").innerHTML = "[" + game.x + " | " + game.y + "]";
            } else {
                game.activeCanvas = undefined;

                document.getElementById("activeCanvas").innerHTML = "Off Canvas";
                document.getElementById("canvasXY").innerHTML = "[" + e.clientX + " | " + e.clientY + "]";
            }
            document.getElementById("mtp").innerHTML = "-> [" + game.x + "|" + game.y + "]";
        })
    },

    start: function () {
        function gameLoop() {
            requestAnimationFrame(gameLoop);
            if (document.active)
                updateGame();
        }
        gameLoop();
    },

    stop: function () {

    },

    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

/**
 * Updates the current map with all it's components
 * TODO: Clean up - structure; for-loop length as var in the loop BUT care it must not change will the loop runs EVENTS that change map / delete objects
 */
function update() {
    // While game.gameSequence == true all components will stop moving (i.e. used for menus, dialogs,...)
    if (!game.gameSequence) {
        // Update the movement of all components on the current map (this also resolves tileCollision)
        if (!game.transition)
            for (var i = 0; i < maps.data[game.currentMap].components.data.length; i++)
                maps.data[game.currentMap].components.data[i].updateMovement();
        // For components that can start an interacted
        for (var i = 0; i < maps.data[game.currentMap].components.data.length; i++)
            // The controlled component can acted with other component
            if (maps.data[game.currentMap].components.data[i] != game.control.target)
                game.control.target.updateInteraction(maps.data[game.currentMap].components.data[i]);
        // Check each combination pair of components on the current map for component-component-collision
        for (var i = 0; i < maps.data[game.currentMap].components.data.length; i++)
            for (var j = 0; j < maps.data[game.currentMap].components.data.length; j++) {
                var c1 = maps.data[game.currentMap].components.data[i];
                var c2 = maps.data[game.currentMap].components.data[j];
                c1.componentCollision(c2);
            }
        // Update the position of all components on the current map
        for (var i = 0, l = maps.data[game.currentMap].components.data.length; i < l; i++) maps.data[game.currentMap].components.data[i].updatePosition();
    }
}

/**
 * Draws the canvas
 * 1) Clear the canvas
 * 2) Draw the background
 * 3) Draw the objects
 * 4) Draw the foreground
 * 4) Draw the gui
 */
function draw() {
    // Draw map
    // Clear the canvas
    game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
    // Draw Background
    maps.data[game.currentMap].drawBackground();
    // Sorts the array after it's y value so that components with bigger y are drawn later
    maps.data[game.currentMap].components.data.sort(function (a, b) {
        return (a.y > b.y) ? 1 : ((b.y > a.y) ? -1 : 0);
    });
    for (var i = 0, l = maps.data[game.currentMap].components.data.length; i < l; i++) maps.data[game.currentMap].components.data[i].draw(game.context);
    // Draw Foreground
    maps.data[game.currentMap].drawForeground();

    // Information for debugging and editing
    if (game.debug) {
        for (var i = 0, l = maps.data[game.currentMap].components.data.length; i < l; i++) {
            var comp = maps.data[game.currentMap].components.data[i];
            // Draw a rectangle for invisiable components
            if (comp.spritesheetID == undefined) {
                game.context.fillStyle = "cyan";
                game.context.globalAlpha = 0.8;
                game.context.fillRect(comp.x + comp.boundingBox.x - game.camera.x, comp.y + comp.boundingBox.y - game.camera.y, comp.boundingBox.width, comp.boundingBox.height);
                game.context.globalAlpha = 1.0;
            }
            // Draw Collision Box
            game.context.strokeStyle = "red";
            game.context.strokeRect(comp.x + comp.boundingBox.x - game.camera.x, comp.y + comp.boundingBox.y - game.camera.y, comp.boundingBox.width, comp.boundingBox.height);
        }
    }
    // Useful information
    if (game.info) {
        game.context.globalAlpha = 0.5;
        game.context.fillStyle = "cyan";
        game.context.fillRect(0, 0, 120, 90);
        game.context.globalAlpha = 1.0;
        showTime();
        updateFPS();
        showFPS();
        if (game.camera.target != undefined) showPosition(game.camera.target);
    }
    // Mouse / Touch
    /*
    if (game.mousedown || game.touchdown) {
        if (game.activeCanvas == 0) {
            ctx = game.context;
            ctx.beginPath();
            if (game.mousedown) ctx.arc(game.clickdownX, game.clickdownY, 5, 0, 2 * Math.PI, true);
            if (game.touchdown) ctx.arc(game.touchstartX, game.touchstartY, 5, 0, 2 * Math.PI, true);
            ctx.arc(game.x, game.y, 5, 0, 2 * Math.PI, true);
            // Fill
            ctx.fillStyle = "black";
            ctx.fill();
            // Outline
            ctx.strokeStyle = "black";
            ctx.stroke();
        }
    }
    */
}

/**
 * Updates the canvas
 * This is the core function of the game
 */
function updateGame() {
    game.frameNo += 1;

    // Redraw caches' on map change + map switch transition
    if (game.currentMap != game.nextMap) {
        game.currentMap = game.nextMap;
        maps.data[game.currentMap].drawCache();
        if (game.editor != undefined) maps.data[game.currentMap].drawTileset();
        setTimeout(function () {
            game.transition = false;
        }, 400);
    }

    // Draw map transition
    if (game.transition) blackTransition();
    else {
        // Update camera
        game.camera.update();
        // Update control
        game.control.update();
        // Update game
        update();
        // Draw game
        draw();
    }

    // Draw dialog
    if (game.currentDialog != undefined) {
        game.gameSequence = true;
        game.currentDialog.update();
    } else game.gameSequence = false;
}
