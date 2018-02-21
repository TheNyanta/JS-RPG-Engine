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
 * Check if an array contains a certain componentID
 * If it contains it return it's index else return false
 * @param the array (i.e. dialogs.data)
 * @param the object (i.e. dialogs.data[4])
 */
function containsObject(data, componentID) {
    for (var i = 0, l = data.length; i < l; i++)
        if (data[i] == componentID) return i;
    return false;
}

/**
 * Removes an componentID from an array if it contains it
 * @param the array
 * @param the componentID
 */
function removeComponentID(data, componentID) {
    var index = containsObject(data, componentID);
    if (index !== false) data.splice(index, 1);
}

/**
 * Add an object to an array if it doesn't already contains it
 * @param the array
 * @param the componentID
 */
function addComponentID(data, componentID) {
    var index = containsObject(data, componentID);
    if (!index) data.push(componentID);
}

/** 
 * Let a component change the map
 * @param new components x
 * @param new components y
 * @param new map
 * @param the component
 * @param {bool} change map?
 */
function componentMapSwitch(x, y, nextMap, componentID, changeMap) {
    // Change the position of the component
    if (x != null) components.data[componentID].x = x;
    if (y != null) components.data[componentID].y = y;
    // Removes the component from the current map
    removeComponentID(maps.data[maps.currentMap].components, componentID);
    // Adds the component to the new map
    addComponentID(maps.data[nextMap].components, componentID);
    if (changeMap) {
        maps.nextMap = nextMap;
        game.transition = true;
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
    //maps.data[maps.currentMap].image.src = img; //maps background image
    maps.data[maps.currentMap].tileset = tmp;
    maps.data[maps.currentMap].switchTileset();

    setTimeout(function () {
        maps.data[maps.currentMap].drawCache();
        maps.data[maps.currentMap].drawTileset();
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
    var mapCL = maps.data[maps.currentMap].layerC;
    var mapWidth = maps.data[maps.currentMap].mapWidth;
    var mapHeight = maps.data[maps.currentMap].mapHeight;

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

// Size the canvas to the size of the map if it fits on the screen
function resizeCanvas() {
    if (document.body.clientWidth > maps.data[maps.currentMap].width) {
        // Screen bigger than map
        game.canvas.width = maps.data[maps.currentMap].width;
    }
    // Screen fits on map
    else game.canvas.width = game.canvas.width = document.body.clientWidth;

    if (document.body.clientHeight > maps.data[maps.currentMap].height) {
        // Screen bigger than map
        game.canvas.height = maps.data[maps.currentMap].height;
    }
    // Screen fits on map
    else game.canvas.height = game.canvas.height = document.body.clientHeight;
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
    ctx.fillRect(0, 0, maps.data[maps.currentMap].width, maps.data[maps.currentMap].height);
}

function extraGuiRect() {
    ctx = game.context;
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "cyan";
    ctx.fillRect(0, 0, 120, 90);
    ctx.globalAlpha = 1.0;
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
    ctx.fillText("x:" + (target.x + target.offsetX) + ", y:" + (target.y + target.offsetY), 5, 60);
    ctx.fillText("Tile[" + Math.floor((target.x + target.offsetX) / spritesheets.data[maps.data[maps.currentMap].spritesheetID].spriteWidth) + ", " + Math.floor((target.y + target.offsetY) / spritesheets.data[maps.data[maps.currentMap].spritesheetID].spriteHeight) + "]", 5, 80);
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
    maps.data[maps.currentMap].drawCache();
    if (game.debug) {
        document.getElementById("debugButton").setAttribute("class", "w3-button w3-green");
        document.getElementById("debugButton").innerHTML = "Debug On";
    } else {
        document.getElementById("debugButton").setAttribute("class", "w3-button w3-red");
        document.getElementById("debugButton").innerHTML = "Debug Off";
    }
}

function guiButton() {
    game.showExtra = toggle(game.showExtra);
    if (game.showExtra) {
        document.getElementById("guiButton").setAttribute("class", "w3-button w3-green");
        document.getElementById("guiButton").innerHTML = "GUI On";
    } else {
        document.getElementById("guiButton").setAttribute("class", "w3-button w3-red");
        document.getElementById("guiButton").innerHTML = "GUI Off";
    }
}

// ##########
// Map Editor
// ##########

function layerButton(i) {
    game.currentLayer = i;
    if (i == 0) {
        document.getElementById("layer1Button").setAttribute("class", "w3-button w3-green");
        document.getElementById("layer2Button").setAttribute("class", "w3-button w3-blue");
        document.getElementById("layer3Button").setAttribute("class", "w3-button w3-blue");
        document.getElementById("layerCButton").setAttribute("class", "w3-button w3-blue");
    }
    if (i == 1) {
        document.getElementById("layer1Button").setAttribute("class", "w3-button w3-blue");
        document.getElementById("layer2Button").setAttribute("class", "w3-button w3-green");
        document.getElementById("layer3Button").setAttribute("class", "w3-button w3-blue");
        document.getElementById("layerCButton").setAttribute("class", "w3-button w3-blue");
    }
    if (i == 2) {
        document.getElementById("layer1Button").setAttribute("class", "w3-button w3-blue");
        document.getElementById("layer2Button").setAttribute("class", "w3-button w3-blue");
        document.getElementById("layer3Button").setAttribute("class", "w3-button w3-green");
        document.getElementById("layerCButton").setAttribute("class", "w3-button w3-blue");
    }
    if (i == 3) {
        document.getElementById("layer1Button").setAttribute("class", "w3-button w3-blue");
        document.getElementById("layer2Button").setAttribute("class", "w3-button w3-blue");
        document.getElementById("layer3Button").setAttribute("class", "w3-button w3-blue");
        document.getElementById("layerCButton").setAttribute("class", "w3-button w3-green");
        if (!game.debug) debugButton();
    }
    if (!game.drawingOn) drawButton();
}

function collisionButton(i) {
    if (!game.debug) debugButton();
    layerButton(3);
    if (!game.drawingOn) drawButton();
    game.tileCollisions[i] = toggle(game.tileCollisions[i]);
    if (game.tileCollisions[0]) document.getElementById("collisionUpButton").setAttribute("class", "w3-button w3-green");
    else document.getElementById("collisionUpButton").setAttribute("class", "w3-button w3-red");
    if (game.tileCollisions[1]) document.getElementById("collisionDownButton").setAttribute("class", "w3-button w3-green");
    else document.getElementById("collisionDownButton").setAttribute("class", "w3-button w3-red");
    if (game.tileCollisions[2]) document.getElementById("collisionLeftButton").setAttribute("class", "w3-button w3-green");
    else document.getElementById("collisionLeftButton").setAttribute("class", "w3-button w3-red");
    if (game.tileCollisions[3]) document.getElementById("collisionRightButton").setAttribute("class", "w3-button w3-green");
    else document.getElementById("collisionRightButton").setAttribute("class", "w3-button w3-red");

    // Update tileCollisionType
    if (game.tileCollisions[0] && game.tileCollisions[1] && game.tileCollisions[2] && game.tileCollisions[3])
        game.tileCollisionType = 1;
    else if (!game.tileCollisions[0] && !game.tileCollisions[1] && !game.tileCollisions[2] && !game.tileCollisions[3])
        game.tileCollisionType = 0;
    else {
        var collision = [];
        if (game.tileCollisions[0]) collision.push(0);
        if (game.tileCollisions[1]) collision.push(1);
        if (game.tileCollisions[2]) collision.push(2);
        if (game.tileCollisions[3]) collision.push(3);
        game.tileCollisionType = collision;
    }

}

function drawButton() {
    game.drawingOn = toggle(game.drawingOn);
    if (game.drawingOn) {
        document.getElementById("drawButton").setAttribute("class", "w3-button w3-green");
        document.getElementById("drawButton").innerHTML = "Drawing On";
    } else {
        document.getElementById("drawButton").setAttribute("class", "w3-button w3-red");
        document.getElementById("drawButton").innerHTML = "Drawing Off";
    }
}
