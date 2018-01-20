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

//convert mapCL to graph
function getGraph() {
    var mapCL = maps[mapID].layerC;
    var mapWidth = maps[mapID].mapWidth;
    var mapHeight = maps[mapID].mapHeight;
    
    var arr = Array();
    for (var j = 0; j < mapHeight; j++) {
        arr.push(Array());
    }
    for (var i = 0; i < mapWidth*mapHeight; i++) {
        if (mapCL[i])
            arr[Math.floor(i / mapWidth)][i % mapWidth] = 1;
        else
            arr[Math.floor(i / mapWidth)][i % mapWidth] = 0;
    }
    return arr;
}

// Use Astar
function astar_test() {
    var graph = new Graph(getGraph());
    var start = graph.grid[Math.floor((character.y+16)/16)][Math.floor((character.x+4)/16)];
    //console.log("Start = ["+Math.floor((character.y+16)/16)+"]["+Math.floor((character.x+4)/16)+"]");
    var end = graph.grid[Math.floor((myGameArea.clickY+gameCamera.y)/16)][Math.floor((myGameArea.clickX+gameCamera.x)/16)];
    //console.log("End = ["+Math.floor((myGameArea.clickY+gameCamera.y)/16)+"]["+Math.floor((myGameArea.clickX+gameCamera.x)/16)+"]");
    return astar.search(graph, start, end);
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
    
    //resize canvas if fullscreen
    //myGameArea.canvasWidth = document.body.offsetWidth;
    //if (canvasWidth > tileWidth[mapID] * mapWidth[mapID]) canvasWidth = tileWidth[mapID] * mapWidth[mapID];
    
    //myGameArea.canvasHeight = document.body.offsetHeight;
    //if (canvasHeight > tileHeight[mapID] * mapHeight[mapID]) canvasHeight = tileHeight[mapID] * mapHeight[mapID];  
}

function resizeCanvas() {
    //myGameArea.canvas.width = 480;
    //if (canvasWidth > tileWidth[mapID] * mapWidth[mapID]) canvasWidth = tileWidth[mapID] * mapWidth[mapID];
    
    //myGameArea.canvas.height = 270;
    //if (canvasHeight > tileHeight[mapID] * mapHeight[mapID]) canvasHeight = tileHeight[mapID] * mapHeight[mapID];
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