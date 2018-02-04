//convert spritesheet to tile index coordinates
function xy2i(x, y, width) {
    var index = y * width + x;
    return index;
}

//convert tile index to spritesheet coordinates
function i2xy(index, width) {
    var x = index % width;
    var y = Math.floor(index / width);
    return [x,y];
}

//convert mapCL to a graph
function getGraph() {
    var mapCL = maps[mapID].layerC;
    var mapWidth = maps[mapID].mapWidth;
    var mapHeight = maps[mapID].mapHeight;
    
    var arr = Array();
    for (var i = 0; i < mapWidth; i++) {
        arr.push(Array());
    }
    for (var i = 0; i < mapWidth*mapHeight; i++) {
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
    return astar.search(graph, start, end, {closest : true});
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
    element = myGameArea.canvas;
    if(element.requestFullscreen) {
        element.requestFullscreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if(element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if(element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

// Size the canvas to the size of the map if it fits on the screen
function resizeCanvas() {
    if (document.body.clientWidth > maps[mapID].mapWidth * maps[mapID].tileWidth) {
        // Screen bigger than map
        myGameArea.canvas.width = maps[mapID].mapWidth * maps[mapID].tileWidth;
    }
    // Screen fits on map
    else myGameArea.canvas.width = myGameArea.canvas.width = document.body.clientWidth;
    
    if (document.body.clientHeight > maps[mapID].mapHeight * maps[mapID].tileHeight) {
        // Screen bigger than map
        myGameArea.canvas.height = maps[mapID].mapHeight * maps[mapID].tileHeight;
    }
    // Screen fits on map
    else myGameArea.canvas.height = myGameArea.canvas.height = document.body.clientHeight;
}

function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Init FPS and time
var start,before,now,time,fps;
start=Date.now();
before=Date.now();
fps=0;    


function updateFPS() {
    now=Date.now();
    time=now-start;
    if (myGameArea.frameNo == 1 || everyinterval(30)) {fps=Math.round(1000/(now-before)); }
    before=now;
}

function showFPS() {
    ctx = myGameArea.context;
    ctx.font =  "bold 20px red";
    ctx.fillStyle = "black";
    ctx.fillText("FPS : " + fps, 470, 40);
}

function showPosition(target) {
    ctx = myGameArea.context;
    ctx.fillStyle = "black";
    ctx.fillText("x:" + (target.x + target.offset_x) + ", y:" + (target.y + target.offset_y), 5, 20);
    ctx.fillText("Tile[" + Math.floor((target.x + target.offset_x)/16) + ", " + Math.floor((target.y + target.offset_y)/16) + "]", 5, 40);
}

function showTime() {
    ctx = myGameArea.context;
    ctx.fillStyle = "black";
    ctx.fillText("Timer : " + Math.round(time/1000), 440, 20);
}